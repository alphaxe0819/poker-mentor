#!/usr/bin/env node
/**
 * Probe key nodes in the TexasSolver output to verify assumptions
 * before writing the full converter.
 *
 * Usage: node probe-structure.mjs <path-to-json>
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const jsonPath = process.argv[2] || 'output/hu_40bb_srp_flop_QsJh2h.json'
const abs = resolve(jsonPath)
console.log(`Loading ${abs}...`)
const data = JSON.parse(readFileSync(abs, 'utf8'))
console.log(`Loaded. ${Object.keys(data).length} top-level keys.\n`)

// ---- Root node: BB's first decision (check or lead) ----
console.log('=== ROOT NODE (BB first decision, player should be OOP) ===')
console.log('player:', data.player)
console.log('node_type:', data.node_type)
console.log('actions:', data.actions)
console.log('children keys:', Object.keys(data.childrens))

// Sample strategy for a known hand (AcAs = pocket aces, one combo)
const rootStrat = data.strategy?.strategy
if (rootStrat) {
  const combos = Object.keys(rootStrat)
  console.log('total combos in root strategy:', combos.length)

  // Find a few known combos
  const samples = ['AcAs', 'AsAh', 'KsKh', 'AsKs', 'AsKh', '7d6d', '9c9d', '2c2d']
  console.log('\nSample combos at root (BB first decision):')
  for (const c of samples) {
    if (rootStrat[c]) {
      const freqs = rootStrat[c]
      const actionsWithFreq = data.actions.map((a, i) => `${a}: ${(freqs[i] * 100).toFixed(1)}%`)
      console.log(`  ${c}: [${actionsWithFreq.join(', ')}]`)
    }
  }
}

// ---- CHECK child: after BB checks, BTN's decision (c-bet or check back) ----
console.log('\n=== $.childrens.CHECK (BTN facing BB check = c-bet decision) ===')
const checkNode = data.childrens?.CHECK
if (checkNode) {
  console.log('player:', checkNode.player)
  console.log('node_type:', checkNode.node_type)
  console.log('actions:', checkNode.actions)

  const checkStrat = checkNode.strategy?.strategy
  if (checkStrat) {
    console.log('combos:', Object.keys(checkStrat).length)
    console.log('\nSample combos at BTN c-bet decision:')
    const samples = ['AcAs', 'AsKs', 'AsKh', 'QsQh', 'JsJh', '7d6d', '2c2d', 'QdJd']
    for (const c of samples) {
      if (checkStrat[c]) {
        const freqs = checkStrat[c]
        const actionsWithFreq = checkNode.actions.map((a, i) => `${a}: ${(freqs[i] * 100).toFixed(1)}%`)
        console.log(`  ${c}: [${actionsWithFreq.join(', ')}]`)
      }
    }
  }
}

// ---- CHECK → BET X child: BB facing BTN c-bet ----
console.log('\n=== $.childrens.CHECK.childrens["BET X"] (BB facing c-bet) ===')
const checkBets = Object.keys(checkNode?.childrens || {}).filter(k => k.startsWith('BET '))
console.log('BTN c-bet sizes available:', checkBets)

// Look at the first bet size (probably smallest)
if (checkBets.length > 0) {
  const firstBet = checkBets[0]
  const facing = checkNode.childrens[firstBet]
  console.log(`\nAt "${firstBet}" child (BB facing BTN c-bet):`)
  console.log('  player:', facing.player)
  console.log('  node_type:', facing.node_type)
  console.log('  actions:', facing.actions)

  const facingStrat = facing.strategy?.strategy
  if (facingStrat) {
    console.log('\n  Sample combos (BB facing c-bet):')
    const samples = ['AcAs', 'QsQh', 'AsKs', 'JsTs', '9c9d', '2c2d']
    for (const c of samples) {
      if (facingStrat[c]) {
        const freqs = facingStrat[c]
        const actionsWithFreq = facing.actions.map((a, i) => `${a}: ${(freqs[i] * 100).toFixed(1)}%`)
        console.log(`    ${c}: [${actionsWithFreq.join(', ')}]`)
      }
    }
  }
}

// ---- Enumerate node_types seen in the tree ----
console.log('\n=== Node types encountered ===')
const nodeTypes = new Set()
const playerValues = new Set()
function walk(node, depth = 0, maxDepth = 6) {
  if (!node || typeof node !== 'object' || depth > maxDepth) return
  if (node.node_type) nodeTypes.add(node.node_type)
  if (node.player !== undefined) playerValues.add(node.player)
  if (node.childrens) {
    for (const child of Object.values(node.childrens)) walk(child, depth + 1, maxDepth)
  }
  if (node.dealcards) {
    for (const dc of Object.values(node.dealcards)) walk(dc, depth + 1, maxDepth)
  }
}
walk(data)
console.log('node_types seen:', [...nodeTypes])
console.log('player values seen:', [...playerValues])
