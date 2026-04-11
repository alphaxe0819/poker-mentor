#!/usr/bin/env node
/**
 * TexasSolver JSON 輸出結構檢查器
 *
 * 用途：
 *   因為我們還沒實際看過 TexasSolver 的 JSON 輸出結構，
 *   這個腳本讀取輸出檔，印出 top-level keys、樣本節點、
 *   以及策略資料的 shape，讓我們知道怎麼寫 converter。
 *
 * 用法：
 *   node inspect-json.mjs ./output/hu_40bb_srp_flop_QsJh2h.json
 */

import { readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'

const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('用法: node inspect-json.mjs <path-to-json>')
  process.exit(1)
}

const abs = resolve(jsonPath)
console.log(`\n=== 讀取 ${abs} ===`)

const stats = statSync(abs)
console.log(`檔案大小: ${(stats.size / 1024).toFixed(1)} KB`)

let data
try {
  data = JSON.parse(readFileSync(abs, 'utf8'))
} catch (e) {
  console.error(`❌ JSON parse 失敗: ${e.message}`)
  console.error('可能檔案不是 JSON 或損毀，印出前 500 字元：')
  console.error(readFileSync(abs, 'utf8').slice(0, 500))
  process.exit(1)
}

// ── Top-level 結構 ──
console.log('\n=== Top-level keys ===')
if (Array.isArray(data)) {
  console.log(`是陣列，長度 ${data.length}`)
  console.log('第一個元素的 keys:', Object.keys(data[0] || {}))
} else {
  const keys = Object.keys(data)
  console.log(`是物件，${keys.length} 個 top-level keys:`)
  for (const k of keys.slice(0, 20)) {
    const v = data[k]
    const type = Array.isArray(v) ? `Array(${v.length})`
               : v === null ? 'null'
               : typeof v === 'object' ? `Object(${Object.keys(v).length} keys)`
               : typeof v
    console.log(`  ${k}: ${type}`)
  }
  if (keys.length > 20) console.log(`  ... 還有 ${keys.length - 20} 個`)
}

// ── 遞迴印出前幾層結構 ──
function summarize(obj, depth = 0, maxDepth = 3) {
  if (depth >= maxDepth) return '...'
  if (obj === null || obj === undefined) return String(obj)
  if (typeof obj !== 'object') return typeof obj + ':' + String(obj).slice(0, 40)
  if (Array.isArray(obj)) {
    return `[${obj.length}] ` + (obj.length ? summarize(obj[0], depth + 1, maxDepth) : '')
  }
  const keys = Object.keys(obj)
  const sample = keys.slice(0, 5).map(k => `${k}: ${summarize(obj[k], depth + 1, maxDepth)}`).join(', ')
  return `{${sample}${keys.length > 5 ? ', ...' : ''}}`
}

console.log('\n=== 結構預覽（前 3 層）===')
console.log(summarize(data, 0, 3))

// ── 找策略節點 ──
// TexasSolver 可能用樹狀結構，策略通常埋在某個 "strategy" 或 "actions" 下
console.log('\n=== 可能的策略相關欄位 ===')
const suspects = ['strategy', 'actions', 'childrens', 'children', 'node_type', 'board', 'pot', 'ip', 'oop']
function findKeys(obj, path = '$', depth = 0, maxDepth = 4) {
  if (depth >= maxDepth || !obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    if (obj[0]) findKeys(obj[0], `${path}[0]`, depth + 1, maxDepth)
    return
  }
  for (const k of Object.keys(obj)) {
    if (suspects.includes(k)) {
      const v = obj[k]
      const preview = typeof v === 'object' ? summarize(v, 0, 2) : String(v).slice(0, 60)
      console.log(`  ${path}.${k} = ${preview}`)
    }
    findKeys(obj[k], `${path}.${k}`, depth + 1, maxDepth)
  }
}
findKeys(data)

// ── 印一手牌的策略（若能找到）──
console.log('\n=== 樣本 hand 策略（試著尋找 AA 或 KK 等知名手牌）===')
function findHandStrat(obj, path = '$', depth = 0, maxDepth = 6) {
  if (depth >= maxDepth || !obj || typeof obj !== 'object') return null
  if (Array.isArray(obj)) {
    for (let i = 0; i < Math.min(obj.length, 3); i++) {
      const r = findHandStrat(obj[i], `${path}[${i}]`, depth + 1, maxDepth)
      if (r) return r
    }
    return null
  }
  // 可能的 hand key 格式
  const handKeys = Object.keys(obj).filter(k =>
    /^[2-9TJQKA][2-9TJQKA][so]?$/i.test(k) ||
    /^[2-9TJQKA][cdhs][2-9TJQKA][cdhs]$/i.test(k)
  )
  if (handKeys.length > 0) {
    console.log(`  找到 hand keys 在 ${path}，共 ${handKeys.length} 個`)
    console.log(`  範例：`)
    for (const hk of handKeys.slice(0, 3)) {
      console.log(`    ${hk}: ${JSON.stringify(obj[hk]).slice(0, 120)}`)
    }
    return true
  }
  for (const k of Object.keys(obj)) {
    const r = findHandStrat(obj[k], `${path}.${k}`, depth + 1, maxDepth)
    if (r) return r
  }
  return null
}
if (!findHandStrat(data)) {
  console.log('  （找不到典型 hand key pattern，結構可能不同）')
}

console.log('\n=== 完成檢查 ===')
console.log('下一步：把上述輸出 + JSON 檔前 200 行貼給 Claude，讓他完成 converter')
