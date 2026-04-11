#!/usr/bin/env node
/**
 * Convert TexasSolver JSON output to TypeScript gtoData_*.ts format.
 *
 * Extracts the key decision nodes for a given flop solve and writes them
 * as canonical hand-class → action maps (matching existing gtoData pattern).
 *
 * Input:  output/hu_40bb_srp_flop_QsJh2h.json
 * Output: src/lib/gto/gtoData_hu_postflop_flop_QsJh2h.ts
 *
 * Extracts 4 scenarios from the solve:
 *   1. BTN c-bet decision (after BB check)
 *   2. BB facing c-bet small (b33)
 *   3. BB facing c-bet mid   (b50)
 *   4. BB facing c-bet large (b100)
 *
 * Usage: node convert-to-ts.mjs <input-json> [scenario-prefix]
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

// Project root = two levels up from this script (scripts/gto-pipeline/ → project root)
const __dirname = dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = resolve(__dirname, '..', '..')

// ───────────────────────────────────────────────────────────
// CLI args
// ───────────────────────────────────────────────────────────
const jsonPath = process.argv[2] || 'output/hu_40bb_srp_flop_QsJh2h.json'
const scenarioPrefix = process.argv[3] || 'hu_40bb_srp_flop_QsJh2h'

const absInput = resolve(jsonPath)
console.log(`Loading ${absInput}...`)
const data = JSON.parse(readFileSync(absInput, 'utf8'))
console.log('Loaded.\n')

// ───────────────────────────────────────────────────────────
// Combo → canonical class  (e.g. AsKs → AKs, AcAd → AA)
// ───────────────────────────────────────────────────────────
const RANK_ORDER = '23456789TJQKA'

function rankIdx(r) {
  return RANK_ORDER.indexOf(r)
}

/**
 * 'AsKs' → 'AKs'
 * 'AsKh' → 'AKo'
 * 'AcAd' → 'AA'
 * 'TcTs' → 'TT'
 */
function comboToClass(combo) {
  if (combo.length !== 4) return null
  const r1 = combo[0], s1 = combo[1], r2 = combo[2], s2 = combo[3]

  if (r1 === r2) return r1 + r2 // pair

  // Order high rank first
  const hi = rankIdx(r1) > rankIdx(r2) ? r1 : r2
  const lo = rankIdx(r1) > rankIdx(r2) ? r2 : r1
  const suited = s1 === s2
  return hi + lo + (suited ? 's' : 'o')
}

// ───────────────────────────────────────────────────────────
// Aggregate combo strategies → class strategies
// ───────────────────────────────────────────────────────────
/**
 * Given a node's strategy.strategy (combo → action freqs) and actions array,
 * return { classKey → avgFreqsArray }.
 */
function aggregateToClasses(comboStrategy, actions) {
  const classSum = {}   // class → [sumFreq0, sumFreq1, ...]
  const classCount = {} // class → count of combos

  for (const [combo, freqs] of Object.entries(comboStrategy)) {
    const cls = comboToClass(combo)
    if (!cls) continue

    if (!classSum[cls]) {
      classSum[cls] = new Array(actions.length).fill(0)
      classCount[cls] = 0
    }
    for (let i = 0; i < actions.length; i++) {
      classSum[cls][i] += freqs[i]
    }
    classCount[cls] += 1
  }

  // Average each class
  const classAvg = {}
  for (const cls of Object.keys(classSum)) {
    const cnt = classCount[cls]
    classAvg[cls] = classSum[cls].map(s => s / cnt)
  }
  return classAvg
}

// ───────────────────────────────────────────────────────────
// Bet amount → UI bucket mapping
// ───────────────────────────────────────────────────────────
/**
 * Given ordered actions list containing "BET X.XXXXXX" / "RAISE X.XXXXXX" etc,
 * return a map: action name → bucket code.
 *
 * We expect each node to have at most 3 non-allin bet/raise sizes which map
 * to b33 / b50 / b100 (or r-small / r-mid / r-large for raises), plus optionally all-in.
 *
 * The largest bet that equals the effective stack is mapped to 'allin'.
 */
