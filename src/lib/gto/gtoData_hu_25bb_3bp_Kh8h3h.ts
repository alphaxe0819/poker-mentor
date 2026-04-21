// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Kh8h3h
// Generated: 2026-04-16T12:39:02.627Z
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

export const HU_25BB_3BP_KH8H3H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Kh8h3h_btn_cbet: {
    'AA':'mix:b33@67,x','AKs':'b33','AQs':'x','AJs':'x','ATs':'x','AKo':'b33',
    'KK':'b33','KQs':'b33','KJs':'b33','AQo':'mix:x@62,b33','QQ':'b33','QJs':'mix:x@53,b33',
    'JJ':'mix:b33@66,x','JTs':'mix:x@52,b33','TT':'mix:b33@61,x','T9s':'b33','99':'mix:x@64,b33','98s':'b33',
    '88':'b33','77':'mix:x@57,b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Kh8h3h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'f','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'mix:c@50,f',
    'KQo':'c','QQ':'c','QJs':'f','AJo':'mix:c@50,f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'f','99':'mix:c@61,f','98s':'c',
  },

}
