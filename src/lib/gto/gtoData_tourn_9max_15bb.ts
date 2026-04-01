// ============================================================
// GTO Preflop Range Data
// Source: Poker Coaching Charts
// Format: Tournament, 9-max, 15BB
// ============================================================
// 注意：15BB 超短籌碼，大量使用 All-In
// RFI 從 UTG+2 開始出現 All-In 選項
// SB 為 Raise/Call + All-In + Limp 混合結構
// ============================================================

export type GtoDatabase = Record<string, Record<string, string>>

const DB_TOURN_15BB: GtoDatabase = {

  // ============================================================
  // RAISE FIRST IN (RFI) — 錦標賽 9-max 15BB
  // ============================================================

  // ── UTG RFI — 16.7% (222/1326) — Raise 100% (與25BB相同) ──
  tourn_9max_15bb_UTG_RFI: {
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
  tourn_9max_15bb_UTG1_RFI: {
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

  // ── UTG+2 RFI — Raise: 15.1%, All-In: 2.3% (total ~17.4%) ──
  tourn_9max_15bb_UTG2_RFI: {
    // Raise
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
    // All-In
    'A2s':'allin','55':'allin',
  },

  // ── LJ (Lojack) RFI — Raise: 15.1%, All-In: 5.1% (total ~20.2%) ──
  tourn_9max_15bb_LJ_RFI: {
    // Raise
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
    // All-In
    '44':'allin','33':'allin','22':'allin', // 部分 A9s 也 jam
  },

  // ── HJ (Hijack) RFI — Raise: 16.0%, All-In: 7.1% (total ~23.1%) ──
  tourn_9max_15bb_HJ_RFI: {
    // Raise
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    '66':'r','55':'r',
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
    // All-In
    '44':'allin','33':'allin','22':'allin',
    'K5s':'allin','K4s':'allin','K3s':'allin','K2s':'allin',
  },

  // ── CO (Cutoff) RFI — Raise: 16.4%, All-In: 7.1% (total ~23.5%) ──
  tourn_9max_15bb_CO_RFI: {
    // Raise
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r',
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
    // All-In
    '44':'allin','33':'allin','22':'allin',
    'K5s':'allin','K4s':'allin','K3s':'allin','K2s':'allin',
    'Q6s':'allin',
  },

  // ── BTN (Button) RFI — Raise: 18.4%, All-In: 13.6% (total ~32%) ──
  tourn_9max_15bb_BTN_RFI: {
    // Raise
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'A7o':'r','A6o':'r','A5o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'K6s':'r',
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
    // All-In
    '44':'allin','33':'allin','22':'allin',
    'K5s':'allin','K4s':'allin','K3s':'allin','K2s':'allin',
    'Q5s':'allin','Q4s':'allin','Q3s':'allin','Q2s':'allin',
    'J5s':'allin',
  },

  // ── SB RFI — 15BB 特殊結構 ──
  // All-In: 23.4%, Call (limp): 60.3%, Fold: 16.3%
  tourn_9max_15bb_SB_RFI: {
    // All-In (直接 jam)
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    '99':'allin','88':'allin','77':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin',
    'AKo':'allin','AQo':'allin','AJo':'allin',
    'A9s':'allin','A8s':'allin','A7s':'allin','A6s':'allin','A5s':'allin',
    'A4s':'allin','A3s':'allin','A2s':'allin',
    'KQs':'allin','KJs':'allin','KTs':'allin',
    'K9s':'allin','K8s':'allin',
    // Limp/Call
    '66':'c','55':'c','44':'c','33':'c','22':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    'ATo':'c','A9o':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJo':'c','QTo':'c',
    'JTo':'c',
    'K7s':'c','K6s':'c','K5s':'c','K4s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c',
  },

  // ============================================================
  // FACING RFI vs UTG — 15BB
  // 15BB facing RFI：幾乎只有 All-In 或 Fold，極少 call
  // ============================================================

  // ── UTG+1/+2 vs UTG RFI — All-In: 7.1% ──
  tourn_9max_15bb_EP_vs_UTG_RFI: {
    'AA':'allin','KK':'allin','QQ':'allin',
    'AKs':'allin','AQs':'allin',
    'AKo':'allin',
    'JJ':'allin',
  },

  // ── LJ/HJ vs UTG RFI — All-In: 7.8% ──
  tourn_9max_15bb_LJ_HJ_vs_UTG_RFI: {
    'AA':'allin','KK':'allin','QQ':'allin',
    'AKs':'allin','AQs':'allin',
    'AKo':'allin',
    'JJ':'allin',
    'A5s':'allin','A4s':'allin',
  },

  // ── CO vs UTG RFI — All-In: 10.4% ──
  tourn_9max_15bb_CO_vs_UTG_RFI: {
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'TT':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
  },

  // ── BTN vs UTG RFI — All-In: 9.0%, Call: 4.1% ──
  tourn_9max_15bb_BTN_vs_UTG_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'A9s':'allin','A8s':'allin',
    'A5s':'allin','A4s':'allin',
    // Call
    '99':'c','88':'c',
    'ATs':'c',
    'KQs':'c',
  },

  // ── SB vs UTG RFI — All-In: 9.5%, Call: 11.2% ──
  tourn_9max_15bb_SB_vs_UTG_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'A5s':'allin','A4s':'allin',
    // Call
    '99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c',
  },

  // ── BB vs UTG RFI — All-In: 7.4%, Call: 70.9% ──
  tourn_9max_15bb_BB_vs_UTG_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin',
    'AKs':'allin','AQs':'allin',
    'AKo':'allin',
    // Wide call (90.6% of calling range)
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'AJs':'c','ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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
    '65s':'c','54s':'c',
    '43s':'c',
  },

  // ============================================================
  // FACING RFI vs MP (LJ/HJ) — 15BB
  // ============================================================

  // ── HJ vs LJ RFI — All-In: 10.4% ──
  tourn_9max_15bb_HJ_vs_LJ_RFI: {
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'TT':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
  },

  // ── CO vs LJ/HJ RFI — All-In: 11.6% ──
  tourn_9max_15bb_CO_vs_LJ_HJ_RFI: {
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    '99':'allin',
  },

  // ── BTN vs LJ/HJ RFI — All-In: 10.7%, Call: 3.8% ──
  tourn_9max_15bb_BTN_vs_LJ_HJ_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    'A9s':'allin','A8s':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    // Call
    '99':'c','88':'c',
    'ATs':'c',
  },

  // ── SB vs LJ/HJ RFI — All-In: 14.9%, Call: 5.7% ──
  tourn_9max_15bb_SB_vs_LJ_HJ_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin','99':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin',
    'AKo':'allin','AQo':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    '88':'allin',
    // Call
    '77':'c','66':'c',
    'A9s':'c',
    'KQs':'c',
  },

  // ── BB vs LJ/HJ RFI — All-In: 10.9%, Call: 66.5% ──
  tourn_9max_15bb_BB_vs_LJ_HJ_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin',
    'AKo':'allin',
    '99':'allin','88':'allin',
    'A5s':'allin','A4s':'allin',
    // Wide call
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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
    '65s':'c','54s':'c',
  },

  // ============================================================
  // FACING RFI vs LP (CO/BTN) — 15BB
  // ============================================================

  // ── BTN vs CO RFI — All-In: 14.0%, Call: 4.1% ──
  tourn_9max_15bb_BTN_vs_CO_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin','99':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin',
    'AKo':'allin','AQo':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    '88':'allin',
    // Call
    '77':'c','66':'c',
    'A9s':'c',
    'KQs':'c',
  },

  // ── SB vs CO RFI — All-In: 22.5% ──
  tourn_9max_15bb_SB_vs_CO_RFI: {
    // All-In 非常寬（SB位置保護 stack）
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin','99':'allin','88':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin','A9s':'allin',
    'AKo':'allin','AQo':'allin','AJo':'allin',
    'A8s':'allin','A7s':'allin','A6s':'allin','A5s':'allin','A4s':'allin','A3s':'allin',
    'KQs':'allin','KJs':'allin','KTs':'allin',
    '77':'allin','66':'allin',
  },

  // ── BB vs CO RFI — All-In: 16.0%, Call: 60.5% ──
  tourn_9max_15bb_BB_vs_CO_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin','99':'allin','88':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin',
    'AKo':'allin','AQo':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    // Wide call
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A2s':'c',
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
    '43s':'c',
  },

  // ── SB vs BTN RFI — All-In: 28.2% (BTN range寬，SB jam非常寬) ──
  tourn_9max_15bb_SB_vs_BTN_RFI: {
    // All-In 覆蓋幾乎所有有價值的手牌
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    '99':'allin','88':'allin','77':'allin','66':'allin','55':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin','A9s':'allin',
    'A8s':'allin','A7s':'allin','A6s':'allin','A5s':'allin','A4s':'allin',
    'A3s':'allin','A2s':'allin',
    'AKo':'allin','AQo':'allin','AJo':'allin','ATo':'allin',
    'KQs':'allin','KJs':'allin','KTs':'allin','K9s':'allin',
    'KQo':'allin','KJo':'allin',
    'QJs':'allin','QTs':'allin',
    'JTs':'allin',
    'T9s':'allin',
  },

  // ── BB vs BTN RFI — All-In: 17.6%, Call: 57.9% ──
  tourn_9max_15bb_BB_vs_BTN_RFI: {
    // All-In
    'AA':'allin','KK':'allin','QQ':'allin','JJ':'allin','TT':'allin',
    '99':'allin','88':'allin','77':'allin',
    'AKs':'allin','AQs':'allin','AJs':'allin','ATs':'allin',
    'AKo':'allin','AQo':'allin',
    'A5s':'allin','A4s':'allin','A3s':'allin',
    // Wide call
    '66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A2s':'c',
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
    '43s':'c',
    'K3o':'c','K4o':'c',
  },

  // ============================================================
  // FACING 3-BETS (from EP) — 15BB
  // 15BB RFI facing all-in：只有 Call 或 Fold
  // ============================================================

  // ── UTG RFI vs UTG+1-CO All-In — Call: 5.9% ──
  tourn_9max_15bb_UTG_RFI_vs_EP_allin: {
    'AA':'c','KK':'c','QQ':'c',
    'AKs':'c','AKo':'c',
    'JJ':'c',
  },

  // ── UTG RFI vs BTN All-In — Call: 9.0% ──
  tourn_9max_15bb_UTG_RFI_vs_BTN_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ── UTG RFI vs SB All-In — Call: 8.3% ──
  tourn_9max_15bb_UTG_RFI_vs_SB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ── UTG RFI vs BB All-In — Call: 7.2% ──
  tourn_9max_15bb_UTG_RFI_vs_BB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
  },

  // ── UTG+1 RFI vs UTG+2-CO All-In — Call: 6.9% ──
  tourn_9max_15bb_UTG1_RFI_vs_EP_allin: {
    'AA':'c','KK':'c','QQ':'c',
    'AKs':'c','AKo':'c',
    'JJ':'c',
  },

  // ── UTG+1 RFI vs BTN All-In — Call: 8.6% ──
  tourn_9max_15bb_UTG1_RFI_vs_BTN_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ── UTG+1 RFI vs SB All-In — Call: 8.7% ──
  tourn_9max_15bb_UTG1_RFI_vs_SB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ── UTG+1 RFI vs BB All-In — Call: 8.6% ──
  tourn_9max_15bb_UTG1_RFI_vs_BB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ── UTG+2 RFI vs All-In — Call: 6.9% ──
  tourn_9max_15bb_UTG2_RFI_vs_allin: {
    'AA':'c','KK':'c','QQ':'c',
    'AKs':'c','AKo':'c',
    'JJ':'c',
  },

  // ── LJ RFI vs All-In — Call: 6.0% ──
  tourn_9max_15bb_LJ_RFI_vs_allin: {
    'AA':'c','KK':'c','QQ':'c',
    'AKs':'c','AKo':'c',
    'JJ':'c',
  },

  // ── HJ RFI vs All-In — Call: 7.2% ──
  tourn_9max_15bb_HJ_RFI_vs_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
  },

  // ── CO RFI vs All-In — Call: 6.8% ──
  tourn_9max_15bb_CO_RFI_vs_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
  },

  // ── BTN RFI vs All-In — Call: 8.7% ──
  tourn_9max_15bb_BTN_RFI_vs_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c',
    'AKs':'c','AQs':'c','AKo':'c',
    'TT':'c',
  },

  // ============================================================
  // BLIND vs BLIND — 15BB
  // ============================================================

  // ── SB RFI (BvB) — All-In: 23.4%, Call (limp): 60.3% ──
  // (與 SB_RFI 相同結構，已在上方定義)

  // ── BB vs SB Limp — Raise: 33.9%, All-In: 8.1% ──
  tourn_9max_15bb_BB_vs_SB_limp: {
    // All-In
    'AA':'allin','KK':'allin',
    'AKs':'allin','AKo':'allin',
    // Raise
    'QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    'AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'KQo':'r','KJo':'r',
    'QJs':'r','QTs':'r','Q9s':'r',
    'QJo':'r',
    'JTs':'r',
    'T9s':'r',
    '77':'r','66':'r',
    // Check rest
  },

  // ── BB vs SB All-In — Call: 28.5% ──
  tourn_9max_15bb_BB_vs_SB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c',
    'AKo':'c','AQo':'c','AJo':'c',
    'KQs':'c','KJs':'c',
  },

  // ── SB Limp vs BB Raise — All-In: 7.5%, Call: 29.9% ──
  tourn_9max_15bb_SB_limp_vs_BB_raise: {
    // All-In (re-jam)
    'AA':'allin','KK':'allin','QQ':'allin',
    'AKs':'allin','AKo':'allin',
    // Call
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c',
    'AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'AQo':'c','AJo':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'KQo':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c',
    'T9s':'c',
  },

  // ── SB Limp vs BB All-In — Call: 14.5% ──
  tourn_9max_15bb_SB_limp_vs_BB_allin: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c','TT':'c','99':'c','88':'c',
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c',
    'AKo':'c','AQo':'c',
    'KQs':'c',
    '77':'c',
  },

  // ── BB vs SB Limp/Jam — Call: 14.9% ──
  tourn_9max_15bb_BB_vs_SB_limp_jam: {
    'AA':'c','KK':'c','QQ':'c','JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c',
    'AKo':'c','AQo':'c','AJo':'c',
    'KQs':'c',
  },

};

export default DB_TOURN_15BB;
