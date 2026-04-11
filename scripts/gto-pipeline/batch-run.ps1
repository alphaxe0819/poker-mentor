# =============================================================
# TexasSolver batch runner: solve all boards + convert to TS
# =============================================================
# What it does:
#   1. Loads every input file from scripts/gto-pipeline/inputs/
#   2. For each input:
#       a. Run console_solver
#       b. Convert resulting JSON to a TS file under src/lib/gto/
#       c. Delete the JSON to save disk (130MB each)
#   3. Print summary at the end
#
# Usage:
#   cd scripts\gto-pipeline
#   powershell -ExecutionPolicy Bypass -File batch-run.ps1
#
# Optional flags:
#   -KeepJson    Keep large JSON files instead of deleting
#   -StopOnError Halt batch if any board fails (default: skip & continue)
# =============================================================

param(
    [switch]$KeepJson,
    [switch]$StopOnError
)

$ErrorActionPreference = "Stop"

# ---- Paths ----
$ScriptDir = $PSScriptRoot
$OuterDir  = Join-Path $ScriptDir "TexasSolver-v0.2.0-Windows"

# Auto-detect nested or flat layout
$NestedExe = Join-Path $OuterDir "TexasSolver-v0.2.0-Windows\console_solver.exe"
$FlatExe   = Join-Path $OuterDir "console_solver.exe"
if (Test-Path $NestedExe) {
    $SolverDir = Join-Path $OuterDir "TexasSolver-v0.2.0-Windows"
} elseif (Test-Path $FlatExe) {
    $SolverDir = $OuterDir
} else {
    Write-Host "ERROR: console_solver.exe not found under $OuterDir" -ForegroundColor Red
    exit 1
}

$SolverExe   = Join-Path $SolverDir "console_solver.exe"
$InputDir    = Join-Path $ScriptDir "inputs"
$OutputDir   = Join-Path $ScriptDir "output"
$ConverterJs = Join-Path $ScriptDir "convert-to-ts.mjs"

# ---- Preflight ----
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " TexasSolver Batch Runner" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "Solver:    $SolverExe"
Write-Host "Inputs:    $InputDir"
Write-Host "JSON out:  $OutputDir"
Write-Host "Converter: $ConverterJs"
Write-Host ""

if (-not (Test-Path $InputDir)) {
    Write-Host "ERROR: input dir not found. Run 'node generate-input.mjs' first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Solver dumps to its own output/, so we need that dir too
$SolverOutDir = Join-Path $SolverDir "output"
if (-not (Test-Path $SolverOutDir)) {
    New-Item -ItemType Directory -Path $SolverOutDir -Force | Out-Null
}

# Get all input files
$inputFiles = Get-ChildItem -Path $InputDir -Filter "*.txt" | Sort-Object Name
$totalCount = $inputFiles.Count

if ($totalCount -eq 0) {
    Write-Host "ERROR: no input files found in $InputDir" -ForegroundColor Red
    exit 1
}

Write-Host "Found $totalCount input file(s)" -ForegroundColor Green
Write-Host ""

# ---- Run loop ----
$succeeded = @()
$failed    = @()
$batchStart = Get-Date

for ($i = 0; $i -lt $totalCount; $i++) {
    $inputFile = $inputFiles[$i]
    $baseName  = [System.IO.Path]::GetFileNameWithoutExtension($inputFile.Name)
    $boardSlug = ($baseName -split '_')[-1]
    $progress  = "[$($i + 1)/$totalCount]"

    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host "$progress $baseName" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan

    # Copy input into solver dir (cwd-relative dump_result paths)
    $copiedInput = Join-Path $SolverDir "batch_input.txt"
    Copy-Item $inputFile.FullName $copiedInput -Force

    # Run solver
    $solveStart = Get-Date
    Push-Location $SolverDir
    try {
        & .\console_solver.exe -i batch_input.txt 2>&1 | ForEach-Object {
            # Show only progress percentages and important lines
            if ($_ -match '^\[|^EXEC|^iter|^accuracy|^WARN|^ERROR|^terminate|^command not') {
                Write-Host "  $_"
            }
        }
        $solveExit = $LASTEXITCODE
    } catch {
        $solveExit = -1
        Write-Host "  Solver crashed: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Pop-Location
    }
    $solveDur = (Get-Date) - $solveStart

    # Solver dumps to its own output/ dir
    $expectedJson = Join-Path $SolverOutDir "$baseName.json"

    if ($solveExit -ne 0 -or -not (Test-Path $expectedJson)) {
        Write-Host "  FAIL: solver exit=$solveExit, json missing? $(-not (Test-Path $expectedJson))" -ForegroundColor Red
        $failed += @{ name = $baseName; reason = "solve failed (exit $solveExit)" }
        if ($StopOnError) { exit 1 }
        continue
    }

    $jsonSize = (Get-Item $expectedJson).Length / 1MB
    Write-Host ("  Solve OK ({0:F1}s, {1:F1} MB)" -f $solveDur.TotalSeconds, $jsonSize) -ForegroundColor Green

    # Move JSON to project-level output
    $finalJson = Join-Path $OutputDir "$baseName.json"
    Move-Item $expectedJson $finalJson -Force

    # Convert
    $convertStart = Get-Date
    try {
        $convertOutput = & node --max-old-space-size=4096 $ConverterJs $finalJson $baseName 2>&1
        $convertExit = $LASTEXITCODE
    } catch {
        $convertExit = -1
        $convertOutput = $_.Exception.Message
    }
    $convertDur = (Get-Date) - $convertStart

    if ($convertExit -ne 0) {
        Write-Host "  FAIL: convert exit=$convertExit" -ForegroundColor Red
        Write-Host "  $convertOutput" -ForegroundColor Red
        $failed += @{ name = $baseName; reason = "convert failed" }
        if ($StopOnError) { exit 1 }
        continue
    }

    # Find the final TS line in convert output
    $tsLine = ($convertOutput | Where-Object { $_ -match 'Written.*\.ts' }) | Select-Object -Last 1
    Write-Host ("  Convert OK ({0:F1}s)" -f $convertDur.TotalSeconds) -ForegroundColor Green
    if ($tsLine) { Write-Host "  $tsLine" -ForegroundColor DarkGray }

    # Delete intermediate JSON unless -KeepJson
    if (-not $KeepJson) {
        Remove-Item $finalJson -Force
        Write-Host "  Cleaned JSON ($([Math]::Round($jsonSize, 1)) MB freed)" -ForegroundColor DarkGray
    }

    $succeeded += $baseName
    Write-Host ""
}

# ---- Summary ----
$totalDur = (Get-Date) - $batchStart
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host " BATCH COMPLETE" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ("Total time: {0:F1} minutes" -f $totalDur.TotalMinutes)
Write-Host "Succeeded:  $($succeeded.Count) / $totalCount" -ForegroundColor Green
Write-Host "Failed:     $($failed.Count)" -ForegroundColor $(if ($failed.Count -gt 0) { "Red" } else { "Green" })

if ($succeeded.Count -gt 0) {
    Write-Host ""
    Write-Host "Generated TS files (src/lib/gto/):" -ForegroundColor Green
    foreach ($s in $succeeded) {
        Write-Host "  gtoData_$s.ts"
    }
}

if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host "Failed boards:" -ForegroundColor Red
    foreach ($f in $failed) {
        Write-Host "  $($f.name) - $($f.reason)"
    }
}

Write-Host ""
Write-Host "Done. Report this to Claude when you're back." -ForegroundColor Cyan
