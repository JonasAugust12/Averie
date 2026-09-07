# Sync OpenSpec, Superpowers, Ponytail, and UI/UX Pro Max skills & rules for Antigravity (IDE & CLI).
# Supports both machine-global (~/.gemini and ~/.agents) and workspace-local (.agents).
#
# Usage:
#   & "f:\Averie\scripts\sync-antigravity-global.ps1"
#   & "f:\Averie\scripts\sync-antigravity-global.ps1" -UpdateCache

param(
    [switch]$UpdateCache,
    [switch]$SkipWorkspace
)

$ErrorActionPreference = "Stop"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Antigravity Global AI Workflow Sync Engine    " -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# ── Paths ──
$workspaceRoot = Split-Path $PSScriptRoot -Parent
$globalGeminiConfig = Join-Path $env:USERPROFILE ".gemini\config"
$globalGeminiSkills = Join-Path $globalGeminiConfig "skills"
$globalAgentsSkills = Join-Path $env:USERPROFILE ".agents\skills"
$globalAgentsRules = Join-Path $env:USERPROFILE ".agents\rules"
$globalGeminiRule = Join-Path $env:USERPROFILE ".gemini\GEMINI.md"

$wsAgentsSkills = Join-Path $workspaceRoot ".agents\skills"
$wsAgentsRules = Join-Path $workspaceRoot ".agents\rules"

# Ensure directories exist
$targetDirs = @(
    $globalGeminiConfig,
    $globalGeminiSkills,
    $globalAgentsSkills,
    $globalAgentsRules
)
if (-not $SkipWorkspace) {
    $targetDirs += @($wsAgentsSkills, $wsAgentsRules)
}

foreach ($dir in $targetDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
}

# Ensure drive-root Junction F:\.agents exists pointing to ~/.agents so all repos on F:\ inherit global skills/workflows
$driveFAgents = "F:\.agents"
if (Test-Path "F:\") {
    if (-not (Test-Path $driveFAgents)) {
        try {
            cmd /c mklink /J "$driveFAgents" "$globalAgentsWorkflows\.." | Out-Null
            Write-Host "   [+] Created Drive Junction: $driveFAgents -> $globalAgentsSkills\.." -ForegroundColor Green
        } catch {}
    }
}

# Helper to deploy a skill directory to all targets
function Deploy-Skill {
    param(
        [string]$SkillName,
        [string]$SourcePath
    )
    if (-not (Test-Path $SourcePath)) {
        Write-Warning "Source not found for skill: $SkillName ($SourcePath)"
        return
    }

    $destinations = @(
        (Join-Path $globalGeminiSkills $SkillName),
        (Join-Path $globalAgentsSkills $SkillName)
    )
    if (-not $SkipWorkspace) {
        $destinations += (Join-Path $wsAgentsSkills $SkillName)
    }

    foreach ($dest in $destinations) {
        if (Test-Path $dest) {
            if ((Resolve-Path $SourcePath).Path -eq (Resolve-Path $dest).Path) {
                continue
            }
            Remove-Item $dest -Recurse -Force
        }
        New-Item -ItemType Directory -Force -Path $dest | Out-Null
        Copy-Item (Join-Path $SourcePath "*") $dest -Recurse -Force
    }

    Write-Host "   [+] Skill deployed: $SkillName" -ForegroundColor Green
}

# ── 1. UI/UX Pro Max ──
Write-Host "`n[1/5] Syncing UI/UX Pro Max..." -ForegroundColor Yellow
try {
    # Try using uipro CLI if available
    $uiproCmd = Get-Command "uipro" -ErrorAction SilentlyContinue
    if ($uiproCmd) {
        Write-Host "   Running: uipro init --global -a antigravity"
        & uipro init --global -a antigravity | Out-Null
    }
} catch {
    Write-Warning "uipro CLI command failed, falling back to local copy."
}

# If ~/.agents/skills/ui-ux-pro-max exists, ensure it's copied to .gemini/config/skills and workspace
$srcUipro = Join-Path $globalAgentsSkills "ui-ux-pro-max"
if (-not (Test-Path $srcUipro)) {
    $srcUipro = Join-Path $env:USERPROFILE ".cursor\skills\ui-ux-pro-max"
}
if (Test-Path $srcUipro) {
    Deploy-Skill -SkillName "ui-ux-pro-max" -SourcePath $srcUipro
}

