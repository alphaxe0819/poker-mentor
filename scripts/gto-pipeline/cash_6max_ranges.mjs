/**
 * Cash 6-max 100BB preflop ranges — mirrored from
 * src/lib/gto/gtoData_cash_6max_100bb.ts into mjs for solver input generation.
 *
 * Exposes `extractTexasSolver(key, mode)` that returns comma-separated hand
 * strings with weights (e.g. "AA,KK,AKs:0.5") consumable by TexasSolver
 * `set_range_ip` / `set_range_oop`.
 *
 * mode:
 *   'raise'   — only the raise portion of the key's range (opener / 3bettor / 4bettor)
 *   'call'    — only the call portion (caller / call-vs-3bet / call-vs-4bet)
 *   'active'  — raise + call (everything that continues past preflop)
 */

const RANKS = ['A','K','Q','J','T','9','8','7','6','5','4','3','2']
export const ALL_HANDS = []
for (let i = 0; i < 13; i++) {
  for (let j = 0; j < 13; j++) {
    if (i === j) ALL_HANDS.push(`${RANKS[i]}${RANKS[j]}`)
    else if (i < j) ALL_HANDS.push(`${RANKS[i]}${RANKS[j]}s`)
    else ALL_HANDS.push(`${RANKS[j]}${RANKS[i]}o`)
  }
}

// ── makeRange helpers (mirrored from src/lib/gto/helpers.ts) ──

function makeRange(raises, calls = [], mixed = {}) {
  const m = {}
  const rSet = new Set(raises)
  const cSet = new Set(calls)
  for (const h of ALL_HANDS) {
    if (rSet.has(h)) m[h] = 'r'
    else if (mixed[h]) m[h] = mixed[h]
    else if (cSet.has(h)) m[h] = 'c'
  }
  return m
}

function makeRangeDefaultCall(raises, folds, mixed = {}) {
  const m = {}
  const rSet = new Set(raises)
  const fSet = new Set(folds)
  for (const h of ALL_HANDS) {
    if (rSet.has(h)) m[h] = 'r'
    else if (mixed[h]) m[h] = mixed[h]
    else if (!fSet.has(h)) m[h] = 'c'
  }
  return m
}

function makeRangeDefaultRaise(folds, calls = [], mixed = {}) {
  const m = {}
  const fSet = new Set(folds)
  const cSet = new Set(calls)
  for (const h of ALL_HANDS) {
    if (fSet.has(h)) {}
    else if (mixed[h]) m[h] = mixed[h]
    else if (cSet.has(h)) m[h] = 'c'
    else m[h] = 'r'
  }
  return m
}

// ── Range definitions (copied verbatim from gtoData_cash_6max_100bb.ts) ──

