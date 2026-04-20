// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_KsQd4h
// Generated: 2026-04-16T12:33:52.017Z
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

export const HU_13BB_SRP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_KsQd4h_btn_cbet: {
    'AA':'b33','AKs':'mix:b33@69,x','AQs':'x','AJs':'mix:x@51,b33','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'b33','A3s':'mix:x@55,b33',
    'A2s':'mix:x@50,b33','AKo':'b33','KK':'x','KQs':'x','KJs':'mix:b33@65,x','KTs':'mix:b33@52,x',
    'K9s':'b33','K8s':'x','AQo':'mix:x@56,b33','KQo':'mix:b33@58,x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'b33','KJo':'b33','QJo':'x','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'b33','QTo':'x','JTo':'x',
    'TT':'x','T9s':'x','T8s':'b33','A9o':'mix:b33@60,x','99':'x','98s':'x',
    '97s':'mix:b33@54,x','88':'x','87s':'mix:x@65,b33','77':'x','76s':'mix:x@67,b33','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_KsQd4h_bb_facing_cbet_small: {
    'AKs':'mix:r@56,c','AQs':'c','AJs':'r','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'r','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'mix:c@59,r',
    'KQo':'r','QJs':'mix:c@54,r','QTs':'r','AJo':'r','KJo':'r','QJo':'mix:r@60,c',
    'JTs':'r','J9s':'f','ATo':'mix:f@58,c','KTo':'r','JTo':'mix:r@66,c','TT':'c',
    'T9s':'f','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'c','44':'c',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_KsQd4h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@52,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:f@51,c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'c','JTo':'f','TT':'mix:f@59,c',
    'T9s':'f','99':'mix:f@69,c','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'c',
    '33':'f','22':'f',
  },

}
