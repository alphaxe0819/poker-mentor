#!/usr/bin/env node
/**
 * Scan scripts/gto-pipeline/output/ and ingest every 6-max JSON to Supabase.
 *
 * Filename pattern: {scenarioSlug}_{flopSlug}.json
 * Example:          6max_100bb_srp_btn_open_bb_call_As7d2c.json
 *
 * We match filename against known scenario slugs from scenarios.mjs to
 * disambiguate scenarioSlug from flopSlug (both contain underscores).
 *
 * Usage:
 *   node ingest-all-to-db.mjs              # ingest all matching files
 *   node ingest-all-to-db.mjs --delete     # also delete JSON after successful ingest
 *   node ingest-all-to-db.mjs --limit 5    # pilot: only first 5 files
 */

import { readdirSync, unlinkSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { SIXMAX_SCENARIOS } from './scenarios.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = resolve(__dirname, 'output')
const CONVERTER = resolve(__dirname, 'convert-to-db.mjs')

const args = process.argv.slice(2)
const deleteAfter = args.includes('--delete')
const limitIdx = args.indexOf('--limit')
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0

// Known scenario slugs sorted longest-first (so match prefers longest match)
const knownSlugs = SIXMAX_SCENARIOS.map(s => s.slug).sort((a, b) => b.length - a.length)

function parseFilename(base) {
  // base = "6max_100bb_srp_btn_open_bb_call_As7d2c"
  for (const slug of knownSlugs) {
    if (base.startsWith(slug + '_')) {
      return { scenarioSlug: slug, flopSlug: base.slice(slug.length + 1) }
    }
  }
  return null
}

const files = readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json')).sort()
const jobs = []
for (const f of files) {
  const base = f.replace(/\.json$/, '')
  const parsed = parseFilename(base)
  if (!parsed) {
    console.log(`  SKIP: ${f} (no matching 6-max scenario slug)`)
    continue
  }
  jobs.push({ file: f, ...parsed })
}

if (limit > 0 && jobs.length > limit) {
  jobs.length = limit
  console.log(`Limit=${limit}, running first ${limit} only`)
}

console.log(`Found ${jobs.length} job(s) to ingest`)
console.log('')

let ok = 0, fail = 0
for (const j of jobs) {
  const jsonPath = resolve(OUTPUT_DIR, j.file)
  console.log(`▶ ${j.file}`)
  const res = spawnSync('node', [CONVERTER, jsonPath, j.scenarioSlug, j.flopSlug], {
    stdio: 'inherit',
  })
  if (res.status === 0) {
    ok++
    if (deleteAfter) {
      unlinkSync(jsonPath)
      console.log(`  (deleted ${j.file})`)
    }
  } else {
    fail++
    console.error(`  FAILED (exit ${res.status})`)
  }
  console.log('')
}

console.log('═════════════════════════════════')
console.log(`✅ ${ok} succeeded, ❌ ${fail} failed`)
