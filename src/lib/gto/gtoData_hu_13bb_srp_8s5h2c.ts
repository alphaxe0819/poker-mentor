// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_8s5h2c
// Generated: 2026-04-16T12:25:56.967Z
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

export const HU_13BB_SRP_8S5H2C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_8s5h2c_btn_cbet: {
    'AA':'x','AKs':'mix:b33@65,x','AQs':'x','AJs':'x','ATs':'x','A9s':'b33',
    'A8s':'b33','A7s':'x','A6s':'x','A5s':'b33','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','AQo':'x','KQo':'x','QQ':'mix:x@55,b33','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'x','QJo':'mix:b33@66,x','JJ':'b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'mix:b33@56,x','QTo':'mix:b33@70,x','JTo':'mix:x@52,b33',
    'TT':'b33','T9s':'x','T8s':'b33','A9o':'b33','99':'b33','98s':'b33',
    '97s':'x','88':'x','87s':'b33','77':'b33','76s':'x','66':'b33',
    '65s':'b33','55':'x','54s':'b33','44':'b33','33':'b33','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_8s5h2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'c','A9s':'mix:c@38,r','A8s':'r',
    'A7s':'mix:c@57,f','A6s':'f','A5s':'r','A4s':'r','A3s':'mix:r@69,c','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'mix:f@68,c','K9s':'f','AQo':'mix:r@61,c',
    'KQo':'f','QJs':'mix:c@68,f','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:f@51,r','J9s':'r','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'mix:c@53,f','99':'r','98s':'r','88':'c','87s':'r','77':'r',
    '76s':'r','66':'r','65s':'r','55':'c','54s':'r','44':'r',
    '33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_8s5h2c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:c@62,f','A9s':'mix:f@61,c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '33':'c','22':'c',
  },

}
