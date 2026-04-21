// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_9h8d7c
// Generated: 2026-04-16T12:37:18.546Z
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

export const HU_25BB_3BP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_9h8d7c_btn_cbet: {
    'AA':'b33','AKs':'b33','AQs':'mix:x@68,b33','AJs':'b33','ATs':'b33','AKo':'b33',
    'KK':'b33','KQs':'mix:b33@56,x','KJs':'b33','AQo':'x','QQ':'b33','QJs':'mix:b33@53,x',
    'JJ':'b33','JTs':'x','TT':'mix:b33@69,x','T9s':'b33','99':'mix:b33@67,x','98s':'b33',
    '88':'b33','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_9h8d7c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'c','ATs':'c','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
