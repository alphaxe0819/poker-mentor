#!/bin/bash
# TexasSolver batch runner — Phase-based execution with checkpoints
#
# Usage:
#   bash batch-solve.sh                  # run all 180 inputs
#   bash batch-solve.sh hu_40bb_srp      # run only 40BB SRP (30 boards)
#   bash batch-solve.sh hu_25bb_srp      # run only 25BB SRP
#   bash batch-solve.sh hu_40bb_3bp      # run only 40BB 3BP
#   bash batch-solve.sh phase1a          # SRP 40BB only
#   bash batch-solve.sh phase1b          # SRP 25BB + 13BB
#   bash batch-solve.sh phase1c          # 3BP + 4BP

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOLVER="solver/TexasSolver-v0.2.0-Windows/console_solver.exe"
RESOURCES="solver/TexasSolver-v0.2.0-Windows/resources"
INPUT_DIR="inputs"
OUTPUT_DIR="output"

mkdir -p "$OUTPUT_DIR"

# Solver dump_result uses relative paths — must run from gto-pipeline dir
cd "$SCRIPT_DIR"

# Phase definitions
phase1a="hu_40bb_srp"
phase1b="hu_25bb_srp hu_13bb_srp"
phase1c="hu_40bb_3bp hu_25bb_3bp hu_40bb_4bp"

# Parse arg
FILTER="${1:-all}"
case "$FILTER" in
  phase1a) PATTERNS="$phase1a" ;;
  phase1b) PATTERNS="$phase1b" ;;
  phase1c) PATTERNS="$phase1c" ;;
  all)     PATTERNS="$phase1a $phase1b $phase1c" ;;
  *)       PATTERNS="$FILTER" ;;
esac

# Collect matching input files
FILES=()
for pattern in $PATTERNS; do
  for f in "$INPUT_DIR"/${pattern}_*.txt; do
    [ -f "$f" ] && FILES+=("$f")
  done
done

TOTAL=${#FILES[@]}
if [ "$TOTAL" -eq 0 ]; then
  echo "No input files found for: $FILTER"
  exit 1
fi

echo "═══════════════════════════════════════════════"
echo "  TexasSolver Batch — $FILTER"
echo "  Files: $TOTAL"
echo "  Output: $OUTPUT_DIR"
echo "═══════════════════════════════════════════════"
echo ""

DONE=0
FAILED=0
START_TIME=$(date +%s)

for input_file in "${FILES[@]}"; do
  fname=$(basename "$input_file" .txt)
  output_json="$OUTPUT_DIR/${fname}.json"

  # Skip if already solved
  if [ -f "$output_json" ]; then
    echo "  SKIP $fname (output exists)"
    DONE=$((DONE + 1))
    continue
  fi

  DONE=$((DONE + 1))
  echo "  [$DONE/$TOTAL] $fname"

  t0=$(date +%s)
  if "$SOLVER" --input_file "$input_file" --resource_dir "$RESOURCES" > /dev/null 2>&1; then
    t1=$(date +%s)
    elapsed=$((t1 - t0))
    # Check if output was created
    if [ -f "$output_json" ]; then
      size=$(stat -c%s "$output_json" 2>/dev/null || stat -f%z "$output_json" 2>/dev/null || echo "?")
      echo "    OK  ${elapsed}s  ${size} bytes"
    else
      echo "    WARN  ${elapsed}s  (no output file — check dump_result path)"
      FAILED=$((FAILED + 1))
    fi
  else
    t1=$(date +%s)
    elapsed=$((t1 - t0))
    echo "    FAIL  ${elapsed}s  (solver error)"
    FAILED=$((FAILED + 1))
  fi
done

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))
MINS=$((TOTAL_TIME / 60))
SECS=$((TOTAL_TIME % 60))

echo ""
echo "═══════════════════════════════════════════════"
echo "  Done: $DONE/$TOTAL  Failed: $FAILED"
echo "  Time: ${MINS}m ${SECS}s"
echo "═══════════════════════════════════════════════"
