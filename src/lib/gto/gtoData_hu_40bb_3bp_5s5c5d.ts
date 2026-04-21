// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_5s5c5d
// Generated: 2026-04-21T06:32:16.482Z
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

export const HU_40BB_3BP_5S5C5D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_5s5c5d_btn_cbet: {
    'ATs':'mix:b50@50,x','A9s':'mix:b50@45,x','A8s':'mix:b50@43,x','A7s':'mix:x@45,b50','A6s':'mix:x@52,b50','A5s':'mix:x@64,b33',
    'A4s':'mix:x@46,b50','A3s':'mix:b50@47,x','A2s':'mix:b50@52,x','KQs':'mix:x@41,b50','KJs':'mix:x@56,b50','KTs':'mix:x@65,b50',
    'K9s':'mix:x@70,b50','K8s':'x','K7s':'x','K6s':'x','K5s':'mix:x@65,b33','K4s':'x',
    'K3s':'mix:x@70,b50','K2s':'mix:x@68,b50','KQo':'mix:x@43,b50','QJs':'x','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'mix:b50@48,x','KJo':'mix:x@59,b50','QJo':'x',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'mix:b50@49,x','KTo':'mix:x@69,b50',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'x','T7s':'x','A9o':'mix:b50@44,x',
    'K9o':'x','Q9o':'x','J9o':'x','98s':'x','97s':'x','A8o':'mix:x@44,b50',
    '87s':'x','86s':'x','76s':'x','75s':'mix:x@61,b33','65s':'mix:x@46,b33','64s':'x',
    '54s':'mix:x@55,b33',
  },

  // ──────────────────────────────
  hu_40bb_3bp_5s5c5d_bb_facing_cbet_small: {
    'AA':'c','AKs':'r','AQs':'r','AJs':'r','ATs':'r','AKo':'r',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'r','KQo':'c',
    'QQ':'r','QJs':'c','AJo':'r','KJo':'c','JJ':'r','TT':'r',
    '99':'r','96s':'c','86s':'mix:c@51,r','85s':'c','75s':'c','74s':'mix:c@68,r',
    '65s':'c','64s':'r','63s':'mix:c@54,r','65o':'c','54s':'c','53s':'c',
    '64o':'mix:r@55,c','54o':'c','43s':'mix:c@57,r',
  },

  // ──────────────────────────────
  hu_40bb_3bp_5s5c5d_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'c','KJs':'c','KTs':'c','AQo':'c','KQo':'c',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'c','JJ':'c','TT':'c',
    '99':'c','96s':'f','86s':'f','85s':'c','75s':'c','74s':'f',
    '65s':'c','64s':'f','63s':'f','65o':'c','54s':'c','53s':'c',
    '64o':'f','54o':'c','43s':'f',
  },

}
