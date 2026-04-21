// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Ah8h3c
// Generated: 2026-04-21T06:33:53.698Z
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

export const HU_40BB_3BP_AH8H3C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Ah8h3c_btn_cbet: {
    'ATs':'mix:b33@51,x','A9s':'mix:b33@53,x','A8s':'mix:x@56,b33','A7s':'mix:b33@56,x','A6s':'mix:b33@64,x','A5s':'mix:b33@57,x',
    'A4s':'mix:b33@59,x','A3s':'mix:x@56,b33','A2s':'mix:b33@55,x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@63,b33','K8s':'mix:x@58,b33','K7s':'mix:x@68,b33','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'mix:b33@49,x','K2s':'mix:x@60,b33','KQo':'x','QJs':'mix:x@64,b33','QTs':'mix:x@55,b33','Q9s':'mix:x@54,b33',
    'Q8s':'mix:x@53,b33','Q7s':'mix:x@58,b33','Q6s':'mix:x@65,b33','AJo':'mix:b33@49,x','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'mix:x@67,b33','J8s':'mix:x@67,b33','J7s':'mix:x@68,b33','ATo':'mix:b33@51,x','KTo':'x',
    'QTo':'mix:x@62,b33','JTo':'x','T9s':'x','T8s':'mix:x@62,b33','T7s':'x','A9o':'mix:b33@52,x',
    'K9o':'x','Q9o':'mix:x@61,b33','J9o':'x','98s':'mix:x@61,b33','97s':'x','A8o':'mix:x@55,b33',
    '87s':'mix:x@62,b33','86s':'mix:x@58,b33','76s':'x','75s':'x','65s':'x','64s':'mix:x@69,b33',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah8h3c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'mix:c@50,f','AJo':'c','KJo':'c','JJ':'c','TT':'r',
    '99':'r','96s':'mix:f@57,c','86s':'r','85s':'r','75s':'mix:f@53,c','74s':'mix:f@61,c',
    '65s':'mix:f@50,c','64s':'mix:f@59,c','63s':'mix:r@66,c','65o':'mix:f@58,c','54s':'c','53s':'mix:r@68,c',
    '64o':'f','54o':'mix:r@53,c','43s':'mix:r@68,c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah8h3c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'mix:f@50,c','KTs':'f','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'f','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'c','85s':'c','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'c','65o':'f','54s':'f','53s':'c',
    '64o':'f','54o':'f','43s':'c',
  },

}
