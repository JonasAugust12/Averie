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

  user_data = file("${path.module}/cloud-init.yaml")

  # Free public IPv4 WAN interface, protected by the firewall above.
  default_public_ipv4 {
    enabled      = true
    firewall_ids = [bizflycloud_firewall.web.id]
  }

  lifecycle {
    # The image is pinned by ID; a Bizfly image refresh would otherwise force a
    # rebuild of the whole server. Recreate deliberately instead.
    ignore_changes = [os_id]
  }
}

# -----------------------------------------------------------------------------
# Container Registry repository the pipeline pushes into.
# -----------------------------------------------------------------------------
resource "bizflycloud_container_registry" "app" {
  count = var.manage_container_registry ? 1 : 0

  name   = var.container_registry_name
  public = false
}