function buildActionCodeMap(actions, effectiveStack) {
  const map = {}

  // Separate by type
  const bets = []
  const raises = []
  for (const a of actions) {
    if (a === 'CHECK') map[a] = 'x'
    else if (a === 'CALL') map[a] = 'c'
    else if (a === 'FOLD') map[a] = 'f'
    else if (a.startsWith('BET ')) bets.push(a)
    else if (a.startsWith('RAISE ')) raises.push(a)
  }

  // Sort bets by amount ascending
  bets.sort((a, b) => parseFloat(a.split(' ')[1]) - parseFloat(b.split(' ')[1]))
  raises.sort((a, b) => parseFloat(a.split(' ')[1]) - parseFloat(b.split(' ')[1]))

  // Map bets: smallest → b33, next → b50, next → b100, if amount ~= stack → allin
  const betBuckets = ['b33', 'b50', 'b100']
  let bi = 0
  for (const b of bets) {
    const amt = parseFloat(b.split(' ')[1])
    if (amt >= effectiveStack * 0.95) {
      map[b] = 'allin'
    } else {
      map[b] = betBuckets[bi] || `b${Math.round((amt / 5) * 100)}`
      bi++
    }
  }

  // Map raises: 'r' for smallest raise, 'rbig' for larger, 'allin' if >= stack
  for (let i = 0; i < raises.length; i++) {
    const r = raises[i]
    const amt = parseFloat(r.split(' ')[1])
    if (amt >= effectiveStack * 0.95) {
      map[r] = 'allin'
    } else {
      map[r] = i === 0 ? 'r' : 'rbig'
    }
  }

  return map
}

// ───────────────────────────────────────────────────────────
// Pick representative action from frequency distribution
// ───────────────────────────────────────────────────────────
/**
 * Given actions array and averaged frequencies, return action code string.
 * Rules:
 *   - If dominant action > 70% → return its code
 *   - If top-2 are both > 25% → return `mix:codeA,codeB`
 *   - Else return dominant code
 */
function pickAction(actions, freqs, codeMap) {
  // Pair up and sort
  const pairs = actions.map((a, i) => ({ action: a, freq: freqs[i] }))
  pairs.sort((a, b) => b.freq - a.freq)

  const top = pairs[0]
  const second = pairs[1]

  const topCode = codeMap[top.action] ?? '?'

  if (top.freq >= 0.7 || !second || second.freq < 0.25) {
    return topCode
  }

  const secondCode = codeMap[second.action] ?? '?'
  const topPct = Math.round(top.freq * 100)
  // Use @ separator to keep code and percentage unambiguous (e.g. 'b100' vs '41')
  return `mix:${topCode}@${topPct},${secondCode}`
}

// ───────────────────────────────────────────────────────────
// Full hand list (169 canonical classes, for output ordering)
// ───────────────────────────────────────────────────────────
const ALL_RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const ALL_HANDS = []
for (let i = 0; i < 13; i++) {
  for (let j = 0; j < 13; j++) {
    if (i === j) ALL_HANDS.push(ALL_RANKS[i] + ALL_RANKS[j])
    else if (i < j) ALL_HANDS.push(ALL_RANKS[i] + ALL_RANKS[j] + 's')
    else ALL_HANDS.push(ALL_RANKS[j] + ALL_RANKS[i] + 'o')
  }
}

// ───────────────────────────────────────────────────────────
// Extract scenarios from the JSON tree
// ───────────────────────────────────────────────────────────
const EFFECTIVE_STACK = 37.5  // from POC input file
const scenarios = {}

function extractNode(node, scenarioKey) {
  if (!node?.strategy?.strategy || !node.actions) {
    console.warn(`WARN: ${scenarioKey} has no strategy, skipping`)
    return
  }

  const codeMap = buildActionCodeMap(node.actions, EFFECTIVE_STACK)
  console.log(`\n[${scenarioKey}]`)
  console.log(`  player ${node.player} (${node.player === 0 ? 'IP/BTN' : 'OOP/BB'})`)
  console.log(`  actions: ${node.actions.join(' | ')}`)
  console.log(`  action codes: ${JSON.stringify(codeMap)}`)

  const classAvg = aggregateToClasses(node.strategy.strategy, node.actions)

  const result = {}
  for (const hand of ALL_HANDS) {
    const freqs = classAvg[hand]
    if (!freqs) continue
    result[hand] = pickAction(node.actions, freqs, codeMap)
  }

  console.log(`  ${Object.keys(result).length} classes extracted`)
  console.log(`  samples:`)
  for (const h of ['AA', 'KK', 'AKs', 'AKo', 'QQ', 'JJ', 'QJs', 'T9s', '72o', '22']) {
    if (result[h]) console.log(`    ${h}: ${result[h]}`)
  }

  scenarios[scenarioKey] = result
}

