// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_6d5h4c
// Generated: 2026-04-21T06:32:26.774Z
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

export const HU_40BB_3BP_6D5H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_6d5h4c_btn_cbet: {
    'ATs':'x','A9s':'x','A8s':'x','A7s':'x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'x','A2s':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','KQo':'x','QJs':'x','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'x','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'x','T7s':'x','A9o':'x',
    'K9o':'x','Q9o':'x','J9o':'x','98s':'x','97s':'x','A8o':'x',
    '87s':'mix:b33@51,x','86s':'mix:x@50,b33','76s':'mix:x@46,b33','75s':'mix:b33@46,x','65s':'mix:b33@49,x','64s':'mix:b33@49,x',
    '54s':'mix:x@55,b33',
  },

  // ──────────────────────────────
  hu_40bb_3bp_6d5h4c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'mix:r@67,c','KJs':'mix:c@64,r','KTs':'mix:c@57,r','AQo':'c','KQo':'mix:r@63,c',
    'QQ':'c','QJs':'r','AJo':'c','KJo':'c','JJ':'c','TT':'r',
    '99':'r','96s':'r','86s':'r','85s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c','63s':'r','65o':'c','54s':'c','53s':'c',
    '64o':'c','54o':'c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_6d5h4c_bb_facing_cbet_mid: {
    'AA':'c','AKs':'f','AQs':'f','AJs':'f','ATs':'f','AKo':'f',
    'KK':'c','KQs':'f','KJs':'f','KTs':'f','AQo':'f','KQo':'f',
    'QQ':'c','QJs':'f','AJo':'f','KJo':'f','JJ':'c','TT':'c',
    '99':'c','96s':'c','86s':'c','85s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c','63s':'c','65o':'c','54s':'c','53s':'mix:c@63,f',
    '64o':'c','54o':'c','43s':'mix:c@58,f',
  },

}
