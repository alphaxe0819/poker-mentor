// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Td8h4c
// Generated: 2026-04-21T06:35:21.629Z
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

export const HU_40BB_3BP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Td8h4c_btn_cbet: {
    'ATs':'b33','A9s':'b33','A8s':'b33','A7s':'b33','A6s':'x','A5s':'x',
    'A4s':'b50','A3s':'x','A2s':'mix:b33@60,x','KQs':'x','KJs':'x','KTs':'mix:b33@53,x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'mix:b50@55,b33',
    'K3s':'x','K2s':'b33','KQo':'mix:b33@59,x','QJs':'mix:b33@43,x','QTs':'b33','Q9s':'mix:x@67,b33',
    'Q8s':'mix:b33@60,x','Q7s':'x','Q6s':'x','AJo':'b33','KJo':'mix:b33@66,x','QJo':'mix:x@44,b33',
    'JTs':'b33','J9s':'mix:x@59,b33','J8s':'mix:b33@67,x','J7s':'x','ATo':'b33','KTo':'mix:b33@67,x',
    'QTo':'b33','JTo':'b33','T9s':'b33','T8s':'b33','T7s':'b33','A9o':'b33',
    'K9o':'mix:x@57,b33','Q9o':'mix:x@65,b33','J9o':'b33','98s':'mix:x@59,b33','97s':'b33','A8o':'b33',
    '87s':'mix:x@67,b33','86s':'mix:x@55,b33','76s':'b33','75s':'x','65s':'x','64s':'mix:b50@38,b33',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Td8h4c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'r','AJs':'c','ATs':'r','AKo':'c',
    'KK':'r','KQs':'c','KJs':'mix:r@67,c','KTs':'r','AQo':'r','KQo':'c',
    'QQ':'r','QJs':'r','AJo':'c','KJo':'c','JJ':'r','TT':'c',
    '99':'r','96s':'c','86s':'r','85s':'r','75s':'c','74s':'r',
    '65s':'c','64s':'r','63s':'f','65o':'c','54s':'r','53s':'f',
    '64o':'r','54o':'r','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Td8h4c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'f',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'mix:f@58,c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'c','85s':'c','75s':'f','74s':'c',
    '65s':'f','64s':'c','63s':'f','65o':'f','54s':'c','53s':'f',
    '64o':'c','54o':'c','43s':'c',
  },

}
