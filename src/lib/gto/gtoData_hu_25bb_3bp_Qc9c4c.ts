// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Qc9c4c
// Generated: 2026-04-16T12:39:23.697Z
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

export const HU_25BB_3BP_QC9C4C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Qc9c4c_btn_cbet: {
    'AA':'mix:b33@65,x','AKs':'x','AQs':'b33','AJs':'x','ATs':'mix:x@52,b33','AKo':'mix:x@56,b33',
    'KK':'b33','KQs':'b33','KJs':'b33','AQo':'b33','QQ':'b33','QJs':'b33',
    'JJ':'b33','JTs':'b33','TT':'b33','T9s':'b33','99':'b33','98s':'b33',
    '88':'b33','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Qc9c4c_bb_facing_cbet_small: {
    'AA':'c','AKs':'f','AQs':'c','AJs':'f','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'mix:c@50,f','KK':'c','KQs':'c','KJs':'c','AQo':'c',
    'KQo':'c','QQ':'c','QJs':'c','AJo':'mix:c@50,f','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
