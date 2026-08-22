# Ansible — Averie on Bizfly

Configures a single Bizfly cloud server to run the Next.js container behind
Nginx. CI calls these same playbooks, so anything that works here works there.

Full setup guide: [docs/deployment-bizfly.md](../docs/deployment-bizfly.md).

## Layout

| File                              | What it does                                              |
| --------------------------------- | --------------------------------------------------------- |
| `site.yml`                        | `install_docker.yml` + `deploy_app.yml`                   |
| `install_docker.yml`              | Docker engine, compose plugin, log-size caps              |
| `deploy_app.yml`                  | Renders config, pulls the image, health-gates, rolls back |
| `issue_cert.yml`                  | One-off Let's Encrypt cert + renewal cron                 |
| `group_vars/all.yml`              | Non-secret defaults                                       |
| `templates/docker-compose.yml.j2` | `averie-web` + `averie-nginx` stack                       |
| `templates/nginx.conf.j2`         | Reverse proxy, gzip, ACME, optional TLS                   |
| `templates/app.env.j2`            | Runtime env file, written 0600 root-owned                 |

On the server everything lives under `/opt/averie`.

## Prerequisites (local)

```bash
sudo apt install -y ansible
```

```bash
ansible-galaxy collection install community.docker
```

```bash
chmod 600 ~/.ssh/averie
```

```bash
cp inventory.ini.example inventory.ini   # then replace SERVER_IP
```

`inventory.ini` is git-ignored — it holds a host address, and CI regenerates it.

Check connectivity first:

```bash
ansible web -m ping
```

## Deploying by hand

`image_tag` must be an immutable tag that already exists in the registry (CI
publishes `main-<short-sha>`). Secrets are passed with `-e`; nothing sensitive is
stored in this directory.

```bash
ansible-playbook site.yml \
  -e image_tag=main-9045a20 \
  -e registry_namespace=<namespace-from-the-console-push-command> \
  -e registry_username=BIZFLY \
  -e registry_password=<registry-token> \
  -e mongodb_uri='mongodb+srv://...' \
  -e auth_secret='...' \
  -e cloudinary_cloud_name=... \
  -e cloudinary_api_key=... \
  -e cloudinary_api_secret=...
```

To skip the Docker install once the host is set up, run `deploy_app.yml` instead
of `site.yml`.

`-e allow_latest=true` permits `image_tag=latest`. Use it only for a throwaway
smoke test: `latest` moves, so a rollback cannot tell versions apart.

## Enabling HTTPS

Requires DNS already pointing at the server and port 80 answering.

```bash
ansible-playbook issue_cert.yml -e letsencrypt_email=you@example.com
```

Then set `enable_tls: true` in `group_vars/all.yml` (or the `ENABLE_TLS`
repository variable in CI) and redeploy. The playbook installs
`/usr/local/bin/averie-renew-cert.sh` and a cron entry that renews and reloads
Nginx twice a day.

## How rollback works

`deploy_app.yml` records the image reference the container is running _before_
touching anything. After `docker compose up` it polls the container health status
(the image's `HEALTHCHECK` hits `/api/health`). If it never reaches `healthy`
within `health_retries × health_delay` (default 5 minutes), the playbook dumps
the last 80 log lines, re-renders compose with the previous image, redeploys,
verifies _that_ is healthy, and then fails the run. A red pipeline therefore
still leaves a working site up.

There is no previous image on the very first deploy, so a failure there fails
outright — as it should.

## Troubleshooting

```bash
ansible web -a "docker ps -a" --become
```

```bash
ansible web -a "docker logs --tail 100 averie-web" --become
```

```bash
ansible web -a "docker exec averie-nginx nginx -t" --become
```

Container unhealthy but the app looks fine → `/api/health` returns 503 when
MongoDB is unreachable. Check that the Atlas cluster allows the server's IP
(Network Access → the Bizfly public IP, or `0.0.0.0/0`).

`no such host` / `pull access denied` → the registry namespace or token is wrong.
Confirm both against the push command shown in the Bizfly console.
