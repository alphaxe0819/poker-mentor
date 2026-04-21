// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Ah2d2c
// Generated: 2026-04-16T12:27:22.567Z
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

export const HU_13BB_SRP_AH2D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Ah2d2c_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'mix:b33@54,x','AJs':'mix:b33@65,x','ATs':'mix:x@57,b33','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'mix:x@54,b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','AQo':'mix:b33@67,x','KQo':'x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'b33','KJo':'x','QJo':'mix:x@59,b33','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'mix:x@53,b33','KTo':'x','QTo':'mix:b33@54,x','JTo':'mix:x@50,b33',
    'TT':'mix:b33@54,x','T9s':'mix:x@58,b33','T8s':'mix:x@69,b33','A9o':'x','99':'mix:x@68,b33','98s':'mix:b33@62,x',
    '97s':'mix:x@60,b33','88':'x','87s':'mix:x@52,b33','77':'x','76s':'x','66':'x',
    '65s':'mix:b33@63,x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ah2d2c_bb_facing_cbet_small: {
    'AKs':'mix:r@62,c','AQs':'r','AJs':'r','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@68,r','A6s':'c','A5s':'mix:c@65,r','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'mix:c@60,r','KTs':'mix:f@58,c','K9s':'f','AQo':'r',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'f','77':'mix:c@57,f',
    '76s':'f','66':'mix:f@54,c','65s':'f','55':'mix:r@50,c','54s':'r','44':'r',
    '33':'mix:r@68,c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ah2d2c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'mix:f@56,c','KJs':'mix:f@60,c','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'mix:f@57,c','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'mix:c@70,f',
    'T9s':'f','99':'mix:c@66,f','98s':'f','88':'mix:c@57,f','87s':'f','77':'mix:f@54,c',
    '76s':'f','66':'mix:f@67,c','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

}
