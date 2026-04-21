/**
 * Parse a pokerdinosaur table.name string into structured scenario metadata.
 *
 * pd 的 hand-map JSON 每張 table 只給一個自由文字 `name`（例：
 *   "BB VS MP"
 *   "10bb SB Push"
 *   "Live MTT Ben Adjusted - Open Raise UTG"
 *   "Squeeze CO vs UTG+1 + BTN call"
 *
 * 這個 parser 把它解析成 scenarios.mjs / solver pipeline 能消化的物件。
 * 採 prefix-based token scanner（同 pd-to-range.mjs 的 label 規則），所有
 * 無法歸類的 raw 進入 unknown bucket，**不 silently drop**。
 *
 * Public API:
 *   parseTableName(raw) → { raw, scenario, hero, villain, positions, depth_bb, format, modifiers, unknown, reason }
 *   summarizeParsing(parsed[]) → { total, ok, unknown, byScenario, sampleUnknown }
 */

// ── Position dictionary ────────────────────────────────────────────────
// Canonical 9-max names. Keys = canonical, values = aliases that map to it.
const POSITION_CANON = {
  BTN:    ['btn', 'button', 'bu', 'dealer'],
  SB:     ['sb', 'smallblind'],
  BB:     ['bb', 'bigblind'],
  CO:     ['co', 'cutoff'],
  HJ:     ['hj', 'hijack'],
  LJ:     ['lj', 'lojack'],
  'UTG+2':['utg+2', 'utg2'],
  'UTG+1':['utg+1', 'utg1'],
  UTG:    ['utg', 'utg+0', 'underthegun'],
  MP:     ['mp', 'middle'],
  MP1:    ['mp1'],
  MP2:    ['mp2'],
  MP3:    ['mp3'],
  EP:     ['ep', 'early'],
  LP:     ['lp', 'late'],
}

// Build alias → canonical lookup (longest alias first, so "utg+2" beats "utg")
const POSITION_LOOKUP = (() => {
  const pairs = []
  for (const [canon, aliases] of Object.entries(POSITION_CANON)) {
    for (const a of aliases) pairs.push([a, canon])
  }
  // Match longer aliases first to avoid prefix collisions (utg+2 > utg)
  pairs.sort((a, b) => b[0].length - a[0].length)
  return pairs
})()

function tokenToPosition(token) {
  const t = token.toLowerCase()
  for (const [alias, canon] of POSITION_LOOKUP) {
    if (t === alias) return canon
  }
  return null
}

// ── Scenario keyword (prefix-based, single-word) ───────────────────────
// Order matters: more specific patterns first.
const SCENARIO_PREFIXES = [
  // [scenario_id, regex (anchored to token start)]
  ['cold4bet', /^(cold[\-\s]?4b(et)?|c4b(et)?)$/i],
  ['rejam',    /^(rejam|re[\-\s]?jam|reshove|re[\-\s]?shove)$/i],
  ['squeeze',  /^(sqz|squeeze|squeezing|squeezed?)$/i],
  ['4bet',     /^(4b|4bet|4[\-\s]?bet|4betting)$/i],
  ['3bet',     /^(3b|3bet|3[\-\s]?bet|3betting)$/i],
  ['jam',      /^(jam|push|shove|allin|all[\-\s]?in|openshove|openjam)$/i],
  ['flat',     /^(flat|flatting|defend|defending|caller?|calling)$/i],
  ['limp',     /^(limp|limping)$/i],
  ['open',     /^(open|openraise|raise|raising|or|rfi|first[\-\s]?in)$/i],
  ['multiway', /^(multiway|3[\-\s]?way|4[\-\s]?way)$/i],
]

function tokenToScenario(token) {
  for (const [id, re] of SCENARIO_PREFIXES) {
    if (re.test(token)) return id
  }
  return null
}

