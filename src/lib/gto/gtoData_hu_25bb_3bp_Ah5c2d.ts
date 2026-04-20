// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Ah5c2d
// Generated: 2026-04-16T12:37:41.148Z
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

export const HU_25BB_3BP_AH5C2D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Ah5c2d_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'x','ATs':'x','AKo':'mix:x@51,b33',
    'KK':'x','KQs':'x','KJs':'x','AQo':'mix:x@63,b33','QQ':'x','QJs':'x',
    'JJ':'x','JTs':'x','TT':'x','T9s':'x','99':'x','98s':'x',
    '88':'x','77':'mix:x@64,b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Ah5c2d_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','A5s':'c',
    'A4s':'c','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'c',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'c','JJ':'f','JTs':'f',
    'TT':'f','T9s':'f','99':'f','98s':'f',
  },

}
