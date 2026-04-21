// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_KsQd4h
// Generated: 2026-04-16T12:39:17.078Z
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

export const HU_25BB_3BP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_KsQd4h_btn_cbet: {
    'AA':'b33','AKs':'mix:b33@58,x','AQs':'x','AJs':'mix:b33@67,x','ATs':'x','AKo':'b33',
    'KK':'x','KQs':'x','KJs':'b33','AQo':'mix:x@55,b33','QQ':'x','QJs':'x',
    'JJ':'x','JTs':'mix:b33@58,x','TT':'x','T9s':'x','99':'x','98s':'x',
    '88':'mix:x@57,b33','77':'mix:b33@61,x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_KsQd4h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'c',
    'KQo':'c','QQ':'c','QJs':'c','AJo':'f','JJ':'mix:f@63,c','JTs':'c',
    'TT':'f','T9s':'f','99':'f','98s':'f',
  },

}
