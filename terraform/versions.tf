terraform {
  required_version = ">= 1.10.0"

  required_providers {
    bizflycloud = {
      source = "bizflycloud/bizflycloud"
      # Provider is still pre-1.0; pin the patch range so a 0.4 release with
      # breaking schema changes cannot land silently.
      version = "~> 0.3.9"
    }
  }

  # ---------------------------------------------------------------------------
  # State lives in Bizfly Simple Storage (S3-compatible).
  # Locking uses the native .tflock object (Terraform >= 1.10) — no DynamoDB.
  #
  # Bucket name / endpoint are supplied via partial config so nothing
  # environment-specific is committed:
  #     terraform init -backend-config=backend.hcl
  #
  # To run with local state instead, comment out this whole `backend` block.
  # ---------------------------------------------------------------------------
  backend "s3" {
    key          = "averie/terraform.tfstate"
    use_lockfile = true

    # Bizfly Simple Storage is S3-compatible but not AWS — skip AWS-only calls.
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

provider "bizflycloud" {
  auth_method = var.bizfly_auth_method
  region_name = var.bizfly_region_name
  project_id  = var.bizfly_project_id

  # Credentials come from environment variables so they never touch the repo:
  #   auth_method = "password"
  #     BIZFLYCLOUD_EMAIL / BIZFLYCLOUD_PASSWORD
  #   auth_method = "application_credential"
  #     BIZFLYCLOUD_APPLICATION_CREDENTIAL_ID / BIZFLYCLOUD_APPLICATION_CREDENTIAL_SECRET
}
