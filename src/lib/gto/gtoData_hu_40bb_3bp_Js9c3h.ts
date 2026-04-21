// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Js9c3h
// Generated: 2026-04-21T06:34:14.171Z
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

export const HU_40BB_3BP_JS9C3H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Js9c3h_btn_cbet: {
    'ATs':'mix:b33@45,x','A9s':'x','A8s':'x','A7s':'x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'b33','A2s':'mix:x@70,b33','KQs':'mix:b33@50,x','KJs':'b33','KTs':'x',
    'K9s':'mix:x@65,b33','K8s':'b33','K7s':'b33','K6s':'x','K5s':'x','K4s':'mix:x@66,b33',
    'K3s':'b33','K2s':'b33','KQo':'mix:b33@49,x','QJs':'b33','QTs':'mix:x@51,b33','Q9s':'mix:b33@53,x',
    'Q8s':'x','Q7s':'b33','Q6s':'x','AJo':'b33','KJo':'b33','QJo':'b33',
    'JTs':'b33','J9s':'b33','J8s':'b33','J7s':'mix:b33@67,x','ATo':'b33','KTo':'x',
    'QTo':'mix:b33@56,x','JTo':'b33','T9s':'mix:x@65,b33','T8s':'x','T7s':'x','A9o':'x',
    'K9o':'mix:x@60,b33','Q9o':'mix:b33@60,x','J9o':'b33','98s':'x','97s':'x','A8o':'b33',
    '87s':'x','86s':'x','76s':'mix:x@63,b33','75s':'mix:x@69,b33','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Js9c3h_bb_facing_cbet_small: {
    'AA':'r','AKs':'mix:c@57,r','AQs':'mix:c@50,r','AJs':'r','ATs':'mix:r@51,c','AKo':'c',
    'KK':'r','KQs':'r','KJs':'r','KTs':'r','AQo':'mix:c@57,r','KQo':'r',
    'QQ':'r','QJs':'r','AJo':'r','KJo':'r','JJ':'c','TT':'r',
    '99':'mix:c@60,r','96s':'r','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'r','65o':'f','54s':'mix:f@54,c','53s':'r',
    '64o':'f','54o':'f','43s':'r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Js9c3h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'mix:f@67,c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'mix:c@60,f','65o':'f','54s':'f','53s':'mix:c@59,f',
    '64o':'f','54o':'f','43s':'mix:c@59,f',
  },

}
