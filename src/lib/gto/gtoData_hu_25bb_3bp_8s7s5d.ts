// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_8s7s5d
// Generated: 2026-04-16T12:37:03.218Z
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

export const HU_25BB_3BP_8S7S5D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_8s7s5d_btn_cbet: {
    'AA':'mix:x@58,b33','AKs':'mix:b33@66,x','AQs':'x','AJs':'x','ATs':'mix:b33@50,x','AKo':'b33',
    'KK':'b33','KQs':'mix:b33@60,x','KJs':'b33','AQo':'x','QQ':'b33','QJs':'mix:x@60,b33',
    'JJ':'b33','JTs':'b33','TT':'b33','T9s':'b33','99':'b33','98s':'b33',
    '88':'x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_8s7s5d_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'mix:f@59,c','AJs':'f','ATs':'f','A5s':'c',
    'A4s':'mix:c@50,f','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'mix:f@63,c',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
