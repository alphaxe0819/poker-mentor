#!/usr/bin/env node
/**
 * Merge HTML + PNG parsed ranges into unified format.
 *
 * Normalizes both formats into:
 * {
 *   id: "unique_id",
 *   source: "html" | "png",
 *   category: "open_raise" | "3bet" | "openshove" | ...,
 *   bbDepth: "40BB",
 *   position: "BTN",
 *   opponent: "CO",
 *   description: "BTN open raise at 40BB",
 *   hands: { "AA": "raise", "AKs": "call", "72o": "fold", ... }
 * }
 *
 * Output: ~/.claude/poker-data/merged/
 *         ~/.claude/poker-data/unified-index.json
 *
 * Usage: node merge-ranges.mjs
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const POKER_DATA = join(homedir(), '.claude', 'poker-data')
const HTML_DIR = join(POKER_DATA, 'rye-ranges')
const PNG_DIR = join(POKER_DATA, 'rye-png-ranges')
const MERGED_DIR = join(POKER_DATA, 'merged')
mkdirSync(MERGED_DIR, { recursive: true })

const allRanges = []

// ── Process HTML ranges ──
console.log('Processing HTML ranges...')
const htmlFiles = readdirSync(HTML_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'))

for (const f of htmlFiles) {
  const d = JSON.parse(readFileSync(join(HTML_DIR, f), 'utf8'))
  if (!d.hands || Object.keys(d.hands).length === 0) continue

  // Normalize hands: { "AA": { action: "Open raise", ... } } → { "AA": "raise" }
  const hands = {}
  for (const [hand, info] of Object.entries(d.hands)) {
    hands[hand] = info.action || info.color || 'unknown'
  }

  const entry = {
    id: d.file,
    source: 'html',
    category: d.meta.category,
    bbDepth: d.meta.bbDepth || '',
    position: d.meta.position || '',
    opponent: d.meta.opponent || '',
    description: d.file.replace(/-/g, ' '),
    actionsUsed: Object.keys(d.legend || {}),
    handsCount: Object.keys(hands).length,
    hands,
  }

  allRanges.push(entry)
  writeFileSync(join(MERGED_DIR, `${d.file}.json`), JSON.stringify(entry, null, 2))
}
console.log(`  ✓ ${htmlFiles.length} HTML files → ${allRanges.length} ranges`)

// ── Process PNG ranges ──
console.log('Processing PNG ranges...')
const pngFiles = readdirSync(PNG_DIR).filter(f => f.endsWith('.json'))
let pngCount = 0

for (const f of pngFiles) {
  const d = JSON.parse(readFileSync(join(PNG_DIR, f), 'utf8'))
  if (!d.grids || d.grids.length === 0) continue

  for (let gi = 0; gi < d.grids.length; gi++) {
    const grid = d.grids[gi]
    const suffix = d.grids.length > 1 ? `_${grid.gridPosition}` : ''
    const id = `${d.meta.folder}_${d.meta.raw || f.replace('.json', '')}${suffix}`
      .replace(/[^a-zA-Z0-9_-]/g, '_')

    // Normalize: "action" → "shove"/"reshove", "fold" → "fold"
    const actionLabel = d.meta.type === 'reshove' ? 'reshove' : 'shove'
    const hands = {}
    for (const [hand, val] of Object.entries(grid.hands)) {
      hands[hand] = val === 'action' ? actionLabel : 'fold'
    }

    const entry = {
      id,
      source: 'png',
      category: d.meta.type || 'unknown',
      bbDepth: d.meta.bbDepth || '',
      position: d.meta.position || '',
      opponent: d.meta.opponent || '',
      description: `${d.meta.type} ${d.meta.bbDepth} ${d.meta.position}${d.meta.opponent ? ' vs ' + d.meta.opponent : ''}${suffix ? ' (' + grid.gridPosition + ')' : ''}`.trim(),
      actionsUsed: [actionLabel, 'fold'],
      handsCount: Object.keys(hands).length,
      actionPct: grid.actionPct,
      hands,
    }

    allRanges.push(entry)
    writeFileSync(join(MERGED_DIR, `${id}.json`), JSON.stringify(entry, null, 2))
    pngCount++
  }
}
console.log(`  ✓ ${pngFiles.length} PNG files → ${pngCount} ranges (including split doubles)`)

// ── Build unified index ──
console.log('\nBuilding unified index...')

const index = {
  total: allRanges.length,
  sources: { html: allRanges.filter(r => r.source === 'html').length, png: allRanges.filter(r => r.source === 'png').length },
  categories: {},
  files: allRanges.map(r => ({
    id: r.id,
    source: r.source,
    category: r.category,
    bbDepth: r.bbDepth,
    position: r.position,
    opponent: r.opponent,
    description: r.description,
    handsCount: r.handsCount,
  }))
}

for (const r of allRanges) {
  if (!index.categories[r.category]) index.categories[r.category] = 0
  index.categories[r.category]++
}

writeFileSync(join(POKER_DATA, 'unified-index.json'), JSON.stringify(index, null, 2))

console.log(`\n✅ Total merged: ${allRanges.length} ranges`)
console.log(`   HTML: ${index.sources.html} | PNG: ${index.sources.png}`)
console.log(`\nCategories:`)
for (const [cat, count] of Object.entries(index.categories).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`)
}
console.log(`\n📂 Merged: ${MERGED_DIR}/`)
console.log(`📄 Index:  ${join(POKER_DATA, 'unified-index.json')}`)
