#!/usr/bin/env node
/**
 * Parse RYE Rangeviewer HTML files → JSON range data.
 *
 * Extracts 169 hand cells from each HTML file, maps CSS color classes
 * to action labels using the legend embedded in each file.
 *
 * Input:  RYE Rangeviewer db/ folder (720 HTML files)
 * Output: JSON files in output/ folder, one per HTML
 *
 * Usage:
 *   node parse-rye-html.mjs <db-folder> [output-folder]
 *   node parse-rye-html.mjs "D:/path/to/Range Viewer [NEW]/db"
 *   node parse-rye-html.mjs "D:/path/to/db" ./output/rye-ranges
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, basename, join } from 'node:path'

// ── Config ──
const HANDS_ORDER = []
const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
for (let i = 0; i < 13; i++) {
  for (let j = 0; j < 13; j++) {
    if (i === j) HANDS_ORDER.push(`${RANKS[i]}${RANKS[j]}`)
    else if (i < j) HANDS_ORDER.push(`${RANKS[i]}${RANKS[j]}s`)
    else HANDS_ORDER.push(`${RANKS[j]}${RANKS[i]}o`)
  }
}

// ── Parse one HTML file ──
function parseFile(filePath) {
  const html = readFileSync(filePath, 'utf8')
  const fileName = basename(filePath, '.html')

  // Skip menu/navigation pages (no cell data)
  const cellCount = (html.match(/id="cid_/g) || []).length
  if (cellCount === 0) return null
  if (cellCount !== 169) {
    console.warn(`  ⚠️ ${fileName}: unexpected ${cellCount} cells (expected 169), skipping`)
    return null
  }

  // 1. Extract legend: color → action label
  const legend = {}
  const legendRegex = /mdl-color--([a-z-]+)"[^>]*>.*?<span class="title">(.*?)<\/span>.*?<div class="sectionCombos">(.*?)<\/div>/gs
  let match
  while ((match = legendRegex.exec(html)) !== null) {
    const [, color, title, combos] = match
    if (title && title.trim()) {
      legend[color] = {
        action: title.trim(),
        combos: combos.trim() || null
      }
    }
  }

  // 2. Extract cells: hand → color (+ weighted flag)
  const hands = {}
  const cellRegex = /id="cid_([A-Z0-9a-z]+)"\s+class="cell\s+[spo]\s+mdl-color--([a-z-]+?)(?:\s+weighted)?"/g
  while ((match = cellRegex.exec(html)) !== null) {
    const [fullMatch, hand, color] = match
    const isWeighted = fullMatch.includes('weighted')
    const actionInfo = legend[color]

    hands[hand] = {
      color,
      weighted: isWeighted,
      action: actionInfo ? actionInfo.action : color,
    }
  }

  // Also catch cells with no color (fold / empty)
  const nocolorRegex = /id="cid_([A-Z0-9a-z]+)"\s+class="cell\s+[spo]\s*"/g
  while ((match = nocolorRegex.exec(html)) !== null) {
    const [, hand] = match
    if (!hands[hand]) {
      hands[hand] = { color: 'none', weighted: false, action: 'Fold' }
    }
  }

  // 3. Parse metadata from filename
  const meta = parseFilename(fileName)

  return {
    file: fileName,
    meta,
    legend,
    handsCount: Object.keys(hands).length,
    hands,
  }
}

// ── Parse filename into structured metadata ──
function parseFilename(name) {
  const meta = { category: '', bbDepth: '', position: '', opponent: '', raw: name }

  // OP-100BB-BU → category=OP, bb=100, position=BU
  const opMatch = name.match(/^(OP)-(\d+BB\w*)-(.+)$/)
  if (opMatch) {
    meta.category = 'open_raise'
    meta.bbDepth = opMatch[2]
    meta.position = opMatch[3]
    return meta
  }

  // RE-BB-vs-BTN → category=RE (3bet), position=BB, opponent=BTN
  const reMatch = name.match(/^(RE)-(\w+)-vs-(\w+)$/)
  if (reMatch) {
    meta.category = '3bet'
    meta.position = reMatch[2]
    meta.opponent = reMatch[3]
    return meta
  }

  // F3B-100BB-BTN-vs-CO → category=F3B (facing 3bet), bb=100, position=BTN, opponent=CO
  const f3bMatch = name.match(/^(F3B)-(\d+BB)-(\w+)-vs-(.+)$/)
  if (f3bMatch) {
    meta.category = 'facing_3bet'
    meta.bbDepth = f3bMatch[2]
    meta.position = f3bMatch[3]
    meta.opponent = f3bMatch[4]
    return meta
  }

  // HU-25BBMais-OOP-30-40BB → category=HU
  const huMatch = name.match(/^(HU)-(.+)$/)
  if (huMatch) {
    meta.category = 'heads_up'
    meta.bbDepth = huMatch[2]
    return meta
  }

  // MUL-100BB-BB-vs-BTN_SB → category=MUL (multiway)
  const mulMatch = name.match(/^(MUL)-(\d+BB)-(\w+)-vs-(.+)$/)
  if (mulMatch) {
    meta.category = 'multiway'
    meta.bbDepth = mulMatch[2]
    meta.position = mulMatch[3]
    meta.opponent = mulMatch[4]
    return meta
  }

  // SQU-40BBMais-BB-vs-CO-BU-SB → category=SQU (squeeze)
  const squMatch = name.match(/^(SQU)-(.+)$/)
  if (squMatch) {
    meta.category = 'squeeze'
    meta.bbDepth = squMatch[2]
    return meta
  }

  // PU-10bb-BTN → category=PU (push)
  const puMatch = name.match(/^(PU)-(\d+bb)-(\w+)$/)
  if (puMatch) {
    meta.category = 'push'
    meta.bbDepth = puMatch[2]
    meta.position = puMatch[3]
    return meta
  }

  // BBSTR-vs-... → category=BBSTR (BB strategy)
  if (name.startsWith('BBSTR')) {
    meta.category = 'bb_strategy'
    return meta
  }

  // CALLRE-BU-vs-BB → category=CALLRE (calling rejams)
  const callreMatch = name.match(/^(CALLRE)-(\w+)-vs-(.+)$/)
  if (callreMatch) {
    meta.category = 'call_rejam'
    meta.position = callreMatch[2]
    meta.opponent = callreMatch[3]
    return meta
  }

  // ICM variants
  if (name.startsWith('ICM')) {
    meta.category = 'icm'
    return meta
  }

  // Bounty
  if (name.startsWith('Bounty')) {
    meta.category = 'bounty'
    return meta
  }

  meta.category = 'unknown'
  return meta
}

// ── Main ──
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node parse-rye-html.mjs <db-folder> [output-folder]')
  process.exit(1)
}

const dbFolder = resolve(args[0])
const outputFolder = resolve(args[1] || './output/rye-ranges')
mkdirSync(outputFolder, { recursive: true })

const htmlFiles = readdirSync(dbFolder)
  .filter(f => f.endsWith('.html'))
  .sort()

console.log(`📂 Input:  ${dbFolder}`)
console.log(`📂 Output: ${outputFolder}`)
console.log(`📋 Found ${htmlFiles.length} HTML files\n`)

let parsed = 0
let skipped = 0
const summary = { categories: {} }

for (const file of htmlFiles) {
  const filePath = join(dbFolder, file)
  const result = parseFile(filePath)

  if (!result) {
    skipped++
    continue
  }

  // Write individual JSON
  const outPath = join(outputFolder, `${result.file}.json`)
  writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8')

  // Track categories
  const cat = result.meta.category
  if (!summary.categories[cat]) summary.categories[cat] = 0
  summary.categories[cat]++

  parsed++
}

// Write summary
const summaryPath = join(outputFolder, '_summary.json')
writeFileSync(summaryPath, JSON.stringify({
  total: htmlFiles.length,
  parsed,
  skipped,
  categories: summary.categories,
}, null, 2), 'utf8')

console.log(`\n✅ Parsed: ${parsed} files`)
console.log(`⏭️  Skipped: ${skipped} files (menu/nav pages)`)
console.log(`\nCategories:`)
for (const [cat, count] of Object.entries(summary.categories).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`)
}
console.log(`\n📄 Summary: ${summaryPath}`)
console.log(`📂 JSON files: ${outputFolder}/`)
