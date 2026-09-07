# Sync Caveman skills + slash commands to global Cursor (~/.cursor).
# Prose compression (fewer tokens) - complementary to Ponytail (less code).
#
# Usage:
#   & "f:\Averie\scripts\sync-caveman-cursor-global.ps1"
#   & "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -UpdateCache
#   & "f:\Averie\scripts\sync-caveman-cursor-global.ps1" -AlwaysOnRule

param(
    [switch]$UpdateCache,
    [switch]$AlwaysOnRule
)

$ErrorActionPreference = "Stop"
$cache = Join-Path $env:USERPROFILE ".local\share\caveman"
$destSkills = Join-Path $env:USERPROFILE ".cursor\skills"
$destCommands = Join-Path $env:USERPROFILE ".cursor\commands"
$destRules = Join-Path $env:USERPROFILE ".cursor\rules"

if ($UpdateCache -or -not (Test-Path (Join-Path $cache ".git"))) {
    Write-Host ">> Updating caveman cache at $cache"
    if (Test-Path (Join-Path $cache ".git")) {
        git -C $cache pull --ff-only
    } else {
        New-Item -ItemType Directory -Force -Path (Split-Path $cache -Parent) | Out-Null
        git clone --depth 1 https://github.com/JuliusBrussee/caveman.git $cache
    }
}

if (-not (Test-Path $cache)) {
    Write-Error "Caveman cache missing. Run with -UpdateCache."
}

$skillsSrc = Join-Path $cache "skills"
$ruleSrc = Join-Path $cache "src\rules\caveman-activate.md"
if (-not (Test-Path $skillsSrc)) {
    Write-Error "skills folder missing: $skillsSrc"
}

New-Item -ItemType Directory -Force -Path $destSkills, $destCommands, $destRules | Out-Null

Write-Host ">> Source: $cache"

Get-ChildItem $skillsSrc -Directory | ForEach-Object {
    $name = $_.Name
    if ($name -eq "generated") { return }

    Copy-Item $_.FullName (Join-Path $destSkills $name) -Recurse -Force
    Write-Host "   skill: $name"

    $skillMd = Join-Path $destSkills "$name\SKILL.md"
    if (-not (Test-Path $skillMd)) { continue }

    $raw = Get-Content $skillMd -Raw
    $desc = "Caveman skill"
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
category: 'Caveman'
description: '$descEscaped'
---

Read and follow the **$name** skill from global skills (`~/.cursor/skills/$name/SKILL.md`). Apply it fully for this request.
"@

    Set-Content -Path (Join-Path $destCommands "$name.md") -Value $cmd -Encoding UTF8
    Write-Host "   command: /$name"
}

if (Test-Path $ruleSrc) {
    $ruleBody = Get-Content $ruleSrc -Raw
    $alwaysApply = if ($AlwaysOnRule) { "true" } else { "false" }
    $frontmatter = @"
---
description: Caveman terse mode - fewer tokens in replies. Use /caveman to toggle; off during OpenSpec artifact writing.
globs:
alwaysApply: $alwaysApply
---

"@
    $rulePath = Join-Path $destRules "caveman.mdc"
    Set-Content -Path $rulePath -Value ($frontmatter + $ruleBody) -Encoding UTF8
    Write-Host ">> rule: $rulePath (alwaysApply=$alwaysApply)"
} else {
    Write-Warning "Rule source missing: $ruleSrc"
}

Write-Host ""
Write-Host "Done. Restart Cursor."
Write-Host "  Per session: /caveman (or /caveman full|lite|ultra|off)"
Write-Host "  Help: /caveman-help"
Write-Host "  Note: Caveman compresses PROSE only; code/commits stay normal. Pairs with Ponytail (less code)."
