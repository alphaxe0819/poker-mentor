// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_8s7s5d
// Generated: 2026-04-16T12:26:13.138Z
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

export const HU_13BB_SRP_8S7S5D: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_8s7s5d_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'b33','A7s':'b33','A6s':'x','A5s':'mix:b33@46,x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'mix:b33@62,x','KK':'x','KQs':'x','KJs':'x','KTs':'mix:b33@54,x',
    'K9s':'x','K8s':'mix:b33@53,x','AQo':'x','KQo':'x','QQ':'b33','QJs':'mix:b33@52,x',
    'QTs':'mix:b33@58,x','Q9s':'x','AJo':'x','KJo':'x','QJo':'mix:b33@60,x','JJ':'b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'mix:x@51,b33','QTo':'mix:b33@59,x','JTo':'mix:x@51,b50',
    'TT':'b33','T9s':'x','T8s':'b33','A9o':'mix:b33@61,x','99':'b33','98s':'b33',
    '97s':'b33','88':'x','87s':'x','77':'x','76s':'b33','66':'b33',
    '65s':'mix:b33@55,x','55':'x','54s':'mix:b33@51,x','44':'mix:b33@40,x','33':'x','22':'b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_8s7s5d_bb_facing_cbet_small: {
    'AKs':'r','AQs':'mix:r@52,f','AJs':'mix:r@55,f','ATs':'mix:f@50,r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'mix:f@50,r','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'f','KJs':'f','KTs':'f','K9s':'r','AQo':'mix:r@47,f',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'mix:r@53,f','KJo':'f','QJo':'f',
    'JTs':'mix:r@51,f','J9s':'r','ATo':'mix:f@50,c','KTo':'f','JTo':'mix:r@53,f','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'r','66':'r','65s':'r','55':'r','54s':'r','44':'r',
    '33':'mix:r@55,f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_8s7s5d_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:c@54,f','AJs':'mix:c@63,f','ATs':'mix:c@50,f','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'mix:f@60,c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'c','AQo':'mix:c@52,f',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'mix:c@53,f','KJo':'f','QJo':'f',
    'JTs':'mix:c@52,f','J9s':'c','ATo':'f','KTo':'f','JTo':'mix:c@53,f','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '33':'mix:c@58,f','22':'f',
  },

}
