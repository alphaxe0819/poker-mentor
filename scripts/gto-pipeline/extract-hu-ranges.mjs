#!/usr/bin/env node
/**
 * Extract corrected HU ranges from RYE parsed data for TexasSolver scenarios.
 *
 * Maps RYE action labels → TexasSolver input categories:
 *   SRP IP  = all hands SB open-raises with (non-fold, non-limp)
 *   SRP OOP = all hands BB calls an open-raise with (non-3bet, non-fold)
 *   3BP IP  = hands BTN calls a 3bet with (not 4bet, not fold)
 *   3BP OOP = hands BB 3bets with (value + bluff 3bets)
 *   4BP IP  = hands BTN 4bets with
 *   4BP OOP = hands BB calls a 4bet with
 */

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { homedir } from 'node:os'

const MERGED_DIR = join(homedir(), '.claude', 'poker-data', 'merged')

// ── RYE file mapping for each depth ──
// SB = BTN in HU (opens first), BB = OOP (defends)
const DEPTH_MAP = {
  '40bb': {
    sb: 'HU-25BBMais-DO-SB-35-50BB',    // SB opening strategy at 35-50BB
    bb: 'HU-25BBMais-OOP-40-50BB',       // BB defense at 40-50BB
  },
  '25bb': {
    sb: 'HU-25BB-DO-SB-Openrasing-Limping-20-25BB',  // SB at 20-25BB
    bb: 'HU-25BB-OOP-20-25BB-vs-Raise',               // BB vs raise at 20-25BB
  },
  '13bb': {
    sb: 'HU-25BB-DO-SB-Limping-Shoving-10-15BB',  // SB at 10-15BB
    bb: 'HU-25BB-OOP-10-15BB-vs-Raise',            // BB vs raise at 10-15BB
  },
}

// ── Action classification rules ──
// Classify RYE action labels into poker tree nodes
function classifyAction(label) {
  const lc = label.toLowerCase()

  // Fold
  if (lc === 'fold') return 'fold'

  // SB actions
  if (lc.includes('openshove')) return 'sb_shove'
  if (lc.includes('openraise') || lc.includes('openrasing')) {
    if (lc.includes('4bet') && lc.includes('all in')) return 'sb_open_4bet'
    if (lc.includes('call')) return 'sb_open_call3bet'
    if (lc.includes('fold')) return 'sb_open_fold3bet'
    return 'sb_open'  // generic open
  }
  if (lc.includes('4bet') && (lc.includes('bluff') || lc.includes('all in'))) return 'sb_open_4bet'
  if (lc.includes('limp')) {
    if (lc.includes('jam') || lc.includes('shove')) return 'sb_limp_jam'
    if (lc.includes('call')) return 'sb_limp_call'
    return 'sb_limp'
  }

  // BB actions
  if (lc.includes('reshove') || lc.includes('all in')) return 'bb_shove'
  if (lc.includes('3bet') || lc.startsWith('re-')) {
    if (lc.includes('broke') || lc.includes('all in')) return 'bb_3bet_value'
    if (lc.includes('bluff')) return 'bb_3bet_bluff'
    if (lc.includes('call')) return 'bb_3bet_call4bet'
    return 'bb_3bet'
  }
  if (lc.includes('call')) {
    if (lc.includes('2x') || lc.includes('otherwise')) return 'bb_call_weak'
    return 'bb_call'
  }
  if (lc.includes('bluff') && lc.includes('shove')) return 'bb_bluff_shove'
  if (lc.includes('profitable') && lc.includes('shove')) return 'bb_bluff_shove'

  // Color-coded categories (RYE uses MDL colors)
  // These are typically "open and continue" in SB context
  if (['teal', 'pink', 'amber', 'cyan', 'light-green', 'lime'].includes(lc)) return 'sb_open_call3bet'
  if (['deep-orange', 'orange', 'red'].includes(lc)) {
    // At shallow stacks, red = limp/call
    return 'sb_limp_call'
  }
  if (['deep-purple', 'purple'].includes(lc)) return 'sb_limp_fold'
  if (lc === 'green') return 'sb_limp'

  // Fallback: treat as generic action
  return 'unknown_' + lc.replace(/[^a-z0-9]/g, '_')
}

