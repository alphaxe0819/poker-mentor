#!/usr/bin/env node
/**
 * Seed gto_batch_progress with all turn/river work items.
 *
 * 跑一次就好。產生所有 board × turnCard × stack 的工作項目，
 * 讓 batch-worker.mjs 可以自動領取。
 *
 * Usage: node seed-batches.mjs [--include-river]
 *
 * 預設只產生 turn batches。加 --include-river 會同時產生 river batches。
 * 建議先跑完 turn，確認流程沒問題，再加 river。
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BOARDS, STACK_RATIOS, generateRiverCards } from './boards.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env
try {
  const envPath = resolve(__dirname, '.env')
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n')
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) process.env[match[1].trim()] = match[2].trim()
    }
  }
} catch { /* ignore */ }

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const includeRiver = process.argv.includes('--include-river')

async function main() {
  const rows = []

  for (const board of BOARDS) {
    if (!board.turnCards || board.turnCards.length === 0) {
      console.warn(`SKIP: ${board.slug} has no turnCards defined`)
      continue
    }

    for (const stack of STACK_RATIOS) {
      // Turn batches
      for (const turnCard of board.turnCards) {
        rows.push({
          board_key: board.slug,
          turn_card: turnCard,
          river_card: '',
          street: 'turn',
          stack_label: stack.slug,
          status: 'pending',
        })
      }

      // River batches（可選）
      if (includeRiver) {
        for (const turnCard of board.turnCards) {
          const riverCards = generateRiverCards(board.cards, turnCard)
          for (const riverCard of riverCards) {
            rows.push({
              board_key: board.slug,
              turn_card: turnCard,
              river_card: riverCard,
              street: 'river',
              stack_label: stack.slug,
              status: 'pending',
            })
          }
        }
      }
    }
  }

  console.log(`Seeding ${rows.length} batch items...`)
  console.log(`  Turn:  ${rows.filter(r => r.street === 'turn').length}`)
  console.log(`  River: ${rows.filter(r => r.street === 'river').length}`)

  // Upsert in chunks（avoid duplicate if re-run）
  const CHUNK = 200
  let inserted = 0
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)
    const { error } = await supabase
      .from('gto_batch_progress')
      .upsert(chunk, {
        onConflict: 'board_key,turn_card,river_card,street,stack_label',
        ignoreDuplicates: true,
      })
    if (error) {
      console.error(`Error at chunk ${i}:`, error.message)
    } else {
      inserted += chunk.length
    }
  }

  console.log(`\n✅ Seeded ${inserted} batch items`)

  // Summary
  const { data: counts } = await supabase
    .from('gto_batch_progress')
    .select('status', { count: 'exact', head: false })

  const statusCounts = {}
  if (counts) {
    for (const row of counts) {
      statusCounts[row.status] = (statusCounts[row.status] || 0) + 1
    }
  }
  console.log('Current status distribution:', statusCounts)
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
