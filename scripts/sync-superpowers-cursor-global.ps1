# Sync Superpowers skills + slash commands to global Cursor (~/.cursor).
# Run after /plugin-update superpowers or when /brainstorming etc. missing in other repos.
#
# Usage:
#   & "f:\Averie\scripts\sync-superpowers-cursor-global.ps1"

$ErrorActionPreference = "Stop"

$pluginBase = Join-Path $env:USERPROFILE ".cursor\plugins\cache\cursor-public\superpowers"
if (-not (Test-Path $pluginBase)) {
    Write-Error "Superpowers plugin cache not found. In Cursor Agent chat run: /add-plugin superpowers"
}

$pluginRoot = Get-ChildItem $pluginBase -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $pluginRoot) {
    Write-Error "No superpowers version folder under $pluginBase"
}

$skillsSrc = Join-Path $pluginRoot.FullName "skills"
if (-not (Test-Path $skillsSrc)) {
    Write-Error "skills folder missing in $($pluginRoot.FullName)"
}

$destSkills = Join-Path $env:USERPROFILE ".cursor\skills"
$destCommands = Join-Path $env:USERPROFILE ".cursor\commands"
New-Item -ItemType Directory -Force -Path $destSkills, $destCommands | Out-Null

Write-Host ">> Source: $($pluginRoot.FullName)"

Get-ChildItem $skillsSrc -Directory | ForEach-Object {
    $name = $_.Name
    Copy-Item $_.FullName (Join-Path $destSkills $name) -Recurse -Force
    Write-Host "   skill: $name"

    $skillMd = Join-Path $destSkills "$name\SKILL.md"
    if (-not (Test-Path $skillMd)) { continue }

    $raw = Get-Content $skillMd -Raw
    $desc = "Superpowers skill"
    if ($raw -match '(?ms)^description:\s*"?(.+?)"?\s*$') {
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
category: 'Superpowers'
description: '$descEscaped'
---

Read and follow the **$name** skill from global skills (`~/.cursor/skills/$name/SKILL.md`). Apply it fully for this request.
"@

    Set-Content -Path (Join-Path $destCommands "$name.md") -Value $cmd -Encoding UTF8
    Write-Host "   command: /$name"
}

Write-Host ""
Write-Host "Done. Restart Cursor, then in Agent chat type /brainstorming (or /writing-plans, etc.)."
Write-Host "Plugin must still be enabled: /add-plugin superpowers (once per machine)."
