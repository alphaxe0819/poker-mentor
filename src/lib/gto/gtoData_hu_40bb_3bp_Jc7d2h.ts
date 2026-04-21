// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Jc7d2h
// Generated: 2026-04-21T06:34:03.937Z
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

export const HU_40BB_3BP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Jc7d2h_btn_cbet: {
    'ATs':'b33','A9s':'b33','A8s':'mix:x@55,b33','A7s':'mix:b33@51,x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'x','A2s':'b33','KQs':'mix:b33@53,x','KJs':'b33','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'mix:b33@53,x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'mix:x@62,b33','K2s':'b33','KQo':'b33','QJs':'b33','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'mix:x@56,b33','Q6s':'x','AJo':'b33','KJo':'b33','QJo':'b33',
    'JTs':'b33','J9s':'b33','J8s':'b33','J7s':'b33','ATo':'b33','KTo':'mix:b33@67,x',
    'QTo':'mix:b33@62,x','JTo':'b33','T9s':'x','T8s':'x','T7s':'x','A9o':'b33',
    'K9o':'b33','Q9o':'b33','J9o':'b33','98s':'x','97s':'x','A8o':'mix:b33@52,x',
    '87s':'x','86s':'x','76s':'x','75s':'x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Jc7d2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'r','AQs':'r','AJs':'r','ATs':'c','AKo':'r',
    'KK':'r','KQs':'r','KJs':'r','KTs':'r','AQo':'r','KQo':'r',
    'QQ':'r','QJs':'r','AJo':'r','KJo':'r','JJ':'c','TT':'r',
    '99':'r','96s':'f','86s':'r','85s':'r','75s':'r','74s':'r',
    '65s':'r','64s':'mix:r@64,f','63s':'f','65o':'f','54s':'r','53s':'mix:r@39,f',
    '64o':'f','54o':'f','43s':'mix:r@39,f',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Jc7d2h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'mix:f@54,c','KJs':'c','KTs':'mix:f@69,c','AQo':'c','KQo':'mix:f@60,c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'c','74s':'c',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

}
