// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_KcKd5h
// Generated: 2026-04-16T12:38:55.738Z
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

export const HU_25BB_3BP_KCKD5H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_KcKd5h_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'x','ATs':'x','AKo':'x',
    'KK':'x','KQs':'x','KJs':'x','AQo':'x','QQ':'x','QJs':'x',
    'JJ':'mix:x@56,b33','JTs':'x','TT':'b33','T9s':'mix:x@62,b33','99':'x','98s':'x',
    '88':'x','77':'mix:x@55,b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_KcKd5h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','A5s':'mix:c@61,f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'mix:c@53,f',
    'KQo':'c','QQ':'c','QJs':'mix:c@63,f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'f','99':'c','98s':'f',
  },

}
