// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// ============================================================
// GTO Preflop Range Data
// Source: Poker Coaching Charts
// Format: Tournament, 9-max, 75BB
// ============================================================

export type GtoDatabase = Record<string, Record<string, string>>

const DB_TOURN_75BB: GtoDatabase = {

  // ============================================================
  // RAISE FIRST IN (RFI) — 錦標賽 9-max 75BB
  // ============================================================

  // ── UTG RFI — 13.7% (182/1326) ──
  tourn_9max_75bb_UTG_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r',
    'AKo':'r','AQo':'r',
    'KQs':'r','KJs':'r',
    'QJs':'r',
    'JTs':'r',
    'T9s':'r',
    'A9s':'mr:50','A8s':'mr:30',
    'A5s':'r','A4s':'mr:50',
    'KTs':'mr:50',
    'AJo':'mr:50',
    '88':'mr:50',
  },

  // ── UTG+1 RFI — 16.3% (216/1326) ──
  tourn_9max_75bb_UTG1_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r',
    'AKo':'r','AQo':'r','AJo':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '98s':'r',
    'A8s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30',
    'K9s':'mr:50',
    'ATo':'mr:50',
    '77':'mr:50',
  },

  // ── UTG+2 RFI — 19.2% (254/1326) ──
  tourn_9max_75bb_UTG2_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '98s':'r',
    'A7s':'mr:50','A6s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30','A2s':'mr:30',
    '66':'mr:50',
    '87s':'mr:30',
    'Q9s':'mr:30',
    'J9s':'mr:30',
    'K8s':'mr:30',
    'KQo':'mr:50',
  },

  // ── LJ (Lojack) RFI — 23.5% (312/1326) ──
  tourn_9max_75bb_LJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r','66':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'A6s':'r','A5s':'r','A4s':'r','A3s':'mr:50','A2s':'mr:30',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'mr:50',
    'KQo':'r','KJo':'mr:50',
    'QJs':'r','QTs':'r','Q9s':'mr:50',
    'QJo':'mr:30',
    'JTs':'r','J9s':'mr:50',
    'T9s':'r','T8s':'mr:30',
    '98s':'r','97s':'mr:30',
    '87s':'mr:30',
    '55':'mr:30',
  },

  // ── HJ (Hijack) RFI — 27.9% (370/1326) ──
  tourn_9max_75bb_HJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    '66':'r','55':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'mr:50',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'mr:30',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'mr:30',
    'KQo':'r','KJo':'r','KTo':'mr:50',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'mr:30',
    'QJo':'r','QTo':'mr:30',
    'JTs':'r','J9s':'r','J8s':'mr:30',
    'JTo':'mr:30',
    'T9s':'r','T8s':'mr:50',
    'T9o':'mr:30',
    '98s':'r','97s':'mr:50',
    '87s':'mr:50','86s':'mr:30',
    '76s':'mr:30',
    '44':'mr:30',
  },

  // ── CO (Cutoff) RFI — 37.3% (494/1326) ──
  tourn_9max_75bb_CO_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'mr:50',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'mr:50',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'mr:50',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'mr:50',
    'QJo':'r','QTo':'mr:50','Q9o':'mr:30',
    'JTs':'r','J9s':'r','J8s':'mr:50',
    'JTo':'r','J9o':'mr:30',
    'T9s':'r','T8s':'r','T7s':'mr:30',
    'T9o':'mr:30',
    '98s':'r','97s':'r','96s':'mr:30',
    '87s':'r','86s':'mr:50',
    '76s':'r','75s':'mr:30',
    '65s':'mr:50',
    '54s':'mr:30',
  },

  // ── BTN (Button) RFI — 54.8% (726/1326) ──
  tourn_9max_75bb_BTN_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'r','33':'r','22':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'A7o':'r','A6o':'mr:50','A5o':'mr:30',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'K6s':'r','K5s':'mr:50','K4s':'mr:30','K3s':'mr:30','K2s':'mr:30',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r','K8o':'mr:50','K7o':'mr:30',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r','Q7s':'r','Q6s':'mr:50',
    'QJo':'r','QTo':'r','Q9o':'r','Q8o':'mr:30',
    'JTs':'r','J9s':'r','J8s':'r','J7s':'mr:50',
    'JTo':'r','J9o':'r','J8o':'mr:30',
    'T9s':'r','T8s':'r','T7s':'r','T6s':'mr:30',
    'T9o':'r','T8o':'mr:50',
    '98s':'r','97s':'r','96s':'r',
    '98o':'mr:50',
    '87s':'r','86s':'r','85s':'mr:50',
    '87o':'mr:30',
    '76s':'r','75s':'r','74s':'mr:30',
    '65s':'r','64s':'mr:50',
    '54s':'r','53s':'mr:30',
    '43s':'mr:30',
  },

  // ── SB RFI — Raise: 15.5%, Call: 69.1%, Fold: 15.4% ──
  tourn_9max_75bb_SB_RFI: {
    // Raise for value
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','AKo':'r','AQo':'r',
    // Raise as bluff
    'A2s':'r','A3s':'r','A4s':'r','A5s':'r',
    'K2s':'r','K3s':'r',
    // Limp
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTo':'c','J9o':'c',
    'T9o':'c',
  },

  // ============================================================
  // FACING RFI vs UTG
  // ============================================================

  // ── UTG+1/UTG+2 vs UTG RFI — 3bet: 5.6%, Call: 3.0% ──
  tourn_9max_75bb_EP_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c',
    'ATs':'c',
    'KQs':'c',
  },

  // ── LJ/HJ vs UTG RFI — 3bet: 5.3%, Call: 9.4% ──
  tourn_9max_75bb_LJ_HJ_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── CO vs UTG RFI — 3bet: 5.3%, Call: 13.0% ──
  tourn_9max_75bb_CO_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── BTN vs UTG RFI — 3bet: 5.3%, Call: 16.3% ──
  tourn_9max_75bb_BTN_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs UTG RFI — 3bet: 5.4%, Call: 14.0% ──
  tourn_9max_75bb_SB_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BB vs UTG RFI — 3bet: 5.4%, Call: 50.2% ──
  tourn_9max_75bb_BB_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // Wide call
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c',
    'AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'AJo':'c','ATo':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'KQo':'c','KJo':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'QJo':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c',
    '76s':'c',
    '65s':'c','54s':'c',
  },

  // ============================================================
  // FACING RFI vs LJ/HJ (MP)
  // ============================================================

  // ── HJ vs LJ RFI — 3bet: 7.4%, Call: 8.9% ──
  tourn_9max_75bb_HJ_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── CO vs LJ/HJ RFI — 3bet: 7.4%, Call: 11.6% ──
  tourn_9max_75bb_CO_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── BTN vs LJ/HJ RFI — 3bet: 8.9%, Call: 15.7% ──
  tourn_9max_75bb_BTN_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs LJ/HJ RFI — 3bet: 8.3%, Call: 13.9% ──
  tourn_9max_75bb_SB_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BB vs LJ/HJ RFI — 3bet: 7.4%, Call: 56.4% ──
  tourn_9max_75bb_BB_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // Wide call
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'KQo':'c','KJo':'c','KTo':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'QJo':'c','QTo':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','54s':'c',
  },

  // ============================================================
  // FACING RFI vs LP (CO/BTN)
  // ============================================================

  // ── BTN vs CO RFI — 3bet: 11.6%, Call: 16.6% ──
  tourn_9max_75bb_BTN_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs CO RFI — 3bet: 12.1%, Call: 15.2% ──
  tourn_9max_75bb_SB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── BB vs CO RFI — 3bet: 11.8%, Call: 62.9% ──
  tourn_9max_75bb_BB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    // Wide call
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','54s':'c',
  },

  // ── SB vs BTN RFI — 3bet: 12.1%, Call: 15.2% ──
  tourn_9max_75bb_SB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c',
    'ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── BB vs BTN RFI — 3bet: 17.0%, Call: 64.9% ──
  tourn_9max_75bb_BB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b','A2s':'mr:30_3b',
    'KQs':'mr:30_3b',
    // Wide call
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c','K8o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    '43s':'c',
  },

  // ============================================================
  // BLIND vs BLIND
  // ============================================================

  // ── SB RFI (BvB) — Raise: 15.5%, Limp: 69.1% (same as SB_RFI above) ──

  // ── BB vs SB Limp — Raise: 43.3% ──
  tourn_9max_75bb_BB_vs_SB_limp: {
    // Raise majority of range
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'KQo':'r','KJo':'r',
    'QJs':'r','QTs':'r',
    'QJo':'r',
    'JTs':'r',
    'T9s':'mr:50','T8s':'mr:30',
    '98s':'mr:50',
    '87s':'mr:50','86s':'mr:30',
    '76s':'mr:50',
    '65s':'mr:30',
    '55':'mr:50','66':'mr:50',
    // Check rest
  },

  // ── BB vs SB Raise — Raise: 12.2%, Call: 54.0% ──
  tourn_9max_75bb_BB_vs_SB_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b','99':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'3b','A8s':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'3b','A9o':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'3b','KJs':'3b','KTs':'mr:50_3b',
    'QJs':'mr:50_3b',
    // Wide call
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A7s':'c','A6s':'c',
    'A8o':'c','A7o':'c','A6o':'c','A5o':'c','A4o':'c',
    'K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c','K8o':'c',
    'Q9s':'c','Q8s':'c','Q7s':'c','Q6s':'c',
    'QTo':'c','Q9o':'c',
    'J9s':'c','J8s':'c','J7s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    '43s':'c',
  },

};

export default DB_TOURN_75BB;
