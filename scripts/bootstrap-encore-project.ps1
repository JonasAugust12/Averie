# Bootstrap Encore project for Cursor: LLM rules + local MCP server config.
# Run from repo root AFTER `encore app create` or in an existing Encore app folder.
#
# Usage:
#   & "f:\Averie\scripts\bootstrap-encore-project.ps1" -ProjectPath "D:\path\to\my-encore-app"
#   & "f:\Averie\scripts\bootstrap-encore-project.ps1"   # uses current directory

param(
    [string]$ProjectPath = (Get-Location).Path
)

$ErrorActionPreference = "Stop"

$encoreCmd = Get-Command encore -ErrorAction SilentlyContinue
if (-not $encoreCmd) {
    Write-Error "encore CLI not found. Run install-encore-cli.ps1 first, then reopen terminal."
}

$ProjectPath = (Resolve-Path $ProjectPath).Path
Set-Location $ProjectPath

$appFile = Join-Path $ProjectPath "encore.app"
if (-not (Test-Path $appFile)) {
    Write-Error "Not an Encore app (missing encore.app). Run 'encore app create' in this folder first."
}

Write-Host ">> Project: $ProjectPath"
Write-Host ">> Running encore llm-rules init (select Cursor when prompted)..."

Push-Location $ProjectPath
try {
    encore llm-rules init
} finally {
    Pop-Location
}

# Parse app id from encore.app (JSON: { "id": "..." })
$appId = $null
$appRaw = Get-Content $appFile -Raw
if ($appRaw -match '"id"\s*:\s*"([^"]+)"') {
    $appId = $Matches[1]
}

if (-not $appId) {
    Write-Warning "Could not parse app id from encore.app. Set --app= manually in .cursor/mcp.json"
} else {
    Write-Host ">> App id: $appId"

    $cursorDir = Join-Path $ProjectPath ".cursor"
    $mcpPath = Join-Path $cursorDir "mcp.json"
    New-Item -ItemType Directory -Force -Path $cursorDir | Out-Null

    $mcp = @{ mcpServers = @{} }
    if (Test-Path $mcpPath) {
        $existing = Get-Content $mcpPath -Raw | ConvertFrom-Json
        if ($existing.mcpServers) {
            $existing.mcpServers.PSObject.Properties | ForEach-Object {
                $mcp.mcpServers[$_.Name] = $_.Value
            }
        }
    }

    $mcp.mcpServers["encore-local"] = @{
        command = "encore"
        args    = @("mcp", "run", "--app=$appId")
    }

    ($mcp | ConvertTo-Json -Depth 10) | Set-Content -Path $mcpPath -Encoding UTF8
    Write-Host ">> MCP config: $mcpPath (encore-local -> app=$appId)"
}

Write-Host ""
Write-Host "Done. Next steps:"
Write-Host "  1. Restart Cursor (open this project folder as workspace root)"
Write-Host "  2. Enable encore-local MCP in Cursor Settings > MCP"
Write-Host "  3. encore run          # local app + dashboard :9400"
Write-Host "  4. Agent can inspect APIs, DB schema, traces via MCP"
