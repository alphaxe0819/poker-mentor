// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Tc9c6d
// Generated: 2026-04-21T06:35:11.372Z
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

export const HU_40BB_3BP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Tc9c6d_btn_cbet: {
    'ATs':'mix:b50@52,x','A9s':'b50','A8s':'mix:b50@57,b33','A7s':'mix:b33@58,b50','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'mix:x@58,b33','A2s':'b33','KQs':'mix:b33@47,x','KJs':'x','KTs':'mix:b33@50,b50',
    'K9s':'mix:b33@50,b50','K8s':'x','K7s':'x','K6s':'mix:b50@42,x','K5s':'x','K4s':'x',
    'K3s':'b33','K2s':'b33','KQo':'b50','QJs':'mix:b50@42,x','QTs':'b50','Q9s':'b50',
    'Q8s':'mix:b50@49,b33','Q7s':'b33','Q6s':'mix:b50@53,b33','AJo':'mix:b50@45,b33','KJo':'mix:x@52,b33','QJo':'b50',
    'JTs':'mix:b33@63,b50','J9s':'mix:b33@54,b50','J8s':'b50','J7s':'x','ATo':'mix:b50@45,x','KTo':'mix:b33@60,b50',
    'QTo':'b50','JTo':'mix:b33@68,b50','T9s':'b33','T8s':'b50','T7s':'b50','A9o':'mix:b50@56,x',
    'K9o':'mix:b33@52,b50','Q9o':'b50','J9o':'mix:b33@61,b50','98s':'b50','97s':'b50','A8o':'b50',
    '87s':'mix:x@55,b33','86s':'b50','76s':'mix:b50@66,b33','75s':'x','65s':'mix:x@44,b33','64s':'mix:b50@40,b33',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Tc9c6d_bb_facing_cbet_small: {
    'AA':'r','AKs':'mix:c@57,f','AQs':'mix:c@68,r','AJs':'mix:c@40,f','ATs':'r','AKo':'mix:c@53,f',
    'KK':'r','KQs':'c','KJs':'c','KTs':'r','AQo':'mix:r@65,c','KQo':'mix:r@55,c',
    'QQ':'r','QJs':'r','AJo':'mix:r@52,c','KJo':'mix:r@50,c','JJ':'r','TT':'c',
    '99':'c','96s':'r','86s':'c','85s':'mix:f@40,c','75s':'f','74s':'f',
    '65s':'c','64s':'mix:c@59,r','63s':'mix:c@54,r','65o':'c','54s':'f','53s':'f',
    '64o':'c','54o':'f','43s':'f',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Tc9c6d_bb_facing_cbet_mid: {
    'AA':'c','AKs':'mix:c@59,f','AQs':'c','AJs':'mix:c@55,f','ATs':'c','AKo':'mix:c@54,f',
    'KK':'c','KQs':'c','KJs':'mix:c@50,f','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'mix:c@52,f','KJo':'mix:c@50,f','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'c','85s':'f','75s':'f','74s':'f',
    '65s':'mix:f@67,c','64s':'mix:f@67,c','63s':'mix:f@67,c','65o':'mix:c@51,f','54s':'f','53s':'f',
    '64o':'mix:c@51,f','54o':'f','43s':'f',
  },

}