// ── Modifiers (don't change scenario, just tag context) ────────────────
const MODIFIER_PATTERNS = [
  ['live',          /\blive\b/i],
  ['ben-adjusted',  /\bben\b/i],
  ['icm',           /\bicm\b/i],
  ['final-table',   /\bfinal[\-\s]?table\b/i],
  ['chip-ev',       /\bchip[\-\s]?ev\b/i],
  ['exploitative',  /\bexploitative\b/i],
  ['bubble',        /\bbubble\b/i],
  ['hu',            /\b(hu|heads[\-\s]?up)\b/i],
]

function detectModifiers(raw) {
  const tags = []
  for (const [id, re] of MODIFIER_PATTERNS) {
    if (re.test(raw)) tags.push(id)
  }
  return tags
}

// ── Depth detection ────────────────────────────────────────────────────
const DEPTH_RE = /(\d+(?:\.\d+)?)\s*bb\b/i

function detectDepth(raw) {
  const m = raw.match(DEPTH_RE)
  if (!m) return null
  const n = parseFloat(m[1])
  return Number.isFinite(n) && n > 0 && n < 500 ? n : null
}

// ── VS pattern (hero VS villain, or villain VS hero — convention varies) ──
// Matches "BB VS MP" or "MP vs BB" — captures both sides.
const VS_RE = /\b(\w+(?:\+\d+)?)\s+vs\.?\s+(\w+(?:\+\d+)?)\b/i

function detectVsPair(raw) {
  const m = raw.match(VS_RE)
  if (!m) return null
  const left  = tokenToPosition(m[1])
  const right = tokenToPosition(m[2])
  if (!left || !right) return null
  // Convention: in "X VS Y" pd-style names, hero is on the LEFT (X is the
  // hero whose range we're describing; Y is the opponent context).
  return { hero: left, villain: right }
}

// ── Pre-normalize: collapse multi-word actions before tokenizing ────────
// e.g. "All in" → "allin", "Open Raise" → "openraise", so the single-token
// scenario regex can match. Mirrors pd-to-range.mjs label normalization.
function preNormalize(raw) {
  return raw
    .replace(/\ball[\-\s]+in\b/gi, 'allin')
    .replace(/\bopen[\-\s]+raise\b/gi, 'openraise')
    .replace(/\bopen[\-\s]+jam\b/gi, 'openjam')
    .replace(/\bopen[\-\s]+shove\b/gi, 'openshove')
    .replace(/\bcold[\-\s]+4b(et)?\b/gi, 'cold4bet')
    .replace(/\bre[\-\s]+jam\b/gi, 'rejam')
    .replace(/\bre[\-\s]+shove\b/gi, 'reshove')
}

