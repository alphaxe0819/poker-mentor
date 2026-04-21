// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_Ah5c2d
// Generated: 2026-04-16T13:36:44.416Z
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

export const HU_25BB_SRP_AH5C2D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_Ah5c2d_btn_cbet: {
    'AA':'mix:x@66,b33','AKs':'b33','AQs':'b33','AJs':'mix:b33@69,x','ATs':'mix:b33@60,x','A9s':'mix:b33@60,x',
    'A8s':'mix:b33@60,x','A7s':'x','A6s':'x','A5s':'mix:b33@65,x','A4s':'mix:x@54,b33','A3s':'mix:x@51,b33',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','K7s':'b33','K6s':'mix:b33@67,x','K5s':'b33','AQo':'b33',
    'KQo':'x','QQ':'x','QJs':'x','QTs':'mix:x@66,b33','Q9s':'mix:x@63,b33','Q8s':'mix:b33@60,x',
    'Q7s':'b33','AJo':'mix:b33@52,x','KJo':'x','QJo':'b33','JJ':'x','JTs':'mix:x@59,b33',
    'J9s':'mix:x@57,b33','J8s':'mix:b33@62,x','ATo':'mix:x@57,b33','KTo':'x','QTo':'mix:b33@64,x','JTo':'mix:b33@66,x',
    'TT':'x','T9s':'mix:x@61,b33','T8s':'mix:b33@65,x','T7s':'b33','A9o':'mix:x@62,b33','K9o':'mix:b33@53,x',
    'T9o':'mix:b33@58,x','99':'mix:x@53,b33','98s':'mix:x@56,b33','97s':'mix:b33@65,x','A8o':'mix:x@64,b33','98o':'b33',
    '88':'mix:b33@65,x','87s':'mix:x@62,b33','86s':'x','77':'mix:b33@56,x','76s':'mix:x@70,b33','66':'mix:x@60,b33',
    '65s':'x','55':'b33','54s':'mix:b33@59,x','44':'mix:x@51,b33','43s':'b33','33':'mix:b33@54,x',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah5c2d_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@65,f',
    'K7s':'r','K6s':'r','K5s':'mix:c@60,r','AQo':'r','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'mix:c@67,f','Q8s':'mix:c@62,f','AJo':'c','KJo':'c','QJo':'f',
    'JTs':'c','J9s':'mix:c@53,f','J8s':'mix:c@51,f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'mix:c@52,f','88':'c','87s':'r',
    '86s':'r','77':'c','76s':'mix:r@59,c','66':'c','65s':'c','55':'mix:r@52,c',
    '54s':'r','44':'c','43s':'mix:c@68,r','33':'mix:r@54,c','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah5c2d_bb_facing_cbet_mid: {
    'AKs':'mix:c@58,r','AQs':'mix:c@54,r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@69,f',
    'K7s':'mix:c@37,r','K6s':'mix:r@55,c','K5s':'c','AQo':'mix:r@66,c','KQo':'mix:c@41,f','QJs':'c',
    'QTs':'c','Q9s':'mix:f@68,c','Q8s':'f','AJo':'c','KJo':'mix:f@54,c','QJo':'f',
    'JTs':'mix:f@52,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'mix:r@63,c','44':'c','43s':'c','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah5c2d_bb_facing_cbet_large: {
    'AKs':'mix:r@58,c','AQs':'mix:r@60,c','AJs':'mix:r@54,c','ATs':'mix:c@50,r','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:r@67,c','KQs':'mix:c@54,f','KJs':'mix:f@58,c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'mix:c@60,r','AQo':'mix:r@67,c','KQo':'mix:f@67,c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'mix:r@60,c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:r@49,c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:c@62,r','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'mix:c@66,f','87s':'f',
    '86s':'f','77':'mix:c@54,f','76s':'f','66':'mix:c@61,f','65s':'mix:r@51,c','55':'c',
    '54s':'r','44':'mix:r@65,c','43s':'mix:c@67,r','33':'mix:r@65,c','22':'mix:c@68,r',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah5c2d_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'mix:c@51,f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'mix:f@53,c','98s':'f','97s':'f','88':'mix:f@67,c','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'mix:c@51,f','55':'c',
    '54s':'mix:c@68,f','44':'mix:c@53,f','43s':'c','33':'mix:f@53,c','22':'c',
  },

}
