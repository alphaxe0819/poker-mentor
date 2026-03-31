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
}