// ── Tokenizer ──────────────────────────────────────────────────────────
// Split on whitespace + structural separators, but keep `-` and `+` in tokens
// so "3-bet" stays one token and "UTG+1" stays one token. Standalone dashes
// (separators between phrases) are filtered out.
function tokenize(raw) {
  return raw
    .replace(/[()\[\]"']/g, ' ')
    .replace(/[,/_]+/g, ' ')      // collapse , / _ to space; keep - and +
    .split(/\s+/)
    .filter(t => t && t !== '-')  // drop empty + standalone dash tokens
}

// ── Format inference ───────────────────────────────────────────────────
function inferFormat(raw, modifiers) {
  if (modifiers.includes('hu')) return 'hu'
  if (modifiers.includes('icm') || modifiers.includes('final-table') ||
      modifiers.includes('live') || modifiers.includes('ben-adjusted') ||
      modifiers.includes('chip-ev') || modifiers.includes('bubble')) {
    return 'mtt'
  }
  if (/\bcash\b/i.test(raw)) return 'cash'
  if (/\b(mtt|tourn(ament)?)\b/i.test(raw)) return 'mtt'
  return null
}

// ── Main parser ────────────────────────────────────────────────────────

/**
 * Parse a raw pd table.name into structured fields.
 * Returns an object that's always populated (never throws) — `unknown=true`
 * + non-empty `reason` means the caller should bucket it as unparseable.
 */
export function parseTableName(raw) {
  const result = {
    raw,
    scenario: null,
    hero: null,
    villain: null,
    positions: [],
    depth_bb: null,
    format: null,
    modifiers: [],
    unknown: false,
    reason: '',
  }

  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    result.unknown = true
    result.reason = 'empty name'
    return result
  }

  const trimmed = raw.trim()
  result.modifiers = detectModifiers(trimmed)
  result.format = inferFormat(trimmed, result.modifiers)
  result.depth_bb = detectDepth(trimmed)

  // Normalize multi-word actions before further parsing
  const normalized = preNormalize(trimmed)

  // VS pattern → assign hero/villain
  const vs = detectVsPair(normalized)
  if (vs) {
    result.hero = vs.hero
    result.villain = vs.villain
    if (!result.positions.includes(vs.hero)) result.positions.push(vs.hero)
    if (!result.positions.includes(vs.villain)) result.positions.push(vs.villain)
  }

  // Token scan: collect all positions + first scenario hit + post-"vs" villain
  const tokens = tokenize(normalized)
  let scenarioFromToken = null
  let prevWasVs = false
  for (const tok of tokens) {
    const isVsTok = /^v(s|s\.|\.)$/i.test(tok)
    const pos = tokenToPosition(tok)
    if (pos && !result.positions.includes(pos)) result.positions.push(pos)
    // If villain not yet known and this position is the FIRST one right after "vs" → villain
    if (pos && prevWasVs && !result.villain) result.villain = pos
    if (!scenarioFromToken) {
      const sc = tokenToScenario(tok)
      if (sc) scenarioFromToken = sc
    }
    prevWasVs = isVsTok
  }
  if (scenarioFromToken) result.scenario = scenarioFromToken

  // Heuristic fallbacks
  if (!result.hero && result.positions.length > 0) {
    // No "VS" — hero defaults to first position mentioned
    result.hero = result.positions[0]
  }

  // Classify unknown: if we didn't extract scenario AND no positions, mark unknown
  if (!result.scenario && result.positions.length === 0) {
    result.unknown = true
    result.reason = 'no scenario or position keywords matched'
  } else if (!result.scenario && result.positions.length > 0) {
    // Has positions but no action verb — treat "X vs Y" without verb as 'flat'
    // (common pd convention: "BB vs MP" = BB defending vs MP open)
    if (vs) {
      result.scenario = 'flat'
      result.reason = 'inferred flat from VS pattern'
    } else {
      result.unknown = true
      result.reason = `positions ${result.positions.join(',')} but no scenario verb`
    }
  }

  return result
}

// ── Aggregate reporting ─────────────────────────────────────────────────

/**
 * Produce a summary report over a batch of parsed names.
 */
export function summarizeParsing(parsedList) {
  const summary = {
    total: parsedList.length,
    ok: 0,
    unknown: 0,
    byScenario: {},
    byFormat: {},
    byDepth: {},
    sampleUnknown: [],
    sampleByScenario: {},
  }

  for (const p of parsedList) {
    if (p.unknown) {
      summary.unknown++
      if (summary.sampleUnknown.length < 20) {
        summary.sampleUnknown.push({ raw: p.raw, reason: p.reason })
      }
      continue
    }
    summary.ok++
    const sc = p.scenario || 'unspecified'
    summary.byScenario[sc] = (summary.byScenario[sc] || 0) + 1
    if (!summary.sampleByScenario[sc]) summary.sampleByScenario[sc] = []
    if (summary.sampleByScenario[sc].length < 3) {
      summary.sampleByScenario[sc].push(p.raw)
    }
    const fmt = p.format || 'unspecified'
    summary.byFormat[fmt] = (summary.byFormat[fmt] || 0) + 1
    const depth = p.depth_bb ?? 'unspecified'
    summary.byDepth[depth] = (summary.byDepth[depth] || 0) + 1
  }

  return summary
}

// ── CLI: scan pd-ranges output dir, report parsing coverage ─────────────
//
// Usage:
//   node parse-pd-table-name.mjs <pd-ranges-dir>
//   node parse-pd-table-name.mjs scripts/gto-pipeline/output/pd-ranges
//
// 不阻擋下游 pipeline；純診斷 — 列出每個 project 的 parsing rate +
// unknown 樣本，方便決定要不要擴充規則。

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

function isMain() {
  if (typeof process === 'undefined' || !process.argv[1]) return false
  return resolve(process.argv[1]) === fileURLToPath(import.meta.url)
}

if (isMain()) {
  const root = resolve(process.argv[2] ?? 'scripts/gto-pipeline/output/pd-ranges')
  let projectDirs
  try {
    projectDirs = readdirSync(root).filter(name => {
      try { return statSync(join(root, name)).isDirectory() } catch { return false }
    })
  } catch (err) {
    console.error(`Cannot read pd-ranges dir: ${root}`)
    console.error(`(${err.message})`)
    process.exit(1)
  }

  if (projectDirs.length === 0) {
    console.error(`No project subdirs found under ${root}`)
    process.exit(1)
  }

  const allParsed = []
  let totalProjectFiles = 0

  for (const project of projectDirs) {
    const projectDir = join(root, project)
    const files = readdirSync(projectDir).filter(f => f.endsWith('.json'))
    const parsed = []
    for (const f of files) {
      try {
        const data = JSON.parse(readFileSync(join(projectDir, f), 'utf8'))
        const raw = data.tableName ?? data.tableName ?? basename(f, '.json')
        parsed.push(parseTableName(raw))
      } catch {
        // skip malformed JSON
      }
    }
    totalProjectFiles += files.length
    const sub = summarizeParsing(parsed)
    const okPct = parsed.length === 0 ? 0 : (100 * sub.ok / parsed.length).toFixed(1)
    console.log(`\n[${project}]  ${sub.ok}/${parsed.length} ok (${okPct}%)`)
    const top = Object.entries(sub.byScenario).sort((a, b) => b[1] - a[1]).slice(0, 6)
    for (const [sc, n] of top) console.log(`    ${sc.padEnd(10)} ${n}`)
    if (sub.unknown > 0) {
      console.log(`    unknown ${sub.unknown}  e.g. ${sub.sampleUnknown.slice(0, 3).map(u => `"${u.raw}"`).join(', ')}`)
    }
    allParsed.push(...parsed)
  }

  console.log('\n══ Aggregate ══')
  const total = summarizeParsing(allParsed)
  const okPct = allParsed.length === 0 ? 0 : (100 * total.ok / allParsed.length).toFixed(1)
  console.log(`Files scanned: ${totalProjectFiles}, parsed: ${allParsed.length}`)
  console.log(`Parsed OK:     ${total.ok} (${okPct}%)`)
  console.log(`Unknown:       ${total.unknown}`)
  console.log('\nScenario breakdown:')
  for (const [sc, n] of Object.entries(total.byScenario).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${sc.padEnd(10)} ${String(n).padStart(6)}`)
  }
  console.log('\nFormat breakdown:')
  for (const [f, n] of Object.entries(total.byFormat)) console.log(`  ${f.padEnd(12)} ${n}`)
  console.log('\nDepth breakdown (top 10):')
  const depthEntries = Object.entries(total.byDepth).sort((a, b) => b[1] - a[1]).slice(0, 10)
  for (const [d, n] of depthEntries) console.log(`  ${String(d).padEnd(12)} ${n}`)
  if (total.sampleUnknown.length > 0) {
    console.log('\nUnknown samples (up to 20):')
    for (const u of total.sampleUnknown) console.log(`  "${u.raw}"  → ${u.reason}`)
  }
}
