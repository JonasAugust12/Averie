# -----------------------------------------------------------------------------
# Provider / account
# -----------------------------------------------------------------------------
variable "bizfly_auth_method" {
  description = "Bizfly authentication method: password or application_credential."
  type        = string
  default     = "application_credential"

  validation {
    condition     = contains(["password", "application_credential"], var.bizfly_auth_method)
    error_message = "bizfly_auth_method must be either \"password\" or \"application_credential\"."
  }
}

variable "bizfly_region_name" {
  description = "Bizfly region: HaNoi or HoChiMinh."
  type        = string
  default     = "HoChiMinh"
}

variable "bizfly_project_id" {
  description = "Bizfly project (tenant) ID. Find it in the console URL / project selector."
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Server
# -----------------------------------------------------------------------------
variable "project_name" {
  description = "Prefix used for every resource name."
  type        = string
  default     = "averie"
}

variable "availability_zone" {
  description = "Availability zone. HN1/HN2 for HaNoi, HCM1 for HoChiMinh."
  type        = string
  default     = "HCM1"
}

variable "flavor_name" {
  description = <<-EOT
    Server flavor in Bizfly's `<cpu>c_<ram>g` format. Matches the console table:
      1c_1g  ->  1 vCPU / 1 GB  / 20 GB   (~128.500 d/thang)
      1c_2g  ->  1 vCPU / 2 GB  / 20 GB   (~150.500 d/thang)
      2c_2g  ->  2 vCPU / 2 GB  / 40 GB   (~214.100 d/thang)
      2c_4g  ->  2 vCPU / 4 GB  / 40 GB   (~396.700 d/thang)
  EOT
  type        = string
  default     = "1c_2g"

  validation {
    condition     = contains(["1c_1g", "1c_2g", "2c_2g", "2c_4g"], var.flavor_name)
    error_message = "flavor_name must be one of: 1c_1g, 1c_2g, 2c_2g, 2c_4g."
  }
}

variable "server_category" {
  description = "Server line: basic (Shared CPU), premium, enterprise, dedicated."
  type        = string
  default     = "basic"
}

variable "root_disk_size" {
  description = "Root disk size in GB. Keep it aligned with the flavor's bundled disk (20 or 40)."
  type        = number
  default     = 20
}

variable "root_disk_type" {
  description = "Root disk volume type: HDD or SSD."
  type        = string
  default     = "HDD"

  validation {
    condition     = contains(["HDD", "SSD"], var.root_disk_type)
    error_message = "root_disk_type must be HDD or SSD."
  }
}

variable "os_distribution" {
  description = "OS distribution for the boot image."
  type        = string
  default     = "Ubuntu"
}

variable "os_version" {
  description = "OS version for the boot image, e.g. \"24.04 x64\" or \"26.04 x64\"."
  type        = string
  default     = "24.04 x64"
}

variable "billing_plan" {
  description = "Billing plan: on_demand or saving_plan."
  type        = string
  default     = "on_demand"
}

variable "network_plan" {
  description = "Network plan: free_datatransfer or free_bandwidth."
  type        = string
  default     = "free_datatransfer"
}

# -----------------------------------------------------------------------------
# Access
# -----------------------------------------------------------------------------
variable "ssh_public_key" {
  description = "Contents of the SSH public key allowed to log in as ubuntu (ssh-ed25519 AAAA...)."
  type        = string
}

variable "ssh_allowed_cidrs" {
  description = <<-EOT
    CIDRs allowed to reach port 22. Defaults to the whole internet because the
    GitHub Actions runner has no fixed egress IP. Narrow this if you add a
    self-hosted runner or a bastion.
  EOT
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "manage_container_registry" {
  description = "Create the Bizfly Container Registry repository from Terraform. Set false if it already exists."
  type        = bool
  default     = true
}

variable "container_registry_name" {
  description = "Repository name inside Bizfly Container Registry."
  type        = string
  default     = "averie-web"
}
