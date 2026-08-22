# Deploy Averie on Bizfly Cloud

Self-hosted deployment path: one Bizfly cloud server running the Next.js app in
Docker behind Nginx, image built by GitHub Actions and pushed to Bizfly Container
Registry, infrastructure described in Terraform, host configuration in Ansible.

This is deliberately **single-environment** — no dev/staging/prod split. One
server, one image repository, one hostname (`bizfly.averienails.com` by default).

---

## 1. Architecture

```
 git push main
        │
        ▼
┌──────────────────────────┐
│ GitHub Actions (deploy)  │
│  1. docker build         │  build args = NEXT_PUBLIC_* + CLOUDINARY_CLOUD_NAME
│  2. push image           │──────────────► Bizfly Container Registry
│  3. ssh + ansible ───────┼──────┐         cr-hn-1.bizflycloud.vn/<ns>/averie-web
└──────────────────────────┘      │
                                  ▼
                 ┌──────────────────────────────────┐
                 │ Bizfly Cloud Server (Ubuntu)     │
                 │                                  │
                 │  averie-nginx  :80 / :443        │
                 │        │  averie_network         │
                 │        ▼                         │
                 │  averie-web    :3000 (internal)  │
                 │        └── app.env (0600, root)  │
                 └──────────────────────────────────┘
                                  │
                                  ▼
                          MongoDB Atlas / Cloudinary
```

**No Portainer.** Each Actions run SSHes in and runs Ansible, which pulls the new
tag and recreates the container. A watchtower/Portainer auto-pull loop would add
a moving part without adding anything — the pipeline already knows exactly when a
new image exists.

**Secrets are not baked into the image.** Only `NEXT_PUBLIC_*` values (which end
up in the client bundle anyway) and `CLOUDINARY_CLOUD_NAME` (read by
`next.config.ts`) are build args. `MONGODB_URI`, `AUTH_SECRET`,
`OBFUSCATION_SECRET` and the Cloudinary API keys are rendered by Ansible into
`/opt/averie/app.env` (mode 0600, root-owned) and loaded by docker-compose at
container start. They still live in GitHub — just as secrets rather than as image
layers, so anyone who can pull the image cannot read them.

---

## 2. AWS → Bizfly mapping

| BRIX (AWS)            | Averie (Bizfly)                                       |
| --------------------- | ----------------------------------------------------- |
| S3 state bucket       | Simple Storage bucket, S3 API `hcm.ss.bfcplatform.vn` |
| DynamoDB lock table   | `use_lockfile = true` (a `.tflock` object)            |
| IAM user + access key | Application Credential + Simple Storage access key    |
| `provider "aws"`      | `provider "bizflycloud"`                              |
| `aws_instance`        | `bizflycloud_server`                                  |
| `aws_security_group`  | `bizflycloud_firewall`                                |
| Elastic IP            | `default_public_ipv4` (free WAN IPv4)                 |
| Docker Hub            | Bizfly Container Registry                             |

The `openstack_*` resources also work against Bizfly, but the native
`bizflycloud` provider covers everything needed here and exposes the flavor /
billing-plan concepts directly, so that is what is used.

---

## 3. Files

| Path                                      | Purpose                                         |
| ----------------------------------------- | ----------------------------------------------- |
| `Dockerfile`                              | Multi-stage build, Next.js standalone output    |
| `terraform/`                              | Server, firewall, SSH key, registry repository  |
| `ansible/`                                | Docker install, Nginx + app stack, TLS          |
| `.github/actions/terraform-setup/`        | Shared Terraform init for the infra workflows   |
| `.github/actions/ansible-setup/`          | Shared Ansible + SSH + inventory setup          |
| `.github/workflows/infra-create.yml`      | Create the server, set `SERVER_HOST`, fix DNS   |
| `.github/workflows/infra-stop.yml`        | Power off, keep the disk and the IP             |
| `.github/workflows/infra-start.yml`       | Power back on, repair `SERVER_HOST` and DNS     |
| `.github/workflows/infra-destroy.yml`     | Delete the server, keep the registry            |
| `.github/workflows/infra-tls.yml`         | Issue the certificate and switch Nginx to HTTPS |
| `.github/workflows/deploy.yml`            | Build → push → deploy                           |
| `.github/workflows/update-bizfly-dns.yml` | Point `bizfly.averienails.com` at the server    |
| `scripts/update_bizfly_subdomain_dns.py`  | Name.com API client for that one record         |

