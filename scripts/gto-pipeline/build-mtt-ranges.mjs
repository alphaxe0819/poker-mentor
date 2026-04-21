// T-075 Phase 1 ephemeral builder: generate mtt_9max_ranges.mjs from Course pd data
import { parseTableName } from './parse-pd-table-name.mjs'
import fs from 'node:fs'

const DL = 'C:/Users/User/Downloads/'
const PD_DIR = 'output/pd-ranges/Course/'
const OUT = 'mtt_9max_ranges.mjs'

function sanitize(s) { return s.replace(/[^\w\-]+/g, '_').replace(/^_|_$/g, '') }

// Sort hands by category + canonical order for stable output
const RANK_ORDER = '23456789TJQKA'
function handSortKey(hand) {
  // Pairs first: by rank desc. Suited before offsuit. Within: rank1 desc, rank2 desc
  if (hand.length === 2) return [0, -RANK_ORDER.indexOf(hand[0])]  // pairs AA-22
  const r1 = hand[0], r2 = hand[1], suit = hand[2]
  const suitOrder = suit === 's' ? 0 : 1
  return [1 + suitOrder, -RANK_ORDER.indexOf(r1), -RANK_ORDER.indexOf(r2)]
}
function sortHands(hands) {
  return [...hands].sort((a, b) => {
    const ka = handSortKey(a), kb = handSortKey(b)
    for (let i = 0; i < Math.max(ka.length, kb.length); i++) {
      const va = ka[i] ?? 0, vb = kb[i] ?? 0
      if (va !== vb) return va - vb
    }
    return 0
  })
}

// Build slug from parsed result (deterministic, url-safe)
function slugFromParsed(p, name) {
  const parts = []
  if (p.scenario) parts.push(p.scenario)
  if (p.hero) parts.push(p.hero.toLowerCase().replace(/\+/g, 'p'))
  if (p.villain && p.villain !== p.hero) parts.push('vs_' + p.villain.toLowerCase().replace(/\+/g, 'p'))
  if (p.depth_bb) parts.push(p.depth_bb + 'bb')
  let slug = parts.join('_')
  if (!slug) slug = 'unnamed_' + sanitize(name).toLowerCase()
  return slug
}

// ── Load Course JSON and parse ──
const d = JSON.parse(fs.readFileSync(DL + 'Course_ranges.json', 'utf8'))
const byName = new Map()  // name → { parsed, sids: Set, order: min }
for (const t of d.tables) {
  const p = parseTableName(t.name)
  if (p.unknown) continue
  if (!byName.has(t.name)) byName.set(t.name, { parsed: p, sids: new Set(), minOrder: t.order })
  const rec = byName.get(t.name)
  rec.sids.add(t.scenario_id)
  if (t.order < rec.minOrder) rec.minOrder = t.order
}

// ── Build entries ──
const entries = []
const slugCollisions = new Map()
for (const [name, rec] of byName) {
  const pdFile = PD_DIR + sanitize(name) + '.json'
  if (!fs.existsSync(pdFile)) continue
  const pd = JSON.parse(fs.readFileSync(pdFile, 'utf8'))
  const hands = sortHands(Object.keys(pd.hands || {}))
  const range = hands.join(',')
  let slug = slugFromParsed(rec.parsed, name)
  // Uniquify slug if collision
  const baseSlug = slug
  let suffix = 2
  while (entries.some(e => e.slug === slug)) {
    slug = baseSlug + '_v' + suffix++
    slugCollisions.set(baseSlug, (slugCollisions.get(baseSlug) || 1) + 1)
  }
  entries.push({
    slug,
    raw_name: name,
    hero: rec.parsed.hero,
    villain: rec.parsed.villain,
    scenario_tag: rec.parsed.scenario,
    depth_bb: rec.parsed.depth_bb,
    covered_sids: rec.sids.size,
    range,
    hand_count: hands.length,
    order: rec.minOrder,
  })
}
entries.sort((a, b) => a.order - b.order)

console.log(`Entries built: ${entries.length}`)
console.log(`Scenario tags:`, [...new Set(entries.map(e => e.scenario_tag))].sort())
if (slugCollisions.size) {
  console.log(`Slug collisions resolved with _v2/_v3 suffix:`, slugCollisions.size)
}
console.log(`Total sid coverage:`, entries.reduce((sum, e) => sum + e.covered_sids, 0), '(auto-parseable tables)')

// ── Emit .mjs file ──
const header = `// =============================================================
// mtt_9max_ranges.mjs — Course-sourced MTT 9-max preflop ranges
// =============================================================
// T-075 Phase 1 (2026-04-21)
// Source: pokerdinosaur "Course" project (S0 課程表格)
//   - Total tables: 353 / distinct names: 149
//   - auto-parseable: 205 tables → 110 distinct names (58% parse rate)
// 本檔自動產出（別手改；重跑 build-mtt-ranges-tmp.mjs 更新）
//
// 每 entry = 一個 pd table.name（對應 N 個 scenario_id/depth variant）
// hero / villain 欄位是 parseTableName 結果；null 表 parser 未 confirm
// scenario_tag 值：open / flat / 3bet / limp / jam
// range 字串：TexasSolver notation（comma-separated），含全部 hero non-fold hands
// =============================================================

export const COURSE_RANGES = {
`

const body = entries.map(e => {
  const meta = `hero: ${JSON.stringify(e.hero)}, villain: ${JSON.stringify(e.villain)}, scenario: ${JSON.stringify(e.scenario_tag)}, depth_bb: ${e.depth_bb === null ? 'null' : e.depth_bb}, covered_sids: ${e.covered_sids}, hand_count: ${e.hand_count}, raw_name: ${JSON.stringify(e.raw_name)}`
  return `  ${JSON.stringify(e.slug)}: {\n    ${meta},\n    range: ${JSON.stringify(e.range)},\n  },`
}).join('\n')

const footer = `\n}\n\nexport const COURSE_RANGES_META = {\n  project: 'Course',\n  project_id: 'f443feb0-c8e1-4bb1-9a76-e40ba6e4eb46',\n  total_entries: ${entries.length},\n  source_parseable_tables: 205,\n  source_total_tables: 353,\n  parse_rate: '58.1%',\n  generated_at: '${new Date().toISOString()}',\n}\n`

fs.writeFileSync(OUT, header + body + footer, 'utf8')
console.log(`\nWrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB)`)
