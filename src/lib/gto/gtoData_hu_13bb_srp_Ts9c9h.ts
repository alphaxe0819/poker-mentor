// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Ts9c9h
// Generated: 2026-04-16T12:36:26.363Z
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

export const HU_13BB_SRP_TS9C9H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Ts9c9h_btn_cbet: {
    'AA':'mix:b33@64,b50','AKs':'mix:b33@56,b50','AQs':'mix:b33@62,b50','AJs':'b33','ATs':'mix:b33@41,b50','A9s':'b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'mix:x@52,b33',
    'A2s':'mix:b33@51,x','AKo':'mix:b50@63,b33','KK':'mix:b33@63,b50','KQs':'b33','KJs':'mix:b50@53,x','KTs':'mix:b33@53,b50',
    'K9s':'x','K8s':'b33','AQo':'mix:b50@36,x','KQo':'mix:b33@62,b50','QQ':'mix:b33@65,x','QJs':'mix:b50@53,b33',
    'QTs':'mix:b33@61,b50','Q9s':'x','AJo':'mix:x@60,b50','KJo':'mix:x@54,b50','QJo':'mix:b50@47,x','JJ':'b33',
    'JTs':'mix:b33@62,b50','J9s':'mix:b33@66,x','ATo':'mix:b50@50,b33','KTo':'mix:b33@52,b50','QTo':'mix:b33@56,b50','JTo':'mix:b33@61,b50',
    'TT':'x','T9s':'x','T8s':'mix:b33@43,b50','A9o':'mix:b33@69,x','99':'x','98s':'x',
    '97s':'mix:x@63,b33','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'b33','55':'x','54s':'b33','44':'x','33':'mix:x@65,b33','22':'mix:x@45,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ts9c9h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'c','KTs':'r','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'f','KJo':'f','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'mix:r@55,c','87s':'mix:r@65,c','77':'mix:f@53,c',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ts9c9h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'mix:c@51,f','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'f','KTs':'c','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'f','KJo':'f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'f','77':'mix:c@59,f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
