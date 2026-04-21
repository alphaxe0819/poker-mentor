// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Kc8h3s
// Generated: 2026-04-16T12:32:17.167Z
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

export const HU_13BB_SRP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Kc8h3s_btn_cbet: {
    'AA':'x','AKs':'mix:x@67,b33','AQs':'mix:x@52,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'b33','A7s':'mix:x@60,b33','A6s':'x','A5s':'x','A4s':'x','A3s':'b33',
    'A2s':'x','AKo':'x','KK':'x','KQs':'b33','KJs':'b33','KTs':'mix:b33@67,x',
    'K9s':'x','K8s':'x','AQo':'x','KQo':'b33','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'b33','QJo':'mix:x@56,b33','JJ':'mix:x@53,b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'b33','QTo':'b33','JTo':'mix:b33@55,x',
    'TT':'b33','T9s':'x','T8s':'mix:x@66,b33','A9o':'b33','99':'b33','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'mix:x@61,b33','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kc8h3s_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:c@60,r','AJs':'c','ATs':'c','A9s':'mix:f@61,c','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'mix:f@50,r','A4s':'mix:r@51,f','A3s':'r','A2s':'f',
    'AKo':'c','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'mix:c@70,r',
    'KQo':'r','QJs':'f','QTs':'f','AJo':'mix:f@51,c','KJo':'r','QJo':'f',
    'JTs':'mix:r@53,f','J9s':'f','ATo':'f','KTo':'r','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'c','88':'c','87s':'r','77':'mix:c@39,r',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'c','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Kc8h3s_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:f@52,c','AJs':'mix:f@53,c','ATs':'mix:f@61,c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:f@51,c','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'mix:f@62,c',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'mix:f@59,c','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'c','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'c','88':'c','87s':'c','77':'mix:c@68,f',
    '76s':'f','66':'mix:c@57,f','65s':'f','55':'mix:f@57,c','54s':'f','44':'f',
    '33':'c','22':'f',
  },

}
