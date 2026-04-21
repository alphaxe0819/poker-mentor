// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// ============================================================
// GTO Preflop Range Data
// Source: Poker Coaching Charts
// Format: Tournament, 9-max, 25BB
// ============================================================

export type GtoDatabase = Record<string, Record<string, string>>

const DB_TOURN_25BB: GtoDatabase = {

  // ============================================================
  // RAISE FIRST IN (RFI) — 錦標賽 9-max 25BB
  // 注意：25BB 短籌碼，RFI 全部為純 raise（100%），無混合策略
  // ============================================================

  // ── UTG RFI — 16.7% (222/1326) — Raise 100% ──
  tourn_9max_25bb_UTG_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r',
    'AKo':'r','AQo':'r','AJo':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '98s':'r',
    'A8s':'r','A7s':'r','A5s':'r','A4s':'r',
    'K9s':'r',
    'ATo':'r',
  },

  // ── UTG+1 RFI — 18.7% (248/1326) — Raise 100% ──
  tourn_9max_25bb_UTG1_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '98s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r',
    'KQo':'r',
    '87s':'r',
  },

  // ── UTG+2 RFI — 20.8% (276/1326) — Raise 100% ──
  tourn_9max_25bb_UTG2_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r','66':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r',
    'QJs':'r','QTs':'r','Q9s':'r',
    'JTs':'r','J9s':'r',
    'T9s':'r','T8s':'r',
    '98s':'r','97s':'r',
    '87s':'r',
    'A6s':'r','A5s':'r','A4s':'r','A3s':'r',
    'KQo':'r','KJo':'r',
    '55':'r',
  },

  // ── LJ (Lojack) RFI — 24.1% (320/1326) — Raise 100% ──
  tourn_9max_25bb_LJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r','66':'r','55':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r','A6s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r',
    'JTs':'r','J9s':'r','J8s':'r',
    'T9s':'r','T8s':'r',
    '98s':'r','97s':'r',
    '87s':'r','86s':'r',
    '76s':'r',
    'A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'KQo':'r','KJo':'r','KTo':'r',
    '44':'r',
  },

  // ── HJ (Hijack) RFI — 27.8% (368/1326) — Raise 100% ──
  tourn_9max_25bb_HJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    '66':'r','55':'r','44':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r','K6s':'r',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r',
    'QJo':'r','QTo':'r',
    'JTs':'r','J9s':'r','J8s':'r',
    'JTo':'r',
    'T9s':'r','T8s':'r',
    '98s':'r','97s':'r',
    '87s':'r','86s':'r',
    '76s':'r','75s':'r',
    '65s':'r',
    '33':'r',
  },

  // ── CO (Cutoff) RFI — 34.2% (454/1326) — Raise 100% ──
  tourn_9max_25bb_CO_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'r','33':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r','K6s':'r',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r','K8o':'r',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r','Q7s':'r',
    'QJo':'r','QTo':'r','Q9o':'r',
    'JTs':'r','J9s':'r','J8s':'r','J7s':'r',
    'JTo':'r','J9o':'r',
    'T9s':'r','T8s':'r','T7s':'r',
    'T9o':'r',
    '98s':'r','97s':'r','96s':'r',
    '87s':'r','86s':'r','85s':'r',
    '76s':'r','75s':'r',
    '65s':'r','64s':'r',
    '54s':'r',
    '22':'r',
  },

  // ── BTN (Button) RFI — 46.3% (614/1326) — Raise 100% ──
  tourn_9max_25bb_BTN_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'r','33':'r','22':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'A7o':'r','A6o':'r','A5o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'K6s':'r','K5s':'r','K4s':'r','K3s':'r','K2s':'r',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r','K8o':'r','K7o':'r',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r','Q7s':'r','Q6s':'r',
    'QJo':'r','QTo':'r','Q9o':'r','Q8o':'r',
    'JTs':'r','J9s':'r','J8s':'r','J7s':'r','J6s':'r',
    'JTo':'r','J9o':'r','J8o':'r',
    'T9s':'r','T8s':'r','T7s':'r','T6s':'r',
    'T9o':'r','T8o':'r',
    '98s':'r','97s':'r','96s':'r','95s':'r',
    '98o':'r',
    '87s':'r','86s':'r','85s':'r',
    '76s':'r','75s':'r','74s':'r',
    '65s':'r','64s':'r',
    '54s':'r','53s':'r',
    '43s':'r',
  },

  // ── SB RFI — 25BB 特殊結構 ──
  // All-In: 1.8%, Raise/Call: 8.9%, Raise/Fold: 21.1%
  // Limp/Jam: 5.7%, Limp/Call: 20.8%, Limp/Fold: 23.5%, Fold: 18.1%
  tourn_9max_25bb_SB_RFI: {
    // All-In (jam直接全下)
    'AA':'allin','KK':'allin',
    // Raise for value (raise then call 3bet)
    'QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AKo':'r',
    // Raise/Fold (raise then fold to 3bet) — 主要是 bluff raises
    'A2s':'r','A3s':'r','A4s':'r','A5s':'r',
    'K2s':'r','K3s':'r','K4s':'r',
    'QJo':'r',
    // Limp/Jam (limp then jam over raise)
    '99':'c','88':'c',
    'AJs':'c','ATs':'c',
    // Limp/Call
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','86s':'c',
    '76s':'c',
    '65s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQo':'c','KJo':'c','KTo':'c',
    'QTo':'c',
    'JTo':'c',
  },

  // ============================================================
  // FACING RFI vs UTG — 25BB
  // 注意：25BB 有 All-In 選項（藍色）
  // ============================================================

  // ── UTG+1/+2 vs UTG RFI — 3bet: 5.1%, All-In: 3.6%, Call: 3.6% ──
  tourn_9max_25bb_EP_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin',
    'AJs':'allin',
    // Call
    'ATs':'c',
    'KQs':'c',
  },

  // ── LJ/HJ vs UTG RFI — 3bet: 3.8%, All-In: 1.2%, Call: 8.1% ──
  tourn_9max_25bb_LJ_HJ_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // All-In
    'JJ':'allin',
    // Call
    'TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
  },

  // ── CO vs UTG RFI — 3bet: 4.1%, All-In: 1.2%, Call: 9.8% ──
  tourn_9max_25bb_CO_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin',
    // Call
    'TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BTN vs UTG RFI — 3bet: 3.6%, All-In: 1.2%, Call: 14.0% ──
  tourn_9max_25bb_BTN_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin',
    // Call
    'TT':'c','99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs UTG RFI — 3bet: 4.8%, All-In: 3.6%, Call: 14.3% ──
  tourn_9max_25bb_SB_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin',
    'AJs':'allin',
    // Call
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BB vs UTG RFI — 3bet: 4.4%, All-In: 2.4%, Call: 86.1% ──
  tourn_9max_25bb_BB_vs_UTG_RFI: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin',
    // Wide call (90.7% of non-fold range)
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'AJs':'c','ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
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
  // FACING RFI vs MP (LJ/HJ)
  // ============================================================

  // ── HJ vs LJ RFI — 3bet: 4.4%, All-In: 1.7%, Call: 7.4% ──
  tourn_9max_25bb_HJ_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // All-In
    'JJ':'allin',
    // Call
    'TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c',
  },

  // ── CO vs LJ/HJ RFI — 3bet: 3.8%, All-In: 1.7%, Call: 10.0% ──
  tourn_9max_25bb_CO_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin',
    // Call
    'TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BTN vs LJ/HJ RFI — 3bet: 3.6%, All-In: 2.9%, Call: 13.7% ──
  tourn_9max_25bb_BTN_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin',
    // Call
    '99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs LJ/HJ RFI — 3bet: 5.0%, All-In: 3.6%, Call: 12.7% ──
  tourn_9max_25bb_SB_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin',
    'AJs':'allin',
    // Call
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── BB vs LJ/HJ RFI — 3bet: 5.0%, All-In: 5.3%, Call: 66.2% ──
  tourn_9max_25bb_BB_vs_LJ_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin','99':'allin',
    'AJs':'allin',
    // Wide call
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
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

  // ============================================================
  // FACING RFI vs LP (CO/BTN)
  // ============================================================

  // ── BTN vs CO RFI — 3bet: 3.2%, All-In: 5.9%, Call: 13.6% ──
  tourn_9max_25bb_BTN_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin','99':'allin',
    'AJs':'allin',
    // Call
    '88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── SB vs CO RFI — 3bet: 5.7%, All-In: 11.5%, Call: 9.8% ──
  tourn_9max_25bb_SB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In (很多手牌選擇直接 jam)
    'JJ':'allin','TT':'allin','99':'allin','88':'allin',
    'ATs':'allin','A9s':'allin',
    'KQs':'allin',
    // Call
    '77':'c','66':'c',
    'KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── BB vs CO RFI — 3bet: 5.8%, All-In: 8.4%, Call: 67.0% ──
  tourn_9max_25bb_BB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In
    'JJ':'allin','TT':'allin','99':'allin',
    'AJs':'allin','ATs':'allin',
    // Wide call
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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
    '65s':'c','54s':'c',
  },

  // ── SB vs BTN RFI — 3bet: 6.6%, All-In: 14.3%, Call: 6.0% ──
  tourn_9max_25bb_SB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b',
    'AKo':'3b','AQo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // All-In (BTN range寬，SB要jam更多)
    'JJ':'allin','TT':'allin','99':'allin','88':'allin',
    'ATs':'allin','A9s':'allin','A8s':'allin',
    'KQs':'allin','KJs':'allin',
    // Call
    '77':'c','66':'c',
    'KTs':'c',
    'QJs':'c',
  },

  // ── BB vs BTN RFI — 3bet: 8.4%, All-In: 11.0%, Call: 66.1% ──
  tourn_9max_25bb_BB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b',
    'AKo':'3b','AQo':'3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b','A2s':'mr:30_3b',
    // All-In
    'TT':'allin','99':'allin','88':'allin',
    'ATs':'allin','A9s':'allin',
    'KQs':'allin',
    // Wide call
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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
    'K3o':'c','K4o':'c',
  },

  // ============================================================
  // BLIND vs BLIND — 25BB
  // ============================================================

  // ── SB RFI (BvB) — 25BB 特殊結構 ──
  // All-In: 1.8%, Raise/Call: 8.9%, Raise/Fold: 21.1%
  // Limp/Jam: 5.7%, Limp/Call: 20.8%, Limp/Fold: 23.5%
  // (與 SB_RFI 相同，已在上方定義)

  // ── BB vs SB Limp — Raise: 36.8%, All-In: 4.1% ──
  tourn_9max_25bb_BB_vs_SB_limp: {
    // All-In
    'AA':'allin','KK':'allin',
    // Raise (大部分有價值的手牌)
    'QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'KQo':'r','KJo':'r','KTo':'r',
    'QJs':'r','QTs':'r','Q9s':'r',
    'QJo':'r','QTo':'r',
    'JTs':'r','J9s':'r',
    'JTo':'r',
    'T9s':'r',
    '98s':'r',
    '66':'r','55':'r',
    // Check rest
  },

  // ── BB vs SB Raise — All-In: 10.6%, Call: 53.5% ──
  tourn_9max_25bb_BB_vs_SB_RFI: {
    // All-In (對SB的raise，BB用jam保護)
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin','AQo':'allin',
    'A5s':'allin','A4s':'allin',
    // Wide call
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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
  },

  // ── BB vs SB Limp/All-In — Call: 12.1%, Fold: 24.7% ──
  // (SB limp 然後 jam 時，BB 的應對)
  tourn_9max_25bb_BB_vs_SB_limp_jam: {
    // Call (約32.8%勝率以上)
    'AA':'c','KK':'c','QQ':'c','JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c',
    'AKo':'c','AQo':'c','AJo':'c',
    'KQs':'c','KJs':'c',
    // Fold rest
  },

};

export default DB_TOURN_25BB;
