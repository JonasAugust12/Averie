# Sync Ponytail rules, skills, and slash commands to global Cursor (~/.cursor).
# Run after `git pull` in the ponytail cache or when /ponytail commands are missing.
#
# Usage:
#   & "f:\Averie\scripts\sync-ponytail-cursor-global.ps1"
#   & "f:\Averie\scripts\sync-ponytail-cursor-global.ps1" -UpdateCache

param(
    [switch]$UpdateCache
)

$ErrorActionPreference = "Stop"
$cache = Join-Path $env:USERPROFILE ".local\share\ponytail"
$destRules = Join-Path $env:USERPROFILE ".cursor\rules"
$destSkills = Join-Path $env:USERPROFILE ".cursor\skills"
$destCommands = Join-Path $env:USERPROFILE ".cursor\commands"

if ($UpdateCache -or -not (Test-Path (Join-Path $cache ".git"))) {
    Write-Host ">> Updating ponytail cache at $cache"
    if (Test-Path (Join-Path $cache ".git")) {
        git -C $cache pull --ff-only
    } else {
        New-Item -ItemType Directory -Force -Path (Split-Path $cache -Parent) | Out-Null
        git clone --depth 1 https://github.com/DietrichGebert/ponytail.git $cache
    }
}

if (-not (Test-Path $cache)) {
    Write-Error "Ponytail cache missing. Run with -UpdateCache or clone manually."
}

$ruleSrc = Join-Path $cache ".cursor\rules\ponytail.mdc"
$skillsSrc = Join-Path $cache "skills"
if (-not (Test-Path $ruleSrc)) {
    Write-Error "Rule file missing: $ruleSrc"
}
if (-not (Test-Path $skillsSrc)) {
    Write-Error "skills folder missing: $skillsSrc"
}

New-Item -ItemType Directory -Force -Path $destRules, $destSkills, $destCommands | Out-Null

Copy-Item $ruleSrc (Join-Path $destRules "ponytail.mdc") -Force
Write-Host ">> rule: $destRules\ponytail.mdc (alwaysApply)"

Get-ChildItem $skillsSrc -Directory | ForEach-Object {
    $name = $_.Name
    Copy-Item $_.FullName (Join-Path $destSkills $name) -Recurse -Force
    Write-Host "   skill: $name"

    $skillMd = Join-Path $destSkills "$name\SKILL.md"
    if (-not (Test-Path $skillMd)) { continue }

    $raw = Get-Content $skillMd -Raw
    $desc = "Ponytail skill"
    if ($raw -match '(?ms)^description:\s*>\s*\r?\n((?:\s+.+\r?\n)+)') {
        $desc = ($Matches[1] -replace '\s+', ' ').Trim()
    } elseif ($raw -match '(?ms)^description:\s*"?(.+?)"?\s*$') {
        $desc = $Matches[1].Trim().Trim('"')
    }
    if ($desc.Length -gt 120) {
        $desc = $desc.Substring(0, 117) + "..."
    }
    $descEscaped = $desc -replace "'", "''"

    $cmd = @"
---
name: '/$name'
id: '$name'
category: 'Ponytail'
description: '$descEscaped'
---

Read and follow the **$name** skill from global skills (`~/.cursor/skills/$name/SKILL.md`). Apply it fully for this request.
"@

    Set-Content -Path (Join-Path $destCommands "$name.md") -Value $cmd -Encoding UTF8
    Write-Host "   command: /$name"
}

Write-Host ""
Write-Host "Done. Restart Cursor."
Write-Host "  Rule: always-on lazy senior dev mode (ponytail.mdc)"
Write-Host "  Commands: /ponytail, /ponytail-review, /ponytail-audit, /ponytail-debt, /ponytail-gain, /ponytail-help"
