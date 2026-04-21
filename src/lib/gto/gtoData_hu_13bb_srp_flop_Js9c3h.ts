// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_Js9c3h
// Generated: 2026-04-12T04:29:36.928Z
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

export const HU_13BB_SRP_FLOP_JS9C3H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_Js9c3h_btn_cbet: {
    'AA':'b33','AKs':'b33','AQs':'x','AJs':'mix:b33@57,x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:x@58,b33','A3s':'b33',
    'A2s':'b33','AKo':'mix:b33@52,x','KK':'b33','KQs':'b33','KJs':'b33','KTs':'x',
    'K9s':'mix:x@65,b33','K8s':'b33','AQo':'mix:x@64,b33','KQo':'b33','QQ':'b33','QJs':'b33',
    'QTs':'mix:x@50,b33','Q9s':'b33','AJo':'mix:b33@64,x','KJo':'b33','QJo':'b33','JJ':'x',
    'JTs':'b33','J9s':'b33','ATo':'b33','KTo':'mix:x@55,b33','QTo':'mix:x@56,b33','JTo':'b33',
    'TT':'mix:x@63,b33','T9s':'x','T8s':'x','A9o':'x','99':'x','98s':'mix:x@65,b33',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'b33','66':'x',
    '65s':'mix:b33@61,x','55':'x','54s':'mix:b33@56,x','44':'x','33':'x','22':'mix:x@66,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Js9c3h_bb_facing_cbet_small: {
    'AKs':'mix:r@56,c','AQs':'mix:r@46,c','AJs':'r','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:r@55,c','A2s':'f',
    'AKo':'mix:c@54,r','KQs':'r','KJs':'r','KTs':'mix:c@51,r','K9s':'r','AQo':'mix:f@43,c',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'c','JTo':'r','TT':'mix:c@53,r',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'f','66':'mix:f@58,c','65s':'f','55':'f','54s':'f','44':'f',
    '33':'mix:c@54,r','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Js9c3h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'mix:r@55,f','AJs':'r','ATs':'f','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:r@54,c','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'mix:r@54,c','K9s':'r','AQo':'f',
    'KQo':'r','QJs':'r','QTs':'mix:r@68,c','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'mix:f@65,r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'mix:f@44,r','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Js9c3h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:c@64,f','K9s':'c','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'mix:c@66,f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'c','22':'f',
  },

}
