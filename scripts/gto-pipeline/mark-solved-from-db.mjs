#!/usr/bin/env node
/**
 * Query Supabase for already-ingested (scenario, flop) pairs and create
 * empty marker JSON files in output/. Used so batch-run.ps1 -SkipExisting
 * skips them without re-solving.
 *
 * Call this BEFORE starting a new batch to avoid re-solving DB rows
 * whose JSONs were already cleaned up.
 */

import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const SUPABASE_URL = 'https://btiqmckyjyswzrarmfxa.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXFtY2t5anlzd3pyYXJtZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzA4MjAsImV4cCI6MjA5MTcwNjgyMH0.NexV3NCPU3ksCVudWdhBjDWS99jcbLkxnaL1tInJAGQ'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = resolve(__dirname, 'output')
mkdirSync(OUTPUT_DIR, { recursive: true })

const MARKER_CONTENT = '{"_marker": "solved, ingested, JSON cleaned"}'

async function fetchAll() {
  const rows = []
  let offset = 0
  const pageSize = 1000
  while (true) {
    const url = `${SUPABASE_URL}/rest/v1/solver_postflop_6max?select=scenario_slug,flop&limit=${pageSize}&offset=${offset}`
    const r = await fetch(url, { headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` } })
    const data = await r.json()
    if (!Array.isArray(data) || data.length === 0) break
    rows.push(...data)
    if (data.length < pageSize) break
    offset += pageSize
  }
  return rows
}

const rows = await fetchAll()
console.log(`Found ${rows.length} (scenario, flop) rows in DB`)

let created = 0, existed = 0
for (const row of rows) {
  const name = `${row.scenario_slug}_${row.flop}.json`
  const path = resolve(OUTPUT_DIR, name)
  if (existsSync(path)) existed++
  else {
    writeFileSync(path, MARKER_CONTENT, 'utf8')
    created++
  }
}
console.log(`Created ${created} marker file(s), ${existed} already existed`)
