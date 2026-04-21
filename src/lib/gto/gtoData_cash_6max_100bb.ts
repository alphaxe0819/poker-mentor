// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
import { makeRange, makeRangeDefaultCall, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_CASH_6MAX_100BB: GtoDB = {
  // ── UTG open (tightest RFI) ────────────────────────────────────────────────
  'cash_6max_100bb_UTG_open': makeRange(
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

  // ── HJ open (slightly wider than UTG) ──────────────────────────────────────
  'cash_6max_100bb_HJ_open': makeRange(
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

  // ── CO open (wider than HJ) ────────────────────────────────────────────────
  'cash_6max_100bb_CO_open': makeRange(
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

  // ── BTN open (widest RFI) ──────────────────────────────────────────────────
  'cash_6max_100bb_BTN_open': makeRangeDefaultRaise(
    ['72o','73o','74o','75o','82o','83o','84o','92o','93o','94o',
     '32o','42o','43o','52o','53o','62o','63o','64o',
     '72s','82s','92s','32s']
  ),

  // ── SB open (raise or limp vs BB) ─────────────────────────────────────────
  'cash_6max_100bb_SB_open': makeRange(
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

  // ── BB vs open (defend vs single raise) ───────────────────────────────────
  'cash_6max_100bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ',
     'AKs','AQs','AJs','AKo','AQo',
     'KQs','A5s','A4s','54s','43s'],
    ['72o','73o','82o','83o','92o','93o','32o','42o','52o','62o']
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // VS RFI (Facing a Raise) — Cash 6-max 100BB
  // ══════════════════════════════════════════════════════════════════════════

  // ── HJ vs UTG raise ──────────────────────────────────────────────────────
  'cash_6max_100bb_HJ_vs_UTG': makeRange(
    [],
    ['JJ','TT','ATs','KQs','QJs'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b',
      'A5s':'mr:30_3b','A4s':'mr:30_3b' }
  ),

  // ── CO vs UTG raise ──────────────────────────────────────────────────────
  'cash_6max_100bb_CO_vs_UTG': makeRange(
    [],
    ['JJ','TT','99','ATs','A9s','KQs','KJs','QJs','QTs','JTs','T9s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b',
      'A5s':'mr:50_3b','A4s':'mr:30_3b','A3s':'mr:30_3b' }
  ),

  // ── CO vs HJ raise ──────────────────────────────────────────────────────
  'cash_6max_100bb_CO_vs_HJ': makeRange(
    [],
    ['JJ','TT','99','ATs','A9s','KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b','AQo':'mr:30_3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b','A3s':'mr:30_3b' }
  ),

  // ── BTN vs UTG raise ─────────────────────────────────────────────────────
  'cash_6max_100bb_BTN_vs_UTG': makeRange(
    [],
    ['JJ','TT','99','88','77','AJs','ATs','A9s',
     'KQs','KJs','KTs','QJs','QTs','JTs','T9s','98s','87s','76s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b',
      'AKo':'3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b' }
  ),

  // ── BTN vs HJ raise ──────────────────────────────────────────────────────
  'cash_6max_100bb_BTN_vs_HJ': makeRange(
    [],
    ['JJ','TT','99','88','77','AJs','ATs','A9s','A8s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','86s','76s','65s'],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b','AQo':'mr:40_3b',
      'A5s':'mr:60_3b','A4s':'mr:50_3b','A3s':'mr:30_3b',
      'K9s':'mr:30_3b' }
  ),

  // ── BTN vs CO raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_BTN_vs_CO': makeRange(
    [],
    ['TT','99','88','77','66','AJs','ATs','A9s','A8s','A7s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s'],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b','AQo':'3b',
      'A5s':'mr:70_3b','A4s':'mr:60_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'K5s':'mr:30_3b','Q9s':'mr:30_3b','86s':'mr:30_3b' }
  ),

  // ── SB vs UTG raise (3-bet or fold, no cold-call) ────────────────────────
  'cash_6max_100bb_SB_vs_UTG': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b',
      'AKs':'3b','AQs':'3b',
      'AKo':'3b',
      'A5s':'mr:40_3b','A4s':'mr:30_3b' }
  ),

  // ── SB vs HJ raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_SB_vs_HJ': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:60_3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:40_3b',
      'AKo':'3b','AQo':'mr:30_3b',
      'A5s':'mr:50_3b','A4s':'mr:40_3b','A3s':'mr:30_3b' }
  ),

  // ── SB vs CO raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_SB_vs_CO': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:70_3b','TT':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:40_3b',
      'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
      'A5s':'mr:60_3b','A4s':'mr:50_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'KQs':'mr:50_3b','K5s':'mr:30_3b',
      'Q9s':'mr:30_3b','76s':'mr:30_3b' }
  ),

  // ── SB vs BTN raise ──────────────────────────────────────────────────────
  'cash_6max_100bb_SB_vs_BTN': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b','TT':'mr:60_3b','99':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'3b','A9s':'mr:50_3b','A8s':'mr:30_3b',
      'AKo':'3b','AQo':'3b','AJo':'3b','ATo':'mr:40_3b',
      'A5s':'3b','A4s':'mr:70_3b','A3s':'mr:50_3b','A2s':'mr:40_3b',
      'KQs':'3b','KJs':'mr:60_3b','KTs':'mr:40_3b',
      'KQo':'mr:40_3b',
      'QJs':'mr:40_3b','Q9s':'mr:30_3b',
      'J9s':'mr:30_3b','76s':'mr:40_3b','65s':'mr:30_3b','54s':'mr:30_3b' }
  ),

  // ── BB vs UTG raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_BB_vs_UTG': makeRangeDefaultCall(
    ['AA','KK','QQ','AKs','AQs','AKo'],
    ['72o','73o','74o','82o','83o','84o','92o','93o',
     '32o','42o','43o','52o','53o','62o','63o','64o',
     'K2o','K3o','K4o','Q2o','Q3o','Q4o','Q5o','J2o','J3o','J4o',
     'T2o','T3o','T4o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b' }
  ),

  // ── BB vs HJ raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_BB_vs_HJ': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ',
     'AKs','AQs','AJs',
     'AKo','AQo'],
    ['72o','73o','74o','82o','83o','84o','92o','93o',
     '32o','42o','43o','52o','53o','62o','63o',
     'K2o','K3o','Q2o','Q3o','J2o','J3o','T2o','T3o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b' }
  ),

  // ── BB vs CO raise ────────────────────────────────────────────────────────
  'cash_6max_100bb_BB_vs_CO': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT',
     'AKs','AQs','AJs','ATs',
     'AKo','AQo',
     'KQs'],
    ['72o','73o','82o','83o','92o','93o',
     '32o','42o','52o','62o',
     'K2o','Q2o','J2o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b','43s':'mr:30_3b' }
  ),

  // ── BB vs BTN raise ───────────────────────────────────────────────────────
  'cash_6max_100bb_BB_vs_BTN': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','ATs','A9s',
     'AKo','AQo','AJo',
     'KQs','KJs'],
    ['72o','73o','82o','83o','92o',
     '32o','42o','52o','62o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','54s':'mr:30_3b','43s':'mr:30_3b' }
  ),

  // ── BB vs SB raise ────────────────────────────────────────────────────────
  'cash_6max_100bb_BB_vs_SB': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AQs','AJs','ATs','A9s','A8s',
     'AKo','AQo','AJo','ATo',
     'KQs','KJs','KTs',
     'QJs'],
    ['72o','73o','82o','32o','42o','52o'],
    { 'A5s':'mr:30_3b','A4s':'mr:30_3b','A3s':'mr:30_3b',
      '54s':'mr:30_3b','43s':'mr:30_3b','65s':'mr:30_3b' }
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // VS 3-BET — Cash 6-max 100BB
  // ══════════════════════════════════════════════════════════════════════════

  // ── UTG vs 3-bet ──────────────────────────────────────────────────────────
  'cash_6max_100bb_UTG_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','AQs','AJs','ATs','KQs'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'A5s':'mr:30_4b' }
  ),

  // ── HJ vs 3-bet ──────────────────────────────────────────────────────────
  'cash_6max_100bb_HJ_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','AQs','AJs','ATs','KQs','KJs','QJs'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:30_4b',
      'A5s':'mr:40_4b','A4s':'mr:30_4b' }
  ),

  // ── CO vs 3-bet ───────────────────────────────────────────────────────────
  'cash_6max_100bb_CO_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','AQs','AJs','ATs','A9s','KQs','KJs','KTs',
     'QJs','QTs','JTs','T9s','98s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:40_4b',
      'A5s':'mr:50_4b','A4s':'mr:40_4b','A3s':'mr:30_4b' }
  ),

  // ── BTN vs 3-bet ──────────────────────────────────────────────────────────
  'cash_6max_100bb_BTN_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','88','AQs','AJs','ATs','A9s','A8s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','87s','76s','65s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:50_4b','AJo':'mr:30_4b',
      'A5s':'mr:60_4b','A4s':'mr:50_4b','A3s':'mr:40_4b','A2s':'mr:30_4b' }
  ),

  // ── SB vs BB 3-bet ────────────────────────────────────────────────────────
  'cash_6max_100bb_SB_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','88','77',
     'AQs','AJs','ATs','A9s','A8s','A7s','A6s',
     'KQs','KJs','KTs','K9s',
     'QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','76s','65s','54s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:60_4b','AJo':'mr:30_4b',
      'A5s':'mr:70_4b','A4s':'mr:60_4b','A3s':'mr:40_4b','A2s':'mr:30_4b' }
  ),
}
