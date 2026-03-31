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
}
