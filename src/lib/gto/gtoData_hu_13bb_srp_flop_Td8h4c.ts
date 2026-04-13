// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_Td8h4c
// Generated: 2026-04-12T04:33:26.891Z
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

export const HU_13BB_SRP_FLOP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_Td8h4c_btn_cbet: {
    'AA':'mix:x@67,b33','AKs':'b33','AQs':'mix:b33@57,x','AJs':'x','ATs':'b33','A9s':'x',
    'A8s':'mix:x@54,b33','A7s':'mix:b33@65,x','A6s':'b33','A5s':'x','A4s':'b33','A3s':'mix:x@56,b33',
    'A2s':'mix:b33@60,x','AKo':'mix:x@55,b33','KK':'b33','KQs':'x','KJs':'mix:x@62,b33','KTs':'b33',
    'K9s':'mix:b33@61,x','K8s':'x','AQo':'x','KQo':'x','QQ':'b33','QJs':'b33',
    'QTs':'b33','Q9s':'x','AJo':'x','KJo':'b33','QJo':'b33','JJ':'b33',
    'JTs':'b33','J9s':'x','ATo':'b33','KTo':'mix:b33@68,b100','QTo':'b33','JTo':'b33',
    'TT':'x','T9s':'b33','T8s':'b33','A9o':'b33','99':'b33','98s':'mix:b33@50,x',
    '97s':'x','88':'x','87s':'mix:b33@65,x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'x','22':'b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Td8h4c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'r','A9s':'f','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'mix:c@68,r','KQs':'mix:r@46,c','KJs':'c','KTs':'mix:r@56,c','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'r','QTs':'r','AJo':'mix:f@59,c','KJo':'f','QJo':'r',
    'JTs':'mix:r@68,c','J9s':'c','ATo':'r','KTo':'r','JTo':'r','TT':'c',
    'T9s':'r','99':'r','98s':'c','88':'c','87s':'r','77':'c',
    '76s':'c','66':'c','65s':'c','55':'f','54s':'mix:c@55,r','44':'c',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Td8h4c_bb_facing_cbet_mid: {
    'AKs':'mix:r@56,c','AQs':'r','AJs':'r','ATs':'r','A9s':'f','A8s':'mix:r@67,c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:c@50,r','A3s':'f','A2s':'f',
    'AKo':'mix:f@40,r','KQs':'mix:f@61,r','KJs':'mix:f@56,r','KTs':'r','K9s':'f','AQo':'mix:f@62,r',
    'KQo':'f','QJs':'r','QTs':'r','AJo':'f','KJo':'f','QJo':'r',
    'JTs':'r','J9s':'mix:c@52,r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'mix:r@53,c','66':'mix:f@63,r','65s':'f','55':'f','54s':'mix:r@64,c','44':'r',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Td8h4c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'mix:c@61,f','KQs':'f','KJs':'mix:f@60,c','KTs':'c','K9s':'f','AQo':'f',
    'KQo':'f','QJs':'c','QTs':'c','AJo':'f','KJo':'f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'f','66':'mix:f@66,c','65s':'f','55':'f','54s':'c','44':'c',
    '33':'f','22':'f',
  },

}
