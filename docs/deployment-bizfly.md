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

| Path                                      | Purpose                                        |
| ----------------------------------------- | ---------------------------------------------- |
| `Dockerfile`                              | Multi-stage build, Next.js standalone output   |
| `terraform/`                              | Server, firewall, SSH key, registry repository |
| `ansible/`                                | Docker install, Nginx + app stack, TLS         |
| `.github/workflows/deploy.yml`            | Build → push → deploy                          |
| `.github/workflows/update-bizfly-dns.yml` | Point `bizfly.averienails.com` at the server   |
| `scripts/update_bizfly_subdomain_dns.py`  | Name.com API client for that one record        |

`next.config.ts` gained `output: 'standalone'` — required for the runtime image.

---

## 4. What to configure on Bizfly

### 4.1 Application Credential (for Terraform)

`Dashboard → Tài khoản → Bảo mật (https://manage.bizflycloud.vn/account/security)`
→ create an **Application Credential**. Keep the ID and secret.

Also note your **Project ID** from the project selector — it goes into
`bizfly_project_id`.

### 4.2 Simple Storage bucket (Terraform state)

`Simple Storage → Tạo bucket`

- Name: `averie-terraform-state`
- Location: `hcm`
- ACL: `private`

Then on the same security page create a **Simple Storage access key / secret
key** pair. These are S3 credentials, separate from the application credential.

Skip this whole section if you are happy with local state — comment out the
`backend "s3"` block in `terraform/versions.tf`.

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

Generate the deploy key locally — the private half goes into GitHub, the public
half into Terraform:

```bash
ssh-keygen -t ed25519 -C "averie-deploy" -f ~/.ssh/averie -N ""
```

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

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # fill in project_id + ssh_public_key
cp backend.hcl.example backend.hcl             # fill in bucket name
```

```bash
export BIZFLYCLOUD_APPLICATION_CREDENTIAL_ID=...
export BIZFLYCLOUD_APPLICATION_CREDENTIAL_SECRET=...
export AWS_ACCESS_KEY_ID=<simple-storage-access-key>
export AWS_SECRET_ACCESS_KEY=<simple-storage-secret-key>
```

```bash
terraform init -backend-config=backend.hcl
```

```bash
terraform plan
```

```bash
terraform apply
```

Take `public_ip` from the outputs — it becomes the `SERVER_HOST` repository
variable and the DNS A record.

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

`NAME_COM_*` already exist if `update-dns.yml` was used for Vercel.

`NEXTAUTH_SECRET` is a next-auth v4 name, but `src/libs/auth.config.ts` still
reads it **before** `AUTH_SECRET`. Set it only to reuse an existing deployment's
session cookies; if you set both to different values, `NEXTAUTH_SECRET` wins.
Leave it unset and `AUTH_SECRET` is used — the env file then omits it entirely.

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

Everything marked "no" falls back to a sensible default inside the workflow.
The deploy fails fast with a clear message if `SERVER_HOST` or
`BIZFLY_REGISTRY_NAMESPACE` is missing.

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

Then switch to HTTPS — once DNS resolves and port 80 answers:

```bash
cd ansible
ansible-playbook issue_cert.yml -e letsencrypt_email=you@example.com
```

Set the `ENABLE_TLS` repository variable to `true` and re-run the deploy. Nginx
then redirects 80 → 443 and a cron job renews the certificate twice a day.

---

## 9. Operating it

Redeploy an older image without rebuilding: `Actions → deploy → Run workflow` and
put an existing tag (e.g. `main-9045a20`) in `image_tag`.

On the server:

```bash
ssh -i ~/.ssh/averie ubuntu@$SERVER_HOST
```

```bash
sudo docker compose -f /opt/averie/docker-compose.yml ps
```

```bash
sudo docker logs -f averie-web
```

Ansible runs from a laptop too — see [ansible/README.md](../ansible/README.md).
