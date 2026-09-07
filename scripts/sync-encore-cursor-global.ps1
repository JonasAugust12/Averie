# Sync Encore skills + slash commands to global Cursor (~/.cursor).
# Skills source: npx skills add (installs to ~/.agents/skills) or git cache.
#
# Usage:
#   & "f:\Averie\scripts\sync-encore-cursor-global.ps1"
#   & "f:\Averie\scripts\sync-encore-cursor-global.ps1" -UpdateCache
#   & "f:\Averie\scripts\sync-encore-cursor-global.ps1" -InstallViaNpx

param(
    [switch]$UpdateCache,
    [switch]$InstallViaNpx
)

$ErrorActionPreference = "Stop"
$cache = Join-Path $env:USERPROFILE ".local\share\encore-skills"
$agentsSkills = Join-Path $env:USERPROFILE ".agents\skills"
$destSkills = Join-Path $env:USERPROFILE ".cursor\skills"
$destCommands = Join-Path $env:USERPROFILE ".cursor\commands"

if ($InstallViaNpx) {
    Write-Host ">> Installing via npx skills add (global Cursor)..."
    npx skills add encoredev/skills -a cursor -g -y
}

if ($UpdateCache -or -not (Test-Path (Join-Path $cache ".git"))) {
    Write-Host ">> Updating encore-skills cache at $cache"
    if (Test-Path (Join-Path $cache ".git")) {
        git -C $cache pull --ff-only
    } else {
        New-Item -ItemType Directory -Force -Path (Split-Path $cache -Parent) | Out-Null
        git clone --depth 1 https://github.com/encoredev/skills.git $cache
    }
}

$skillsSrc = $null
if (Test-Path $cache) {
    $encoreDir = Join-Path $cache "encore"
    if (Test-Path $encoreDir) {
        $skillsSrc = $encoreDir
    } else {
        $skillsSrc = $cache
    }
}

New-Item -ItemType Directory -Force -Path $destSkills, $destCommands | Out-Null

$copied = 0
$skillDirs = @()

if ($skillsSrc -and (Test-Path $skillsSrc)) {
    $skillDirs = Get-ChildItem $skillsSrc -Directory | Where-Object {
        $_.Name -like "encore*" -and (Test-Path (Join-Path $_.FullName "SKILL.md"))
    }
}

if ($skillDirs.Count -eq 0) {
    $skillDirs = Get-ChildItem $agentsSkills -Directory -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -like "encore*" -and (Test-Path (Join-Path $_.FullName "SKILL.md"))
    }
    if ($skillDirs.Count -gt 0) {
        Write-Host ">> Source: $agentsSkills (encore-*)"
    }
} else {
    Write-Host ">> Source: $skillsSrc"
}

if ($skillDirs.Count -eq 0) {
    Write-Error "No encore skills found. Run with -InstallViaNpx or -UpdateCache first."
}

foreach ($dir in $skillDirs) {
    $name = $dir.Name
    Copy-Item $dir.FullName (Join-Path $destSkills $name) -Recurse -Force
    Write-Host "   skill: $name"
    $copied++

    $skillMd = Join-Path $destSkills "$name\SKILL.md"
    $raw = Get-Content $skillMd -Raw
    $desc = "Encore skill"
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
category: 'Encore'
description: '$descEscaped'
---

Read and follow the **$name** skill from global skills (`~/.cursor/skills/$name/SKILL.md`). Apply it fully for this Encore request.
"@

    Set-Content -Path (Join-Path $destCommands "$name.md") -Value $cmd -Encoding UTF8
    Write-Host "   command: /$name"
}

Write-Host ""
Write-Host "Done. Synced $copied Encore skills. Restart Cursor."
Write-Host "  MCP is per-project - run bootstrap-encore-project.ps1 after encore app create."
Write-Host "  Docs: ai-flow/encore-workflow.md"
