// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_JsTc9h
// Generated: 2026-04-21T06:34:24.133Z
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

export const HU_40BB_3BP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_JsTc9h_btn_cbet: {
    'ATs':'x','A9s':'x','A8s':'x','A7s':'b33','A6s':'b33','A5s':'mix:x@53,b33',
    'A4s':'mix:x@52,b33','A3s':'b33','A2s':'b33','KQs':'mix:b33@65,x','KJs':'b33','KTs':'mix:x@65,b33',
    'K9s':'x','K8s':'x','K7s':'mix:b33@65,x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'b33','K2s':'b33','KQo':'b33','QJs':'mix:b33@62,x','QTs':'mix:x@62,b33','Q9s':'mix:x@58,b33',
    'Q8s':'b33','Q7s':'x','Q6s':'x','AJo':'x','KJo':'b33','QJo':'b33',
    'JTs':'mix:b33@69,x','J9s':'mix:x@53,b33','J8s':'b33','J7s':'x','ATo':'x','KTo':'mix:x@58,b33',
    'QTo':'mix:b33@53,x','JTo':'b33','T9s':'mix:b33@65,x','T8s':'mix:b33@55,x','T7s':'x','A9o':'x',
    'K9o':'x','Q9o':'mix:b33@57,x','J9o':'mix:b33@56,x','98s':'b33','97s':'x','A8o':'mix:b33@55,x',
    '87s':'b33','86s':'x','76s':'b33','75s':'mix:b33@69,x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_JsTc9h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'r','ATs':'c','AKo':'c',
    'KK':'r','KQs':'c','KJs':'r','KTs':'mix:r@62,c','AQo':'mix:r@53,c','KQo':'c',
    'QQ':'r','QJs':'r','AJo':'r','KJo':'r','JJ':'r','TT':'r',
    '99':'r','96s':'c','86s':'c','85s':'c','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

  // ──────────────────────────────
  hu_40bb_3bp_JsTc9h_bb_facing_cbet_mid: {
    'AA':'c','AKs':'mix:f@63,c','AQs':'c','AJs':'c','ATs':'c','AKo':'f',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'f','75s':'f','74s':'f',
    '65s':'f','64s':'f','63s':'f','65o':'f','54s':'f','53s':'f',
    '64o':'f','54o':'f','43s':'f',
  },

}