// ── Extract ranges for each scenario type ──
function extractRanges(depth) {
  const config = DEPTH_MAP[depth]
  if (!config) {
    console.error(`Unknown depth: ${depth}`)
    return null
  }

  const result = { depth, srp: {}, '3bp': {}, '4bp': {} }

  // ── SB (BTN) data ──
  const sbFile = join(MERGED_DIR, config.sb + '.json')
  if (!existsSync(sbFile)) {
    console.error(`Missing SB file: ${config.sb}`)
    return null
  }
  const sbData = JSON.parse(readFileSync(sbFile, 'utf8'))
  const sbByClass = {}
  for (const [hand, action] of Object.entries(sbData.hands || {})) {
    const cls = classifyAction(action)
    if (!sbByClass[cls]) sbByClass[cls] = []
    sbByClass[cls].push(hand)
  }

  // SRP IP = all hands that open-raise (includes fold-to-3bet, call-3bet, 4bet)
  const srpIpHands = [
    ...(sbByClass.sb_open || []),
    ...(sbByClass.sb_open_call3bet || []),
    ...(sbByClass.sb_open_fold3bet || []),
    ...(sbByClass.sb_open_4bet || []),
    ...(sbByClass.sb_shove || []),  // shove = raise all-in, still creates a "raised pot"
  ]
  result.srp.ip = sortRange(srpIpHands)

  // 3BP IP = hands BTN calls a 3bet with (not 4bet, not fold)
  const threeBpIpHands = [
    ...(sbByClass.sb_open_call3bet || []),
  ]
  result['3bp'].ip = sortRange(threeBpIpHands)

  // 4BP IP = hands BTN 4bets with
  const fourBpIpHands = [
    ...(sbByClass.sb_open_4bet || []),
  ]
  result['4bp'].ip = sortRange(fourBpIpHands)

  console.log(`\n  SB action breakdown (${config.sb}):`)
  for (const [cls, hands] of Object.entries(sbByClass).sort()) {
    console.log(`    ${cls}: ${hands.length} hands`)
  }

  // ── BB data ──
  const bbFile = join(MERGED_DIR, config.bb + '.json')
  if (!existsSync(bbFile)) {
    console.error(`Missing BB file: ${config.bb}`)
    return null
  }
  const bbData = JSON.parse(readFileSync(bbFile, 'utf8'))
  const bbByClass = {}
  for (const [hand, action] of Object.entries(bbData.hands || {})) {
    const cls = classifyAction(action)
    if (!bbByClass[cls]) bbByClass[cls] = []
    bbByClass[cls].push(hand)
  }

  // SRP OOP = hands BB calls with (not 3bet, not fold)
  const srpOopHands = [
    ...(bbByClass.bb_call || []),
    ...(bbByClass.bb_call_weak || []),  // include "call vs 2x" as marginal calls
    ...(bbByClass.bb_bluff_shove || []), // these sometimes flat
  ]
  result.srp.oop = sortRange(srpOopHands)

  // 3BP OOP = hands BB 3bets with (value + bluff)
  const threeBpOopHands = [
    ...(bbByClass.bb_3bet_value || []),
    ...(bbByClass.bb_3bet_bluff || []),
    ...(bbByClass.bb_3bet || []),
    ...(bbByClass.bb_3bet_call4bet || []),
    ...(bbByClass.bb_shove || []),  // reshove = aggressive 3bet
  ]
  result['3bp'].oop = sortRange(threeBpOopHands)

  // 4BP OOP = hands BB calls a 4bet with
  const fourBpOopHands = [
    ...(bbByClass.bb_3bet_call4bet || []),
  ]
  result['4bp'].oop = sortRange(fourBpOopHands)

  console.log(`\n  BB action breakdown (${config.bb}):`)
  for (const [cls, hands] of Object.entries(bbByClass).sort()) {
    console.log(`    ${cls}: ${hands.length} hands`)
  }

  return result
}

