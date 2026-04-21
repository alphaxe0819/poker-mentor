// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Kh9h4c
// Generated: 2026-04-16T12:39:09.672Z
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

export const HU_25BB_3BP_KH9H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Kh9h4c_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'x','AJs':'x','ATs':'x','AKo':'x',
    'KK':'x','KQs':'b33','KJs':'b33','AQo':'x','QQ':'b33','QJs':'b33',
    'JJ':'mix:b33@52,x','JTs':'mix:x@63,b33','TT':'x','T9s':'x','99':'x','98s':'b33',
    '88':'x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Kh9h4c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'f','ATs':'f','A5s':'f',
    'A4s':'mix:f@66,c','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'f',
    'KQo':'c','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'mix:f@68,c','T9s':'c','99':'c','98s':'mix:f@60,c',
  },

}