export const RANGES = {
  UTG_open: makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo',
     'KQs','KJs','KTs','K9s','KQo','KJo',
     'QJs','QTs','Q9s','QJo',
     'JTs','J9s','T9s','T8s','98s','97s','87s','86s','76s','65s','54s'],
    [],
    { '66':'mr:80','55':'mr:60','44':'mr:40','33':'mr:30','22':'mr:20',
      'K8s':'mr:40','Q8s':'mr:30','J8s':'mr:40',
      'A9o':'mr:60','A8o':'mr:30','KTo':'mr:60','QTo':'mr:40','JTo':'mr:50' }
  ),

  HJ_open: makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','K9s','K8s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','QJo',
     'JTs','J9s','T9s','T8s','98s','97s','87s','86s','76s','65s','54s'],
    [],
    { '55':'mr:80','44':'mr:60','33':'mr:40','22':'mr:30',
      'Q8s':'mr:50','J8s':'mr:60',
      'A8o':'mr:50','QTo':'mr:60','JTo':'mr:70' }
  ),

  CO_open: makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o','A8o',
     'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','Q8s','Q7s','QJo','QTo',
     'JTs','J9s','J8s','JTo','J9o',
     'T9s','T8s','T7s','T9o',
     '98s','97s','96s','98o',
     '87s','86s','87o','76s','75s','65s','64s','54s','53s','43s'],
    [],
    { '33':'mr:70','22':'mr:50','Q9o':'mr:40','K9o':'mr:50' }
  ),

  BTN_open: makeRangeDefaultRaise(
    ['72o','73o','74o','75o','82o','83o','84o','92o','93o','94o',
     '32o','42o','43o','52o','53o','62o','63o','64o',
     '72s','82s','92s','32s']
  ),

  SB_open: makeRange(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AQs','AJs','ATs','A9s','A8s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','KQo','KJo',
     'QJs','QTs','JTs','J9s','T9s','T8s','98s','97s','87s','76s','65s','54s'],
    ['77','66','55','44','33','22',
     'A7s','A6s','A5s','A4s','A3s','A2s',
     'K9s','K8s','Q9s','Q8s','J8s','T7s','86s','75s','64s','53s',
     'KTo','QTo','JTo',
     'A8o','A7o','K9o','Q9o','J9o','T9o']
  ),

  BB_vs_open: makeRangeDefaultCall(
    ['AA','KK','QQ','JJ',
     'AKs','AQs','AJs','AKo','AQo',
     'KQs','A5s','A4s','54s','43s'],
    ['72o','73o','82o','83o','92o','93o','32o','42o','52o','62o']
  ),

  HJ_vs_UTG: makeRange([],
    ['JJ','TT','ATs','KQs','QJs'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b',
      'A5s':'mr:30_3b','A4s':'mr:30_3b' }),

  CO_vs_UTG: makeRange([],
    ['JJ','TT','99','ATs','A9s','KQs','KJs','QJs','QTs','JTs','T9s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b',
      'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b' }),

  CO_vs_HJ: makeRange([],
    ['JJ','TT','99','ATs','A9s','KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b','AQo':'mr:30_3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b','A3s':'mr:30_3b' }),

  BTN_vs_UTG: makeRange([],
    ['JJ','TT','99','88','77','AJs','ATs','A9s',
     'KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b',
      'AKo':'3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b' }),

  BTN_vs_HJ: makeRange([],
    ['JJ','TT','99','88','77','AJs','ATs','A9s','A8s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','86s','76s','65s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b','AQo':'mr:40_3b',
      'A5s':'mr:60_3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
      'K9s':'mr:30_3b' }),

  BTN_vs_CO: makeRange([],
    ['TT','99','88','77','66','AJs','ATs','A9s','A8s','A7s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s'],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b','AQo':'3b',
      'A5s':'mr:70_3b','A4s':'mr:60_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'K5s':'mr:30_3b','Q9s':'mr:30_3b','86s':'mr:30_3b' }),

  SB_vs_UTG: makeRange([], [],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b',
      'AKo':'3b',
      'A5s':'mr:40_3b','A4s':'mr:30_3b' }),

  SB_vs_HJ: makeRange([], [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:60_3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b','AQo':'mr:30_3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b','A3s':'mr:30_3b' }),

  SB_vs_CO: makeRange([], [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:70_3b','TT':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:40_3b',
      'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
      'A5s':'mr:60_3b','A4s':'mr:50_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'KQs':'mr:50_3b','K5s':'mr:30_3b',
      'Q9s':'mr:30_3b','76s':'mr:30_3b' }),

  SB_vs_BTN: makeRange([], [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:60_3b','99':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:50_3b','A8s':'mr:30_3b',
      'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'mr:40_3b',
      'A5s':'3b','A4s':'mr:70_3b','A3s':'mr:50_3b','A2s':'mr:40_3b',
      'KQs':'3b','KJs':'mr:60_3b','KTs':'mr:40_3b',
      'KQo':'mr:40_3b',
      'QJs':'mr:40_3b','Q9s':'mr:30_3b',
      'J9s':'mr:30_3b','76s':'mr:40_3b','65s':'mr:30_3b','54s':'mr:30_3b' }),

  BB_vs_UTG: makeRangeDefaultCall(
    ['AA','KK','QQ','AKs','AQs','AKo'],
    ['72o','73o','74o','82o','83o','84o','92o','93o',
     '32o','42o','43o','52o','53o','62o','63o','64o',
     'K2o','K3o','K4o','Q2o','Q3o','Q4o','Q5o','J2o','J3o','J4o',
     'T2o','T3o','T4o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b' }),

  BB_vs_HJ: makeRangeDefaultCall(
    ['AA','KK','QQ','JJ',
     'AKs','AQs','AJs',
     'AKo','AQo'],
    ['72o','73o','74o','82o','83o','84o','92o','93o',
     '32o','42o','43o','52o','53o','62o','63o',
     'K2o','K3o','Q2o','Q3o','J2o','J3o','T2o','T3o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b' }),

  BB_vs_CO: makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT',
     'AKs','AQs','AJs','ATs',
     'AKo','AQo',
     'KQs'],
    ['72o','73o','82o','83o','92o','93o',
     '32o','42o','52o','62o',
     'K2o','Q2o','J2o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b','43s':'mr:30_3b' }),

  BB_vs_BTN: makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','ATs','A9s',
     'AKo','AQo','AJo',
     'KQs','KJs'],
    ['72o','73o','82o','83o','92o',
     '32o','42o','52o','62o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b','43s':'mr:30_3b' }),

  BB_vs_SB: makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AQs','AJs','ATs','A9s','A8s',
     'AKo','AQo','AJo','ATo',
     'KQs','KJs','KTs',
     'QJs'],
    ['72o','73o','82o','32o','42o','52o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
      '54s':'mr:30_3b','43s':'mr:30_3b','65s':'mr:30_3b' }),

  UTG_vs_3bet: makeRange([],
    ['QQ','JJ','TT','AQs','AJs','ATs','KQs'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'A5s':'mr:30_4b' }),

  HJ_vs_3bet: makeRange([],
    ['QQ','JJ','TT','99','AQs','AJs','ATs','KQs','KJs','QJs'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:30_4b',
      'A5s':'mr:40_4b','A4s':'mr:30_4b' }),

  CO_vs_3bet: makeRange([],
    ['QQ','JJ','TT','99','AQs','AJs','ATs','A9s','KQs','KJs','KTs',
     'QJs','QTs','JTs','T9s','98s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:40_4b',
      'A5s':'mr:50_4b','A4s':'mr:40_4b','A3s':'mr:30_4b' }),

  BTN_vs_3bet: makeRange([],
    ['QQ','JJ','TT','99','88','AQs','AJs','ATs','A9s','A8s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','87s','76s','65s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:50_4b','AJo':'mr:30_4b',
      'A5s':'mr:60_4b','A4s':'mr:50_4b','A3s':'mr:40_4b','A2s':'mr:30_4b' }),

  SB_vs_3bet: makeRange([],
    ['QQ','JJ','TT','99','88','77',
     'AQs','AJs','ATs','A9s','A8s','A7s','A6s',
     'KQs','KJs','KTs','K9s',
     'QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','76s','65s','54s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:60_4b','AJo':'mr:30_4b',
      'A5s':'mr:70_4b','A4s':'mr:60_4b','A3s':'mr:40_4b','A2s':'mr:30_4b' }),
}

