// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_9d5c2h
// Generated: 2026-04-21T06:33:06.488Z
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

export const HU_40BB_3BP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_9d5c2h_btn_cbet: {
    'ATs':'x','A9s':'b33','A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b50@43,b33',
    'A4s':'mix:x@54,b33','A3s':'mix:x@54,b33','A2s':'b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@54,b33','K8s':'x','K7s':'x','K6s':'x','K5s':'mix:x@69,b33','K4s':'x',
    'K3s':'x','K2s':'mix:x@61,b33','KQo':'x','QJs':'x','QTs':'x','Q9s':'mix:x@52,b33',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'mix:x@56,b50','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'mix:x@49,b33','J8s':'x','J7s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','T9s':'mix:b33@45,x','T8s':'x','T7s':'x','A9o':'mix:b33@62,b50',
    'K9o':'mix:x@53,b33','Q9o':'mix:x@50,b33','J9o':'mix:x@46,b33','98s':'mix:b33@53,b50','97s':'mix:b33@53,b50','A8o':'x',
    '87s':'mix:x@61,b33','86s':'x','76s':'x','75s':'mix:x@36,b33','65s':'mix:x@47,b33','64s':'x',
    '54s':'mix:x@37,b50',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9d5c2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'r','AQs':'mix:c@53,r','AJs':'mix:c@70,r','ATs':'c','AKo':'r',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'mix:r@53,c','KQo':'c',
    'QQ':'r','QJs':'c','AJo':'mix:c@61,r','KJo':'c','JJ':'r','TT':'r',
    '99':'c','96s':'mix:r@64,c','86s':'c','85s':'mix:c@54,r','75s':'mix:r@51,c','74s':'f',
    '65s':'mix:r@55,c','64s':'c','63s':'c','65o':'mix:r@57,c','54s':'mix:r@57,c','53s':'mix:r@63,c',
    '64o':'c','54o':'mix:r@60,c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9d5c2h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'mix:f@56,c','KJs':'f','KTs':'f','AQo':'c','KQo':'f',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'f','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'f','85s':'c','75s':'c','74s':'f',
    '65s':'c','64s':'f','63s':'f','65o':'c','54s':'c','53s':'c',
    '64o':'f','54o':'c','43s':'c',
  },

}
