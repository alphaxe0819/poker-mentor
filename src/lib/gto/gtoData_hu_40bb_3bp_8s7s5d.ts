// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_8s7s5d
// Generated: 2026-04-21T06:32:56.143Z
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

export const HU_40BB_3BP_8S7S5D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_8s7s5d_btn_cbet: {
    'ATs':'x','A9s':'x','A8s':'x','A7s':'x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'x','A2s':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','KQo':'x','QJs':'x','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'x','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'x','T7s':'x','A9o':'x',
    'K9o':'x','Q9o':'x','J9o':'x','98s':'mix:x@55,b33','97s':'mix:x@59,b33','A8o':'x',
    '87s':'mix:x@53,b33','86s':'mix:x@62,b33','76s':'mix:x@64,b33','75s':'mix:x@55,b33','65s':'mix:x@66,b33','64s':'mix:b33@51,x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_8s7s5d_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'mix:r@64,c','KQs':'c','KJs':'c','KTs':'mix:c@56,f','AQo':'c','KQo':'c',
    'QQ':'r','QJs':'mix:f@51,c','AJo':'c','KJo':'c','JJ':'r','TT':'r',
    '99':'r','96s':'c','86s':'r','85s':'r','75s':'mix:r@62,c','74s':'r',
    '65s':'r','64s':'c','63s':'mix:c@66,r','65o':'r','54s':'r','53s':'mix:c@66,r',
    '64o':'c','54o':'r','43s':'mix:f@62,c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_8s7s5d_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'mix:f@51,c','KJs':'mix:f@51,c','KTs':'mix:f@52,c','AQo':'mix:c@68,f','KQo':'mix:f@54,c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'mix:f@52,c','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'c','85s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c','63s':'f','65o':'c','54s':'c','53s':'mix:f@66,c',
    '64o':'c','54o':'c','43s':'f',
  },

}
