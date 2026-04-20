// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Kc8h3s
// Generated: 2026-04-16T12:38:48.741Z
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

export const HU_25BB_3BP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Kc8h3s_btn_cbet: {
    'AA':'mix:b33@63,x','AKs':'x','AQs':'x','AJs':'x','ATs':'mix:x@61,b33','AKo':'x',
    'KK':'x','KQs':'b33','KJs':'b33','AQo':'x','QQ':'mix:b33@58,x','QJs':'x',
    'JJ':'x','JTs':'x','TT':'x','T9s':'x','99':'x','98s':'x',
    '88':'x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Kc8h3s_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'f','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'f',
    'KQo':'c','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'mix:f@56,c','T9s':'f','99':'f','98s':'c',
  },

}
