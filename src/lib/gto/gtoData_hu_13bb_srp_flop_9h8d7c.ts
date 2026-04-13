// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_9h8d7c
// Generated: 2026-04-12T04:27:42.444Z
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

export const HU_13BB_SRP_FLOP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_9h8d7c_btn_cbet: {
    'AA':'x','AKs':'mix:x@56,b33','AQs':'x','AJs':'mix:b33@46,b100','ATs':'b33','A9s':'mix:b100@50,b33',
    'A8s':'mix:x@51,b33','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:x@51,b33','A3s':'b33',
    'A2s':'b33','AKo':'x','KK':'mix:x@64,b33','KQs':'x','KJs':'x','KTs':'mix:b33@49,b100',
    'K9s':'x','K8s':'x','AQo':'x','KQo':'b33','QQ':'b33','QJs':'x',
    'QTs':'mix:x@63,b33','Q9s':'x','AJo':'mix:b100@58,b33','KJo':'mix:x@62,b33','QJo':'x','JJ':'b33',
    'JTs':'mix:x@67,b33','J9s':'b33','ATo':'b33','KTo':'x','QTo':'x','JTo':'mix:x@61,b33',
    'TT':'b33','T9s':'b33','T8s':'b33','A9o':'b100','99':'mix:b33@62,x','98s':'b33',
    '97s':'b33','88':'mix:x@59,b33','87s':'b33','77':'x','76s':'b33','66':'mix:b100@57,b33',
    '65s':'b33','55':'x','54s':'mix:b33@54,x','44':'x','33':'x','22':'mix:b33@58,x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9h8d7c_bb_facing_cbet_small: {
    'AKs':'mix:r@53,c','AQs':'mix:r@42,c','AJs':'r','ATs':'r','A9s':'r','A8s':'mix:c@63,r',
    'A7s':'c','A6s':'r','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'f','KJs':'c','KTs':'r','K9s':'c','AQo':'f',
    'KQo':'f','QJs':'c','QTs':'r','AJo':'r','KJo':'f','QJo':'c',
    'JTs':'mix:c@53,r','J9s':'r','ATo':'r','KTo':'mix:c@52,r','JTo':'mix:r@51,c','TT':'r',
    'T9s':'r','99':'mix:r@58,c','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'r','66':'r','65s':'r','55':'c','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9h8d7c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:f@36,r','AJs':'r','ATs':'r','A9s':'r','A8s':'mix:r@52,c',
    'A7s':'mix:c@48,r','A6s':'mix:c@48,f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@43,c','KQs':'f','KJs':'mix:r@58,f','KTs':'r','K9s':'mix:r@63,c','AQo':'f',
    'KQo':'f','QJs':'c','QTs':'mix:r@59,c','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'r','J9s':'r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'r','66':'r','65s':'r','55':'mix:c@67,f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_9h8d7c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@56,c','KQs':'f','KJs':'c','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'f','QJs':'f','QTs':'c','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'c','55':'mix:f@56,c','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
