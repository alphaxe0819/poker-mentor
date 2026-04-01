// ============================================================
// GTO Preflop Range Data
// Source: Poker Coaching Charts
// Format: Tournament, 9-max, 100BB
// ============================================================

export type GtoDatabase = Record<string, Record<string, string>>

const DB_TOURN_100BB: GtoDatabase = {

  // ============================================================
  // RAISE FIRST IN (RFI) — 錦標賽 9-max 100BB
  // ============================================================

  // ── UTG RFI — 10.1% (134/1326) ──
  tourn_9max_100bb_UTG_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r',
    'AKo':'r','AQo':'r',
    'KQs':'r','KJs':'r',
    'QJs':'r',
    'JTs':'r',
    'A9s':'mr:50','A8s':'mr:30',
    'A5s':'mr:50','A4s':'mr:30',
    'KTs':'mr:50',
    'AJo':'mr:50',
    'T9s':'mr:30',
    '99':'mr:50',
  },

  // ── UTG+1 RFI — 14.3% (190/1326) ──
  tourn_9max_100bb_UTG1_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r',
    'AKo':'r','AQo':'r','AJo':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    'A8s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30',
    'K9s':'mr:50',
    'ATo':'mr:50',
    '88':'mr:50',
    '98s':'mr:30',
  },

  // ── UTG+2 RFI — 15.7% (208/1326) ──
  tourn_9max_100bb_UTG2_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '98s':'r',
    'A7s':'mr:50','A6s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30','A2s':'mr:30',
    '77':'mr:50',
    '87s':'mr:30',
    'Q9s':'mr:30',
    'J9s':'mr:30',
    'K8s':'mr:30',
    'KQo':'mr:50',
  },

  // ── LJ (Lojack) RFI — 18.3% (242/1326) ──
  tourn_9max_100bb_LJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'mr:50',
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
  },

  // ── HJ (Hijack) RFI — 21.3% (282/1326) ──
  tourn_9max_100bb_HJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r','66':'mr:50',
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
    '55':'mr:30',
  },

  // ── CO (Cutoff) RFI — 27.0% (358/1326) ──
  tourn_9max_100bb_CO_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'mr:50',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'mr:30',
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
  },

  // ── BTN (Button) RFI — 51.1% (678/1326) ──
  tourn_9max_100bb_BTN_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'r','33':'r','22':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'A7o':'r','A6o':'mr:50','A5o':'mr:30',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'K6s':'r','K5s':'mr:50','K4s':'mr:50','K3s':'mr:30','K2s':'mr:30',
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

  // ── SB RFI / Raise as Bluff / Limp ──
  // Raise for Value: 8.9%, Raise as Bluff: 13.0%, Limp: 48.6%
  tourn_9max_100bb_SB_RFI: {
    // Raise for value
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','AKo':'r','AQo':'r',
    // Raise as bluff
    'A2s':'r','A3s':'r','A4s':'r','A5s':'r',
    'K2s':'r','K3s':'r',
    'QJo':'mr:30',
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
    'QTo':'c','Q9o':'c',
    'JTo':'c','J9o':'c',
    'T9o':'c',
  },

  // ============================================================
  // FACING RFI: EP/MP (9-max specific positions)
  // ============================================================

  // ── UTG+1 vs UTG ── (3bet: 2.6%+1.5%, Call: 3.3%, Fold: 92.6%)
  tourn_9max_100bb_UTG1_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // Call
    'JJ':'c','TT':'c','ATs':'c','KQs':'c',
  },

  // ── UTG+2 vs UTG/UTG+1 ── (same as UTG+1 vs UTG)
  tourn_9max_100bb_UTG2_vs_EP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','ATs':'c','KQs':'c',
  },

  // ── LJ vs UTG/UTG+1 ── (3bet: 2.6%+1.8%, Call: 4.1%, Fold: 91.6%)
  tourn_9max_100bb_LJ_vs_EP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── LJ vs UTG+2 ── (3bet: 2.6%+2.4%, Call: 4.5%, Fold: 90.5%)
  tourn_9max_100bb_LJ_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── HJ vs UTG ── (3bet: 2.6%+1.8%, Call: 4.1%, Fold: 91.6%)
  tourn_9max_100bb_HJ_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
  },

  // ── HJ vs UTG+1 ── (3bet similar)
  tourn_9max_100bb_HJ_vs_UTG1_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  // ── HJ vs UTG+2 ── (3bet: 2.6%+3.0%, Call: 5.3%, Fold: 89.1%)
  tourn_9max_100bb_HJ_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── HJ vs LJ ── (3bet: 4.4%+5.9%, Call: 5.9%, Fold: 85.2%)
  tourn_9max_100bb_HJ_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b','A2s':'mr:30_3b',
    'TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c',
  },

  // ============================================================
  // FACING RFI: CO
  // ============================================================

  // ── CO vs UTG/UTG+1 ── (3bet: 2.9%+2.4%, Call: 5.7%, Fold: 89%)
  tourn_9max_100bb_CO_vs_EP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c',
  },

  // ── CO vs UTG+2 ── (3bet: 2.9%+3.6%, Call: 6.2%, Fold: 87.3%)
  tourn_9max_100bb_CO_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c',
  },

  // ── CO vs LJ ── (3bet: 4.4%+4.2%, Call: 6.0%, Fold: 85.4%)
  tourn_9max_100bb_CO_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b','A2s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c',
  },

  // ── CO vs HJ ── (3bet: 4.4%+6.0%, Call: 6.3%, Fold: 83.3%)
  tourn_9max_100bb_CO_vs_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:50_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'A9s':'c','A8s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c',
  },

  // ============================================================
  // FACING RFI: BUTTON
  // ============================================================

  // ── BTN vs UTG ── (3bet: 2.6%+3.6%, Call: 8.1%, Fold: 85.7%)
  tourn_9max_100bb_BTN_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c','76s':'c',
  },

  // ── BTN vs UTG+1 ── (3bet: 2.6%+3.9%, Call: 8.7%, Fold: 84.8%)
  tourn_9max_100bb_BTN_vs_UTG1_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c','76s':'c',
  },

  // ── BTN vs UTG+2 ── (3bet: 3.8%+3.9%, Call: 10.3%, Fold: 82.1%)
  tourn_9max_100bb_BTN_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c','76s':'c',
  },

  // ── BTN vs LJ ── (3bet: 3.8%+4.5%, Call: 10.6%, Fold: 81.1%)
  tourn_9max_100bb_BTN_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c',
  },

  // ── BTN vs HJ ── (3bet: 4.1%+5.1%, Call: 11.5%, Fold: 79.3%)
  tourn_9max_100bb_BTN_vs_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c',
    'A9s':'c','A8s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','86s':'c',
    '76s':'c','65s':'c',
  },

  // ── BTN vs CO ── (3bet: 4.1%+6.9%, Call: 13.9%, Fold: 75.1%)
  tourn_9max_100bb_BTN_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c',
    'A9s':'c','A8s':'c','A7s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c',
  },

  // ============================================================
  // FACING RFI: SMALL BLIND
  // ============================================================

  // ── SB vs UTG/UTG+1 ── (3bet: 1.7%+0.9%, Call: 6.5%, Fold: 91%)
  tourn_9max_100bb_SB_vs_EP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── SB vs UTG+2 ── (3bet: 1.7%+0.9%, Call: 7.8%, Fold: 89.6%)
  tourn_9max_100bb_SB_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ── SB vs LJ ── (3bet: 2.9%+2.1%, Call: 7.1%, Fold: 87.9%)
  tourn_9max_100bb_SB_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ── SB vs HJ ── (3bet: 2.9%+3.0%, Call: 7.8%, Fold: 86.3%)
  tourn_9max_100bb_SB_vs_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ── SB vs CO ── (3bet: 5.6%+11.2%, Call: 0%, Fold: 83.3%)
  // Note: No call range — 3bet or fold only
  tourn_9max_100bb_SB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:50_3b',
    'KQs':'mr:50_3b','KJs':'mr:30_3b',
    'QJs':'mr:30_3b',
    '99':'mr:30_3b',
  },

  // ── SB vs BTN ── (3bet: 7.7%+13.6%, Call: 0%, Fold: 78.7%)
  // Note: No call range
  tourn_9max_100bb_SB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'3b','KJs':'mr:50_3b','KTs':'mr:30_3b',
    'QJs':'mr:50_3b','QTs':'mr:30_3b',
    'JTs':'mr:30_3b',
    '99':'mr:50_3b',
    'K5s':'mr:30_3b','K4s':'mr:30_3b',
  },

  // ============================================================
  // FACING RFI: BIG BLIND
  // ============================================================

  // ── BB vs UTG/UTG+1 ── (3bet: 2.0%+2.1%, Call: 23.8%, Fold: 72.1%)
  tourn_9max_100bb_BB_vs_EP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // Call wide
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'AJs':'c','ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'KQo':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c','65s':'c',
  },

  // ── BB vs UTG+2 ── (3bet: 3.3%+2.1%, Call: 23.7%, Fold: 70.0%)
  tourn_9max_100bb_BB_vs_UTG2_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'KQo':'c','KJo':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c','65s':'c','54s':'c',
  },

  // ── BB vs LJ ── (3bet: 4.4%+4.4%, Call: 25.3%, Fold: 67.0%)
  tourn_9max_100bb_BB_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b','A2s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'KQo':'c','KJo':'c','KTo':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'QJo':'c','QTo':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c',
    'T9s':'c','T8s':'c',
    'T9o':'c',
    '98s':'c','97s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','54s':'c',
  },

  // ── BB vs HJ ── (3bet: 5.3%+4.2%, Call: 24.1%, Fold: 66.4%)
  tourn_9max_100bb_BB_vs_HJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b','TT':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b','A2s':'mr:30_3b',
    'KQs':'mr:30_3b',
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c',
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
  },

  // ── BB vs CO ── (3bet: 8.0%+6.3%, Call: 29.6%, Fold: 56.1%)
  tourn_9max_100bb_BB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'mr:50_3b','KJs':'mr:30_3b',
    'QJs':'mr:30_3b',
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A8s':'c','A7s':'c','A6s':'c',
    'ATo':'c','A9o':'c','A8o':'c','A7o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c','T8o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    '43s':'c',
  },

  // ── BB vs BTN ── (3bet: 9.4%+13.0%, Call: 49.6%, Fold: 28.1%)
  tourn_9max_100bb_BB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b','99':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'3b','KJs':'mr:50_3b','KTs':'mr:30_3b',
    'QJs':'mr:30_3b',
    // Very wide call range vs BTN
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A8s':'c','A7s':'c','A6s':'c',
    'A9o':'c','A8o':'c','A7o':'c','A6o':'c','A5o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c','K8o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','Q6s':'c',
    'QJo':'c','QTo':'c','Q9o':'c','Q8o':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c','J6s':'c',
    'JTo':'c','J9o':'c','J8o':'c',
    'T9s':'c','T8s':'c','T7s':'c','T6s':'c',
    'T9o':'c','T8o':'c','T7o':'c',
    '98s':'c','97s':'c','96s':'c','95s':'c',
    '98o':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    '43s':'c',
  },

  // ── BB vs SB ── (3bet: 9.4%+14.2%, Call: 54.8%, Fold: 21.7%)
  tourn_9max_100bb_BB_vs_SB_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b','99':'3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'3b','A8s':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'3b','A9o':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'3b','KJs':'3b','KTs':'mr:50_3b',
    'QJs':'mr:50_3b','QTs':'mr:30_3b',
    'JTs':'mr:30_3b',
    // Wide call
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A7s':'c','A6s':'c',
    'A8o':'c','A7o':'c','A6o':'c','A5o':'c','A4o':'c',
    'K9s':'c','K8s':'c','K7s':'c','K6s':'c','K5s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c','K8o':'c',
    'Q9s':'c','Q8s':'c','Q7s':'c','Q6s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
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

  // ============================================================
  // RFI vs 3BET — UTG
  // ============================================================

  // UTG vs UTG+1 3bet (4bet: 2.1%+1.2%, Call: 3.3%, Fold: 3.5%, Overall fold: 89.9%)
  tourn_9max_100bb_UTG_vs_3bet_early: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:30_4b',
    'A5s':'mr:30_4b','A4s':'mr:30_4b',
    // Call
    'JJ':'c','TT':'c','AQo':'c',
    'KQs':'c',
  },

  // UTG vs CO/BTN 3bet (more bluff catchers)
  tourn_9max_100bb_UTG_vs_3bet_late: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:30_4b',
    'A5s':'mr:50_4b','A4s':'mr:30_4b',
    // Call
    'JJ':'c','TT':'c','99':'c',
    'AQo':'c','AJs':'c',
    'KQs':'c','KJs':'c',
  },

  // UTG vs SB/BB 3bet (call more)
  tourn_9max_100bb_UTG_vs_3bet_blinds: {
    'AA':'4b','KK':'4b','QQ':'4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b',
    'A5s':'mr:50_4b',
    // Call all premium
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AQo':'c','AJo':'c','AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c',
    'JTs':'c',
    'T9s':'c',
  },

  // ============================================================
  // RFI vs 3BET — LJ
  // ============================================================

  tourn_9max_100bb_LJ_vs_3bet_early: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:30_4b','A5s':'mr:30_4b',
    'JJ':'c','TT':'c','99':'c',
    'AQo':'c','AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
  },

  tourn_9max_100bb_LJ_vs_3bet_btn: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','A5s':'mr:50_4b','A4s':'mr:30_4b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AQo':'c','AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c',
  },

  tourn_9max_100bb_LJ_vs_3bet_sb: {
    'AA':'4b','KK':'4b','QQ':'4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','AQo':'mr:30_4b',
    'A5s':'3b','A4s':'mr:50_4b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  tourn_9max_100bb_LJ_vs_3bet_bb: {
    'AA':'4b','KK':'4b','QQ':'4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b',
    'A5s':'4b','A4s':'mr:50_4b','A3s':'mr:30_4b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c','AQo':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ============================================================
  // RFI vs 3BET — HJ/CO
  // ============================================================

  tourn_9max_100bb_HJ_vs_3bet_co: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:30_4b','A5s':'mr:30_4b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AQo':'c','AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  tourn_9max_100bb_HJ_vs_3bet_btn: {
    'AA':'4b','KK':'4b','QQ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','A5s':'mr:50_4b','A4s':'mr:30_4b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AQo':'c','AJo':'mr:30_4b',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c',
  },

  tourn_9max_100bb_HJ_vs_3bet_sb: {
    'AA':'4b','KK':'4b','QQ':'4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','AQo':'mr:30_4b',
    'A5s':'4b','A4s':'mr:50_4b',
    'JJ':'c','TT':'c','99':'c','88':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c',
    'QJs':'c','JTs':'c',
  },

  tourn_9max_100bb_HJ_vs_3bet_bb: {
    'AA':'4b','KK':'4b','QQ':'4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','A5s':'4b','A4s':'mr:50_4b',
    'JJ':'c','TT':'c','99':'c','88':'c','77':'c',
    'AQo':'c','AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  tourn_9max_100bb_CO_vs_3bet_btn_sb: {
    'AA':'4b','KK':'4b','QQ':'4b','JJ':'mr:30_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','AQo':'mr:30_4b',
    'A5s':'4b','A4s':'4b','A3s':'mr:30_4b',
    'TT':'c','99':'c','88':'c','77':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  tourn_9max_100bb_CO_vs_3bet_bb: {
    'AA':'4b','KK':'4b','QQ':'4b','JJ':'mr:30_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'mr:50_4b','AQo':'mr:50_4b',
    'A5s':'4b','A4s':'4b','A3s':'mr:50_4b','A2s':'mr:30_4b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c',
    'AJs':'c','ATs':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ============================================================
  // RFI vs 3BET — BTN/SB
  // ============================================================

  tourn_9max_100bb_BTN_vs_3bet_sb_bb: {
    'AA':'4b','KK':'4b','QQ':'4b','JJ':'mr:50_4b',
    'AKs':'4b','AKo':'4b',
    'AQs':'4b','AQo':'mr:50_4b',
    'A5s':'4b','A4s':'4b','A3s':'4b','A2s':'mr:50_4b',
    'KQs':'mr:50_4b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c',
    'AJs':'c','ATs':'c','A9s':'c',
    'KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ── SB RFI vs BB 3bet ──
  // Note: AA/KK/AKo not in range — they were limped
  tourn_9max_100bb_SB_rfi_vs_BB_3bet: {
    // No AA, KK, AKo (limped those)
    'QQ':'4b','JJ':'mr:50_4b',
    'AKs':'4b','AQs':'4b','AJs':'mr:50_4b',
    'AQo':'mr:30_4b',
    'A5s':'4b','A4s':'mr:50_4b','A3s':'mr:30_4b',
    'KQs':'mr:50_4b',
    // Call
    'TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── SB Limp vs BB Raise ──
  // 3bet: 1.8%+4.5%, Call: 37.7%, Fold: 4.5%
  tourn_9max_100bb_SB_limp_vs_BB_raise: {
    // 3bet with strong hands (were limped for deception)
    'AA':'3b','KK':'3b',
    'AKo':'3b',
    'QQ':'mr:50_3b','JJ':'mr:30_3b',
    // Call wide
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c','A7s':'c',
    'A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AQo':'c','AJo':'c','ATo':'c','A9o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
    'KQo':'c','KJo':'c','KTo':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'QJo':'c','QTo':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
  },

};

export default DB_TOURN_100BB;
