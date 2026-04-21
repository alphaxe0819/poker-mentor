// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_7s7d2h
// Generated: 2026-04-21T06:32:36.362Z
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

export const HU_40BB_3BP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_7s7d2h_btn_cbet: {
    'ATs':'b33','A9s':'b33','A8s':'b33','A7s':'mix:x@61,b33','A6s':'mix:x@64,b33','A5s':'mix:x@64,b33',
    'A4s':'mix:x@67,b33','A3s':'b33','A2s':'b33','KQs':'b33','KJs':'b33','KTs':'mix:b33@66,x',
    'K9s':'mix:b33@53,x','K8s':'mix:x@54,b33','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'b33','KQo':'b33','QJs':'mix:x@58,b33','QTs':'mix:x@69,b33','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'b33','KJo':'b33','QJo':'mix:x@67,b33',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'mix:b33@60,b50','KTo':'mix:b33@49,x',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'x','T7s':'x','A9o':'mix:b33@52,b50',
    'K9o':'mix:b33@44,x','Q9o':'x','J9o':'x','98s':'mix:x@57,b33','97s':'x','A8o':'mix:b33@62,b50',
    '87s':'x','86s':'mix:x@63,b33','76s':'mix:b33@50,x','75s':'mix:x@68,b33','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_7s7d2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'r','AQs':'r','AJs':'r','ATs':'r','AKo':'r',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'r','KQo':'mix:r@55,c',
    'QQ':'c','QJs':'c','AJo':'r','KJo':'c','JJ':'c','TT':'r',
    '99':'r','96s':'c','86s':'c','85s':'c','75s':'c','74s':'c',
    '65s':'r','64s':'mix:c@64,r','63s':'c','65o':'c','54s':'mix:r@68,c','53s':'c',
    '64o':'c','54o':'c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_7s7d2h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'f','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'c','74s':'c',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

}
