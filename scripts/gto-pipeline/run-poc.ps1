# =============================================================
# TexasSolver POC runner (Windows PowerShell)
# =============================================================
# Purpose: run a single POC scenario HU 40BB SRP flop QsJh2h
# to validate the full data pipeline.
#
# Prereqs:
#   1. Download TexasSolver-v0.2.0-Windows.zip from
#      https://github.com/bupticybee/TexasSolver/releases/latest
#   2. Unzip into scripts/gto-pipeline/TexasSolver-v0.2.0-Windows/
#   3. Script auto-detects flat or nested folder layout.
#
# Usage:
#   cd scripts\gto-pipeline
#   powershell -ExecutionPolicy Bypass -File run-poc.ps1
# =============================================================

$ErrorActionPreference = "Stop"

# ---- Paths ----
$ScriptDir = $PSScriptRoot
$OuterDir  = Join-Path $ScriptDir "TexasSolver-v0.2.0-Windows"

# Auto-detect: zip may extract flat or double-nested
$NestedExe = Join-Path $OuterDir "TexasSolver-v0.2.0-Windows\console_solver.exe"
$FlatExe   = Join-Path $OuterDir "console_solver.exe"

if (Test-Path $NestedExe) {
    $SolverDir = Join-Path $OuterDir "TexasSolver-v0.2.0-Windows"
    Write-Host "Detected nested layout" -ForegroundColor Yellow
} elseif (Test-Path $FlatExe) {
    $SolverDir = $OuterDir
    Write-Host "Detected flat layout" -ForegroundColor Yellow
} else {
    $SolverDir = $OuterDir  # default, check below will error out
}

$SolverExe  = Join-Path $SolverDir "console_solver.exe"
$InputFile  = Join-Path $ScriptDir "hu_40bb_srp_flop_QsJh2h.txt"
$OutputDir  = Join-Path $SolverDir "output"
$OutputJson = Join-Path $OutputDir  "hu_40bb_srp_flop_QsJh2h.json"

# ---- Preflight checks ----
Write-Host "=== TexasSolver POC Runner ===" -ForegroundColor Cyan

if (-not (Test-Path $SolverExe)) {
    Write-Host "ERROR: console_solver.exe not found" -ForegroundColor Red
    Write-Host "Expected at: $SolverExe" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please download and extract:"
    Write-Host "  https://github.com/bupticybee/TexasSolver/releases/download/v0.2.0/TexasSolver-v0.2.0-Windows.zip"
    exit 1
}

if (-not (Test-Path $InputFile)) {
    Write-Host "ERROR: input file not found at $InputFile" -ForegroundColor Red
    exit 1
}

Write-Host "OK: console_solver.exe found" -ForegroundColor Green
Write-Host "OK: input file found" -ForegroundColor Green

# ---- Create output dir (inside solver dir because dump_result is cwd-relative) ----
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "OK: output dir created" -ForegroundColor Green
}

# ---- Copy input into solver dir (cwd-relative paths) ----
$CopiedInput = Join-Path $SolverDir "poc_input.txt"
Copy-Item $InputFile $CopiedInput -Force
Write-Host "OK: input copied to solver dir" -ForegroundColor Green

# ---- Run solver ----
Write-Host ""
Write-Host "=== Solving ===" -ForegroundColor Cyan
Write-Host "(a single flop solve usually takes 30s to 5min)"
Write-Host ""

$StartTime = Get-Date

Push-Location $SolverDir
try {
    & .\console_solver.exe -i poc_input.txt
    $ExitCode = $LASTEXITCODE
} finally {
    Pop-Location
}

$Duration = (Get-Date) - $StartTime

Write-Host ""
Write-Host "=== Solve finished ===" -ForegroundColor Cyan
Write-Host ("Duration: {0:F1} seconds" -f $Duration.TotalSeconds)
Write-Host "Exit code: $ExitCode"

# ---- Check output ----
if ($ExitCode -ne 0) {
    Write-Host "ERROR: solver exited with non-zero code" -ForegroundColor Red
    exit $ExitCode
}

if (-not (Test-Path $OutputJson)) {
    Write-Host "ERROR: expected output file not found" -ForegroundColor Red
    Write-Host "Expected: $OutputJson" -ForegroundColor Yellow
    Write-Host "Check solver logs above or look for any .json inside $SolverDir" -ForegroundColor Yellow
    exit 1
}

$JsonSize = (Get-Item $OutputJson).Length / 1KB
Write-Host ("OK: output file {0} ({1:F1} KB)" -f $OutputJson, $JsonSize) -ForegroundColor Green

# ---- Copy JSON into project-level output/ for converter ----
$ProjectOutputDir = Join-Path $ScriptDir "output"
if (-not (Test-Path $ProjectOutputDir)) {
    New-Item -ItemType Directory -Path $ProjectOutputDir -Force | Out-Null
}
$FinalOutputJson = Join-Path $ProjectOutputDir "hu_40bb_srp_flop_QsJh2h.json"
Copy-Item $OutputJson $FinalOutputJson -Force
Write-Host "OK: JSON copied to scripts/gto-pipeline/output/" -ForegroundColor Green

# ---- Run JSON inspector ----
Write-Host ""
Write-Host "=== Running JSON inspector ===" -ForegroundColor Cyan
$InspectorScript = Join-Path $ScriptDir "inspect-json.mjs"
if (Test-Path $InspectorScript) {
    node $InspectorScript $FinalOutputJson
} else {
    Write-Host "(inspect-json.mjs not found, skipping)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "DONE. Next: review scripts/gto-pipeline/output/hu_40bb_srp_flop_QsJh2h.json" -ForegroundColor Green
Write-Host "and paste the inspector output + JSON head to Claude to build the converter." -ForegroundColor Green
