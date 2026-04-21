// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Qd7s2c
// Generated: 2026-04-16T12:34:37.844Z
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

export const HU_13BB_SRP_QD7S2C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Qd7s2c_btn_cbet: {
    'AA':'x','AKs':'mix:x@52,b33','AQs':'mix:x@67,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'b33','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'x','KK':'x','KQs':'mix:x@59,b33','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:b33@66,x','AQo':'mix:x@59,b33','KQo':'b33','QQ':'x','QJs':'b33',
    'QTs':'b33','Q9s':'mix:x@52,b33','AJo':'x','KJo':'x','QJo':'b33','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'b33','QTo':'b33','JTo':'mix:b33@64,x',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'b33','99':'b33','98s':'x',
    '97s':'x','88':'mix:b33@65,x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qd7s2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'r','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'f','KJo':'f','QJo':'r',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'f','88':'r','87s':'r','77':'c',
    '76s':'r','66':'mix:f@61,r','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qd7s2c_bb_facing_cbet_mid: {
    'AKs':'mix:f@54,c','AQs':'c','AJs':'f','ATs':'mix:f@65,c','A9s':'f','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:f@50,c',
    'AKo':'f','KQs':'c','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'mix:f@64,c','KJo':'f','QJo':'c',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'mix:f@54,c','65s':'f','55':'mix:f@60,c','54s':'f','44':'mix:f@55,c',
    '33':'mix:f@59,c','22':'c',
  },

}
