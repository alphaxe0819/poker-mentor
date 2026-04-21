#!/usr/bin/env node
/**
 * Parse RYE Rangeviewer PNG range charts → JSON.
 *
 * These PNGs contain 13×13 grids where:
 *   - Green cells = action (shove / reshove)
 *   - Red/Pink cells = fold
 *   - White/light cells = fold
 *
 * Some images contain TWO grids side by side (different ICM/ante configs).
 *
 * Usage:
 *   node parse-rye-png.mjs <folder> [output-folder]
 *   node parse-rye-png.mjs "D:/path/to/db/Openshove_10bb"
 *   node parse-rye-png.mjs "D:/path/to/db" ./output/rye-png-ranges --recursive
 */

import sharp from 'sharp'
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { resolve, basename, join, extname } from 'node:path'

// ── 13×13 hand grid (row-major, same order as standard range chart) ──
const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
const GRID = []
for (let r = 0; r < 13; r++) {
  for (let c = 0; c < 13; c++) {
    if (r === c) GRID.push(`${RANKS[r]}${RANKS[c]}`)        // pair
    else if (c > r) GRID.push(`${RANKS[r]}${RANKS[c]}s`)    // suited (above diagonal)
    else GRID.push(`${RANKS[c]}${RANKS[r]}o`)               // offsuit (below diagonal)
  }
}

// ── Color classification ──
function classifyColor(r, g, b) {
  // Green shades (action)
  if (g > 120 && g > r * 1.3 && g > b * 1.3) return 'action'
  // Red/Pink shades (fold)
  if (r > 150 && r > g * 1.3) return 'fold'
  // Light/White (fold)
  if (r > 200 && g > 200 && b > 200) return 'fold'
  // Grey
  if (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && r > 100) return 'fold'
  // Dark (borders, text)
  if (r < 80 && g < 80 && b < 80) return 'border'
  // Ambiguous - check if more green than red
  if (g > r && g > b) return 'action'
  return 'fold'
}

// ── Detect grid boundaries in image ──
async function detectGrids(imagePath) {
  const image = sharp(imagePath)
  const metadata = await image.metadata()
  const { width, height } = metadata

  // Get raw pixel data
  const { data, info } = await image
    .raw()
    .toBuffer({ resolveWithObject: true })

  const channels = info.channels

  // Determine if single or double grid based on aspect ratio
  const isDouble = width > height * 1.5

  const grids = []
  if (isDouble) {
    // Two grids side by side - split at midpoint
    const midX = Math.floor(width / 2)
    grids.push({ x: 0, w: midX, label: 'left' })
    grids.push({ x: midX, w: width - midX, label: 'right' })
  } else {
    grids.push({ x: 0, w: width, label: 'single' })
  }

  const results = []

  for (const grid of grids) {
    // Find the actual grid area within this section
    // Strategy: scan for the 13×13 pattern of cells
    // Each cell is roughly gridWidth/15 × gridHeight/15 (with some margin for borders)

    const cellW = Math.floor(grid.w / 14.5)
    const cellH = Math.floor(height / 15.5)

    // Find top-left of grid by scanning for first non-white row
    let startY = 0
    for (let y = 0; y < height * 0.3; y++) {
      let nonWhiteCount = 0
      for (let x = grid.x; x < grid.x + grid.w; x += 3) {
        const idx = (y * width + x) * channels
        const r = data[idx], g = data[idx + 1], b = data[idx + 2]
        if (r < 240 || g < 240 || b < 240) nonWhiteCount++
      }
      if (nonWhiteCount > grid.w / 10) {
        startY = y
        break
      }
    }

    // Skip header area (title text) - look for first row of colored cells
    let gridStartY = startY
    for (let y = startY; y < height * 0.4; y++) {
      let greenCount = 0, redCount = 0
      for (let x = grid.x + 5; x < grid.x + grid.w - 5; x += 2) {
        const idx = (y * width + x) * channels
        const r = data[idx], g = data[idx + 1], b = data[idx + 2]
        const cls = classifyColor(r, g, b)
        if (cls === 'action') greenCount++
        if (cls === 'fold') redCount++
      }
      if (greenCount + redCount > grid.w / 8) {
        gridStartY = Math.max(startY, y - cellH)
        break
      }
    }

    // Sample each of the 13×13 cells
    const hands = {}
    let actionCount = 0

    for (let row = 0; row < 13; row++) {
      for (let col = 0; col < 13; col++) {
        const hand = GRID[row * 13 + col]

        // Cell center coordinates
        const cx = grid.x + Math.floor(col * cellW + cellW * 0.8)
        const cy = gridStartY + Math.floor(row * cellH + cellH * 1.2)

        // Sample a small area around center (5×5 pixels)
        let actionPixels = 0, foldPixels = 0, totalSampled = 0

        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const sx = Math.min(Math.max(cx + dx, 0), width - 1)
            const sy = Math.min(Math.max(cy + dy, 0), height - 1)
            const idx = (sy * width + sx) * channels
            const r = data[idx], g = data[idx + 1], b = data[idx + 2]
            const cls = classifyColor(r, g, b)
            if (cls === 'action') actionPixels++
            else if (cls === 'fold') foldPixels++
            totalSampled++
          }
        }

        const isAction = actionPixels > foldPixels && actionPixels > totalSampled * 0.3
        hands[hand] = isAction ? 'action' : 'fold'
        if (isAction) actionCount++
      }
    }

    results.push({
      gridPosition: grid.label,
      actionCount,
      foldCount: 169 - actionCount,
      actionPct: Math.round(actionCount / 169 * 100 * 10) / 10,
      hands,
    })
  }

  return results
}

