// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_Tc9c6d
// Generated: 2026-04-12T05:32:55.787Z
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

export const HU_25BB_SRP_FLOP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_Tc9c6d_btn_cbet: {
    'AA':'mix:b50@64,b33','AKs':'x','AQs':'x','AJs':'mix:x@39,b33','ATs':'mix:b33@38,x','A9s':'x',
    'A8s':'mix:x@42,b33','A7s':'mix:b50@43,b33','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'mix:x@50,b50','AKo':'x','KK':'b50','KQs':'x','KJs':'x','KTs':'mix:b33@46,b50',
    'K9s':'mix:x@69,b33','K8s':'mix:b33@43,b50','K7s':'mix:b33@51,b50','K6s':'x','K5s':'mix:x@39,b33','AQo':'mix:b33@38,x',
    'KQo':'mix:x@51,b50','QQ':'mix:b50@47,b33','QJs':'mix:x@48,b33','QTs':'x','Q9s':'x','Q8s':'mix:x@47,b33',
    'Q7s':'mix:b50@43,b33','AJo':'mix:b33@50,b50','KJo':'mix:x@41,b33','QJo':'mix:x@55,b33','JJ':'mix:b50@53,b33','JTs':'x',
    'J9s':'x','J8s':'x','ATo':'mix:x@47,b33','KTo':'mix:b33@45,x','QTo':'x','JTo':'x',
    'TT':'mix:b33@60,x','T9s':'mix:b33@52,b50','T8s':'mix:b33@48,b50','T7s':'mix:x@53,b33','A9o':'x','K9o':'mix:x@59,b33',
    'T9o':'mix:b33@49,b50','99':'mix:b33@68,b50','98s':'mix:x@44,b33','97s':'mix:x@39,b50','A8o':'mix:b33@39,b50','98o':'mix:b33@36,x',
    '88':'x','87s':'b33','86s':'x','77':'x','76s':'x','66':'mix:b33@54,b50',
    '65s':'x','55':'x','54s':'mix:b50@38,b33','44':'x','43s':'mix:b50@41,b33','33':'x',
    '22':'mix:x@44,b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Tc9c6d_bb_facing_cbet_small: {
    'AKs':'mix:f@50,c','AQs':'mix:f@52,c','AJs':'f','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:f@38,c','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@44,r',
    'K7s':'mix:f@50,c','K6s':'c','K5s':'f','AQo':'f','KQo':'c','QJs':'mix:c@64,r',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'f','KJo':'c','QJo':'mix:c@49,rbig',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'mix:rbig@58,r','T8s':'r','A9o':'c','K9o':'c',
    'T9o':'rbig','99':'r','98s':'c','97s':'c','88':'c','87s':'r',
    '86s':'c','77':'c','76s':'c','66':'r','65s':'c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Tc9c6d_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'c','A8s':'mix:f@48,c',
    'A7s':'mix:f@50,c','A6s':'mix:c@65,f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@68,c','KQs':'mix:c@66,f','KJs':'mix:f@49,c','KTs':'c','K9s':'mix:c@59,f','K8s':'f',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'mix:c@53,f','QJs':'mix:c@58,rbig',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'f','KJo':'mix:f@50,c','QJo':'mix:rbig@58,c',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'rbig','T8s':'rbig','A9o':'c','K9o':'mix:c@62,f',
    'T9o':'rbig','99':'rbig','98s':'mix:rbig@47,c','97s':'c','88':'c','87s':'mix:rbig@63,c',
    '86s':'c','77':'c','76s':'c','66':'rbig','65s':'c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Tc9c6d_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'mix:c@60,f','A8s':'mix:f@50,c',
    'A7s':'f','A6s':'mix:f@67,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:f@53,r','KJs':'f','KTs':'r','K9s':'mix:f@61,c','K8s':'f',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'mix:f@53,c','QJs':'mix:c@55,r',
    'QTs':'c','Q9s':'mix:f@67,c','Q8s':'c','AJo':'f','KJo':'f','QJo':'mix:r@57,c',
    'JTs':'c','J9s':'mix:f@51,c','J8s':'c','ATo':'c','KTo':'mix:r@57,c','QTo':'mix:c@49,f',
    'JTo':'mix:c@51,f','TT':'mix:c@58,r','T9s':'r','T8s':'r','A9o':'mix:f@51,c','K9o':'mix:f@65,c',
    'T9o':'r','99':'mix:r@67,c','98s':'c','97s':'c','88':'mix:f@50,c','87s':'r',
    '86s':'c','77':'f','76s':'c','66':'r','65s':'mix:f@67,c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Tc9c6d_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'mix:f@67,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:f@68,c','KJs':'f','KTs':'c','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:c@58,f',
    'QTs':'mix:c@62,f','Q9s':'f','Q8s':'f','AJo':'f','KJo':'f','QJo':'mix:c@52,f',
    'JTs':'mix:c@67,f','J9s':'f','J8s':'f','ATo':'c','KTo':'c','QTo':'mix:c@63,f',
    'JTo':'mix:c@63,f','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'c','99':'c','98s':'mix:c@56,f','97s':'f','88':'f','87s':'c',
    '86s':'mix:f@67,c','77':'f','76s':'mix:f@67,c','66':'c','65s':'mix:f@67,c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

}
