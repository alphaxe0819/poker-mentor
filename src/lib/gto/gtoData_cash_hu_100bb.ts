import { makeRangeDefaultCall, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_CASH_HU_100BB: GtoDB = {
  // ── SB/BTN open (HU: SB=BTN, opens ~80% of hands) ────────────────────────
  'cash_hu_100bb_SB_open': makeRangeDefaultRaise(
    ['72o','73o','82o','83o','92o','32o','42o','52o','62o',
     '72s','82s','32s'],
    [],
    { '74o':'mr:60','84o':'mr:70','93o':'mr:60','94o':'mr:70',
      '43o':'mr:50','53o':'mr:60','63o':'mr:70' }
  ),

  // ── BB defend (HU: BB defends very wide) ──────────────────────────────────
  'cash_hu_100bb_BB_vs_open': makeRangeDefaultCall(
    ['AA','KK','QQ','JJ','TT','99',
     'AKs','AQs','AJs','ATs','A9s','AKo','AQo','AJo',
     'KQs','KJs','KTs','KQo',
     'QJs','QTs','JTs',
     'A5s','A4s','54s','43s'],
    ['72o','73o','82o','32o','42o','52o']
  ),
}