# ── 2. Ponytail (Skills + Lazy Senior Dev Rule) ──
Write-Host "`n[2/5] Syncing Ponytail..." -ForegroundColor Yellow
$ponytailCache = Join-Path $env:USERPROFILE ".local\share\ponytail"
if ($UpdateCache -or -not (Test-Path (Join-Path $ponytailCache ".git"))) {
    Write-Host "   Updating Ponytail git cache at $ponytailCache"
    if (Test-Path (Join-Path $ponytailCache ".git")) {
        git -C $ponytailCache pull --ff-only 2>$null
    } else {
        New-Item -ItemType Directory -Force -Path (Split-Path $ponytailCache -Parent) | Out-Null
        git clone --depth 1 https://github.com/DietrichGebert/ponytail.git $ponytailCache 2>$null
    }
}

$ponytailSkillsSrc = Join-Path $ponytailCache "skills"
if (-not (Test-Path $ponytailSkillsSrc)) {
    $ponytailSkillsSrc = Join-Path $env:USERPROFILE ".cursor\skills"
}

if (Test-Path $ponytailSkillsSrc) {
    Get-ChildItem $ponytailSkillsSrc -Directory -Filter "ponytail*" | ForEach-Object {
        Deploy-Skill -SkillName $_.Name -SourcePath $_.FullName
    }
}

# Deploy Ponytail Rule
$ponytailRuleContent = @"
# Ponytail, lazy senior dev mode

You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:

1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it.
3. Does the standard library already do this? Use it.
4. Does a native platform feature cover it? Use it.
5. Does an already-installed dependency solve it? Use it.
6. Can this be one line? Make it one line.
7. Only then: write the minimum code that works.

The ladder runs after you understand the problem, not instead of it: read the task and the code it touches, trace the real flow end to end, then climb.

Bug fix = root cause, not symptom: a report names a symptom. Grep every caller of the function you touch and fix the shared function once — one guard there is a smaller diff than one per caller, and patching only the path the ticket names leaves a sibling caller still broken.

Rules:

- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- No boilerplate nobody asked for.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, but only once you understand the problem. The smallest change in the wrong place isn't lazy, it's a second bug.
- Question complex requests: "Do you actually need X, or does Y cover it?"
- Pick the edge-case-correct option when two stdlib approaches are the same size, lazy means less code, not the flimsier algorithm.
- Mark deliberate simplifications that cut a real corner with a known ceiling (global lock, O(n²) scan, naive heuristic) with a ``ponytail:`` comment naming the ceiling and upgrade path.

