output "server_id" {
  description = "Bizfly server ID."
  value       = bizflycloud_server.web.id
}

output "server_name" {
  description = "Bizfly server name."
  value       = bizflycloud_server.web.name
}

output "public_ip" {
  description = "Public IPv4 of the server — put this in GitHub variable SERVER_HOST and in the DNS A record."
  value       = try(bizflycloud_server.web.default_public_ipv4[0].ip_address, null)
}

output "firewall_id" {
  description = "Firewall protecting the public interface."
  value       = bizflycloud_firewall.web.id
}

output "ssh_key_name" {
  description = "SSH key registered on the server."
  value       = bizflycloud_ssh_key.deploy.name
}

output "ansible_inventory_line" {
  description = "Paste-ready inventory entry for ansible/inventory.ini."
  value = format(
    "%s ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/%s.pem",
    try(bizflycloud_server.web.default_public_ipv4[0].ip_address, "SERVER_IP"),
    var.project_name
  )
}

output "container_registry_name" {
  description = "Container Registry repository the pipeline pushes into (created in the console, not by Terraform)."
  value       = var.container_registry_name
}