// ── Parse filename for metadata ──
function parseFilename(filePath, parentFolder) {
  const name = basename(filePath, extname(filePath))
  const folder = basename(parentFolder)
  const meta = { raw: name, folder, type: '', bbDepth: '', position: '', opponent: '' }

  // Openshove_10bb/BTN.png
  const osMatch = folder.match(/^Openshove_(\d+bb)$/i)
  if (osMatch) {
    meta.type = 'openshove'
    meta.bbDepth = osMatch[1]
    meta.position = name
    return meta
  }

  // Reshove_20bb/20bb_reshove_BBvsBTN.png
  const rsMatch = folder.match(/^Reshove_(\d+bb)$/i)
  if (rsMatch) {
    meta.type = 'reshove'
    meta.bbDepth = rsMatch[1]
    const vsMatch = name.match(/(\w+)vs(\w+)/)
    if (vsMatch) {
      meta.position = vsMatch[1]
      meta.opponent = vsMatch[2]
    }
    return meta
  }

  meta.type = 'unknown'
  return meta
}

// ── Main ──
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node parse-rye-png.mjs <folder> [output-folder] [--recursive]')
  process.exit(1)
}

const inputFolder = resolve(args[0])
const outputFolder = resolve(args[1] || './output/rye-png-ranges')
const recursive = args.includes('--recursive')

await mkdir(outputFolder, { recursive: true })

// Collect PNG files
async function collectPngs(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  let pngs = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && recursive) {
      pngs = pngs.concat(await collectPngs(fullPath))
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png') && !entry.name.startsWith('footer')) {
      pngs.push({ path: fullPath, parentFolder: dir })
    }
  }
  return pngs
}

const pngFiles = await collectPngs(inputFolder)
console.log(`📂 Input:  ${inputFolder}`)
console.log(`📂 Output: ${outputFolder}`)
console.log(`📋 Found ${pngFiles.length} PNG files\n`)

let parsed = 0
let errors = 0

for (const { path: pngPath, parentFolder } of pngFiles) {
  const name = basename(pngPath, '.png')
  const folder = basename(parentFolder)

  try {
    const grids = await detectGrids(pngPath)
    const meta = parseFilename(pngPath, parentFolder)

    const result = {
      file: `${folder}/${name}`,
      meta,
      grids,
    }

    const safeName = `${folder}_${name}`.replace(/[^a-zA-Z0-9_-]/g, '_')
    const outPath = join(outputFolder, `${safeName}.json`)
    await writeFile(outPath, JSON.stringify(result, null, 2), 'utf8')

    const gridSummary = grids.map(g =>
      `${g.gridPosition}: ${g.actionCount}/169 (${g.actionPct}%)`
    ).join(' | ')
    console.log(`  ✓ ${folder}/${name}: ${gridSummary}`)

    parsed++
  } catch (err) {
    console.error(`  ✗ ${folder}/${name}: ${err.message}`)
    errors++
  }
}

console.log(`\n✅ Parsed: ${parsed}`)
if (errors) console.log(`❌ Errors: ${errors}`)
console.log(`📂 Output: ${outputFolder}/`)