// ── Sort range string in standard poker order ──
function sortRange(hands) {
  const RANKS = '23456789TJQKA'
  const unique = [...new Set(hands)]

  unique.sort((a, b) => {
    // Parse hand: e.g. "AKs" → { r1: A, r2: K, suited: true }
    const parse = h => {
      const r1 = h[0], r2 = h[1], type = h[2] || ''
      return { r1: RANKS.indexOf(r1), r2: RANKS.indexOf(r2), type }
    }
    const pa = parse(a), pb = parse(b)
    // Pairs first (descending), then suited (descending), then offsuit (descending)
    const isPairA = pa.r1 === pa.r2, isPairB = pb.r1 === pb.r2
    if (isPairA && !isPairB) return -1
    if (!isPairA && isPairB) return 1
    if (isPairA && isPairB) return pb.r1 - pa.r1

    const isSuitedA = pa.type === 's', isSuitedB = pb.type === 's'
    if (isSuitedA && !isSuitedB) return -1
    if (!isSuitedA && isSuitedB) return 1

    // Sort by high card desc, then low card desc
    const hiA = Math.max(pa.r1, pa.r2), loA = Math.min(pa.r1, pa.r2)
    const hiB = Math.max(pb.r1, pb.r2), loB = Math.min(pb.r1, pb.r2)
    if (hiA !== hiB) return hiB - hiA
    return loB - loA
  })

  return unique.join(',')
}

// ── Main ──
console.log('═══ Extracting HU ranges from RYE data ═══\n')

const allResults = {}
for (const depth of ['40bb', '25bb', '13bb']) {
  console.log(`\n${'━'.repeat(50)}`)
  console.log(`  ${depth.toUpperCase()}`)
  console.log(`${'━'.repeat(50)}`)

  const result = extractRanges(depth)
  if (!result) continue
  allResults[depth] = result

  for (const potType of ['srp', '3bp', '4bp']) {
    const r = result[potType]
    const ipCount = r.ip ? r.ip.split(',').filter(Boolean).length : 0
    const oopCount = r.oop ? r.oop.split(',').filter(Boolean).length : 0
    console.log(`\n  ${potType.toUpperCase()}:`)
    console.log(`    IP  (${ipCount} hands): ${r.ip || '(none)'}`)
    console.log(`    OOP (${oopCount} hands): ${r.oop || '(none)'}`)
  }
}

// ── Output summary ──
console.log('\n\n' + '═'.repeat(60))
console.log('RANGE COMPARISON: RYE vs Current')
console.log('═'.repeat(60))

const CURRENT = {
  '40bb_srp_ip': 79,  // approximate hand count from boards.mjs
  '40bb_srp_oop': 63,
  '25bb_srp_ip': 71,
  '25bb_srp_oop': 59,
  '13bb_srp_ip': 54,
  '13bb_srp_oop': 44,
  '40bb_3bp_ip': 29,
  '40bb_3bp_oop': 30,
  '25bb_3bp_ip': 20,
  '25bb_3bp_oop': 22,
  '40bb_4bp_ip': 13,
  '40bb_4bp_oop': 11,
}

for (const depth of ['40bb', '25bb', '13bb']) {
  const r = allResults[depth]
  if (!r) continue
  for (const pt of ['srp', '3bp', '4bp']) {
    const ipCount = r[pt].ip ? r[pt].ip.split(',').filter(Boolean).length : 0
    const oopCount = r[pt].oop ? r[pt].oop.split(',').filter(Boolean).length : 0
    const curIp = CURRENT[`${depth}_${pt}_ip`] || '?'
    const curOop = CURRENT[`${depth}_${pt}_oop`] || '?'
    if (ipCount > 0 || oopCount > 0) {
      console.log(`  ${depth} ${pt.toUpperCase()}: IP ${curIp}→${ipCount}  OOP ${curOop}→${oopCount}`)
    }
  }
}
