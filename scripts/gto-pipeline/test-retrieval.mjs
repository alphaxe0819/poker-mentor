#!/usr/bin/env node
/**
 * End-to-end test of the RAG retrieval logic in exploit-coach.
 * Runs the same query logic the Edge Function uses, prints the
 * prompt context that would be fed to Claude.
 */

const SUPABASE_URL = 'https://btiqmckyjyswzrarmfxa.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0aXFtY2t5anlzd3pyYXJtZnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzA4MjAsImV4cCI6MjA5MTcwNjgyMH0.NexV3NCPU3ksCVudWdhBjDWS99jcbLkxnaL1tInJAGQ'

async function query(url) {
  const r = await fetch(url, {
    headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${ANON_KEY}` },
  })
  return r.json()
}

async function retrieve(ctx) {
  let row = null, tier = 'C'

  // T-012：scenario 前綴決定查哪張表（MTT 走 solver_postflop_mtt，其他走 6max）
  // Tier C fallback 保留 6max — 若 MTT 全 miss 仍能拿相近 pot_type 的近似策略
  const targetTable = ctx.scenario_slug?.startsWith('mtt_')
    ? 'solver_postflop_mtt'
    : 'solver_postflop_6max'

  // Tier A: exact
  if (ctx.scenario_slug && ctx.flop) {
    const data = await query(`${SUPABASE_URL}/rest/v1/${targetTable}?scenario_slug=eq.${ctx.scenario_slug}&flop=eq.${ctx.flop}&select=*`)
    if (data[0]) { row = data[0]; tier = 'A' }
  }
  // Tier B: same scenario
  if (!row && ctx.scenario_slug) {
    const data = await query(`${SUPABASE_URL}/rest/v1/${targetTable}?scenario_slug=eq.${ctx.scenario_slug}&select=*&limit=1`)
    if (data[0]) { row = data[0]; tier = 'B' }
  }
  // Tier C: same pot_type（固定查 6max，MTT 全 miss 時退回 cash 近似）
  if (!row && ctx.pot_type) {
    const data = await query(`${SUPABASE_URL}/rest/v1/solver_postflop_6max?scenario_slug=like.*${ctx.pot_type}*&select=*&limit=1`)
    if (data[0]) { row = data[0]; tier = 'C' }
  }
  return { tier, row }
}

function summarize(node, row) {
  if (!node) return ''
  const lines = []
  lines.push(`場景：${row.scenario_slug} / Flop=${row.flop}`)
  lines.push(`位置：IP=${row.ip_pos}, OOP=${row.oop_pos} | pot=${row.pot_bb}bb eff=${row.effective_stack_bb}bb`)
  lines.push(`決策者：${node.player === 0 ? 'IP (' + row.ip_pos + ')' : 'OOP (' + row.oop_pos + ')'}`)
  lines.push(`可選動作：${(node.actions || []).join(' | ')}`)
  if (node.strategy) {
    const totals = new Array(node.actions.length).fill(0)
    let cnt = 0
    for (const freqs of Object.values(node.strategy)) {
      for (let i = 0; i < freqs.length; i++) totals[i] += freqs[i]
      cnt++
    }
    lines.push('分布（range 平均）:')
    for (let i = 0; i < node.actions.length; i++) {
      lines.push(`  ${node.actions[i]}: ${(totals[i] / cnt * 100).toFixed(1)}%`)
    }
    const keyHands = ['AA', 'KK', 'AKs', 'QQ', 'JJ', 'TT', 'QJs', '22', '76s', '54s']
    lines.push('代表手牌:')
    for (const h of keyHands) {
      if (node.strategy[h]) {
        const freqs = node.strategy[h]
        const topIdx = freqs.indexOf(Math.max(...freqs))
        lines.push(`  ${h} → ${node.actions[topIdx]} (${(freqs[topIdx] * 100).toFixed(0)}%)`)
      }
    }
  }
  return lines.join('\n')
}

// Test cases
const tests = [
  // Tier A: exact match
  {
    label: 'Tier A — 完全命中',
    ctx: { scenario_slug: '6max_100bb_srp_utg_open_hj_call', flop: '7s7d2h', pot_type: 'srp' },
  },
  // Tier B: same scenario, different flop
  {
    label: 'Tier B — 同場景，不同 flop',
    ctx: { scenario_slug: '6max_100bb_srp_utg_open_hj_call', flop: 'AhKhQh', pot_type: 'srp' },
  },
  // Tier C: different scenario
  {
    label: 'Tier C — 相同 pot_type，不同場景',
    ctx: { scenario_slug: '6max_100bb_srp_btn_open_bb_call', flop: 'As7d2c', pot_type: 'srp' },
  },
  // Test tree navigation
  {
    label: '節點導航：IP 面對 OOP check',
    ctx: { scenario_slug: '6max_100bb_srp_utg_open_hj_call', flop: '7s7d2h', pot_type: 'srp', path: ['CHECK'] },
  },
  // T-011 E2E：MTT scenario Tier A 必中（暫借 solver_postflop_6max，T-012 後遷移）
  {
    label: 'T-011 Tier A — MTT E2E 骨架驗證',
    ctx: { scenario_slug: 'mtt_40bb_srp_btn_open_bb_call', flop: 'As7d2c', pot_type: 'srp' },
  },
]

for (const t of tests) {
  console.log('\n═'.repeat(30))
  console.log(t.label)
  console.log('═'.repeat(30))
  const result = await retrieve(t.ctx)
  console.log(`Tier: ${result.tier}`)
  if (!result.row) { console.log('  NOT FOUND'); continue }

  let node = result.row.tree
  if (t.ctx.path) {
    for (const step of t.ctx.path) {
      if (node?.children?.[step]) node = node.children[step]
      else { console.log(`  path '${step}' 找不到`); break }
    }
  }
  console.log(summarize(node, result.row))
}
