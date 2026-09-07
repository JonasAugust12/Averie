# Bootstrap OpenSpec + Superspec for a new project (Windows).
# Prerequisites: global OpenSpec CLI + config already set (see docs/global-ai-workflow.md).
#
# Usage (from repo root; Windows PowerShell 5.x or pwsh):
#   & "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -SkipInit -ProjectName "My App" -Stack "Next.js 15 + Tailwind"
#   & "f:\Averie\scripts\bootstrap-openspec-superspec.ps1" -ProjectName "My App" -Stack "Next.js 15 + Tailwind"

param(
    [string]$ProjectName = "",
    [string]$Stack = "",
    [switch]$SkipInit
)

$ErrorActionPreference = "Stop"
$SuperspecCache = Join-Path $env:USERPROFILE ".local\share\superspec"
$RepoRoot = (Get-Location).Path

if (-not (Get-Command openspec -ErrorAction SilentlyContinue)) {
    Write-Error "OpenSpec CLI not found. Run: npm install -g @fission-ai/openspec@latest"
}

if (-not (Test-Path $SuperspecCache)) {
    Write-Error "Superspec cache missing at $SuperspecCache. Run global setup in docs/global-ai-workflow.md first."
}

if (-not $SkipInit) {
    Write-Host ">> openspec init --tools cursor --profile custom"
    openspec init --tools cursor --profile custom
}

$SchemaDest = Join-Path $RepoRoot "openspec\schemas\superspec"
New-Item -ItemType Directory -Force -Path $SchemaDest | Out-Null
Copy-Item -Path (Join-Path $SuperspecCache "*") -Destination $SchemaDest -Recurse -Force
Write-Host ">> Copied superspec schema to $SchemaDest"

$ConfigPath = Join-Path $RepoRoot "openspec\config.yaml"
if (-not (Test-Path $ConfigPath)) {
    if ($ProjectName) {
        $context = "Project: $ProjectName`nStack: $Stack"
    } else {
        $context = "Project: (edit openspec/config.yaml - add stack, rules, context)"
    }

    $configYaml = @"
schema: superspec

context: |
    $context

rules:
    proposal:
        - Keep proposals under ~2 pages; focus on why / what
    tasks:
        - Break tasks into chunks of max ~2 hours
    specs:
        - Requirements MUST use SHALL/MUST and include at least one scenario
    plan:
        - Micro-steps suitable for TDD (2-5 minutes each)
"@

    Set-Content -Path $ConfigPath -Value $configYaml -Encoding UTF8
    Write-Host ">> Created openspec/config.yaml (edit context for this project)"
} else {
    $content = Get-Content $ConfigPath -Raw
    if ($content -notmatch "schema:\s*superspec") {
        Write-Warning "openspec/config.yaml exists but schema is not superspec - set schema: superspec manually."
    }
}

Write-Host ">> openspec update"
openspec update

Write-Host ">> openspec validate"
openspec validate

Write-Host ""
Write-Host "Done. Next:"
Write-Host "  1. Edit openspec/config.yaml (project context + rules)"
Write-Host "  2. Restart Cursor"
Write-Host "  3. In Agent chat: /opsx-onboard (first time) or /opsx-propose <feature>"