Not lazy about: understanding the problem (read it fully and trace the real flow before picking a rung, a small diff you don't understand is just laziness dressed up as efficiency), input validation at trust boundaries, error handling that prevents data loss, security, accessibility, the calibration real hardware needs (the platform is never the spec ideal, a clock drifts, a sensor reads off), anything explicitly requested. Lazy code without its check is unfinished: non-trivial logic leaves ONE runnable check behind, the smallest thing that fails if the logic breaks (an assert-based demo/self-check or one small test file; no frameworks, no fixtures). Trivial one-liners need no test.
"@

# 1. Global ~/.gemini/GEMINI.md
[System.IO.File]::WriteAllText($globalGeminiRule, $ponytailRuleContent, [System.Text.Encoding]::UTF8)
Write-Host "   [+] Global rule deployed: $globalGeminiRule" -ForegroundColor Green

# 2. Global ~/.agents/rules/ponytail.md
$globalPonytailRule = Join-Path $globalAgentsRules "ponytail.md"
[System.IO.File]::WriteAllText($globalPonytailRule, $ponytailRuleContent, [System.Text.Encoding]::UTF8)
Write-Host "   [+] Global agent rule deployed: $globalPonytailRule" -ForegroundColor Green

# 3. Workspace .agents/rules/ponytail.md
if (-not $SkipWorkspace) {
    $wsPonytailRule = Join-Path $wsAgentsRules "ponytail.md"
    [System.IO.File]::WriteAllText($wsPonytailRule, $ponytailRuleContent, [System.Text.Encoding]::UTF8)
    Write-Host "   [+] Workspace rule deployed: $wsPonytailRule" -ForegroundColor Green
}

# ── 3. Superpowers Skills ──
Write-Host "`n[3/5] Syncing Superpowers..." -ForegroundColor Yellow
$superpowersSkillsSrc = Join-Path $env:USERPROFILE ".cursor\skills"
$superpowersList = @(
    "banner-design", "brainstorming", "brand", "design", "design-system",
    "dispatching-parallel-agents", "executing-plans", "finishing-a-development-branch",
    "receiving-code-review", "requesting-code-review", "slides", "subagent-driven-development",
    "systematic-debugging", "test-driven-development", "ui-styling", "using-git-worktrees",
    "using-superpowers", "verification-before-completion", "writing-plans", "writing-skills"
)

foreach ($sName in $superpowersList) {
    $sDir = Join-Path $superpowersSkillsSrc $sName
    if (Test-Path $sDir) {
        Deploy-Skill -SkillName $sName -SourcePath $sDir
    }
}

# ── 4. OpenSpec Skills & /opsx-* Slash Commands ──
Write-Host "`n[4/5] Syncing OpenSpec & Generating /opsx-* Slash Commands..." -ForegroundColor Yellow

# Copy standard openspec-* skills
$openspecSkillsSrc = Join-Path $env:USERPROFILE ".cursor\skills"
Get-ChildItem $openspecSkillsSrc -Directory -Filter "openspec-*" | ForEach-Object {
    Deploy-Skill -SkillName $_.Name -SourcePath $_.FullName
}

# Generate opsx-* skills from .cursor/commands/opsx-*.md (or fallback templates)
$opsxCommandsSrc = Join-Path $workspaceRoot ".cursor\commands"
if (-not (Test-Path $opsxCommandsSrc)) {
    $opsxCommandsSrc = Join-Path $env:USERPROFILE ".cursor\commands"
}

if (Test-Path $opsxCommandsSrc) {
    $tempOpsxDir = Join-Path $env:TEMP "antigravity-opsx-skills"
    if (Test-Path $tempOpsxDir) { Remove-Item $tempOpsxDir -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $tempOpsxDir | Out-Null

    Get-ChildItem $opsxCommandsSrc -Filter "opsx-*.md" | ForEach-Object {
        $cmdName = $_.BaseName # e.g. opsx-apply
        $raw = Get-Content $_.FullName -Raw

        # Extract description
        $desc = "OpenSpec $cmdName workflow"
        if ($raw -match '(?ms)description:\s*[\x27"]?([^\r\n\x27"]+)') {
            $desc = $Matches[1].Trim()
        }

        # Strip Cursor command frontmatter and create valid Antigravity skill
        $body = $raw
        if ($raw -match '(?ms)^---\r?\n.*?\r?\n---\r?\n(.*)$') {
            $body = $Matches[1].Trim()
        }

        $skillContent = @"
---
name: $cmdName
description: $desc
---

# $cmdName

$body
"@

        $cmdSkillFolder = Join-Path $tempOpsxDir $cmdName
        New-Item -ItemType Directory -Force -Path $cmdSkillFolder | Out-Null
        Set-Content -Path (Join-Path $cmdSkillFolder "SKILL.md") -Value $skillContent -Encoding UTF8

        Deploy-Skill -SkillName $cmdName -SourcePath $cmdSkillFolder
    }
    Remove-Item $tempOpsxDir -Recurse -Force -ErrorAction SilentlyContinue
}

# Clean up deprecated source-command-opsx-* in workspace if present
if (-not $SkipWorkspace) {
    Get-ChildItem $wsAgentsSkills -Directory -Filter "source-command-opsx-*" | ForEach-Object {
        Remove-Item $_.FullName -Recurse -Force
        Write-Host "   [-] Cleaned up deprecated legacy folder: $($_.Name)" -ForegroundColor DarkGray
    }
}

# ── 5. Antigravity Global Workflows & skills.json Configuration ──
Write-Host "`n[5/5] Generating Antigravity Global Workflows & skills.json..." -ForegroundColor Yellow

# Deploy Workflows to ~/.agents/workflows, ~/.gemini/config/workflows, ~/.gemini/workflows, and workspace .agents/workflows for IDE Slash Command Autocomplete
$globalAgentsWorkflows = Join-Path $env:USERPROFILE ".agents\workflows"
$globalGeminiConfigWorkflows = Join-Path $globalGeminiConfig "workflows"
$globalGeminiWorkflows = Join-Path $env:USERPROFILE ".gemini\workflows"

$globalWfDirs = @($globalAgentsWorkflows, $globalGeminiConfigWorkflows, $globalGeminiWorkflows)
foreach ($dir in $globalWfDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Force -Path $dir | Out-Null
    }
}

$wsAgentsWorkflows = Join-Path $workspaceRoot ".agents\workflows"
if (-not $SkipWorkspace) {
    if (-not (Test-Path $wsAgentsWorkflows)) {
        New-Item -ItemType Directory -Force -Path $wsAgentsWorkflows | Out-Null
    }
}

# Collect all skills and convert them into workflow .md files for Slash Commands autocomplete
$allSkillsFolders = Get-ChildItem $globalGeminiSkills -Directory
foreach ($sFolder in $allSkillsFolders) {
    $skillMdPath = Join-Path $sFolder.FullName "SKILL.md"
    if (Test-Path $skillMdPath) {
        $cmdName = $sFolder.Name
        $raw = Get-Content $skillMdPath -Raw

        # Extract description
        $desc = "$cmdName workflow"
        if ($raw -match '(?ms)description:\s*[\x27"]?([^\r\n\x27"]+)') {
            $desc = $Matches[1].Trim()
        }

        # Format clean workflow markdown
        $body = $raw
        if ($raw -match '(?ms)^---\r?\n.*?\r?\n---\r?\n(.*)$') {
            $body = $Matches[1].Trim()
        }

        $wfContent = @"
---
description: $desc
---

# $cmdName

$body
"@

        # Write to all global workflows directories
        foreach ($gWfDir in $globalWfDirs) {
            Set-Content -Path (Join-Path $gWfDir "$cmdName.md") -Value $wfContent -Encoding UTF8
        }

        # Write to workspace workflows if applicable
        if (-not $SkipWorkspace) {
            Set-Content -Path (Join-Path $wsAgentsWorkflows "$cmdName.md") -Value $wfContent -Encoding UTF8
        }
    }
}
Write-Host "   [+] Workflows generated & deployed to global ~/.agents/workflows and workspace .agents/workflows" -ForegroundColor Green

# Generate skills.json using home-relative paths (~/...)
$skillsJsonPath = Join-Path $globalGeminiConfig "skills.json"
$skillsJsonContent = @"
{
  "entries": [
    {
      "path": "~/.gemini/config/skills"
    },
    {
      "path": "~/.agents/skills"
    }
  ]
}
"@
Set-Content -Path $skillsJsonPath -Value $skillsJsonContent -Encoding UTF8
Write-Host "   [+] skills.json written with home-relative paths: $skillsJsonPath" -ForegroundColor Green

Write-Host "`n==================================================" -ForegroundColor Cyan
Write-Host "Sync completed successfully!" -ForegroundColor Green
Write-Host "Antigravity IDE & CLI now support:" -ForegroundColor White
Write-Host "  - OpenSpec & Superspec: /opsx-propose, /opsx-apply, /opsx-verify, /opsx-archive, ..." -ForegroundColor Gray
Write-Host "  - Superpowers: /brainstorming, /writing-plans, /test-driven-development, /executing-plans, ..." -ForegroundColor Gray
Write-Host "  - Ponytail: /ponytail-review, /ponytail-audit, /ponytail, ... + Always-On Rule" -ForegroundColor Gray
Write-Host "  - UI/UX Pro Max: /ui-ux-pro-max + python scripts/search.py" -ForegroundColor Gray
Write-Host "==================================================" -ForegroundColor Cyan
