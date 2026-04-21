// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Kh8h3h
// Generated: 2026-04-16T12:32:54.474Z
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

export const HU_13BB_SRP_KH8H3H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Kh8h3h_btn_cbet: {
    'AA':'mix:x@56,b33','AKs':'mix:b33@48,x','AQs':'x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:x@68,b33','A3s':'x',
    'A2s':'mix:x@52,b33','AKo':'mix:b33@62,x','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'mix:b33@54,x','AQo':'x','KQo':'b33','QQ':'mix:x@51,b33','QJs':'x',
    'QTs':'mix:x@59,b33','Q9s':'mix:x@61,b33','AJo':'x','KJo':'b33','QJo':'x','JJ':'mix:x@52,b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'b33','QTo':'mix:x@53,b33','JTo':'x',
    'TT':'mix:x@57,b33','T9s':'mix:x@57,b33','T8s':'mix:x@53,b33','A9o':'x','99':'mix:x@57,b33','98s':'x',
    '97s':'x','88':'x','87s':'mix:x@44,b33','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'mix:b33@67,x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kh8h3h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'f','AJs':'f','ATs':'f','A9s':'f','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'r','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'mix:r@50,f',
    'KQo':'r','QJs':'f','QTs':'f','AJo':'mix:r@50,f','KJo':'r','QJo':'mix:f@50,r',
    'JTs':'f','J9s':'f','ATo':'mix:f@50,r','KTo':'r','JTo':'mix:f@50,r','TT':'r',
    'T9s':'f','99':'mix:r@52,f','98s':'r','88':'r','87s':'r','77':'mix:r@50,f',
    '76s':'f','66':'mix:r@50,f','65s':'f','55':'mix:r@50,f','54s':'f','44':'mix:r@50,f',
    '33':'r','22':'mix:r@50,f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kh8h3h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'f','AJs':'f','ATs':'f','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'mix:c@50,f',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'mix:c@50,f','KJo':'c','QJo':'mix:c@50,f',
    'JTs':'f','J9s':'f','ATo':'mix:c@50,f','KTo':'c','JTo':'mix:f@63,c','TT':'c',
    'T9s':'f','99':'mix:c@53,f','98s':'c','88':'c','87s':'mix:f@54,c','77':'mix:c@51,f',
    '76s':'f','66':'mix:c@50,f','65s':'f','55':'mix:c@50,f','54s':'f','44':'mix:c@50,f',
    '33':'c','22':'mix:c@50,f',
  },

}
