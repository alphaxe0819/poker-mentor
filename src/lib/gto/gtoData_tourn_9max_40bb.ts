// ============================================================
// GTO Preflop Range Data
// Source: Poker Coaching Charts
// Format: Tournament, 9-max, 40BB
// Key difference from 100BB:
//   - Tighter ranges overall (ICM pressure)
//   - All-In appears as option (especially CO/BTN/SB)
//   - No separate vs-3bet charts (jam or fold)
//   - SB has complex limp/raise/jam strategy
// ============================================================

export type GtoDatabase = Record<string, Record<string, string>>

const DB_TOURN_40BB: GtoDatabase = {

  // ============================================================
  // RAISE FIRST IN (RFI) — 錦標賽 9-max 40BB
  // ============================================================

  // ── UTG RFI — 16.1% (214/1326) ──
  tourn_9max_40bb_UTG_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r',
    'AKo':'r','AQo':'r','AJo':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'QJs':'r','QTs':'r',
    'JTs':'r',
    'T9s':'r',
    '99':'r','88':'mr:50',
    'A9s':'r','A8s':'mr:50',
    'A5s':'r','A4s':'mr:50',
    'K9s':'mr:50',
    'ATo':'mr:50',
    '98s':'mr:30',
  },

  // ── UTG+1 RFI — 17.5% (232/1326) ──
  tourn_9max_40bb_UTG1_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r',
    'QJs':'r','QTs':'r','Q9s':'mr:50',
    'JTs':'r','J9s':'mr:50',
    'T9s':'r','T8s':'mr:30',
    '98s':'r',
    'A7s':'mr:50','A6s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30',
    '88':'mr:50',
    'KQo':'mr:50',
  },

  // ── UTG+2 RFI — 20.5% (272/1326) ──
  tourn_9max_40bb_UTG2_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'A6s':'mr:50','A5s':'r','A4s':'mr:50','A3s':'mr:30',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'mr:30',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'mr:30',
    'KQo':'r','KJo':'mr:50',
    'QJs':'r','QTs':'r','Q9s':'mr:50',
    'QJo':'mr:30',
    'JTs':'r','J9s':'mr:50',
    'T9s':'r','T8s':'mr:30',
    '98s':'r','97s':'mr:30',
    '87s':'mr:30',
    '77':'mr:50',
  },

  // ── LJ RFI — 23.5% (312/1326) ──
  tourn_9max_40bb_LJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r',
    'A6s':'r','A5s':'r','A4s':'r','A3s':'mr:50','A2s':'mr:30',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'mr:50',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'mr:50',
    'KQo':'r','KJo':'r','KTo':'mr:30',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'mr:30',
    'QJo':'r','QTo':'mr:30',
    'JTs':'r','J9s':'r','J8s':'mr:30',
    'JTo':'mr:30',
    'T9s':'r','T8s':'mr:50',
    '98s':'r','97s':'mr:30',
    '87s':'mr:30',
    '66':'mr:50',
  },

  // ── HJ RFI — 28.7% (380/1326) ──
  tourn_9max_40bb_HJ_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'mr:50',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'mr:50',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'mr:30',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'mr:30',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'mr:50',
    'QJo':'r','QTo':'mr:50','Q9o':'mr:30',
    'JTs':'r','J9s':'r','J8s':'mr:30',
    'JTo':'r','J9o':'mr:30',
    'T9s':'r','T8s':'r',
    'T9o':'mr:30',
    '98s':'r','97s':'mr:50',
    '87s':'mr:50','86s':'mr:30',
    '76s':'mr:30',
  },

  // ── CO RFI — 36.2% (480/1326) ──
  tourn_9max_40bb_CO_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r','A7o':'mr:50',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r','K6s':'mr:30',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r','K8o':'mr:30',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r','Q7s':'mr:30',
    'QJo':'r','QTo':'r','Q9o':'mr:50',
    'JTs':'r','J9s':'r','J8s':'r','J7s':'mr:30',
    'JTo':'r','J9o':'mr:30',
    'T9s':'r','T8s':'r','T7s':'mr:30',
    'T9o':'mr:50',
    '98s':'r','97s':'r','96s':'mr:30',
    '87s':'r','86s':'mr:50',
    '76s':'r','75s':'mr:30',
    '65s':'mr:50',
  },

  // ── BTN RFI — 50.8% (674/1326) ──
  tourn_9max_40bb_BTN_RFI: {
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r',
    '77':'r','66':'r','55':'r','44':'r','33':'r','22':'mr:50',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r',
    'A7o':'r','A6o':'mr:50','A5o':'mr:30',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r','K7s':'r',
    'K6s':'r','K5s':'mr:50','K4s':'mr:30',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r','K8o':'mr:50','K7o':'mr:30',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r','Q7s':'r','Q6s':'mr:30',
    'QJo':'r','QTo':'r','Q9o':'r','Q8o':'mr:30',
    'JTs':'r','J9s':'r','J8s':'r','J7s':'r','J6s':'mr:30',
    'JTo':'r','J9o':'r','J8o':'mr:30',
    'T9s':'r','T8s':'r','T7s':'r','T6s':'mr:30',
    'T9o':'r','T8o':'mr:30',
    '98s':'r','97s':'r','96s':'r',
    '87s':'r','86s':'r','85s':'mr:30',
    '76s':'r','75s':'r',
    '65s':'r','64s':'mr:30',
    '54s':'r','53s':'mr:30',
    '43s':'mr:30',
  },

  // ── SB Strategy — Raise/Limp/Jam ──
  // Raise/4bet: 3.5%, Raise/Call: 11.3%, Raise/Fold: 12.1%
  // Limp/Jam: 3.2%, Limp/Raise: 4.1%, Limp/Call: 22.9%, Limp/Fold: 24.7%
  // Fold: 19.0%
  tourn_9max_40bb_SB_RFI: {
    // Raise (strong hands)
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r',
    'AKo':'r','AQo':'r','AJo':'r',
    'KQs':'r','KJs':'r',
    'A9s':'r','A8s':'r',
    // Raise/fold (thin value)
    '99':'r','88':'r',
    'KTs':'r','K9s':'mr:50',
    'QJs':'r','QTs':'mr:50',
    'JTs':'r',
    'ATo':'r','A9o':'mr:50',
    'KQo':'r','KJo':'mr:50',
    'QJo':'mr:30',
    // Limp (playability hands)
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'K8s':'c','K7s':'c','K6s':'c','K5s':'c','K4s':'c','K3s':'c',
    'Q9s':'c','Q8s':'c','Q7s':'c',
    'J9s':'c','J8s':'c','J7s':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    'A8o':'c','A7o':'c','A6o':'c',
    'KTo':'c','K9o':'c','K8o':'c',
    'QTo':'c','Q9o':'c',
    'JTo':'c','J9o':'c',
    'T9o':'c','T8o':'c',
  },

  // ============================================================
  // FACING RFI vs UTG (40BB)
  // ============================================================

  // ── UTG+1/2 vs UTG ── (3bet: 4.8%+4.1%, Call: 4.1%, Fold: 91.1%)
  tourn_9max_40bb_EP_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // Call
    'TT':'c','AJs':'c','KQs':'c',
  },

  // ── LJ/HJ vs UTG ── (3bet: 4.8%+8.9%, Call: 8.9%, Fold: 86.3%)
  tourn_9max_40bb_MP_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    // Call
    'TT':'c','99':'c','88':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── CO vs UTG ── (3bet: 4.8%+12.8%, Call: 12.8%, Fold: 82.4%)
  tourn_9max_40bb_CO_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:50_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c',
  },

  // ── BTN vs UTG ── (3bet: 5.3%+16.0%, Call: 16.0%, Fold: 78.7%)
  tourn_9max_40bb_BTN_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b','A2s':'mr:30_3b',
    '99':'c','88':'c','77':'c','66':'c',
    'A9s':'c','A8s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c',
  },

  // ── SB vs UTG ── (3bet: 6.5%+12.7%, Call: 12.7%, Fold: 80.8%)
  tourn_9max_40bb_SB_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b',
    '99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── BB vs UTG ── (3bet: 5.7%+10.5%, Call: 49%, Fold: 45.2%)
  tourn_9max_40bb_BB_vs_UTG_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b',
    'AKo':'3b',
    'A5s':'mr:30_3b','A4s':'mr:30_3b',
    // Very wide call at 40BB (pot odds + position loss)
    'TT':'c','99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'AJs':'c','ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'KQo':'c','KJo':'c','KTo':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'QJo':'c','QTo':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'JTo':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c','65s':'c','54s':'c',
  },

  // ============================================================
  // FACING RFI vs MP (LJ/HJ)
  // ============================================================

  // ── HJ vs LJ ── (3bet: 6.0%+9.0%, Call: 9.0%, Fold: 84.9%)
  tourn_9max_40bb_HJ_vs_LJ_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c','98s':'c',
  },

  // ── CO vs LJ/HJ ── (3bet: 6.2%+12.4%, Call: 12.4%, Fold: 81.4%)
  tourn_9max_40bb_CO_vs_MP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:50_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c','66':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c',
    'JTs':'c','T9s':'c','98s':'c','87s':'c',
  },

  // ── BTN vs LJ/HJ ── (3bet: 6.2%+16.7%, Call: 16.7%, Fold: 76.3%)
  tourn_9max_40bb_BTN_vs_MP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b','A2s':'mr:30_3b',
    '99':'c','88':'c','77':'c','66':'c','55':'c',
    'ATs':'c','A9s':'c','A8s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c',
    'QJs':'c','QTs':'c','Q9s':'c',
    'JTs':'c','J9s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c','65s':'c',
  },

  // ── SB vs LJ/HJ ── (3bet: 9.0%+12.2%, Call: 12.2%, Fold: 78.7%)
  tourn_9max_40bb_SB_vs_MP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
    'TT':'c','99':'c','88':'c','77':'c',
    'ATs':'c','A9s':'c',
    'KQs':'c','KJs':'c','KTs':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── BB vs LJ/HJ ── (3bet: 8.0%+54.0%, Call: 54%, Fold: 38%)
  tourn_9max_40bb_BB_vs_MP_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:50_3b','TT':'mr:30_3b',
    'AKs':'3b','AQs':'3b','AJs':'mr:30_3b',
    'AKo':'3b','AQo':'mr:30_3b',
    'A5s':'3b','A4s':'mr:30_3b',
    // Very wide call
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'ATs':'c','A9s':'c','A8s':'c','A7s':'c','A6s':'c','A3s':'c','A2s':'c',
    'AJo':'c','ATo':'c','A9o':'c','A8o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
  },

  // ============================================================
  // FACING RFI vs LP (CO/BTN)
  // ============================================================

  // ── BTN vs CO ── (3bet: 7.4%+19.6%, Call: 19.6%, Fold: 73.0%)
  tourn_9max_40bb_BTN_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:50_3b',
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c',
    'A9s':'c','A8s':'c','A7s':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c',
    'JTs':'c','J9s':'c','J8s':'c',
    'T9s':'c','T8s':'c',
    '98s':'c','97s':'c',
    '87s':'c','76s':'c','65s':'c',
  },

  // ── SB vs CO ── (3bet: 13.1%+12.7%, Call: 12.7%, Fold: 74.2%)
  // Note: SB 3bets much more vs CO at 40BB
  tourn_9max_40bb_SB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:30_3b',
    'KQs':'mr:50_3b','KJs':'mr:30_3b',
    '99':'c','88':'c','77':'c',
    'A9s':'c','A8s':'c',
    'KTs':'c','K9s':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── BB vs CO ── (3bet: 12.7%+56.6%, Call: 56.6%, Fold: 30.8%)
  tourn_9max_40bb_BB_vs_CO_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:50_3b',
    'KQs':'mr:30_3b',
    // Very wide call vs CO at 40BB
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c',
    'ATo':'c','A9o':'c','A8o':'c','A7o':'c',
    'KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c','T8o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
  },

  // ── SB vs BTN ── (3bet: 14.0%+2.4% allin, Call: 11.8%, Fold: 71.8%)
  tourn_9max_40bb_SB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b','99':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'mr:50_3b',
    'KQs':'mr:50_3b','KJs':'mr:30_3b',
    // Allin (shove range at 40BB)
    'A9s':'allin','A8s':'allin',
    // Call
    '88':'c','77':'c','66':'c',
    'A7s':'c','A6s':'c',
    'KTs':'c','K9s':'c',
    'QJs':'c','JTs':'c','T9s':'c',
  },

  // ── BB vs BTN ── (3bet: 14.0%+3.0% allin, Call: 58.5%, Fold: 24.4%)
  tourn_9max_40bb_BB_vs_BTN_RFI: {
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'3b','99':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:50_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:50_3b',
    'A5s':'3b','A4s':'3b','A3s':'3b','A2s':'3b',
    'KQs':'mr:50_3b','KJs':'mr:30_3b',
    // Allin
    'A9s':'allin','A8s':'allin',
    // Very wide call vs BTN
    '88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A7s':'c','A6s':'c',
    'A9o':'c','A8o':'c','A7o':'c','A6o':'c',
    'KQs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'KQo':'c','KJo':'c','KTo':'c','K9o':'c','K8o':'c',
    'QJs':'c','QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c',
    'QJo':'c','QTo':'c','Q9o':'c',
    'JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'JTo':'c','J9o':'c',
    'T9s':'c','T8s':'c','T7s':'c',
    'T9o':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c',
    '76s':'c','75s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
  },

  // ============================================================
  // BLIND vs BLIND — 40BB
  // ============================================================

  // ── SB RFI (BvB) ──
  // Raise/4bet: 3.5%, Raise/Call: 11.3%, Raise/Fold: 12.1%
  // Limp/Jam: 3.2%, Limp/Raise: 4.1%, Limp/Call: 22.9%, Limp/Fold: 24.7%
  // Fold: 19.0%
  tourn_9max_40bb_SB_BvB: {
    // Raise for value (will call 4bet or jam)
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r',
    'AKo':'r','AQo':'r',
    // Raise/fold (open but fold to 3bet)
    '99':'r','88':'r',
    'A9s':'r','A8s':'r','A7s':'r',
    'KQs':'r','KJs':'r','KTs':'r',
    'QJs':'r',
    'AJo':'r','ATo':'r',
    'KQo':'r','KJo':'mr:50',
    // Limp/Jam
    'A6s':'allin','A5s':'allin','A4s':'allin','A3s':'allin','A2s':'allin',
    // Limp/Raise (semi-strong)
    'K9s':'c','K8s':'c',
    'Q9s':'c','Q8s':'c',
    'J9s':'c','J8s':'c',
    // Limp/Call
    '77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'K7s':'c','K6s':'c','K5s':'c','K4s':'c',
    'Q7s':'c','Q6s':'c',
    'J7s':'c','J6s':'c',
    'T9s':'c','T8s':'c','T7s':'c','T6s':'c',
    '98s':'c','97s':'c','96s':'c',
    '87s':'c','86s':'c','85s':'c',
    '76s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    'A9o':'c','A8o':'c',
    'KTo':'c','K9o':'c','K8o':'c',
    'QTo':'c','Q9o':'c',
    'JTo':'c','J9o':'c',
    'T9o':'c','T8o':'c',
    '98o':'c',
  },

  // ── BB vs SB Limp ── (Raise: 44.0%, Check: 56.0%)
  tourn_9max_40bb_BB_vs_SB_limp: {
    // Raise almost everything except very weak
    'AA':'r','KK':'r','QQ':'r','JJ':'r','TT':'r','99':'r','88':'r','77':'r',
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r','A7s':'r','A6s':'r',
    'AKo':'r','AQo':'r','AJo':'r','ATo':'r','A9o':'r','A8o':'r','A7o':'r',
    'KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r',
    'KQo':'r','KJo':'r','KTo':'r','K9o':'r',
    'QJs':'r','QTs':'r','Q9s':'r','Q8s':'r',
    'QJo':'r','QTo':'r','Q9o':'r',
    'JTs':'r','J9s':'r','J8s':'r',
    'JTo':'r','J9o':'r',
    'T9s':'r','T8s':'r',
    'T9o':'r',
    '98s':'r','97s':'r',
    '87s':'r','76s':'r',
    // Check marginal hands
    '66':'c','55':'c','44':'c','33':'c','22':'c',
    'A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'K7s':'c','K6s':'c','K5s':'c','K4s':'c','K3s':'c','K2s':'c',
    'Q7s':'c','Q6s':'c','Q5s':'c',
    'J7s':'c','J6s':'c',
    'T7s':'c','T6s':'c',
    '96s':'c','95s':'c',
    '86s':'c','85s':'c',
    '75s':'c','74s':'c',
    '65s':'c','64s':'c',
    '54s':'c','53s':'c',
    'A6o':'c','A5o':'c','A4o':'c',
    'K8o':'c','K7o':'c',
    'Q8o':'c','Q7o':'c',
    'J8o':'c','J7o':'c',
    'T8o':'c','T7o':'c',
    '97o':'c','87o':'c',
  },

  // ── BB vs SB Raise ── (3bet: 12.5%, Call: 51.6%, Check: 35.9%)
  // Note: "Check" here means fold/check — BB can't fold preflop after raise
  // This is actually 3bet/Call/Fold breakdown
  tourn_9max_40bb_BB_vs_SB_raise: {
    // 3bet
    'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:50_3b',
    'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:30_3b',
    'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
    'A5s':'3b','A4s':'3b','A3s':'mr:50_3b',
    'KQs':'mr:30_3b',
    // Call wide
    '99':'c','88':'c','77':'c','66':'c','55':'c','44':'c','33':'c','22':'c',
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A2s':'c',
    'ATo':'c','A9o':'c','A8o':'c','A7o':'c',
    'KJs':'c','KTs':'c','K9s':'c','K8s':'c','K7s':'c',
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

};

export default DB_TOURN_40BB;