// ── Action parser ──
// Values in RANGES[key] are:
//   'r'        — raise 100%
//   'c'        — call 100%
//   '3b'       — 3bet 100%
//   '4b'       — 4bet 100%
//   'mr:N'     — mixed: N% raise, (100-N)% call (open ranges)
//   'mr:N_3b'  — mixed: N% 3bet, (100-N)% call (vs open ranges)
//   'mr:N_4b'  — mixed: N% 4bet, (100-N)% call (vs 3bet ranges)
// undefined    — fold

// 'r' / '3b' / '4b' all mean "raise action" in context of the key
// (open-raise for *_open, 3bet for *_vs_open, 4bet for *_vs_3bet).
// The extractor doesn't need to know which — caller picks the right key.
function parseAction(val) {
  if (!val) return { fold: 1 }
  if (val === 'r' || val === '3b' || val === '4b') return { raise: 1 }
  if (val === 'c') return { call: 1 }
  const m = /^mr:(\d+)(?:_(3b|4b))?$/.exec(val)
  if (m) {
    const pct = parseInt(m[1], 10) / 100
    return { raise: pct, call: 1 - pct }
  }
  return { fold: 1 }
}

/**
 * Extract a TexasSolver-compatible range string from a range key.
 *
 * @param {string} key                      — key in RANGES
 * @param {'raise'|'call'|'active'} mode    — raise/call portion, or both
 * @returns {string}                        — "AA,KK:0.5,AKs,..."
 */
