// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_3bp_QsJh2h
// Generated: 2026-04-16T12:39:45.666Z
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

export const HU_25BB_3BP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_3bp_QsJh2h_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'mix:b33@66,x','AJs':'x','ATs':'x','AKo':'mix:b33@59,x',
    'KK':'b33','KQs':'mix:b33@66,x','KJs':'mix:b33@61,x','AQo':'mix:b33@65,x','QQ':'x','QJs':'mix:x@69,b33',
    'JJ':'x','JTs':'x','TT':'x','T9s':'mix:b33@55,x','99':'x','98s':'x',
    '88':'x','77':'x',
  },

  // ──────────────────────────────
  hu_25bb_3bp_QsJh2h_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'f','A5s':'f',
    'A4s':'f','AKo':'c','KK':'c','KQs':'c','KJs':'c','AQo':'c',
    'KQo':'c','QQ':'c','QJs':'c','AJo':'c','JJ':'c','JTs':'c',
    'TT':'mix:c@57,f','T9s':'mix:c@50,f','99':'f','98s':'f',
  },

}
