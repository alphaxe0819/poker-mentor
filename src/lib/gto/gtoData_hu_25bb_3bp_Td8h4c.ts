// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Td8h4c
// Generated: 2026-04-16T12:40:00.497Z
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

export const HU_25BB_3BP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Td8h4c_btn_cbet: {
    'AA':'x','AKs':'mix:b33@61,x','AQs':'x','AJs':'x','ATs':'b33','AKo':'mix:x@51,b33',
    'KK':'b33','KQs':'b33','KJs':'mix:b33@67,x','AQo':'x','QQ':'mix:b33@59,x','QJs':'b33',
    'JJ':'b33','JTs':'b33','TT':'x','T9s':'b33','99':'b33','98s':'b33',
    '88':'x','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Td8h4c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'f','ATs':'c','A5s':'f',
    'A4s':'c','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'c','AJo':'f','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
