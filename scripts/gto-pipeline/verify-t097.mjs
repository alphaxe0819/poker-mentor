#!/usr/bin/env node
// T-097 F-stage verification: seed distribution + last claimed batch + gto_solutions rows
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const envPath = resolve(__dirname, '.env')
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  }
} catch { /* ignore */ }

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

// --- 1. gto_batch_progress total + by (gametype, street) via exact count ---
const gametypes = ['hu_13bb_srp', 'hu_25bb_srp', 'hu_40bb_srp']
const streets = ['turn', 'river']

console.log('=== gto_batch_progress count by (gametype, street) ===')
let grand = 0
for (const gt of gametypes) {
  for (const st of streets) {
    const { count, error } = await supabase
      .from('gto_batch_progress')
      .select('*', { count: 'exact', head: true })
      .eq('gametype', gt).eq('street', st)
    if (error) { console.error(gt, st, error); continue }
    console.log(`  ${gt.padEnd(14)} / ${st.padEnd(5)}: ${count}`)
    grand += count
  }
}
console.log(`  ───────────────────────────`)
console.log(`  GRAND TOTAL: ${grand}`)

// --- 2. latest done batch + row_count ---
console.log('\n=== recent gto_batch_progress (5 most recent) ===')
const { data: recent } = await supabase
  .from('gto_batch_progress')
  .select('id, gametype, depth_bb, preflop_actions, board, turn_card, river_card, street, status, machine_id, row_count, completed_at, error_msg')
  .order('id', { ascending: false })
  .limit(5)

for (const r of recent || []) {
  const loc = `${r.gametype}/${r.street}/${r.board}+${r.turn_card}${r.river_card ? '+' + r.river_card : ''}`
  console.log(`  #${r.id} ${r.status.padEnd(9)} ${loc} rows=${r.row_count || '-'} ${r.error_msg ? 'err=' + r.error_msg : ''}`)
}

// --- 3. gto_solutions total rows + by gametype ---
console.log('\n=== gto_solutions count ===')
const { count: solTotal } = await supabase
  .from('gto_solutions').select('*', { count: 'exact', head: true })
console.log(`  total: ${solTotal}`)

for (const gt of gametypes) {
  const { count } = await supabase
    .from('gto_solutions')
    .select('*', { count: 'exact', head: true })
    .eq('gametype', gt)
  if (count > 0) console.log(`  ${gt}: ${count}`)
}

// --- 4. sample gto_solutions row (if any) ---
if (solTotal > 0) {
  console.log('\n=== gto_solutions sample row ===')
  const { data: sample } = await supabase
    .from('gto_solutions')
    .select('gametype, depth_bb, preflop_actions, board, flop_actions, turn_card, turn_actions, river_card, river_actions, node_data, solver_config')
    .limit(1)
    .single()
  if (sample) {
    console.log(`  gametype: ${sample.gametype} / depth: ${sample.depth_bb}`)
    console.log(`  path: preflop=${sample.preflop_actions} / board=${sample.board} / flop_a=${sample.flop_actions || '(empty)'} / turn=${sample.turn_card} / turn_a=${sample.turn_actions || '(empty)'} / river=${sample.river_card || '(empty)'} / river_a=${sample.river_actions || '(empty)'}`)
    console.log(`  node_type: ${sample.node_data?.node_type}`)
    console.log(`  hand_count: ${Object.keys(sample.node_data?.hands || {}).length}`)
    const sampleHand = Object.keys(sample.node_data?.hands || {})[0]
    if (sampleHand) {
      console.log(`  sample hand "${sampleHand}": ${JSON.stringify(sample.node_data.hands[sampleHand])}`)
    }
    console.log(`  aggregated: ${JSON.stringify(sample.node_data?.aggregated)}`)
    console.log(`  solver_config: ${JSON.stringify(sample.solver_config)}`)
  }
}

console.log('\n✅ verify-t097 complete')
