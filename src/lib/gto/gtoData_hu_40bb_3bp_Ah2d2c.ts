// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Ah2d2c
// Generated: 2026-04-21T06:33:33.974Z
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

export const HU_40BB_3BP_AH2D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Ah2d2c_btn_cbet: {
    'ATs':'mix:x@56,b33','A9s':'mix:b33@50,x','A8s':'mix:b33@55,x','A7s':'mix:b33@54,x','A6s':'b33','A5s':'mix:b33@60,x',
    'A4s':'mix:b33@59,x','A3s':'mix:b33@53,x','A2s':'x','KQs':'b33','KJs':'b33','KTs':'mix:b33@50,x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','KQo':'mix:b33@67,b50','QJs':'mix:x@69,b33','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'mix:x@54,b33','KJo':'mix:b33@51,b50','QJo':'mix:x@62,b33',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'mix:x@69,b33','ATo':'mix:x@53,b33','KTo':'mix:x@36,b50',
    'QTo':'mix:x@58,b33','JTo':'mix:x@55,b33','T9s':'mix:x@69,b33','T8s':'x','T7s':'x','A9o':'mix:b33@52,x',
    'K9o':'mix:x@59,b33','Q9o':'mix:x@60,b33','J9o':'mix:x@52,b33','98s':'mix:x@69,b33','97s':'mix:x@68,b33','A8o':'mix:b33@57,x',
    '87s':'mix:x@62,b33','86s':'x','76s':'x','75s':'x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah2d2c_bb_facing_cbet_small: {
    'AA':'r','AKs':'r','AQs':'r','AJs':'r','ATs':'r','AKo':'r',
    'KK':'c','KQs':'r','KJs':'r','KTs':'mix:c@52,r','AQo':'r','KQo':'r',
    'QQ':'r','QJs':'c','AJo':'r','KJo':'r','JJ':'r','TT':'r',
    '99':'r','96s':'f','86s':'mix:f@60,c','85s':'mix:c@69,f','75s':'mix:c@59,f','74s':'mix:c@61,f',
    '65s':'mix:f@46,c','64s':'mix:f@43,c','63s':'mix:c@42,f','65o':'f','54s':'r','53s':'r',
    '64o':'f','54o':'r','43s':'r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah2d2c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'c','53s':'c',
    '64o':'f','54o':'f','43s':'c',
  },

}
