// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Jh9h7c
// Generated: 2026-04-16T12:30:11.598Z
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

export const HU_13BB_SRP_JH9H7C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Jh9h7c_btn_cbet: {
    'AA':'mix:b33@45,x','AKs':'x','AQs':'x','AJs':'mix:b33@61,b50','ATs':'mix:x@66,b33','A9s':'x',
    'A8s':'mix:x@53,b33','A7s':'x','A6s':'mix:x@53,b33','A5s':'mix:b33@52,x','A4s':'b33','A3s':'b33',
    'A2s':'b33','AKo':'mix:x@55,b50','KK':'b33','KQs':'mix:x@53,b33','KJs':'mix:b33@65,b50','KTs':'mix:x@52,b50',
    'K9s':'mix:b33@42,b50','K8s':'x','AQo':'x','KQo':'x','QQ':'mix:b33@69,b50','QJs':'b33',
    'QTs':'x','Q9s':'x','AJo':'mix:b33@60,b50','KJo':'mix:b33@64,b50','QJo':'b33','JJ':'x',
    'JTs':'mix:b33@61,b50','J9s':'b33','ATo':'mix:b33@37,x','KTo':'mix:b50@47,b33','QTo':'mix:x@54,b50','JTo':'mix:b33@62,b50',
    'TT':'mix:b33@60,b50','T9s':'mix:b33@64,b50','T8s':'x','A9o':'x','99':'x','98s':'b33',
    '97s':'mix:b33@57,x','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'b33','44':'x','33':'x','22':'mix:x@54,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_Jh9h7c_bb_facing_cbet_small: {
    'AKs':'mix:f@50,r','AQs':'f','AJs':'r','ATs':'mix:r@60,f','A9s':'c','A8s':'mix:f@51,r',
    'A7s':'mix:f@54,c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,r','KQs':'mix:r@64,f','KJs':'r','KTs':'r','K9s':'mix:r@63,c','AQo':'f',
    'KQo':'mix:r@64,f','QJs':'r','QTs':'mix:r@52,c','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'mix:r@65,f','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'mix:f@58,r','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Jh9h7c_bb_facing_cbet_mid: {
    'AKs':'mix:c@50,f','AQs':'f','AJs':'c','ATs':'mix:c@62,f','A9s':'c','A8s':'mix:f@65,c',
    'A7s':'mix:f@62,c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'mix:c@67,f','QJs':'c','QTs':'mix:c@50,f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'mix:c@55,f','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'mix:f@65,c','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
