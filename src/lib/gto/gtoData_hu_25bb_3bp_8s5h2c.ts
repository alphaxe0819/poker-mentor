// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_8s5h2c
// Generated: 2026-04-16T12:36:56.244Z
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

export const HU_25BB_3BP_8S5H2C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_8s5h2c_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'x','AJs':'x','ATs':'mix:x@64,b33','AKo':'b33',
    'KK':'mix:x@56,b33','KQs':'x','KJs':'mix:b33@65,x','AQo':'x','QQ':'b33','QJs':'mix:b33@55,x',
    'JJ':'b33','JTs':'b33','TT':'b33','T9s':'x','99':'b33','98s':'b33',
    '88':'x','77':'b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_8s5h2c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'mix:c@70,f','ATs':'f','A5s':'c',
    'A4s':'c','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'f','99':'c','98s':'c',
  },

}
