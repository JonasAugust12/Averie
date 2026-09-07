# Install Encore CLI on Windows (official installer).
# Requires network. Run once per machine.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File "f:\Averie\scripts\install-encore-cli.ps1"
#
# After install, reopen terminal and verify: encore version

$ErrorActionPreference = "Stop"

$encoreCmd = Get-Command encore -ErrorAction SilentlyContinue
if ($encoreCmd) {
    Write-Host "Encore CLI already installed:"
    encore version
    exit 0
}

Write-Host ">> Installing Encore CLI from https://encore.dev/install.ps1"
Set-ExecutionPolicy -Scope Process Bypass -Force
irm https://encore.dev/install.ps1 | iex

Write-Host ""
Write-Host ">> Reopen terminal, then run: encore version"
Write-Host ">> Create project: encore app create"
Write-Host ">> Bootstrap Cursor MCP: bootstrap-encore-project.ps1 -ProjectPath D:\path\to\app"