`next.config.ts` gained `output: 'standalone'` — required for the runtime image.

---

## 4. What to configure on Bizfly

### 4.1 Application Credential (for Terraform)

`Dashboard → Tài khoản → Bảo mật (https://manage.bizflycloud.vn/account/security)`
→ create an **Application Credential**. Keep the ID and secret.

Also note your **Project ID** from the project selector — it goes into
`bizfly_project_id`.

### 4.2 Simple Storage bucket (Terraform state) — required

`Simple Storage → Tạo bucket`

- Name: `averie-terraform-state`
- Location: `hcm`
- ACL: `private`

Then on the same security page create a **Simple Storage access key / secret
key** pair. These are S3 credentials, separate from the application credential.

This is not optional once the infra workflows are in use. An Actions runner is
wiped after every run, so local state would vanish the moment `infra-create`
finished — `infra-stop` and `infra-destroy` would then find nothing to act on,
and the next `infra-create` would build a _second_ server instead of reusing the
first. Remote state is what makes the four buttons see the same infrastructure.

Locking uses the backend's own `.tflock` object, so two runs cannot apply at
once. The `averie-infra` concurrency group in the workflows is a second guard on
top of that.

### 4.3 Container Registry

`Container Registry → Tạo repository` → name `averie-web`, private.
(Or let Terraform create it: `manage_container_registry = true`.)

Open the repository and copy the **push command**. It looks like:

```
docker push cr-hn-1.bizflycloud.vn/c9e4fdedcbe641cf90bb1f58c0e641a8/averie-web:latest
```

Two things you need from it:

- the **host** (`cr-hn-1.bizflycloud.vn`) — confirm it, it may differ per region
- the **namespace** (`c9e4fde…`) — the segment between host and repository name

Then create a registry **token** (`Container Registry → Token`). Login is
`docker login -u BIZFLY -p <token> cr-hn-1.bizflycloud.vn`, so the username is the
literal string `BIZFLY`. With an application credential instead, the username is
`APPCRED_<id>` and the password is the secret.

### 4.4 SSH key

This is the one command you run locally, once. Generating a keypair inside CI
would mean either printing a private key into a log or never having a copy to
debug with, so it stays on your machine:

```bash
ssh-keygen -t ed25519 -C "averie-deploy" -f ~/.ssh/averie -N ""
```

The private half becomes the `SSH_PRIVATE_KEY` secret, the public half the
`SSH_PUBLIC_KEY` variable. Nothing else about the deployment needs a terminal.

### 4.5 Server sizing

`flavor_name` maps to the console's configuration table:

| flavor  | vCPU | RAM  | Disk  | ~ giá/tháng |
| ------- | ---- | ---- | ----- | ----------- |
| `1c_1g` | 1    | 1 GB | 20 GB | 128.500 đ   |
| `1c_2g` | 1    | 2 GB | 20 GB | 150.500 đ   |
| `2c_2g` | 2    | 2 GB | 40 GB | 214.100 đ   |
| `2c_4g` | 2    | 4 GB | 40 GB | 396.700 đ   |

Default is `1c_2g`. `1c_1g` also works — the image is built in CI, so the server
only pulls and runs it — but 1 GB leaves very little headroom; cloud-init adds a
2 GB swapfile to compensate. `server_category = "basic"` is the Shared CPU line.

---

## 5. Provision the server

Everything runs from `Actions`. There is no Terraform or Ansible to install, no
`terraform.tfvars` to fill in, and no inventory file to maintain — the workflows
build all of that on the runner from the secrets and variables in §6.

Configure §6 first, then run `infra-create` (§9). It applies the Terraform,
writes the new IP into the `SERVER_HOST` variable, updates DNS, and can chain
straight into `deploy`.

The `terraform` and `ansible` directories are the source of truth for _what_
gets built; you never invoke them by hand.

---

## 6. What to configure on GitHub

`Settings → Secrets and variables → Actions`

### Secrets (tab "Secrets")

