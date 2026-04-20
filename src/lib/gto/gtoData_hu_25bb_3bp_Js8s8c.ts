// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Js8s8c
// Generated: 2026-04-16T12:38:26.407Z
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

export const HU_25BB_3BP_JS8S8C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Js8s8c_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'b33','ATs':'mix:b33@69,x','AKo':'x',
    'KK':'mix:b33@67,x','KQs':'mix:x@68,b33','KJs':'b33','AQo':'x','QQ':'mix:x@57,b33','QJs':'mix:x@65,b33',
    'JJ':'x','JTs':'b33','TT':'b33','T9s':'b33','99':'mix:x@57,b33','98s':'x',
    '88':'x','77':'mix:x@52,b33',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Js8s8c_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'f','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'f','KJs':'c','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'c','AJo':'c','JJ':'c','JTs':'c',
    'TT':'c','T9s':'mix:c@58,f','99':'mix:c@65,f','98s':'c',
  },

}
