// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_Qh9d6s
// Generated: 2026-04-16T12:39:38.581Z
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

export const HU_25BB_3BP_QH9D6S: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_Qh9d6s_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'x','ATs':'mix:x@59,b33','AKo':'x',
    'KK':'b33','KQs':'b33','KJs':'b33','AQo':'mix:x@66,b33','QQ':'x','QJs':'b33',
    'JJ':'b33','JTs':'b33','TT':'mix:b33@51,x','T9s':'mix:x@54,b33','99':'x','98s':'b33',
    '88':'x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_Qh9d6s_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'f','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'f','KK':'c','KQs':'c','KJs':'c','AQo':'c',
    'KQo':'c','QQ':'c','QJs':'c','AJo':'f','JJ':'c','JTs':'c',
    'TT':'mix:f@67,c','T9s':'c','99':'c','98s':'c',
  },

}
