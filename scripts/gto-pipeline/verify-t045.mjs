#!/usr/bin/env node
// T-045 verification: confirm gto_batch_progress status=done + gto_postflop rows
// Reads same .env as batch-worker.mjs. Does not modify DB.

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

const { data: recent, error: e1 } = await supabase
  .from('gto_batch_progress')
  .select('id, street, board_key, turn_card, river_card, stack_label, status, machine_id, row_count, completed_at, error_msg')
  .order('completed_at', { ascending: false, nullsFirst: false })
  .limit(5)

if (e1) { console.error('progress query failed:', e1); process.exit(1) }

console.log('=== gto_batch_progress (recent 5) ===')
for (const r of recent) {
  console.log(`  ${r.status.padEnd(10)} | ${r.street} ${r.board_key}+${r.turn_card}${r.river_card ? '+' + r.river_card : ''} ${r.stack_label} | machine=${r.machine_id || '-'} rows=${r.row_count || '-'} ${r.error_msg ? 'err=' + r.error_msg : ''}`)
}

const done = recent.find(r => r.status === 'done')
if (!done) {
  console.log('\n❌ no done batch found in last 5')
  process.exit(2)
}

console.log(`\n=== gto_postflop rows for done batch (${done.board_key}+${done.turn_card} ${done.stack_label}) ===`)
const { count, error: e2 } = await supabase
  .from('gto_postflop')
  .select('*', { count: 'exact', head: true })
  .eq('board_key', done.board_key)
  .eq('turn_card', done.turn_card)
  .eq('stack_label', done.stack_label)

if (e2) { console.error('postflop count failed:', e2); process.exit(1) }
console.log(`  row count: ${count}`)

const { data: sample, error: e3 } = await supabase
  .from('gto_postflop')
  .select('role, hand_class, action_code')
  .eq('board_key', done.board_key)
  .eq('turn_card', done.turn_card)
  .eq('stack_label', done.stack_label)
  .limit(6)

if (e3) { console.error('sample query failed:', e3); process.exit(1) }
console.log('  sample rows:')
for (const s of sample) console.log(`    ${s.role.padEnd(25)} ${s.hand_class.padEnd(6)} ${s.action_code}`)

console.log('\n✅ T-045 verify complete')
