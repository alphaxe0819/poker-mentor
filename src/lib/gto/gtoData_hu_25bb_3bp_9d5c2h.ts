// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_9d5c2h
// Generated: 2026-04-16T12:37:10.784Z
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

export const HU_25BB_3BP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_9d5c2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'x','AJs':'x','ATs':'mix:x@56,b33','AKo':'b33',
    'KK':'mix:b33@59,x','KQs':'mix:x@68,b33','KJs':'b33','AQo':'x','QQ':'mix:b33@68,x','QJs':'mix:b33@63,x',
    'JJ':'b33','JTs':'mix:b33@55,x','TT':'b33','T9s':'b33','99':'x','98s':'b33',
    '88':'b33','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_9d5c2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','A5s':'c',
    'A4s':'c','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
