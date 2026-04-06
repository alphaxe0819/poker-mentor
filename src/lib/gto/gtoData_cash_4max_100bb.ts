import { makeRange, makeRangeDefaultCall, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_CASH_4MAX_100BB: GtoDB = {
  // ── UTG open (4-max UTG ≈ 6-max CO) ───────────────────────────────────────
  'cash_4max_100bb_UTG_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o','A8o',
     'KQs','KJs','KTs','K9s','K8s','K7s','K6s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','Q8s','QJo','QTo',
     'JTs','J9s','J8s','JTo',
     'T9s','T8s','T7s','T9o',
     '98s','97s','96s',
     '87s','86s','76s','75s','65s','64s','54s','53s','43s'],
    [],
    { '33':'mr:70','22':'mr:50','Q9o':'mr:40','K9o':'mr:50' }
  ),

  // ── BTN open (4-max BTN very wide) ────────────────────────────────────────
  'cash_4max_100bb_BTN_open': makeRangeDefaultRaise(
    ['72o','73o','74o','82o','83o','84o','92o','93o',
     '32o','42o','43o','52o','53o','62o','63o',
     '72s','82s','92s','32s']
  ),

  // ── SB open ───────────────────────────────────────────────────────────────
  'cash_4max_100bb_SB_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','K9s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','QJo',
     'JTs','J9s','T9s','T8s','98s','97s','87s','76s','65s','54s'],
    ['66','55','44','33','22',
     'A6s','A5s','A4s','A3s','A2s',
     'K8s','Q8s','J8s','T7s','86s','75s','64s','53s',
     'QTo','JTo',
     'A8o','A7o','K9o','Q9o','J9o','T9o']
  ),

  // ── BB vs open ────────────────────────────────────────────────────────────
  'cash_4max_100bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT',
     'AKs','AQs','AJs','AKo','AQo',
     'KQs','A5s','A4s','54s','43s'],
    ['72o','73o','82o','83o','92o','93o','32o','42o','52o','62o']
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // VS RFI — Cash 4-max 100BB
  // ══════════════════════════════════════════════════════════════════════════

  // ── BTN vs UTG raise ──────────────────────────────────────────────────────
  'cash_4max_100bb_BTN_vs_UTG': makeRange(
    [],
    ['TT','99','88','77','66','AJs','ATs','A9s','A8s','A7s',
     'KQs','KJs','KTs','K9s','QJs','QTs','Q9s','JTs','J9s',
     'T9s','T8s','98s','97s','87s','86s','76s','75s','65s','64s','54s'],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'3b',
      'AKs':'3b','AQs':'3b','AJs':'mr:50_3b',
      'AKo':'3b','AQo':'3b',
      'A5s':'mr:70_3b','A4s':'mr:60_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'K5s':'mr:30_3b','86s':'mr:30_3b' }
  ),

  // ── SB vs UTG raise (3-bet or fold) ───────────────────────────────────────
  'cash_4max_100bb_SB_vs_UTG': makeRange(
    [],
    [],
    { 'AA':'3b','KK':'3b','QQ':'3b','JJ':'mr:70_3b','TT':'mr:40_3b',
      'AKs':'3b','AQs':'3b','AJs':'3b','ATs':'mr:40_3b',
      'AKo':'3b','AQo':'3b','AJo':'mr:30_3b',
      'A5s':'mr:60_3b','A4s':'mr:50_3b','A3s':'mr:40_3b','A2s':'mr:30_3b',
      'KQs':'mr:50_3b','K5s':'mr:30_3b',
      'Q9s':'mr:30_3b','76s':'mr:30_3b' }
  ),

  // ── SB vs BTN raise (3-bet or fold) ───────────────────────────────────────
  'cash_4max_100bb_SB_vs_BTN': makeRange(
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
  'cash_4max_100bb_BB_vs_UTG': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT',
     'AKs','AQs','AJs','ATs',
     'AKo','AQo',
     'KQs',
     'A5s','A4s','54s','43s'],
    ['72o','73o','82o','83o','92o','93o',
     '32o','42o','52o','62o',
     'K2o','Q2o','J2o']
  ),

  // ── BB vs BTN raise ───────────────────────────────────────────────────────
  'cash_4max_100bb_BB_vs_BTN': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','ATs','A9s',
     'AKo','AQo','AJo',
     'KQs','KJs',
     'A5s','A4s','54s','43s'],
    ['72o','73o','82o','83o','92o',
     '32o','42o','52o','62o']
  ),

  // ── BB vs SB raise ────────────────────────────────────────────────────────
  'cash_4max_100bb_BB_vs_SB': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AQs','AJs','ATs','A9s','A8s',
     'AKo','AQo','AJo','ATo',
     'KQs','KJs','KTs',
     'QJs',
     'A5s','A4s','A3s','54s','43s','65s'],
    ['72o','73o','82o','32o','42o','52o']
  ),

  // ══════════════════════════════════════════════════════════════════════════
  // VS 3-BET — Cash 4-max 100BB
  // ══════════════════════════════════════════════════════════════════════════

  // ── UTG vs 3-bet ──────────────────────────────────────────────────────────
  'cash_4max_100bb_UTG_vs_3bet': makeRange(
    [],
    ['QQ','JJ','TT','99','AQs','AJs','ATs','A9s','KQs','KJs','KTs',
     'QJs','QTs','JTs','T9s','98s'],
    { 'AA':'4b','KK':'4b',
      'AKs':'4b','AKo':'4b',
      'AQo':'mr:40_4b',
      'A5s':'mr:50_4b','A4s':'mr:40_4b','A3s':'mr:30_4b' }
  ),

  // ── BTN vs 3-bet ──────────────────────────────────────────────────────────
  'cash_4max_100bb_BTN_vs_3bet': makeRange(
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
  'cash_4max_100bb_SB_vs_3bet': makeRange(
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
