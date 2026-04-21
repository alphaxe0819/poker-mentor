// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_QsJh2h
// Generated: 2026-04-16T12:35:35.526Z
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

export const HU_13BB_SRP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_QsJh2h_btn_cbet: {
    'AA':'b33','AKs':'mix:x@59,b33','AQs':'mix:b33@60,x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'mix:b33@50,x','A5s':'mix:x@56,b33','A4s':'b33','A3s':'b33',
    'A2s':'b33','AKo':'b33','KK':'b33','KQs':'mix:b33@67,x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','AQo':'mix:b33@69,x','KQo':'b33','QQ':'x','QJs':'b33',
    'QTs':'mix:b33@57,x','Q9s':'mix:b33@55,x','AJo':'x','KJo':'x','QJo':'b33','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'mix:x@66,b33','QTo':'b33','JTo':'x',
    'TT':'x','T9s':'x','T8s':'x','A9o':'x','99':'x','98s':'x',
    '97s':'mix:x@63,b33','88':'x','87s':'mix:x@60,b33','77':'x','76s':'mix:b33@62,x','66':'x',
    '65s':'mix:b33@58,x','55':'x','54s':'mix:b33@50,x','44':'x','33':'x','22':'b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_QsJh2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'mix:f@50,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:r@61,c',
    'AKo':'r','KQs':'r','KJs':'mix:c@56,r','KTs':'mix:r@55,c','K9s':'f','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'c','KJo':'r','QJo':'r',
    'JTs':'mix:c@65,r','J9s':'c','ATo':'mix:c@51,f','KTo':'r','JTo':'mix:c@64,r','TT':'mix:c@53,f',
    'T9s':'c','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_QsJh2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@63,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:f@60,c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:f@51,c','K9s':'f','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'mix:f@54,c','JTo':'c','TT':'mix:c@69,f',
    'T9s':'f','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

}
