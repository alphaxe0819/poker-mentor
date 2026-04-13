// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_JsTc9h
// Generated: 2026-04-12T04:30:14.071Z
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

export const HU_13BB_SRP_FLOP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_JsTc9h_btn_cbet: {
    'AA':'mix:x@67,b33','AKs':'mix:b33@48,x','AQs':'mix:x@50,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'mix:x@52,b33',
    'A2s':'mix:x@50,b33','AKo':'x','KK':'b50','KQs':'x','KJs':'mix:b33@48,x','KTs':'x',
    'K9s':'x','K8s':'x','AQo':'x','KQo':'mix:x@65,b33','QQ':'mix:b33@55,b50','QJs':'mix:x@56,b33',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'mix:b33@54,b50','QJo':'mix:b33@44,x','JJ':'x',
    'JTs':'mix:b33@52,b50','J9s':'x','ATo':'x','KTo':'x','QTo':'x','JTo':'mix:b33@57,b50',
    'TT':'mix:x@60,b33','T9s':'mix:x@43,b33','T8s':'x','A9o':'x','99':'x','98s':'x',
    '97s':'x','88':'x','87s':'mix:b33@69,x','77':'x','76s':'mix:b33@41,x','66':'x',
    '65s':'x','55':'x','54s':'mix:x@49,b33','44':'x','33':'mix:x@54,b33','22':'mix:x@53,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_JsTc9h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:c@66,r','KJs':'r','KTs':'mix:r@59,c','K9s':'c','AQo':'mix:r@56,c',
    'KQo':'mix:c@56,r','QJs':'mix:c@52,r','QTs':'c','AJo':'c','KJo':'r','QJo':'mix:r@59,c',
    'JTs':'r','J9s':'c','ATo':'c','KTo':'mix:r@55,c','JTo':'r','TT':'c',
    'T9s':'c','99':'r','98s':'c','88':'c','87s':'r','77':'mix:f@64,c',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_JsTc9h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:r@56,c','AJs':'c','ATs':'c','A9s':'mix:c@66,f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:c@63,r','KJs':'r','KTs':'mix:c@64,r','K9s':'c','AQo':'mix:c@56,r',
    'KQo':'mix:c@54,r','QJs':'r','QTs':'c','AJo':'c','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'c','ATo':'f','KTo':'mix:c@56,r','JTo':'r','TT':'mix:c@68,r',
    'T9s':'c','99':'r','98s':'c','88':'c','87s':'r','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_JsTc9h_bb_facing_cbet_large: {
    'AKs':'f','AQs':'mix:c@69,f','AJs':'c','ATs':'mix:c@60,f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'c','KTs':'c','K9s':'f','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'mix:f@53,c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'mix:c@63,f','88':'f','87s':'c','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
