// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_JsTc9h
// Generated: 2026-04-16T12:38:41.369Z
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

export const HU_25BB_3BP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_JsTc9h_btn_cbet: {
    'AA':'x','AKs':'mix:x@54,b33','AQs':'mix:b33@52,x','AJs':'x','ATs':'x','AKo':'x',
    'KK':'b33','KQs':'x','KJs':'mix:b33@56,x','AQo':'x','QQ':'b33','QJs':'b33',
    'JJ':'x','JTs':'mix:x@64,b33','TT':'x','T9s':'x','99':'x','98s':'b33',
    '88':'b33','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_JsTc9h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'c',
    'KQo':'c','QQ':'c','QJs':'c','AJo':'c','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
