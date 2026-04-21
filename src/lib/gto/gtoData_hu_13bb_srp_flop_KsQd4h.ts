// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_KsQd4h
// Generated: 2026-04-12T04:32:00.191Z
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

export const HU_13BB_SRP_FLOP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_KsQd4h_btn_cbet: {
    'AA':'b33','AKs':'mix:b33@63,x','AQs':'mix:x@50,b33','AJs':'mix:b33@69,x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b33@53,x','A4s':'b33','A3s':'b33',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'mix:b33@65,x','KJs':'b33','KTs':'mix:b33@56,x',
    'K9s':'mix:b50@51,b33','K8s':'x','AQo':'mix:b33@56,x','KQo':'b33','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'mix:x@61,b33','AJo':'b33','KJo':'b33','QJo':'x','JJ':'mix:x@54,b33',
    'JTs':'x','J9s':'mix:x@60,b33','ATo':'mix:x@58,b33','KTo':'b33','QTo':'x','JTo':'x',
    'TT':'x','T9s':'x','T8s':'b33','A9o':'mix:x@49,b33','99':'x','98s':'mix:x@47,b33',
    '97s':'mix:b33@47,x','88':'x','87s':'mix:x@55,b33','77':'x','76s':'mix:x@58,b33','66':'x',
    '65s':'mix:x@61,b33','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KsQd4h_bb_facing_cbet_small: {
    'AKs':'mix:c@67,r','AQs':'c','AJs':'mix:r@62,c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'c','KJs':'r','KTs':'r','K9s':'r','AQo':'c',
    'KQo':'r','QJs':'c','QTs':'c','AJo':'mix:r@69,c','KJo':'r','QJo':'c',
    'JTs':'r','J9s':'c','ATo':'c','KTo':'r','JTo':'mix:c@70,r','TT':'c',
    'T9s':'c','99':'c','98s':'f','88':'c','87s':'f','77':'mix:c@58,f',
    '76s':'f','66':'mix:c@51,f','65s':'f','55':'f','54s':'c','44':'c',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KsQd4h_bb_facing_cbet_mid: {
    'AKs':'mix:r@66,c','AQs':'mix:c@55,r','AJs':'mix:r@63,c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'r','A3s':'f','A2s':'f',
    'AKo':'mix:r@68,c','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'mix:c@58,r',
    'KQo':'r','QJs':'mix:c@52,r','QTs':'mix:r@64,c','AJo':'mix:r@65,c','KJo':'r','QJo':'mix:c@52,r',
    'JTs':'r','J9s':'f','ATo':'mix:c@52,f','KTo':'r','JTo':'r','TT':'mix:c@61,r',
    'T9s':'f','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'c','44':'mix:r@65,c',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KsQd4h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'mix:c@64,f','ATs':'mix:f@60,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:c@50,f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'mix:c@53,f','KJo':'c','QJo':'c',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'c','JTo':'f','TT':'mix:f@52,c',
    'T9s':'f','99':'mix:f@63,c','98s':'f','88':'mix:f@69,c','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'mix:f@65,c','44':'c',
    '33':'f','22':'f',
  },

}