| Name                       | Value                                              |
| -------------------------- | -------------------------------------------------- |
| `BIZFLY_REGISTRY_USERNAME` | `BIZFLY` (token auth) or `APPCRED_<id>`            |
| `BIZFLY_REGISTRY_TOKEN`    | registry token / appcred secret                    |
| `SSH_PRIVATE_KEY`          | contents of `~/.ssh/averie` (the private key)      |
| `MONGODB_URI`              | Atlas SRV connection string                        |
| `AUTH_SECRET`              | `openssl rand -base64 32`                          |
| `OBFUSCATION_SECRET`       | `openssl rand -base64 32` (only if obfuscation on) |
| `CLOUDINARY_API_KEY`       | Cloudinary API key                                 |
| `CLOUDINARY_API_SECRET`    | Cloudinary API secret                              |
| `NEXTAUTH_SECRET`          | optional — see the note below                      |
| `NAME_COM_USERNAME`        | Name.com API username (DNS workflow)               |
| `NAME_COM_TOKEN`           | Name.com API token (DNS workflow)                  |
| `BIZFLY_APPCRED_ID`        | application credential ID (infra workflows)        |
| `BIZFLY_APPCRED_SECRET`    | application credential secret                      |
| `TF_STATE_ACCESS_KEY`      | Simple Storage access key for the state bucket     |
| `TF_STATE_SECRET_KEY`      | Simple Storage secret key                          |
| `GH_ADMIN_PAT`             | optional — see the note below                      |

`NAME_COM_*` already exist if `update-dns.yml` was used for Vercel.

`NEXTAUTH_SECRET` is a next-auth v4 name, but `src/libs/auth.config.ts` still
reads it **before** `AUTH_SECRET`. Set it only to reuse an existing deployment's
session cookies; if you set both to different values, `NEXTAUTH_SECRET` wins.
Leave it unset and `AUTH_SECRET` is used — the env file then omits it entirely.

`GH_ADMIN_PAT` is a fine-grained PAT on this repository with **Variables: write**
(add **Actions: write** if you also want `infra-create` to dispatch `deploy`).
Without it the infra workflows still work — they just print the new IP and warn
that `SERVER_HOST` has to be updated by hand. `GITHUB_TOKEN` cannot do this; it
has no permission scope for repository variables.

### Variables (tab "Variables")

| Name                                    | Example                            | Required |
| --------------------------------------- | ---------------------------------- | -------- |
| `SERVER_HOST`                           | `103.107.183.114`                  | **yes**  |
| `BIZFLY_REGISTRY_NAMESPACE`             | `c9e4fdedcbe641cf90bb1f58c0e641a8` | **yes**  |
| `BIZFLY_REGISTRY_HOST`                  | `cr-hn-1.bizflycloud.vn`           | no       |
| `BIZFLY_REGISTRY_REPOSITORY`            | `averie-web`                       | no       |
| `SERVER_USER`                           | `ubuntu`                           | no       |
| `APP_VHOST`                             | `bizfly.averienails.com`           | no       |
| `ENABLE_TLS`                            | `false` → `true` after §8          | no       |
| `CLOUDINARY_CLOUD_NAME`                 | your cloud name                    | no       |
| `SALON_TIMEZONE`                        | `America/New_York`                 | no       |
| `AUTH_SESSION_MAX_AGE_SECONDS`          | `2592000`                          | no       |
| `ENABLE_OBFUSCATION`                    | `0`                                | no       |
| `ENABLE_API_DOCS`                       | `0`                                | no       |
| `NEXT_PUBLIC_APP_URL`                   | `https://bizfly.averienails.com`   | no       |
| `NEXT_PUBLIC_ROUTE_LOADING_MIN_MS`      | `1200`                             | no       |
| `NEXT_PUBLIC_ENABLE_OBFUSCATION`        | `false`                            | no       |
| `NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION` | `false`                            | no       |
| `NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD`     | `false`                            | no       |
| `NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL`     | a URL                              | no       |
| `PRODUCTION_BROWSER_SOURCE_MAPS`        | `false`                            | no       |
| `MONGODB_DEBUG`                         | `0`                                | no       |
| `MONGODB_DNS_SERVERS`                   | `8.8.8.8,1.1.1.1`                  | no       |

The infra workflows need these as well — all plain configuration, none secret:

