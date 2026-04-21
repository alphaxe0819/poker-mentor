// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Jh9h7c
// Generated: 2026-04-16T12:38:19.122Z
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

export const HU_25BB_3BP_JH9H7C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Jh9h7c_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'mix:x@69,b33','AJs':'b33','ATs':'b33','AKo':'x',
    'KK':'b33','KQs':'mix:b33@58,x','KJs':'b33','AQo':'mix:x@64,b33','QQ':'b33','QJs':'b33',
    'JJ':'x','JTs':'b33','TT':'b33','T9s':'b33','99':'x','98s':'b33',
    '88':'b33','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Jh9h7c_bb_facing_cbet_small: {
    'AA':'c','AKs':'mix:f@51,c','AQs':'f','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'f','KK':'c','KQs':'f','KJs':'c','AQo':'f',
    'KQo':'f','QQ':'c','QJs':'c','AJo':'c','JJ':'c','JTs':'c',
    'TT':'c','T9s':'c','99':'c','98s':'c',
  },

}
