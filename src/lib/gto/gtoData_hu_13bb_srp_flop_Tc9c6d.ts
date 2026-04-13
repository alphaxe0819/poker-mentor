// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_Tc9c6d
// Generated: 2026-04-12T04:32:48.464Z
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

export const HU_13BB_SRP_FLOP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_Tc9c6d_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'x','AJs':'mix:x@51,b33','ATs':'mix:b100@56,b33','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b33@50,x','A4s':'mix:b33@54,x','A3s':'b33',
    'A2s':'mix:b33@62,b50','AKo':'mix:x@62,b33','KK':'b33','KQs':'mix:b33@41,b100','KJs':'x','KTs':'mix:b100@38,b33',
    'K9s':'b33','K8s':'x','AQo':'mix:x@44,b100','KQo':'mix:b100@46,b33','QQ':'b33','QJs':'x',
    'QTs':'b100','Q9s':'mix:b100@44,b33','AJo':'mix:b33@43,x','KJo':'x','QJo':'mix:x@41,b100','JJ':'mix:b33@45,b100',
    'JTs':'mix:b33@44,b100','J9s':'x','ATo':'mix:b100@54,b33','KTo':'mix:b100@38,b33','QTo':'mix:b100@55,b50','JTo':'mix:b33@45,b100',
    'TT':'x','T9s':'b33','T8s':'mix:b100@40,b50','A9o':'x','99':'x','98s':'b33',
    '97s':'mix:b33@46,b100','88':'mix:x@52,b33','87s':'mix:x@69,b33','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'mix:b33@52,x','44':'x','33':'x','22':'mix:b33@52,x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Tc9c6d_bb_facing_cbet_small: {
    'AKs':'mix:f@46,c','AQs':'mix:f@51,r','AJs':'f','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'mix:c@47,f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@45,c','KQs':'r','KJs':'c','KTs':'r','K9s':'r','AQo':'mix:f@65,c',
    'KQo':'r','QJs':'mix:r@66,c','QTs':'r','AJo':'f','KJo':'c','QJo':'r',
    'JTs':'r','J9s':'c','ATo':'r','KTo':'r','JTo':'r','TT':'mix:r@54,c',
    'T9s':'r','99':'mix:r@64,c','98s':'r','88':'c','87s':'r','77':'c',
    '76s':'c','66':'r','65s':'c','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Tc9c6d_bb_facing_cbet_mid: {
    'AKs':'mix:f@52,r','AQs':'mix:f@69,r','AJs':'f','ATs':'r','A9s':'c','A8s':'mix:f@50,c',
    'A7s':'f','A6s':'mix:f@64,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@59,r','KQs':'r','KJs':'mix:f@49,c','KTs':'r','K9s':'r','AQo':'f',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'f','KJo':'mix:f@51,c','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'c','87s':'r','77':'c',
    '76s':'mix:r@52,c','66':'r','65s':'mix:f@66,r','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Tc9c6d_bb_facing_cbet_large: {
    'AKs':'mix:f@54,c','AQs':'f','AJs':'f','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'mix:f@65,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@57,c','KQs':'c','KJs':'f','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'f','KJo':'f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'mix:f@50,c',
    '76s':'c','66':'c','65s':'mix:f@66,c','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
