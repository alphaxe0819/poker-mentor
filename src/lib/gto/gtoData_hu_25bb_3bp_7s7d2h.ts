// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_7s7d2h
// Generated: 2026-04-16T12:36:48.675Z
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

export const HU_25BB_3BP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_7s7d2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'x','ATs':'x','AKo':'b33',
    'KK':'b33','KQs':'x','KJs':'mix:b33@65,x','AQo':'mix:b33@55,x','QQ':'mix:b33@65,x','QJs':'b33',
    'JJ':'b33','JTs':'b33','TT':'b33','T9s':'b33','99':'b33','98s':'x',
    '88':'mix:b33@70,x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_7s7d2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'f','KJs':'f','AQo':'c',
    'KQo':'f','QQ':'c','QJs':'f','AJo':'f','JJ':'c','JTs':'f',
    'TT':'c','T9s':'f','99':'c','98s':'f',
  },

}
