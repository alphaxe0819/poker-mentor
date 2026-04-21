#!/usr/bin/env node
// Probe pd JSON structure: list top keys, scenarios, and distinct action_ids
import { readFileSync } from 'node:fs'

const path = process.argv[2]
if (!path) { console.error('Usage: node inspect-pd.mjs <path>'); process.exit(1) }

const d = JSON.parse(readFileSync(path, 'utf8'))
console.log('top keys:', Object.keys(d))
console.log('project_name:', d.project_name)
console.log('total_rows:', d.total_rows)
console.log('tables count:', d.tables?.length)

if (d.tables?.[0]) {
  console.log('\ntable[0] keys:', Object.keys(d.tables[0]))
  console.log('table[0].name:', d.tables[0].name)
  console.log('table[0] top-level fields (no grid):')
  const { grid, ...rest } = d.tables[0]
  console.log(JSON.stringify(rest, null, 2).slice(0, 800))
}

// Collect distinct action_ids across all tables
const ids = new Set()
for (const t of d.tables ?? []) {
  for (const v of Object.values(t.grid ?? {})) {
    if (typeof v === 'string') ids.add(v)
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => ids.add(k))
  }
}
console.log('\ntotal distinct action_ids:', ids.size)
console.log('sample action_ids:', [...ids].slice(0, 10))

// Scenarios
const scenarios = new Map()
for (const t of d.tables ?? []) {
  scenarios.set(t.scenario_id, (scenarios.get(t.scenario_id) ?? 0) + 1)
}
console.log('\nscenarios (scenario_id -> table count):')
for (const [sid, n] of scenarios) console.log(`  ${sid}: ${n} tables`)
