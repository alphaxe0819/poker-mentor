#!/usr/bin/env node
// Sample T-097-produced rows (hu_25bb_srp) to verify format
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

// Stats by street for hu_25bb_srp
const { count: turnCount } = await supabase
  .from('gto_solutions').select('*', { count: 'exact', head: true })
  .eq('gametype', 'hu_25bb_srp').eq('river_card', '')
const { count: riverCount } = await supabase
  .from('gto_solutions').select('*', { count: 'exact', head: true })
  .eq('gametype', 'hu_25bb_srp').neq('river_card', '')
console.log(`=== hu_25bb_srp gto_solutions breakdown ===`)
console.log(`  turn-street (river_card=''): ${turnCount}`)
console.log(`  river-street (river_card!=''): ${riverCount}`)
console.log(`  total: ${turnCount + riverCount}`)

// Sample turn spot
console.log('\n=== sample TURN spot (hu_25bb_srp) ===')
const { data: turnSample } = await supabase
  .from('gto_solutions')
  .select('gametype, depth_bb, preflop_actions, board, flop_actions, turn_card, turn_actions, river_card, river_actions, node_data, solver_config')
  .eq('gametype', 'hu_25bb_srp').eq('river_card', '').limit(1).single()
if (turnSample) {
  console.log(`  path: ${turnSample.gametype} d=${turnSample.depth_bb} preflop=${turnSample.preflop_actions} board=${turnSample.board} turn=${turnSample.turn_card} turn_a="${turnSample.turn_actions}"`)
  console.log(`  node_data.node_type: ${turnSample.node_data.node_type}`)
  console.log(`  node_data.hands count: ${Object.keys(turnSample.node_data.hands).length}`)
  const firstHand = Object.keys(turnSample.node_data.hands)[0]
  console.log(`  sample hand "${firstHand}": ${JSON.stringify(turnSample.node_data.hands[firstHand])}`)
  console.log(`  aggregated: ${JSON.stringify(turnSample.node_data.aggregated)}`)
  console.log(`  solver_config: ${JSON.stringify(turnSample.solver_config)}`)
}

// Sample river spot with deeper path
console.log('\n=== sample RIVER spot with longer path (hu_25bb_srp) ===')
const { data: riverSample } = await supabase
  .from('gto_solutions')
  .select('gametype, turn_card, turn_actions, river_card, river_actions, node_data')
  .eq('gametype', 'hu_25bb_srp')
  .neq('river_card', '')
  .neq('river_actions', '')
  .limit(3)
for (const r of riverSample || []) {
  console.log(`  turn=${r.turn_card} turn_a="${r.turn_actions}" river=${r.river_card} river_a="${r.river_actions}" → ${r.node_data.node_type} hands=${Object.keys(r.node_data.hands).length} aggregated=${JSON.stringify(r.node_data.aggregated)}`)
}

// Unique turn_actions strings (show variety)
console.log('\n=== unique turn_actions patterns in hu_25bb_srp ===')
const { data: turnActionVariety } = await supabase
  .from('gto_solutions').select('turn_actions')
  .eq('gametype', 'hu_25bb_srp').eq('river_card', '')
const unique = [...new Set((turnActionVariety || []).map(r => r.turn_actions))].sort()
console.log(`  ${unique.length} unique turn_actions:`)
for (const t of unique.slice(0, 15)) console.log(`    "${t}"`)
if (unique.length > 15) console.log(`    ... and ${unique.length - 15} more`)
