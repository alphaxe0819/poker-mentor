import { makeRange, makeRangeDefaultCall, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_TOURN_40BB: GtoDB = {
  // ── UTG open ──────────────────────────────────────────────────────────────
  'tournament_9max_40bb_UTG_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
     '77','66','ATs','KJs','QJs','JTs',
     '55','44','A9s','A8s','KTs','QTs','T9s','98s',
     '33','22','A7s','A6s','A5s','K9s','87s','76s']
  ),

  // ── HJ open ───────────────────────────────────────────────────────────────
  'tournament_9max_40bb_HJ_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','K9s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','QJo',
     'JTs','J9s','T9s','T8s','98s','97s','87s','86s','76s','65s','54s'],
    [],
    { '44':'mr:70','33':'mr:50','22':'mr:40','A8o':'mr:40','QTo':'mr:40' }
  ),

  // ── CO open ───────────────────────────────────────────────────────────────
  'tournament_9max_40bb_CO_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o','A8o',
     'KQs','KJs','KTs','K9s','K8s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','Q8s','QJo','QTo',
     'JTs','J9s','J8s','JTo',
     'T9s','T8s','98s','97s',
     '87s','86s','76s','75s','65s','64s','54s','53s','43s'],
    [],
    { '33':'mr:60','22':'mr:40','K9o':'mr:40' }
  ),

  // ── BTN open ──────────────────────────────────────────────────────────────
  'tournament_9max_40bb_BTN_open': makeRangeDefaultRaise(
    ['72o','73o','74o','75o','82o','83o','84o','85o','92o','93o','94o',
     '32o','42o','43o','52o','53o','62o','63o','64o','65o',
     '72s','82s','92s','32s','42s',
     'T2o','J2o','Q2o','K2o']
  ),

  // ── SB open ───────────────────────────────────────────────────────────────
  'tournament_9max_40bb_SB_open': makeRange(
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

  // ── BB vs open ────────────────────────────────────────────────────────────
  'tournament_9max_40bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ',
     'AKs','AQs','AJs','AKo','AQo',
     'KQs','A5s','A4s','54s'],
    ['72o','73o','74o','82o','83o','84o','92o','93o','32o','42o','43o','52o','53o','62o']
  ),
}
