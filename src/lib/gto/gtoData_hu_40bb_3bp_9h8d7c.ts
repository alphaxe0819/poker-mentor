// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_9h8d7c
// Generated: 2026-04-21T06:33:16.712Z
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

export const HU_40BB_3BP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_9h8d7c_btn_cbet: {
    'ATs':'mix:b33@58,b50','A9s':'b50','A8s':'mix:b50@42,b33','A7s':'mix:x@61,b33','A6s':'mix:x@58,b33','A5s':'x',
    'A4s':'x','A3s':'mix:x@58,b33','A2s':'b33','KQs':'x','KJs':'x','KTs':'mix:b33@44,b50',
    'K9s':'mix:b50@59,b33','K8s':'mix:x@69,b33','K7s':'x','K6s':'x','K5s':'mix:x@67,b33','K4s':'x',
    'K3s':'b33','K2s':'b33','KQo':'mix:b33@57,x','QJs':'x','QTs':'mix:b50@55,b33','Q9s':'mix:b33@60,b50',
    'Q8s':'mix:b33@55,x','Q7s':'x','Q6s':'mix:x@52,b33','AJo':'mix:b50@55,b33','KJo':'mix:b33@65,x','QJo':'mix:b33@56,x',
    'JTs':'mix:x@63,b33','J9s':'b33','J8s':'b33','J7s':'b33','ATo':'b50','KTo':'mix:b50@54,x',
    'QTo':'mix:x@51,b50','JTo':'mix:x@55,b33','T9s':'b33','T8s':'b33','T7s':'b33','A9o':'b50',
    'K9o':'b50','Q9o':'mix:b50@63,b33','J9o':'b33','98s':'b33','97s':'b33','A8o':'mix:b50@62,x',
    '87s':'b33','86s':'b33','76s':'b33','75s':'b33','65s':'b33','64s':'x',
    '54s':'mix:b33@51,x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9h8d7c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'mix:c@64,r','AJs':'r','ATs':'c','AKo':'mix:c@60,f',
    'KK':'c','KQs':'c','KJs':'r','KTs':'r','AQo':'mix:c@58,r','KQo':'f',
    'QQ':'r','QJs':'c','AJo':'r','KJo':'r','JJ':'r','TT':'r',
    '99':'c','96s':'r','86s':'r','85s':'r','75s':'c','74s':'c',
    '65s':'mix:r@64,c','64s':'r','63s':'mix:c@63,r','65o':'r','54s':'f','53s':'f',
    '64o':'mix:c@57,f','54o':'f','43s':'f',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9h8d7c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'f',
    'KK':'c','KQs':'f','KJs':'c','KTs':'c','AQo':'mix:c@58,f','KQo':'f',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'c','85s':'c','75s':'c','74s':'mix:c@67,f',
    '65s':'c','64s':'f','63s':'f','65o':'c','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

}
