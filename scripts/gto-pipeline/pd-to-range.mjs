#!/usr/bin/env node
/**
 * Convert pokerdinosaur *_ranges.json (+ action_id_map.json) → normalized
 * per-table hand-map JSON in output/pd-ranges/<project>/<table>.json.
 *
 * Output format aligns with parse-rye-html.mjs so downstream scripts
 * (generate-input.mjs / merge-ranges.mjs) can consume both pipelines.
 *
 * Usage:
 *   node pd-to-range.mjs <ranges.json> [action_id_map.json] [out-dir]
 *   node pd-to-range.mjs /c/Users/User/Downloads/Course_ranges.json
 *
 * If action_id_map.json not given, defaults to ~/Downloads/action_id_map.json.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { resolve, basename, join } from 'node:path'
import os from 'node:os'

// ── label → TexasSolver bucket (raise | call | fold) ──
const LABEL_RULES = [
  // raise bucket
  [/^4B$/i, 'raise'],
  [/^3B( |$)/i, 'raise'],
  [/^Raise( |$)/i, 'raise'],
  [/^Jam$/i, 'raise'],
  [/^All-?in$/i, 'raise'],
  // call bucket
  [/^Call$/i, 'call'],
  [/^Check$/i, 'call'],
  [/^Limp$/i, 'call'],
  [/^Defend/i, 'call'],
  // fold bucket
  [/^Fold$/i, 'fold'],
]

function labelToBucket(label) {
  if (!label) return 'fold'
  for (const [re, bucket] of LABEL_RULES) {
    if (re.test(label)) return bucket
  }
  return 'unknown'
}

const args = process.argv.slice(2)
if (!args[0]) { console.error('Usage: node pd-to-range.mjs <ranges.json> [map.json] [out-dir]'); process.exit(1) }
const rangesPath = resolve(args[0])
const mapPath = args[1]
  ? resolve(args[1])
  : join(os.homedir(), 'Downloads', 'action_id_map.json')
const outDir = args[2] ?? 'scripts/gto-pipeline/output/pd-ranges'

const data = JSON.parse(readFileSync(rangesPath, 'utf8'))
const actionMapAll = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf8')) : {}

const projectId = data.project_id
const projectName = data.project_name ?? 'unknown'
const projectMap = actionMapAll[projectId]?.actions ?? {}

console.log(`Project: ${projectName} (${projectId})`)
console.log(`Tables:  ${data.tables?.length ?? 0}`)
console.log(`Actions: ${Object.keys(projectMap).length} in map`)

const projectDir = join(outDir, sanitize(projectName))
mkdirSync(projectDir, { recursive: true })

let ok = 0
let warnings = []
const labelSummary = new Map()

for (const table of data.tables ?? []) {
  const hands = {}
  let unknownActionIds = new Set()
  let unknownLabels = new Set()

  for (const [hand, cell] of Object.entries(table.grid ?? {})) {
    if (typeof cell === 'string') {
      const action = projectMap[cell]
      if (!action) { unknownActionIds.add(cell); continue }
      hands[hand] = {
        action: action.label,
        bucket: labelToBucket(action.label),
        weight: 1.0,
        color: action.color,
      }
      if (labelToBucket(action.label) === 'unknown') unknownLabels.add(action.label)
      bumpLabel(labelSummary, action.label)
    } else if (cell && typeof cell === 'object') {
      // mixed strategy: { actionId: weight% }
      const mix = []
      let totalPct = 0
      for (const [aid, pct] of Object.entries(cell)) {
        const action = projectMap[aid]
        if (!action) { unknownActionIds.add(aid); continue }
        const w = Number(pct) / 100
        mix.push({
          action: action.label,
          bucket: labelToBucket(action.label),
          weight: w,
          color: action.color,
        })
        totalPct += Number(pct)
        if (labelToBucket(action.label) === 'unknown') unknownLabels.add(action.label)
        bumpLabel(labelSummary, action.label, w)
      }
      hands[hand] = { mixed: mix, totalPct }
    }
  }

  if (unknownActionIds.size) warnings.push(`${table.name}: ${unknownActionIds.size} unknown action_ids`)
  if (unknownLabels.size) warnings.push(`${table.name}: unknown labels ${[...unknownLabels].join(',')}`)

  const out = {
    file: sanitize(`${projectName}_${table.name}`),
    project: projectName,
    projectId,
    scenarioId: table.scenario_id,
    tableId: table.id,
    tableName: table.name,
    handsCount: Object.keys(hands).length,
    hands,
  }

  const outPath = join(projectDir, `${sanitize(table.name)}.json`)
  writeFileSync(outPath, JSON.stringify(out, null, 2))
  ok++
}

console.log(`\n✓ Wrote ${ok} tables → ${projectDir}`)
if (warnings.length) {
  console.log('\n⚠ Warnings:')
  warnings.slice(0, 20).forEach(w => console.log('  ' + w))
  if (warnings.length > 20) console.log(`  ... (+${warnings.length - 20} more)`)
}
console.log('\nLabel usage summary (weighted combos):')
const sorted = [...labelSummary.entries()].sort((a,b) => b[1] - a[1])
for (const [label, count] of sorted) {
  console.log(`  ${label.padEnd(20)} ${count.toFixed(1)}  (${labelToBucket(label)})`)
}

function sanitize(s) { return s.replace(/[^\w\-]+/g, '_').replace(/^_|_$/g, '') }
function bumpLabel(map, label, w = 1) { map.set(label, (map.get(label) ?? 0) + w) }
