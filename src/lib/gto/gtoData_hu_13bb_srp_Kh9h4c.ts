// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Kh9h4c
// Generated: 2026-04-16T12:33:19.906Z
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

export const HU_13BB_SRP_KH9H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Kh9h4c_btn_cbet: {
    'AA':'mix:b33@59,x','AKs':'mix:b33@67,x','AQs':'x','AJs':'x','ATs':'mix:x@70,b33','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'mix:b33@65,x','A5s':'b33','A4s':'mix:x@58,b33','A3s':'b33',
    'A2s':'b33','AKo':'mix:b33@66,x','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'x','K8s':'b33','AQo':'x','KQo':'b33','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'mix:b33@53,x','AJo':'x','KJo':'b33','QJo':'mix:x@52,b33','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'mix:b33@70,x','KTo':'b33','QTo':'x','JTo':'x',
    'TT':'mix:x@61,b33','T9s':'x','T8s':'b33','A9o':'x','99':'x','98s':'x',
    '97s':'x','88':'x','87s':'mix:b33@51,x','77':'x','76s':'mix:b33@50,x','66':'x',
    '65s':'mix:b33@59,x','55':'x','54s':'x','44':'x','33':'x','22':'mix:x@68,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kh9h4c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'mix:f@50,r','AJs':'mix:f@57,c','ATs':'f','A9s':'mix:c@59,r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'r','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'mix:f@65,r',
    'KQo':'r','QJs':'mix:r@65,f','QTs':'f','AJo':'f','KJo':'r','QJo':'mix:r@56,f',
    'JTs':'f','J9s':'r','ATo':'f','KTo':'r','JTo':'f','TT':'mix:r@67,c',
    'T9s':'mix:r@58,c','99':'mix:c@55,r','98s':'mix:r@59,c','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'r','44':'mix:r@51,c',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kh9h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:f@60,c','AJs':'mix:f@63,c','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'c','QJs':'mix:c@59,f','QTs':'mix:f@69,c','AJo':'f','KJo':'c','QJo':'mix:f@56,c',
    'JTs':'f','J9s':'c','ATo':'f','KTo':'c','JTo':'f','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'mix:f@60,c','44':'c',
    '33':'f','22':'f',
  },

}