// 1. BTN c-bet decision = $.childrens.CHECK
console.log('\n=== Extracting BTN c-bet (after BB check) ===')
extractNode(data.childrens?.CHECK, `${scenarioPrefix}_btn_cbet`)

// 2-4. BB facing c-bet at each size
console.log('\n=== Extracting BB facing c-bet (each size) ===')
const btnCbetNode = data.childrens?.CHECK
if (btnCbetNode?.childrens) {
  // Collect BET sizes sorted by amount
  const betEntries = Object.entries(btnCbetNode.childrens)
    .filter(([k]) => k.startsWith('BET '))
    .sort((a, b) => parseFloat(a[0].split(' ')[1]) - parseFloat(b[0].split(' ')[1]))

  const sizeLabels = ['small', 'mid', 'large', 'allin']
  for (let i = 0; i < betEntries.length; i++) {
    const [betKey, childNode] = betEntries[i]
    const amt = parseFloat(betKey.split(' ')[1])
    const label = amt >= EFFECTIVE_STACK * 0.95 ? 'allin' : sizeLabels[i] || `b${i}`
    extractNode(childNode, `${scenarioPrefix}_bb_facing_cbet_${label}`)
  }
}

// ───────────────────────────────────────────────────────────
// Write TypeScript output
// ───────────────────────────────────────────────────────────
const outPath = resolve(PROJECT_ROOT, 'src', 'lib', 'gto', `gtoData_${scenarioPrefix}.ts`)
mkdirSync(dirname(outPath), { recursive: true })

let ts = '// =============================================================\n'
ts += '// GTO Postflop Range Data — HU Tournament\n'
ts += `// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)\n`
ts += `// Scenario: ${scenarioPrefix}\n`
ts += `// Generated: ${new Date().toISOString()}\n`
ts += '// =============================================================\n'
ts += '//\n'
ts += '// Action codes:\n'
ts += "//   'x'      = check\n"
ts += "//   'c'      = call\n"
ts += "//   'f'      = fold\n"
ts += "//   'r'      = raise (small)\n"
ts += "//   'rbig'   = raise (large)\n"
ts += "//   'b33'    = bet 33% pot (UI: 小)\n"
ts += "//   'b50'    = bet 50% pot (UI: 中)\n"
ts += "//   'b100'   = bet 100% pot (UI: 大)\n"
ts += "//   'allin'  = all-in\n"
ts += "//   'mix:CODE@PCT,CODE' = mixed strategy (e.g. 'mix:b33@60,x' = 60% b33 / 40% check)\n"
ts += '// =============================================================\n\n'

ts += `export type GtoRange = Record<string, string>\n`
ts += `export type GtoDatabase = Record<string, GtoRange>\n\n`

const constName = scenarioPrefix.toUpperCase()
ts += `export const ${constName}: GtoDatabase = {\n\n`

for (const [scenarioKey, range] of Object.entries(scenarios)) {
  ts += `  // ──────────────────────────────\n`
  ts += `  ${scenarioKey}: {\n`

  // Group hands on lines by rank similarity for readability
  const lines = []
  let currentLine = []
  for (const hand of ALL_HANDS) {
    if (range[hand]) {
      currentLine.push(`'${hand}':'${range[hand]}'`)
      if (currentLine.length >= 6) {
        lines.push(currentLine.join(','))
        currentLine = []
      }
    }
  }
  if (currentLine.length) lines.push(currentLine.join(','))
  ts += lines.map(l => `    ${l},`).join('\n')
  ts += '\n  },\n\n'
}

ts += '}\n'

writeFileSync(outPath, ts, 'utf8')
console.log(`\n✅ Written ${outPath}`)
console.log(`   ${Object.keys(scenarios).length} scenarios, file size ${(ts.length / 1024).toFixed(1)} KB`)
