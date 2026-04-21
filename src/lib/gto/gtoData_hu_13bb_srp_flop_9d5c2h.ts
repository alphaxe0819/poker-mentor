// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_9d5c2h
// Generated: 2026-04-12T04:27:03.531Z
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

export const HU_13BB_SRP_FLOP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_9d5c2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'mix:x@58,b33','AJs':'x','ATs':'mix:x@70,b50','A9s':'b33',
    'A8s':'mix:b33@56,x','A7s':'mix:b33@60,x','A6s':'b33','A5s':'b33','A4s':'mix:x@67,b33','A3s':'x',
    'A2s':'b50','AKo':'mix:b33@48,x','KK':'mix:x@63,b33','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'b33','K8s':'b33','AQo':'mix:x@69,b33','KQo':'x','QQ':'b33','QJs':'x',
    'QTs':'x','Q9s':'b33','AJo':'x','KJo':'x','QJo':'mix:b33@51,x','JJ':'b33',
    'JTs':'mix:b50@53,b100','J9s':'b33','ATo':'x','KTo':'mix:b33@46,b50','QTo':'mix:b33@54,x','JTo':'mix:x@58,b33',
    'TT':'mix:b50@61,b33','T9s':'b33','T8s':'x','A9o':'b33','99':'x','98s':'mix:b50@61,b33',
    '97s':'mix:b50@68,b33','88':'b50','87s':'x','77':'mix:b50@57,b33','76s':'x','66':'mix:b50@60,b33',
    '65s':'mix:x@54,b33','55':'x','54s':'b33','44':'mix:x@32,b33','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9d5c2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'c',
    'A7s':'c','A6s':'f','A5s':'r','A4s':'mix:r@65,c','A3s':'mix:c@57,r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'r','AQo':'c',
    'KQo':'mix:f@56,c','QJs':'r','QTs':'mix:c@63,f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:r@42,c','J9s':'r','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'c','99':'c','98s':'r','88':'r','87s':'mix:r@62,c','77':'r',
    '76s':'c','66':'r','65s':'c','55':'c','54s':'mix:r@67,c','44':'mix:r@62,c',
    '33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9d5c2h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'mix:r@56,c','ATs':'c','A9s':'r','A8s':'mix:c@46,r',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'f','K9s':'r','AQo':'mix:f@49,c',
    'KQo':'f','QJs':'mix:r@46,c','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'r','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'r','99':'c','98s':'r','88':'r','87s':'mix:r@59,c','77':'r',
    '76s':'c','66':'r','65s':'r','55':'c','54s':'r','44':'r',
    '33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9d5c2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@67,c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'c','A3s':'c','A2s':'mix:c@67,f',
    'AKo':'c','KQs':'c','KJs':'f','KTs':'f','K9s':'c','AQo':'mix:f@63,c',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'c','ATo':'f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'mix:f@61,c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '33':'f','22':'c',
  },

}
