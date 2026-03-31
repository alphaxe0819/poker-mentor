import { makeRange, makeRangeDefaultCall, type GtoDB } from './helpers'

export const DB_TOURN_25BB: GtoDB = {
  // ── UTG open (tight at 25bb) ──────────────────────────────────────────────
  'tournament_9max_25bb_UTG_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88',
     'AKs','AKo','AQs','AQo','AJs','AJo','KQs',
     '77','66','ATs','KJs','QJs','JTs']
  ),

  // ── HJ open ───────────────────────────────────────────────────────────────
  'tournament_9max_25bb_HJ_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A5s',
     'AKo','AQo','AJo','ATo',
     'KQs','KJs','KTs','KQo','KJo',
     'QJs','QTs','JTs','T9s','98s','87s'],
    [],
    { '66':'mr:70','55':'mr:50','A9o':'mr:40' }
  ),

  // ── CO open ───────────────────────────────────────────────────────────────
  'tournament_9max_25bb_CO_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','K9s','KQo','KJo','KTo',
     'QJs','QTs','Q9s','QJo','QTo',
     'JTs','J9s','JTo','T9s','T8s','98s','97s',
     '87s','86s','76s','65s','54s'],
    [],
    { '44':'mr:60','33':'mr:40','22':'mr:30','A8o':'mr:40' }
  ),

  // ── BTN open ──────────────────────────────────────────────────────────────
  'tournament_9max_25bb_BTN_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
     'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A5o',
     'KQs','KJs','KTs','K9s','K8s','K7s','K5s',
     'KQo','KJo','KTo','K9o',
     'QJs','QTs','Q9s','Q8s','QJo','QTo','Q9o',
     'JTs','J9s','J8s','JTo','J9o',
     'T9s','T8s','T9o','98s','97s','98o',
     '87s','86s','76s','75s','65s','64s','54s','53s','43s'],
    [],
    { '22':'mr:50' }
  ),

  // ── SB open (jam-or-fold tilted towards jam at 25bb) ──────────────────────
  'tournament_9max_25bb_SB_open': makeRange(
    ['AA','KK','QQ','JJ','TT','99','88','77',
     'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A5s',
     'AKo','AQo','AJo','ATo','A9o',
     'KQs','KJs','KTs','KQo','KJo',
     'QJs','QTs','JTs','T9s','98s','87s'],
    ['66','55','44','33',
     'A6s','A4s','A3s','A2s',
     'K9s','Q9s','J9s',
     'KTo','QTo',
     'A8o','A7o']
  ),

  // ── BB vs open ────────────────────────────────────────────────────────────
  'tournament_9max_25bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','AKo','AQo',
     'KQs'],
    ['72o','73o','74o','75o','82o','83o','84o','85o','92o','93o','94o',
     '32o','42o','43o','52o','53o','62o','63o']
  ),
}
