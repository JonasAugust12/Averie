"""Point a single subdomain at the Bizfly server via the Name.com v4 API.

Used by .github/workflows/update-bizfly-dns.yml. Kept separate from
update_vercel_dns.py so the Vercel-hosted apex/www records are never touched
while the Bizfly deployment is being tested.

Environment:
    NAME_COM_USERNAME   Name.com API username
    NAME_COM_TOKEN      Name.com API token
    DOMAIN_NAME         Zone to edit, e.g. averienails.com
    SUBDOMAIN           Host inside the zone, e.g. bizfly
    SERVER_IP           IPv4 address of the Bizfly server
    RECORD_TTL          Optional, defaults to 300
    DELETE_RECORD       Optional; "1"/"true" removes the A record instead of
                        upserting it. SERVER_IP is then not required.
"""

import base64
import ipaddress
import os
import sys

import requests  # type: ignore

API_ROOT = "https://api.name.com/v4"


def get_auth_headers() -> dict[str, str]:
    username = os.getenv("NAME_COM_USERNAME")
    token = os.getenv("NAME_COM_TOKEN")

    if not username or not token:
        print("Missing NAME_COM_USERNAME or NAME_COM_TOKEN environment variables.")
        sys.exit(1)

    auth_base64 = base64.b64encode(f"{username}:{token}".encode()).decode()
    return {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/json",
    }


def fetch_records(domain: str, headers: dict[str, str]) -> list[dict]:
    """Return every record in the zone, following pagination."""
    records: list[dict] = []
    page = 1

    while True:
        response = requests.get(
            f"{API_ROOT}/domains/{domain}/records",
            headers=headers,
            params={"page": page, "perPage": 1000},
            timeout=30,
        )

        if response.status_code != 200:
            print(f"Failed to fetch records: {response.status_code} {response.text}")
            sys.exit(1)

        payload = response.json()
        records.extend(payload.get("records", []))

        next_page = payload.get("nextPage")
        if not next_page:
            return records
        page = next_page


def upsert_record(
    domain: str,
    headers: dict[str, str],
    records: list[dict],
    host: str,
    record_type: str,
    answer: str,
    ttl: int,
) -> bool:
    existing = next(
        (r for r in records if r.get("host") == host and r.get("type") == record_type),
        None,
    )

    payload = {"host": host, "type": record_type, "answer": answer, "ttl": ttl}
    fqdn = domain if host == "" else f"{host}.{domain}"

    if existing and existing.get("answer") == answer and existing.get("ttl") == ttl:
        print(f"Unchanged {record_type} {fqdn} -> {answer}")
        return True

    if existing:
        url = f"{API_ROOT}/domains/{domain}/records/{existing['id']}"
        response = requests.put(url, headers=headers, json=payload, timeout=30)
        action = "Updated"
    else:
        url = f"{API_ROOT}/domains/{domain}/records"
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        action = "Created"

    if response.status_code in (200, 201):
        print(f"{action} {record_type} {fqdn} -> {answer} (ttl {ttl})")
        return True

    print(f"Failed to upsert {fqdn}: {response.status_code} {response.text}")
    return False


def delete_record(
    domain: str,
    headers: dict[str, str],
    records: list[dict],
    host: str,
    record_type: str,
) -> bool:
    existing = [
        r for r in records if r.get("host") == host and r.get("type") == record_type
    ]
    fqdn = f"{host}.{domain}"

    if not existing:
        print(f"No {record_type} record for {fqdn} - nothing to delete.")
        return True

    ok = True
    for record in existing:
        url = f"{API_ROOT}/domains/{domain}/records/{record['id']}"
        response = requests.delete(url, headers=headers, timeout=30)

        if response.status_code in (200, 204):
            print(f"Deleted {record_type} {fqdn} -> {record.get('answer')}")
        else:
            print(f"Failed to delete {fqdn}: {response.status_code} {response.text}")
            ok = False

    return ok


def warn_on_conflicts(records: list[dict], host: str, domain: str) -> None:
    """A CNAME or AAAA on the same host would shadow the A record we just set."""
    for record in records:
        if record.get("host") != host:
            continue
        if record.get("type") in ("CNAME", "AAAA", "ALIAS"):
            print(
                f"WARNING: {host}.{domain} also has a {record['type']} record "
                f"-> {record.get('answer')}. Remove it or the A record may be ignored."
            )


def main() -> None:
    domain = os.getenv("DOMAIN_NAME", "averienails.com").strip()
    subdomain = os.getenv("SUBDOMAIN", "bizfly").strip().strip(".")
    server_ip = os.getenv("SERVER_IP", "").strip()
    ttl = int(os.getenv("RECORD_TTL", "300"))

    deleting = os.getenv("DELETE_RECORD", "").strip().lower() in ("1", "true", "yes")

    if not subdomain:
        print("SUBDOMAIN must not be empty - this script never edits the apex record.")
        sys.exit(1)

    if deleting:
        headers = get_auth_headers()
        records = fetch_records(domain, headers)
        if not delete_record(domain, headers, records, subdomain, "A"):
            sys.exit(1)
        return

    if not server_ip:
        print("Missing SERVER_IP environment variable.")
        sys.exit(1)

    try:
        if not isinstance(ipaddress.ip_address(server_ip), ipaddress.IPv4Address):
            raise ValueError
    except ValueError:
        print(f"SERVER_IP must be a valid IPv4 address, got: {server_ip}")
        sys.exit(1)

    headers = get_auth_headers()
    records = fetch_records(domain, headers)

    warn_on_conflicts(records, subdomain, domain)

    if not upsert_record(domain, headers, records, subdomain, "A", server_ip, ttl):
        sys.exit(1)

    print(f"{subdomain}.{domain} now resolves to {server_ip}.")


if __name__ == "__main__":
    main()
