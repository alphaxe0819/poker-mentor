// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_9s7s3s
// Generated: 2026-04-21T06:33:24.674Z
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

export const HU_40BB_3BP_9S7S3S: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_9s7s3s_btn_cbet: {
    'ATs':'b50','A9s':'b50','A8s':'mix:b50@43,x','A7s':'b50','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'b50','A2s':'mix:b50@40,b33','KQs':'x','KJs':'x','KTs':'mix:b33@47,x',
    'K9s':'b50','K8s':'mix:x@65,b33','K7s':'b50','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'b50','K2s':'mix:b33@54,x','KQo':'x','QJs':'mix:x@54,b33','QTs':'mix:x@57,b33','Q9s':'b50',
    'Q8s':'x','Q7s':'b50','Q6s':'x','AJo':'mix:b50@62,b33','KJo':'x','QJo':'mix:x@53,b50',
    'JTs':'b50','J9s':'b50','J8s':'mix:x@46,b50','J7s':'b50','ATo':'mix:b50@52,b33','KTo':'mix:x@50,b50',
    'QTo':'mix:b50@40,x','JTo':'b50','T9s':'b50','T8s':'mix:x@59,b33','T7s':'b50','A9o':'mix:b50@66,b33',
    'K9o':'mix:b50@66,b33','Q9o':'mix:b50@65,b33','J9o':'mix:b50@66,b33','98s':'b50','97s':'b33','A8o':'mix:x@38,b50',
    '87s':'mix:b50@68,b33','86s':'mix:b33@61,x','76s':'mix:b33@52,x','75s':'mix:x@47,b33','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9s7s3s_bb_facing_cbet_small: {
    'AA':'r','AKs':'mix:r@58,c','AQs':'mix:r@59,c','AJs':'mix:r@62,c','ATs':'mix:r@56,c','AKo':'mix:r@61,c',
    'KK':'r','KQs':'c','KJs':'c','KTs':'mix:c@61,f','AQo':'mix:r@68,c','KQo':'c',
    'QQ':'r','QJs':'mix:c@52,f','AJo':'r','KJo':'c','JJ':'r','TT':'r',
    '99':'r','96s':'r','86s':'r','85s':'c','75s':'r','74s':'r',
    '65s':'r','64s':'c','63s':'r','65o':'r','54s':'c','53s':'r',
    '64o':'c','54o':'c','43s':'r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_9s7s3s_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'mix:c@50,f','KJs':'mix:f@54,c','KTs':'mix:f@54,c','AQo':'c','KQo':'mix:c@59,f',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'mix:c@51,f','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'c','85s':'f','75s':'c','74s':'c',
    '65s':'c','64s':'f','63s':'c','65o':'c','54s':'f','53s':'c',
    '64o':'mix:c@50,f','54o':'mix:c@50,f','43s':'c',
  },

}