| Name                 | Example                         | Required |
| -------------------- | ------------------------------- | -------- |
| `TF_STATE_BUCKET`    | `averie-terraform-state`        | **yes**  |
| `BIZFLY_PROJECT_ID`  | project UUID from the console   | **yes**  |
| `SSH_PUBLIC_KEY`     | contents of `~/.ssh/averie.pub` | **yes**  |
| `TF_STATE_ENDPOINT`  | `https://hcm.ss.bfcplatform.vn` | no       |
| `TF_STATE_REGION`    | `hcm`                           | no       |
| `BIZFLY_REGION_NAME` | `HoChiMinh`                     | no       |
| `DNS_ZONE`           | `averienails.com`               | no       |
| `DNS_SUBDOMAIN`      | `bizfly`                        | no       |

`SERVER_HOST` is the one variable you do not have to maintain by hand when
`GH_ADMIN_PAT` is set — `infra-create` and `infra-start` write it for you.

Everything marked "no" falls back to a sensible default inside the workflow.
Each workflow fails before touching anything, naming the exact secret or
variable that is missing.

### Full coverage against the app's `process.env` reads

Every variable the source actually reads is wired. `NEXT_RUNTIME` is set by
Next.js itself, and `NODE_ENV` / `PORT` / `HOSTNAME` are set by the image.

| Variable                                | Where it is set               |
| --------------------------------------- | ----------------------------- |
| `NEXT_PUBLIC_APP_URL`                   | build arg                     |
| `NEXT_PUBLIC_ROUTE_LOADING_MIN_MS`      | build arg                     |
| `NEXT_PUBLIC_ENABLE_STORAGE_ENCRYPTION` | build arg                     |
| `NEXT_PUBLIC_ENABLE_DEVTOOLS_GUARD`     | build arg                     |
| `NEXT_PUBLIC_DEVTOOLS_REDIRECT_URL`     | build arg                     |
| `PRODUCTION_BROWSER_SOURCE_MAPS`        | build arg                     |
| `NEXT_PUBLIC_ENABLE_OBFUSCATION`        | build arg **and** `app.env`   |
| `CLOUDINARY_CLOUD_NAME`                 | build arg **and** `app.env`   |
| `AUTH_SECRET`                           | `app.env`                     |
| `NEXTAUTH_SECRET`                       | `app.env`, only when provided |
| `AUTH_SESSION_MAX_AGE_SECONDS`          | `app.env`                     |
| `MONGODB_URI`                           | `app.env`                     |
| `MONGODB_DEBUG`                         | `app.env`                     |
| `MONGODB_DNS_SERVERS`                   | `app.env`, only when provided |
| `ENABLE_OBFUSCATION`                    | `app.env`                     |
| `OBFUSCATION_SECRET`                    | `app.env`                     |
| `CLOUDINARY_API_KEY` / `_API_SECRET`    | `app.env`                     |
| `SALON_TIMEZONE`                        | `app.env`                     |
| `ENABLE_API_DOCS`                       | `app.env`                     |

`NEXT_PUBLIC_ENABLE_OBFUSCATION` and `CLOUDINARY_CLOUD_NAME` appear twice
because the client bundle needs them at build time while server code reads them
at runtime. `AUTH_URL` and `AUTH_TRUST_HOST` are derived from `APP_VHOST` and
`ENABLE_TLS`, so there is nothing to configure for them.

**Not needed on the server:** `MONGODB_USERNAME`, `MONGODB_PASSWORD` (only
`scripts/diagnose-mongodb.mjs` reads them) and `NEXTAUTH_URL` (nothing reads it —
next-auth v5 uses `trustHost` plus the request headers).

---

## 7. Point the subdomain at the server

`Actions → update-bizfly-dns → Run workflow`. With `SERVER_HOST` already set you
can leave every input blank; it upserts an A record for `bizfly` on
`averienails.com`.

The workflow is separate from `update-dns.yml` on purpose — that one manages the
Vercel apex and `www` records and is never touched here. The script refuses an
empty subdomain so it can never edit the apex, and warns if a CNAME/AAAA on the
same host would shadow the new A record.

---

## 8. First deploy

Push to `main`, or `Actions → deploy → Run workflow`.

The `deploy` job runs `ansible/site.yml`, which installs Docker (idempotent — a
no-op after the first run) and then brings the stack up. It waits for the
container healthcheck (`/api/health`, which pings MongoDB) and **rolls back to
the previously running image** if it never turns healthy.

