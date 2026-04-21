// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Tc9c6d
// Generated: 2026-04-16T12:39:52.873Z
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

export const HU_25BB_3BP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Tc9c6d_btn_cbet: {
    'AA':'b33','AKs':'mix:b33@65,x','AQs':'mix:x@58,b33','AJs':'mix:b33@68,x','ATs':'b33','AKo':'b33',
    'KK':'b33','KQs':'b33','KJs':'b33','AQo':'mix:x@56,b33','QQ':'b33','QJs':'b33',
    'JJ':'b33','JTs':'b33','TT':'mix:x@61,b33','T9s':'b33','99':'mix:x@60,b33','98s':'b33',
    '88':'b33','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Tc9c6d_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'f','ATs':'c','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'mix:c@50,f','KJs':'f','AQo':'f',
    'KQo':'mix:c@50,f','QQ':'c','QJs':'c','AJo':'f','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
