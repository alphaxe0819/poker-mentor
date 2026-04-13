// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_7s7d2h
// Generated: 2026-04-12T04:26:24.130Z
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

export const HU_13BB_SRP_FLOP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_7s7d2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'mix:b33@55,x','ATs':'mix:x@52,b33','A9s':'x',
    'A8s':'x','A7s':'mix:b33@54,x','A6s':'mix:x@70,b33','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'mix:b50@62,b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@52,b33','K8s':'mix:b33@69,x','AQo':'b33','KQo':'x','QQ':'b33','QJs':'x',
    'QTs':'x','Q9s':'mix:x@59,b33','AJo':'mix:x@63,b33','KJo':'x','QJo':'mix:b33@57,x','JJ':'b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'mix:x@54,b33','QTo':'mix:b33@53,x','JTo':'mix:b33@66,x',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'b33','99':'b33','98s':'x',
    '97s':'mix:b33@54,x','88':'b33','87s':'x','77':'x','76s':'mix:b33@62,x','66':'mix:b33@68,b50',
    '65s':'mix:x@61,b33','55':'b33','54s':'mix:x@62,b33','44':'b50','33':'b50','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_7s7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'r',
    'KQo':'mix:c@59,f','QJs':'c','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'mix:f@54,r','ATo':'c','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'mix:r@42,c','88':'r','87s':'c','77':'c',
    '76s':'c','66':'r','65s':'mix:c@62,f','55':'r','54s':'f','44':'mix:c@56,r',
    '33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_7s7d2h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:c@70,r','A9s':'r','A8s':'mix:c@38,r',
    'A7s':'c','A6s':'mix:c@47,r','A5s':'mix:c@48,r','A4s':'mix:f@59,c','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'r',
    'KQo':'f','QJs':'mix:c@66,f','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'mix:r@40,c','88':'r','87s':'c','77':'c',
    '76s':'c','66':'r','65s':'f','55':'r','54s':'f','44':'r',
    '33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_7s7d2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@68,f','A8s':'mix:c@54,f',
    'A7s':'c','A6s':'mix:f@55,c','A5s':'mix:f@55,c','A4s':'mix:f@65,c','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'mix:c@62,f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'f','55':'c','54s':'f','44':'c',
    '33':'c','22':'c',
  },

}