Then switch to HTTPS: `Actions → infra-tls → Run workflow`, giving an email for
the Let's Encrypt account. It refuses to run unless DNS already resolves to
`SERVER_HOST` and the site answers on port 80, so a misconfigured attempt cannot
burn Let's Encrypt rate limits. On success it installs the renewal cron, sets
`ENABLE_TLS=true`, and redeploys so Nginx starts redirecting 80 → 443.

Renewal is a cron job on the server — there is nothing recurring to click.

---

## 9. The infrastructure buttons

Everything is a button under `Actions`. The `infra-*` workflows share the
`averie-infra` concurrency group, so two of them can never apply at once.

| Workflow            | What it does                                                                      |
| ------------------- | --------------------------------------------------------------------------------- |
| `infra-create`      | `terraform apply`. Sets `SERVER_HOST`, fixes DNS, optionally dispatches `deploy`. |
| `infra-start`       | Powers a stopped server on, repairs `SERVER_HOST`/DNS if the IP moved.            |
| `infra-stop`        | Powers off. Disk, IP and firewall are kept; compute billing stops.                |
| `infra-destroy`     | Deletes the server. Keeps the registry unless you ask otherwise.                  |
| `infra-tls`         | Issues the certificate, sets `ENABLE_TLS`, redeploys over HTTPS.                  |
| `deploy`            | Build, push, roll out. Also runs on every push to `main`.                         |
| `update-bizfly-dns` | Re-point the subdomain by hand if you ever need to.                               |

### infra-create

Inputs are `flavor_name` (the four sizes from §4.5), `availability_zone`,
`root_disk_size`, plus two toggles for updating DNS and chaining into `deploy`.

Re-running it is safe. Terraform reconciles against the state in Simple Storage,
so a second run on an existing server changes only what the inputs changed —
picking a different `flavor_name`, for instance, resizes in place rather than
building a second machine.

### infra-stop / infra-start

Both work by flipping `server_state` and re-applying; the provider issues a
start/stop call rather than rebuilding anything. A stopped server still costs
storage, so this is for pausing, not for saving the full bill — that is what
`infra-destroy` is for.

`infra-start` compares the IP against `SERVER_HOST` and only touches the variable
and DNS when it actually changed. It then polls `/api/health` for up to three
minutes; the containers restart on their own because the stack is set to
`restart: always`, so no redeploy is normally needed.

### infra-destroy

Requires typing `destroy` into the `confirm` input — anything else aborts before
Terraform runs.

**The container registry is kept by default.** Destroying it would delete every
image ever pushed, including the one a later `infra-create` would want to
redeploy, so the default path destroys only the server, firewall and SSH key via
`-target`. Deleting the registry as well is a separate opt-in checkbox.

`remove_dns` defaults to true: it deletes the subdomain's A record. Leaving a
record pointed at an address you no longer own means whoever Bizfly hands it to
next inherits your hostname.

---

### infra-tls

Runs once. It verifies that `APP_VHOST` resolves to `SERVER_HOST` and that the
site answers on port 80 _before_ calling Let's Encrypt — a failed challenge
counts against a weekly rate limit, so it is worth failing early instead.

---

## 10. Day-to-day

| I want to…                  | Do this                                                |
| --------------------------- | ------------------------------------------------------ |
| Ship a change               | Push to `main`                                         |
| Roll back to an older image | `deploy` → put an existing tag in `image_tag`          |
| Pause the server overnight  | `infra-stop`, then `infra-start`                       |
| Resize it                   | `infra-create` with a different `flavor_name`          |
| Move it to another zone     | `infra-destroy`, then `infra-create` with the new zone |
| Stop paying                 | `infra-destroy`                                        |

Rolling back does not need a rebuild — the registry keeps every `main-<sha>` tag,
and `deploy` skips the build step when you name an existing one.

### When you do need a shell

The only thing you still hold locally is the deploy key from §4.4. Logs are
usually easier to read from the failing workflow run, which already dumps the
last 80 lines of the container on a failed deploy, but for anything deeper:

```bash
ssh -i ~/.ssh/averie ubuntu@<SERVER_HOST>
```

```bash
sudo docker compose -f /opt/averie/docker-compose.yml ps
```

```bash
sudo docker logs -f averie-web
```

[ansible/README.md](../ansible/README.md) describes what the playbooks put on the
server and where each file lives.
