import base64
import os
import sys

import requests  # type: ignore


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
    url = f"https://api.name.com/v4/domains/{domain}/records"
    response = requests.get(url, headers=headers, timeout=30)

    if response.status_code != 200:
        print(f"Failed to fetch records: {response.status_code} {response.text}")
        sys.exit(1)

    return response.json().get("records", [])


def upsert_record(
    domain: str,
    headers: dict[str, str],
    records: list[dict],
    host: str,
    record_type: str,
    answer: str,
    ttl: int = 300,
) -> bool:
    record = next(
        (r for r in records if r.get("host") == host and r.get("type") == record_type),
        None,
    )

    payload = {
        "host": host,
        "type": record_type,
        "answer": answer,
        "ttl": ttl,
    }

    display_name = domain if host == "" else f"{host}.{domain}"

    if record:
        url = f"https://api.name.com/v4/domains/{domain}/records/{record['id']}"
        response = requests.put(url, headers=headers, json=payload, timeout=30)
        action = "Updated"
    else:
        url = f"https://api.name.com/v4/domains/{domain}/records"
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        action = "Created"

    if response.status_code in (200, 201):
        print(f"{action} {record_type} record for {display_name} -> {answer}")
        return True

    print(f"Failed to upsert {display_name}: {response.status_code} {response.text}")
    return False


def normalize_cname(value: str) -> str:
    value = value.strip()
    if value and not value.endswith("."):
        value += "."
    return value


def update_vercel_dns() -> None:
    domain = os.getenv("DOMAIN_NAME", "averienails.com")
    root_ip = os.getenv("VERCEL_A_RECORD_IP", "216.198.79.1")
    www_cname = normalize_cname(
        os.getenv("VERCEL_WWW_CNAME", "e757ec4ce3482132.vercel-dns-017.com")
    )

    if not root_ip:
        print("Missing VERCEL_A_RECORD_IP environment variable.")
        sys.exit(1)

    headers = get_auth_headers()
    records = fetch_records(domain, headers)

    ok = True
    ok &= upsert_record(domain, headers, records, "", "A", root_ip)
    ok &= upsert_record(domain, headers, records, "www", "CNAME", www_cname)

    if not ok:
        sys.exit(1)

    print(f"DNS records for {domain} are configured for Vercel.")


if __name__ == "__main__":
    update_vercel_dns()
