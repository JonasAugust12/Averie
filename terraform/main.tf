# =============================================================================
# Averie — single Bizfly cloud server hosting the Next.js container behind Nginx.
# No dev/staging split: one server, one app, one domain.
# =============================================================================

data "bizflycloud_image" "os" {
  distribution = var.os_distribution
  version      = var.os_version
}

data "bizflycloud_volume_type" "root" {
  name     = var.root_disk_type
  category = var.server_category
}

# -----------------------------------------------------------------------------
# SSH key — the same key GitHub Actions uses to run Ansible against the server.
# -----------------------------------------------------------------------------
resource "bizflycloud_ssh_key" "deploy" {
  name       = "${var.project_name}-deploy"
  public_key = trimspace(var.ssh_public_key)
}

# -----------------------------------------------------------------------------
# Firewall — only 22 (deploy), 80 and 443 (public traffic) are reachable.
# The app container itself is never published on the host; Nginx proxies to it
# over the internal Docker network.
# -----------------------------------------------------------------------------
#
# The provider declares ingress/egress with ConfigMode: SchemaConfigModeAttr,
# i.e. as attributes. Attribute syntax is written here so the rule list can be
# built with `concat`/`for` from var.ssh_allowed_cidrs; Terraform's block-as-
# attribute shim would also accept the block form the upstream docs show.
resource "bizflycloud_firewall" "web" {
  name = "${var.project_name}-web"

  ingress = concat(
    [
      for cidr in var.ssh_allowed_cidrs : {
        cidr       = cidr
        port_range = "22"
        protocol   = "tcp"
      }
    ],
    [
      {
        cidr       = "0.0.0.0/0"
        port_range = "80"
        protocol   = "tcp"
      },
      {
        cidr       = "0.0.0.0/0"
        port_range = "443"
        protocol   = "tcp"
      },
    ]
  )

  egress = [
    {
      cidr       = "0.0.0.0/0"
      port_range = "1-65535"
      protocol   = "tcp"
    },
    {
      cidr       = "0.0.0.0/0"
      port_range = "1-65535"
      protocol   = "udp"
    },
  ]
}

# -----------------------------------------------------------------------------
# The server
# -----------------------------------------------------------------------------
resource "bizflycloud_server" "web" {
  name                  = "${var.project_name}-web"
  flavor_name           = var.flavor_name
  category              = var.server_category
  availability_zone     = var.availability_zone
  os_type               = "image"
  os_id                 = data.bizflycloud_image.os.id
  root_disk_volume_type = data.bizflycloud_volume_type.root.type
  root_disk_size        = var.root_disk_size
  ssh_key               = bizflycloud_ssh_key.deploy.name
  network_plan          = var.network_plan
  billing_plan          = var.billing_plan
  state                 = var.server_state

  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    ssh_public_key_json = jsonencode(trimspace(var.ssh_public_key))
  })

  # Free public IPv4 WAN interface, protected by the firewall above.
  default_public_ipv4 {
    enabled      = true
    firewall_ids = [bizflycloud_firewall.web.id]
  }

  lifecycle {
    # The image is pinned by ID; a Bizfly image refresh would otherwise force a
    # rebuild of the whole server. Recreate deliberately instead.
    ignore_changes = [os_id]

    # cloud-init writes authorized_keys once, at first boot (see cloud-init.yaml.tftpl).
    # Rotating ssh_public_key replaces the key resource but leaves a running server
    # holding the old key forever — and `ssh_key` here is only the key's *name*,
    # which does not change, so Terraform would otherwise report no diff at all
    # and the deploy would fail with "Permission denied (publickey)".
    # A server is therefore tied to the key it booted with: rotating the key
    # rebuilds it. The app keeps no local state, so this is cheap.
    replace_triggered_by = [bizflycloud_ssh_key.deploy]
  }
}

# -----------------------------------------------------------------------------
# Container Registry
#
# NOT managed here, deliberately. `bizflycloud_container_registry` is broken in
# provider v0.3.9 (the latest): all four CRUD functions assert
# `m.(*gobizfly.Client)` while the provider's ConfigureFunc returns
# `*CombinedConfig`, so the plugin panics the moment the resource is applied.
# Every other resource in this file uses the correct
# `meta.(*CombinedConfig).gobizflyClient()`.
#
# Create the repository once in the console instead — you have to open it anyway
# to copy the namespace out of the push command and to mint a pull token.
# Re-check this when a provider release after v0.3.9 appears.
# -----------------------------------------------------------------------------
