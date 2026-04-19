#!/usr/bin/env node
/**
 * Convert TexasSolver JSON output to Supabase solver_postflop_6max row.
 *
 * Unlike convert-to-ts.mjs (writes .ts file per flop), this:
 *   - Recursively walks the full strategy tree
 *   - Aggregates combo strategies to 169 hand classes per node
 *   - Upserts the compressed tree to Supabase as one JSONB row
 *
 * Usage:
 *   node convert-to-db.mjs <json-path> <scenario-slug> <flop-slug>
 *     e.g.
 *   node convert-to-db.mjs output/6max_100bb_srp_btn_open_bb_call_As7d2c.json \
 *                         6max_100bb_srp_btn_open_bb_call As7d2c
 *
 * Env:
 *   SUPABASE_URL       (default: test env)
 *   SUPABASE_ANON_KEY  (default: test env)
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SIXMAX_SCENARIOS } from './scenarios.mjs'

const SUPABASE_URL = process.env.SUPABASE_URL
  || 'https://btiqmckyjyswzrarmfxa.supabase.co'
const ANON_KEY = process.env.SUPABASE_ANON_KEY
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXFtY2t5anlzd3pyYXJtZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzA4MjAsImV4cCI6MjA5MTcwNjgyMH0.NexV3NCPU3ksCVudWdhBjDWS99jcbLkxnaL1tInJAGQ'

// ── CLI ──
const [jsonPath, scenarioSlug, flopSlug] = process.argv.slice(2)
if (!jsonPath || !scenarioSlug || !flopSlug) {
  console.error('Usage: node convert-to-db.mjs <json-path> <scenario-slug> <flop-slug>')
  process.exit(1)
}

const scenario = SIXMAX_SCENARIOS.find(s => s.slug === scenarioSlug)
if (!scenario) {
  console.error(`Unknown scenario slug: ${scenarioSlug}`)
  console.error(`Available: ${SIXMAX_SCENARIOS.map(s => s.slug).join(', ')}`)
  process.exit(1)
}

// ── combo → class mapping ──
const RANK_ORDER = '23456789TJQKA'
function rankIdx(r) { return RANK_ORDER.indexOf(r) }

function comboToClass(combo) {
  if (combo.length !== 4) return null
  const r1 = combo[0], s1 = combo[1], r2 = combo[2], s2 = combo[3]
  if (r1 === r2) return r1 + r2
  const hi = rankIdx(r1) > rankIdx(r2) ? r1 : r2
  const lo = rankIdx(r1) > rankIdx(r2) ? r2 : r1
  const suited = s1 === s2
  return hi + lo + (suited ? 's' : 'o')
}

// ── Aggregate combos → classes ──
function aggregateToClasses(comboStrategy, numActions) {
  const classSum = {}
  const classCount = {}
  for (const [combo, freqs] of Object.entries(comboStrategy)) {
    const cls = comboToClass(combo)
    if (!cls) continue
    if (!classSum[cls]) {
      classSum[cls] = new Array(numActions).fill(0)
      classCount[cls] = 0
    }
    for (let i = 0; i < numActions; i++) classSum[cls][i] += freqs[i] || 0
    classCount[cls] += 1
  }
  const classAvg = {}
  for (const cls of Object.keys(classSum)) {
    const cnt = classCount[cls]
    // Round to 4 decimals to shrink JSON
    classAvg[cls] = classSum[cls].map(s => Math.round((s / cnt) * 10000) / 10000)
  }
  return classAvg
}

// ── Recursively walk tree, returning compressed node ──
let nodeCount = 0
function walkNode(node, depth = 0) {
  nodeCount++
  if (!node) return null
  const out = {}
  if (typeof node.player === 'number') out.player = node.player
  if (Array.isArray(node.actions)) out.actions = node.actions
  if (node.strategy?.strategy && Array.isArray(node.actions)) {
    out.strategy = aggregateToClasses(node.strategy.strategy, node.actions.length)
  }
  // EV info (optional) — skip for size. Can enable later:
  // if (node.strategy?.evs) out.evs = aggregateEvs(node.strategy.evs, node.actions.length)
  if (node.childrens && typeof node.childrens === 'object') {
    const children = {}
    for (const [key, child] of Object.entries(node.childrens)) {
      const walked = walkNode(child, depth + 1)
      if (walked) children[key] = walked
    }
    if (Object.keys(children).length > 0) out.children = children
  }
  return out
}

// ── Load JSON ──
const absInput = resolve(jsonPath)
console.log(`Loading ${absInput}...`)
const raw = readFileSync(absInput, 'utf8')
const sizeMB = (raw.length / 1024 / 1024).toFixed(2)
console.log(`  Raw JSON size: ${sizeMB} MB`)

const data = JSON.parse(raw)
console.log(`Walking tree...`)
const tree = walkNode(data)
console.log(`  ${nodeCount} nodes compressed`)

const treeJson = JSON.stringify(tree)
console.log(`  Compressed tree size: ${(treeJson.length / 1024).toFixed(1)} KB`)

// ── Upsert to Supabase ──
const row = {
  scenario_slug: scenarioSlug,
  flop: flopSlug,
  ip_pos: scenario.matchup.ip,
  oop_pos: scenario.matchup.oop,
  pot_bb: scenario.pot_bb,
  effective_stack_bb: scenario.effective_stack_bb,
  tree,
  solver_config: {
    accuracy: 0.5,
    max_iteration: 200,
    solver: 'TexasSolver v0.2.0',
  },
}

const url = `${SUPABASE_URL}/rest/v1/solver_postflop_6max`
const r = await fetch(url, {
  method: 'POST',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'resolution=merge-duplicates',
  },
  body: JSON.stringify([row]),
})

if (!r.ok) {
  const err = await r.text()
  console.error(`❌ Upsert failed: HTTP ${r.status}`)
  console.error(err.substring(0, 500))
  process.exit(1)
}

console.log(`✅ Upserted ${scenarioSlug} / ${flopSlug}`)
console.log(`   IP=${row.ip_pos} OOP=${row.oop_pos} pot=${row.pot_bb}bb eff=${row.effective_stack_bb}bb`)
