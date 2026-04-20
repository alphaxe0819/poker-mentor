// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_5s5c5d
// Generated: 2026-04-16T12:24:58.028Z
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

export const HU_13BB_SRP_5S5C5D: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_5s5c5d_btn_cbet: {
    'AA':'x','AKs':'mix:b50@66,b33','AQs':'mix:b50@60,b33','AJs':'mix:b50@54,b33','ATs':'mix:b50@56,b33','A9s':'mix:b50@57,b33',
    'A8s':'mix:b50@52,b33','A7s':'mix:b50@39,x','A6s':'mix:b50@45,b33','A5s':'x','A4s':'mix:b50@52,b33','A3s':'mix:b50@46,x',
    'A2s':'mix:b50@48,b33','AKo':'mix:b50@68,b33','KK':'x','KQs':'mix:b33@56,b50','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','AQo':'mix:b50@60,b33','KQo':'mix:b33@55,b50','QQ':'mix:x@40,b33','QJs':'x',
    'QTs':'mix:b50@63,b33','Q9s':'mix:x@45,b50','AJo':'mix:b50@54,b33','KJo':'x','QJo':'x','JJ':'mix:b50@55,b33',
    'JTs':'mix:b50@51,b33','J9s':'mix:b50@38,x','ATo':'mix:b50@55,b33','KTo':'x','QTo':'x','JTo':'x',
    'TT':'mix:b50@63,b33','T9s':'mix:b50@48,b33','T8s':'mix:x@52,b50','A9o':'mix:b50@56,b33','99':'b50','98s':'mix:x@50,b50',
    '97s':'mix:x@50,b50','88':'b50','87s':'x','77':'b50','76s':'x','66':'b50',
    '65s':'x','54s':'x','44':'b50','33':'b50','22':'b50',
  },

  // ──────────────────────────────
  hu_13bb_srp_5s5c5d_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'r','A8s':'r',
    'A7s':'r','A6s':'mix:r@67,c','A5s':'r','A4s':'mix:r@62,c','A3s':'mix:r@62,c','A2s':'mix:r@62,c',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'c','K9s':'c','AQo':'r',
    'KQo':'r','QJs':'c','QTs':'f','AJo':'r','KJo':'r','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'r','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'f','88':'r','87s':'f','77':'r',
    '76s':'mix:c@70,f','66':'r','65s':'r','54s':'r','44':'r','33':'r',
    '22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_5s5c5d_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'f','AQo':'c',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'c','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'f','77':'c',
    '76s':'f','66':'c','65s':'c','54s':'c','44':'c','33':'c',
    '22':'c',
  },

}
