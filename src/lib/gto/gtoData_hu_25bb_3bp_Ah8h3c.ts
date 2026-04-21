// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Ah8h3c
// Generated: 2026-04-16T12:37:48.229Z
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

export const HU_25BB_3BP_AH8H3C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Ah8h3c_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'mix:b33@51,x','AJs':'mix:x@66,b33','ATs':'x','AKo':'mix:b33@64,x',
    'KK':'x','KQs':'x','KJs':'x','AQo':'mix:b33@52,x','QQ':'x','QJs':'x',
    'JJ':'x','JTs':'x','TT':'x','T9s':'x','99':'x','98s':'x',
    '88':'x','77':'mix:x@53,b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Ah8h3c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','A5s':'c',
    'A4s':'c','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'c',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'c','JJ':'f','JTs':'f',
    'TT':'f','T9s':'f','99':'f','98s':'mix:c@62,f',
  },

}
