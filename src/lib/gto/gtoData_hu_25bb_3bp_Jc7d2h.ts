// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Jc7d2h
// Generated: 2026-04-16T12:38:11.741Z
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

export const HU_25BB_3BP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Jc7d2h_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'b33','ATs':'x','AKo':'x',
    'KK':'b33','KQs':'b33','KJs':'b33','AQo':'x','QQ':'mix:x@58,b33','QJs':'x',
    'JJ':'x','JTs':'b33','TT':'b33','T9s':'b33','99':'mix:b33@65,x','98s':'mix:x@57,b33',
    '88':'mix:b33@67,x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Jc7d2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'f','KJs':'c','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'c','AJo':'c','JJ':'c','JTs':'c',
    'TT':'c','T9s':'f','99':'c','98s':'f',
  },

}
