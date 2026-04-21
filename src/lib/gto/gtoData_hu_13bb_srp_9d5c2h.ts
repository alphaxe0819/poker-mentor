// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_9d5c2h
// Generated: 2026-04-16T12:26:33.633Z
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

export const HU_13BB_SRP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_9d5c2h_btn_cbet: {
    'AA':'x','AKs':'mix:x@51,b33','AQs':'x','AJs':'x','ATs':'x','A9s':'b33',
    'A8s':'b33','A7s':'mix:x@68,b33','A6s':'mix:x@58,b33','A5s':'b33','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'mix:b33@52,x','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'b33','K8s':'x','AQo':'x','KQo':'x','QQ':'mix:x@57,b33','QJs':'x',
    'QTs':'mix:x@68,b33','Q9s':'b33','AJo':'x','KJo':'x','QJo':'mix:x@51,b33','JJ':'b33',
    'JTs':'mix:b33@39,b50','J9s':'b33','ATo':'x','KTo':'b33','QTo':'mix:b33@59,x','JTo':'mix:x@56,b33',
    'TT':'b33','T9s':'b33','T8s':'x','A9o':'b33','99':'x','98s':'b33',
    '97s':'b33','88':'b33','87s':'x','77':'b33','76s':'x','66':'b33',
    '65s':'x','55':'x','54s':'b33','44':'mix:b50@41,x','33':'mix:b33@47,x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_9d5c2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'mix:r@64,c','ATs':'c','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'mix:f@67,c','K9s':'r','AQo':'f',
    'KQo':'f','QJs':'r','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:c@60,f','J9s':'r','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'r','99':'c','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'mix:c@55,r','66':'r','65s':'r','55':'c','54s':'r','44':'r',
    '33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_9d5c2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'mix:c@66,f','ATs':'mix:f@63,c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'mix:f@67,c','KJs':'f','KTs':'f','K9s':'c','AQo':'mix:f@64,c',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'c','ATo':'f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'mix:f@58,c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '33':'f','22':'c',
  },

}
