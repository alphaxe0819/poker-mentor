// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_8s5h2c
// Generated: 2026-04-21T06:32:46.839Z
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

export const HU_40BB_3BP_8S5H2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_8s5h2c_btn_cbet: {
    'ATs':'x','A9s':'x','A8s':'mix:b33@43,x','A7s':'x','A6s':'x','A5s':'mix:x@41,b33',
    'A4s':'x','A3s':'x','A2s':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:x@59,b33','K7s':'x','K6s':'x','K5s':'mix:x@70,b33','K4s':'x',
    'K3s':'x','K2s':'x','KQo':'x','QJs':'x','QTs':'x','Q9s':'x',
    'Q8s':'mix:x@64,b33','Q7s':'x','Q6s':'x','AJo':'x','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'x','J8s':'mix:x@57,b33','J7s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'mix:x@47,b33','T7s':'x','A9o':'x',
    'K9o':'x','Q9o':'x','J9o':'x','98s':'mix:x@47,b33','97s':'x','A8o':'mix:b33@40,x',
    '87s':'mix:x@48,b33','86s':'mix:x@49,b33','76s':'x','75s':'mix:x@67,b33','65s':'mix:x@69,b33','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_8s5h2c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'c','AJo':'c','KJo':'mix:c@57,f','JJ':'r','TT':'r',
    '99':'r','96s':'c','86s':'mix:c@56,r','85s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c','63s':'c','65o':'c','54s':'c','53s':'c',
    '64o':'c','54o':'c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_8s5h2c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'f','KJs':'f','KTs':'f','AQo':'c','KQo':'f',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'f','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'c','85s':'c','75s':'c','74s':'f',
    '65s':'c','64s':'c','63s':'f','65o':'c','54s':'c','53s':'c',
    '64o':'c','54o':'c','43s':'mix:c@67,f',
  },

}
