// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_QsJh2h
// Generated: 2026-04-21T06:35:02.286Z
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

export const HU_40BB_3BP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_QsJh2h_btn_cbet: {
    'ATs':'x','A9s':'b33','A8s':'b33','A7s':'b33','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'b33','A2s':'x','KQs':'b33','KJs':'mix:b33@54,x','KTs':'mix:x@57,b33',
    'K9s':'mix:x@58,b33','K8s':'b33','K7s':'b33','K6s':'x','K5s':'x','K4s':'mix:x@55,b33',
    'K3s':'b33','K2s':'mix:b33@59,x','KQo':'b33','QJs':'b33','QTs':'b33','Q9s':'b33',
    'Q8s':'b33','Q7s':'b33','Q6s':'b33','AJo':'b33','KJo':'mix:b33@66,x','QJo':'b33',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'x','KTo':'mix:b33@51,x',
    'QTo':'b33','JTo':'x','T9s':'x','T8s':'x','T7s':'b33','A9o':'b33',
    'K9o':'mix:x@63,b33','Q9o':'b33','J9o':'x','98s':'x','97s':'b33','A8o':'b33',
    '87s':'b33','86s':'x','76s':'mix:x@65,b33','75s':'mix:b33@61,x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_QsJh2h_bb_facing_cbet_small: {
    'AA':'r','AKs':'mix:r@64,c','AQs':'r','AJs':'mix:r@61,c','ATs':'r','AKo':'r',
    'KK':'r','KQs':'r','KJs':'r','KTs':'r','AQo':'r','KQo':'r',
    'QQ':'c','QJs':'r','AJo':'r','KJo':'r','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'mix:f@54,c','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

  // ──────────────────────────────
  hu_40bb_3bp_QsJh2h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'c','JJ':'c','TT':'mix:c@55,f',
    '99':'mix:f@62,c','96s':'f','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

}