export function extractTexasSolver(key, mode) {
  const range = RANGES[key]
  if (!range) throw new Error(`Unknown range key: ${key}`)
  const parts = []
  for (const hand of ALL_HANDS) {
    const actions = parseAction(range[hand])
    let weight = 0
    if (mode === 'raise') weight = actions.raise || 0
    else if (mode === 'call') weight = actions.call || 0
    else if (mode === 'active') weight = (actions.raise || 0) + (actions.call || 0)
    if (weight <= 0) continue
    if (weight >= 0.999) parts.push(hand)
    else parts.push(`${hand}:${weight.toFixed(2)}`)
  }
  return parts.join(',')
}

// Post-flop action order: lower index = acts first (OOP). Higher index = IP.
const POSTFLOP_ORDER = { SB: 0, BB: 1, UTG: 2, HJ: 3, CO: 4, BTN: 5 }

/**
 * Build an SRP matchup's IP/OOP ranges from position combo.
 * Determines IP/OOP from post-flop action order (NOT pre-flop open order).
 * opener_pos raises preflop, caller_pos calls preflop.
 */
export function srpRangePair(opener_pos, caller_pos) {
  const openerKey = `${opener_pos}_open`
  const callerKey = `${caller_pos}_vs_${opener_pos}`
  if (!RANGES[openerKey]) throw new Error(`No open range: ${openerKey}`)
  if (!RANGES[callerKey]) throw new Error(`No caller range: ${callerKey}`)
  const openerRange = extractTexasSolver(openerKey, 'raise')
  const callerRange = extractTexasSolver(callerKey, 'call')
  const openerIsIP = POSTFLOP_ORDER[opener_pos] > POSTFLOP_ORDER[caller_pos]
  return openerIsIP
    ? { ip_range: openerRange, oop_range: callerRange }
    : { ip_range: callerRange, oop_range: openerRange }
}

/**
 * 3BP range pair:
 * opener opens, threebettor 3bets, opener calls.
 * IP = whoever has later position postflop (not preflop).
 * Returns {ip_range, oop_range, ip_pos, oop_pos}
 */
export function threeBPRangePair(opener_pos, threebettor_pos) {
  const openerVs3betKey = `${opener_pos}_vs_3bet`
  const threebetKey = `${threebettor_pos}_vs_${opener_pos}`
  if (!RANGES[openerVs3betKey]) throw new Error(`No vs-3bet range: ${openerVs3betKey}`)
  if (!RANGES[threebetKey]) throw new Error(`No 3bet range: ${threebetKey}`)
  const openerCall = extractTexasSolver(openerVs3betKey, 'call')
  const threebetRange = extractTexasSolver(threebetKey, 'raise')
  // IP/OOP determined by post-flop position
  const a = POSTFLOP_ORDER[opener_pos], b = POSTFLOP_ORDER[threebettor_pos]
  if (a > b) {
    return { ip_pos: opener_pos, oop_pos: threebettor_pos, ip_range: openerCall, oop_range: threebetRange }
  } else {
    return { ip_pos: threebettor_pos, oop_pos: opener_pos, ip_range: threebetRange, oop_range: openerCall }
  }
}
