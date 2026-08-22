# Ansible — Averie on Bizfly

Configures the Bizfly server to run the Next.js container behind Nginx.

**You do not run these by hand.** The `deploy` and `infra-tls` workflows install
Ansible on the runner, generate the inventory from the `SERVER_HOST` repository
variable, and invoke the playbooks with secrets passed as extra vars. This file
documents what they do and what ends up on the server.

Setup guide: [docs/deployment-bizfly.md](../docs/deployment-bizfly.md).

## Layout

| File                              | What it does                                              |
| --------------------------------- | --------------------------------------------------------- |
| `site.yml`                        | `install_docker.yml` + `deploy_app.yml` — run by `deploy` |
| `install_docker.yml`              | Docker engine, compose plugin, log-size caps              |
| `deploy_app.yml`                  | Renders config, pulls the image, health-gates, rolls back |
| `issue_cert.yml`                  | Let's Encrypt cert + renewal cron — run by `infra-tls`    |
| `group_vars/all.yml`              | Non-secret defaults; CI overrides what it needs           |
| `templates/docker-compose.yml.j2` | `averie-web` + `averie-nginx` stack                       |
| `templates/nginx.conf.j2`         | Reverse proxy, gzip, ACME, optional TLS                   |
| `templates/app.env.j2`            | Runtime env file, written 0600 root-owned                 |

`inventory.ini` is generated per run and git-ignored — there is no committed
host list.

## What lands on the server

```
/opt/averie/
├── docker-compose.yml      averie-web + averie-nginx
├── app.env                 runtime secrets, 0600 root:root
├── nginx/nginx.conf
└── certbot/
    ├── conf/               certificates
    └── www/                ACME challenge webroot
/usr/local/bin/averie-renew-cert.sh   cron, twice daily
```

The app container is never published on the host. Nginx reaches it over the
`averie_network` bridge, so ports 80 and 443 are the only ones open.

## How rollback works

`deploy_app.yml` records the image reference the container is running _before_
touching anything. After `docker compose up` it polls the container health status
(the image's `HEALTHCHECK` hits `/api/health`). If it never reaches `healthy`
within `health_retries × health_delay` (default 5 minutes), the playbook dumps
the last 80 log lines into the workflow log, re-renders compose with the previous
image, redeploys, verifies _that_ is healthy, and then fails the run. A red
pipeline therefore still leaves a working site up.

There is no previous image on the very first deploy, so a failure there fails
outright — as it should.

## Guards

The playbooks refuse to run rather than deploy something broken:

- `image_tag` must be set and must not be `latest` (a moving tag makes rollback
  meaningless). `-e allow_latest=true` overrides it for a throwaway test.
- `registry_username`, `registry_password` and `registry_namespace` must all be
  present — an empty namespace produces an unpullable image path.
- `mongodb_uri` and `auth_secret` must be present, so the app can never come up
  on the hardcoded development secret.

## Troubleshooting

Container unhealthy but the app looks fine → `/api/health` returns 503 when
MongoDB is unreachable. Check that the Atlas cluster allows the server's IP
(Network Access → the Bizfly public IP).

`no such host` / `pull access denied` → `BIZFLY_REGISTRY_NAMESPACE` or the
registry token is wrong. Confirm both against the push command shown in the
Bizfly console.

`Could not load 'yaml' callback plugin` → fixed in repo: `ansible.cfg` uses
`ansible.builtin.default` (the `yaml` callback was removed from ansible-core 2.16+).

Nginx up but 502 → the app container is not on `averie_network`, or it crashed
after passing its healthcheck. `docker logs averie-web` on the server.
