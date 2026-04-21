// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_JsTc9h
// Generated: 2026-04-16T12:31:43.418Z
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

export const HU_13BB_SRP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_JsTc9h_btn_cbet: {
    'AA':'x','AKs':'mix:x@67,b33','AQs':'mix:x@55,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:x@69,b33','A3s':'mix:b33@57,x',
    'A2s':'mix:b33@64,x','AKo':'x','KK':'b33','KQs':'x','KJs':'mix:b33@68,x','KTs':'x',
    'K9s':'x','K8s':'x','AQo':'x','KQo':'x','QQ':'b33','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'b33','QJo':'mix:b33@53,x','JJ':'x',
    'JTs':'b33','J9s':'x','ATo':'x','KTo':'mix:x@59,b33','QTo':'x','JTo':'b33',
    'TT':'x','T9s':'mix:x@57,b33','T8s':'x','A9o':'x','99':'x','98s':'x',
    '97s':'x','88':'x','87s':'mix:x@56,b33','77':'x','76s':'mix:b33@58,x','66':'x',
    '65s':'x','55':'x','54s':'mix:x@52,b33','44':'x','33':'x','22':'mix:x@62,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_JsTc9h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'r','AJs':'c','ATs':'c','A9s':'mix:c@67,f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:r@52,c','KJs':'r','KTs':'mix:r@61,c','K9s':'c','AQo':'mix:r@58,c',
    'KQo':'mix:r@58,c','QJs':'r','QTs':'c','AJo':'c','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'c','ATo':'f','KTo':'mix:r@57,c','JTo':'r','TT':'c',
    'T9s':'c','99':'r','98s':'c','88':'c','87s':'r','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_JsTc9h_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'c','AJs':'c','ATs':'mix:c@53,f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'c','KTs':'c','K9s':'f','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'mix:f@60,c','KTo':'mix:c@66,f','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'f','87s':'c','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
