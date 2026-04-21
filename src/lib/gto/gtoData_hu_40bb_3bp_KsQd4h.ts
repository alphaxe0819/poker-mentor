// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_KsQd4h
// Generated: 2026-04-21T06:34:53.193Z
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

export const HU_40BB_3BP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_KsQd4h_btn_cbet: {
    'ATs':'mix:x@61,b33','A9s':'x','A8s':'mix:x@65,b33','A7s':'mix:x@52,b33','A6s':'x','A5s':'x',
    'A4s':'b33','A3s':'mix:x@53,b33','A2s':'mix:b33@55,x','KQs':'b33','KJs':'b33','KTs':'mix:b33@64,x',
    'K9s':'b33','K8s':'b33','K7s':'b33','K6s':'b33','K5s':'b33','K4s':'x',
    'K3s':'b33','K2s':'b33','KQo':'b33','QJs':'mix:b33@54,x','QTs':'mix:b33@53,x','Q9s':'mix:x@65,b33',
    'Q8s':'mix:b33@50,x','Q7s':'mix:x@65,b33','Q6s':'mix:b33@59,x','AJo':'b33','KJo':'b33','QJo':'mix:b33@62,x',
    'JTs':'mix:x@50,b33','J9s':'x','J8s':'mix:b33@52,x','J7s':'mix:b33@68,x','ATo':'mix:x@52,b33','KTo':'b33',
    'QTo':'mix:b33@60,x','JTo':'mix:b33@57,x','T9s':'x','T8s':'mix:x@63,b33','T7s':'mix:b33@53,x','A9o':'mix:x@65,b33',
    'K9o':'b33','Q9o':'mix:x@65,b33','J9o':'mix:x@61,b33','98s':'x','97s':'x','A8o':'mix:x@59,b33',
    '87s':'mix:b33@50,x','86s':'x','76s':'mix:x@68,b33','75s':'mix:x@58,b33','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_KsQd4h_bb_facing_cbet_small: {
    'AA':'r','AKs':'r','AQs':'c','AJs':'mix:c@66,r','ATs':'c','AKo':'r',
    'KK':'c','KQs':'c','KJs':'r','KTs':'r','AQo':'mix:c@70,r','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'mix:c@56,r','KJo':'r','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'f','74s':'c',
    '65s':'f','64s':'c','63s':'f','65o':'f','54s':'c','53s':'f',
    '64o':'c','54o':'c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_KsQd4h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'c','JJ':'f','TT':'mix:c@60,f',
    '99':'f','96s':'f','86s':'f','85s':'f','75s':'f','74s':'c',
    '65s':'f','64s':'c','63s':'f','65o':'f','54s':'c','53s':'f',
    '64o':'f','54o':'f','43s':'c',
  },

}
