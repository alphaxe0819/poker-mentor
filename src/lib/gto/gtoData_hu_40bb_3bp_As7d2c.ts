// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_As7d2c
// Generated: 2026-04-21T06:25:07.803Z
// =============================================================
//
// Action codes:
//   'x'      = check
//   'c'      = call
//   'f'      = fold
//   'r'      = raise (small)
//   'rbig'   = raise (large)
//   'b33'    = bet 33% pot (UI: 小)
//   'b50'    = bet 50% pot (UI: 中)
//   'b100'   = bet 100% pot (UI: 大)
//   'allin'  = all-in
//   'mix:CODE@PCT,CODE' = mixed strategy (e.g. 'mix:b33@60,x' = 60% b33 / 40% check)
// =============================================================

export type GtoRange = Record<string, string>
export type GtoDatabase = Record<string, GtoRange>

export const HU_40BB_3BP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_As7d2c_btn_cbet: {
    'ATs':'mix:b33@66,x','A9s':'mix:b33@68,x','A8s':'b33','A7s':'mix:b33@56,x','A6s':'b33','A5s':'b33',
    'A4s':'b33','A3s':'b33','A2s':'mix:b33@59,x','KQs':'mix:b50@63,b33','KJs':'mix:x@45,b33','KTs':'mix:x@52,b33',
    'K9s':'mix:x@58,b33','K8s':'x','K7s':'mix:b33@54,x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'mix:x@64,b33','K2s':'mix:b33@60,b50','KQo':'b50','QJs':'mix:x@51,b33','QTs':'mix:x@47,b33','Q9s':'mix:x@54,b33',
    'Q8s':'mix:x@66,b33','Q7s':'mix:b33@56,x','Q6s':'x','AJo':'mix:b33@64,x','KJo':'mix:x@43,b33','QJo':'mix:x@49,b33',
    'JTs':'mix:x@56,b33','J9s':'mix:x@59,b33','J8s':'x','J7s':'mix:x@55,b33','ATo':'mix:b33@68,x','KTo':'mix:b33@53,x',
    'QTo':'mix:b33@52,x','JTo':'mix:x@49,b33','T9s':'mix:x@67,b33','T8s':'x','T7s':'mix:x@50,b33','A9o':'b33',
    'K9o':'mix:b33@58,x','Q9o':'mix:b33@57,x','J9o':'mix:b33@54,x','98s':'x','97s':'mix:x@58,b33','A8o':'b33',
    '87s':'mix:x@60,b33','86s':'x','76s':'mix:x@53,b33','75s':'mix:x@64,b33','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_As7d2c_bb_facing_cbet_small: {
    'AA':'c','AKs':'mix:c@70,r','AQs':'mix:r@55,c','AJs':'c','ATs':'mix:c@54,r','AKo':'mix:c@65,r',
    'KK':'c','KQs':'mix:c@57,r','KJs':'c','KTs':'c','AQo':'mix:r@60,c','KQo':'mix:c@62,r',
    'QQ':'r','QJs':'mix:c@66,f','AJo':'mix:c@68,r','KJo':'c','JJ':'r','TT':'r',
    '99':'r','96s':'mix:c@53,f','86s':'c','85s':'c','75s':'r','74s':'r',
    '65s':'mix:c@57,f','64s':'mix:f@60,c','63s':'f','65o':'f','54s':'r','53s':'r',
    '64o':'f','54o':'r','43s':'r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_As7d2c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'f','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'mix:c@54,f','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'c','74s':'c',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'c','53s':'c',
    '64o':'f','54o':'f','43s':'c',
  },

}
