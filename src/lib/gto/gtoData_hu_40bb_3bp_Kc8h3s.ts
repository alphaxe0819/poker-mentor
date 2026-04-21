// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Kc8h3s
// Generated: 2026-04-21T06:34:34.305Z
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

export const HU_40BB_3BP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Kc8h3s_btn_cbet: {
    'ATs':'mix:x@57,b33','A9s':'mix:x@62,b33','A8s':'mix:b33@58,x','A7s':'x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'b33','A2s':'mix:x@56,b33','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'mix:b33@70,x','K7s':'b33','K6s':'b33','K5s':'b33','K4s':'b33',
    'K3s':'mix:b33@63,x','K2s':'b33','KQo':'b33','QJs':'mix:x@62,b33','QTs':'mix:x@57,b33','Q9s':'mix:x@54,b33',
    'Q8s':'mix:b33@51,x','Q7s':'mix:x@63,b33','Q6s':'x','AJo':'b33','KJo':'b33','QJo':'mix:b33@66,x',
    'JTs':'mix:x@63,b33','J9s':'mix:x@56,b33','J8s':'mix:x@52,b33','J7s':'mix:x@65,b33','ATo':'mix:b33@59,x','KTo':'b33',
    'QTo':'mix:b33@69,x','JTo':'mix:b33@57,x','T9s':'x','T8s':'mix:x@53,b33','T7s':'x','A9o':'mix:b33@65,x',
    'K9o':'b33','Q9o':'b33','J9o':'b33','98s':'mix:x@60,b33','97s':'x','A8o':'mix:b33@61,x',
    '87s':'mix:x@63,b33','86s':'x','76s':'x','75s':'x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Kc8h3s_bb_facing_cbet_small: {
    'AA':'mix:r@62,c','AKs':'mix:c@59,r','AQs':'mix:c@51,r','AJs':'mix:c@61,r','ATs':'c','AKo':'mix:r@55,c',
    'KK':'c','KQs':'r','KJs':'r','KTs':'r','AQo':'mix:c@58,r','KQo':'r',
    'QQ':'c','QJs':'c','AJo':'mix:c@64,r','KJo':'r','JJ':'c','TT':'r',
    '99':'r','96s':'mix:c@49,f','86s':'r','85s':'r','75s':'mix:c@40,f','74s':'mix:c@53,f',
    '65s':'r','64s':'mix:r@48,f','63s':'r','65o':'f','54s':'r','53s':'r',
    '64o':'f','54o':'f','43s':'r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Kc8h3s_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'c','85s':'c','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'c','65o':'f','54s':'f','53s':'c',
    '64o':'f','54o':'f','43s':'c',
  },

}
