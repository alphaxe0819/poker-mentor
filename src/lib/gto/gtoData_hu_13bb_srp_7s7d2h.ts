// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_7s7d2h
// Generated: 2026-04-16T12:25:35.822Z
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

export const HU_13BB_SRP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_7s7d2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'x','ATs':'x','A9s':'mix:b33@52,x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@68,b33','K8s':'x','AQo':'b33','KQo':'x','QQ':'mix:x@66,b33','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'x','QJo':'mix:x@59,b33','JJ':'b33',
    'JTs':'x','J9s':'mix:x@65,b33','ATo':'x','KTo':'mix:x@61,b33','QTo':'mix:b33@67,x','JTo':'b33',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'mix:x@58,b33','99':'b33','98s':'x',
    '97s':'x','88':'b33','87s':'x','77':'x','76s':'x','66':'b33',
    '65s':'x','55':'mix:b33@66,x','54s':'x','44':'b33','33':'b33','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_7s7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'c','A9s':'r','A8s':'mix:r@45,c',
    'A7s':'c','A6s':'mix:c@54,f','A5s':'mix:r@41,c','A4s':'mix:c@57,f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'mix:c@66,f','K9s':'mix:f@58,c','AQo':'r',
    'KQo':'f','QJs':'mix:f@53,c','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'mix:r@54,f','88':'r','87s':'c','77':'c',
    '76s':'c','66':'r','65s':'f','55':'r','54s':'f','44':'r',
    '33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_7s7d2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@64,f','A8s':'mix:c@56,f',
    'A7s':'c','A6s':'mix:f@59,c','A5s':'mix:f@54,c','A4s':'mix:f@63,c','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'mix:c@54,f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'f','55':'c','54s':'f','44':'c',
    '33':'c','22':'c',
  },

}
