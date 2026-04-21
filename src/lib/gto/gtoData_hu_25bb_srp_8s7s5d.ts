// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_8s7s5d
// Generated: 2026-04-16T13:09:40.000Z
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

export const HU_25BB_SRP_8S7S5D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_8s7s5d_btn_cbet: {
    'AA':'b33','AKs':'mix:x@43,b33','AQs':'mix:x@54,b33','AJs':'mix:x@60,b33','ATs':'mix:x@59,b33','A9s':'mix:b33@56,x',
    'A8s':'b33','A7s':'mix:x@58,b33','A6s':'x','A5s':'x','A4s':'mix:b33@59,x','A3s':'b33',
    'A2s':'b33','AKo':'mix:b33@46,x','KK':'b33','KQs':'x','KJs':'mix:x@66,b33','KTs':'mix:b33@53,x',
    'K9s':'mix:b33@62,x','K8s':'mix:b33@56,x','K7s':'x','K6s':'x','K5s':'x','AQo':'mix:x@57,b33',
    'KQo':'x','QQ':'b33','QJs':'mix:b33@55,x','QTs':'mix:b33@57,x','Q9s':'mix:b33@68,x','Q8s':'x',
    'Q7s':'x','AJo':'mix:x@54,b33','KJo':'mix:b33@60,x','QJo':'b33','JJ':'mix:b33@66,b50','JTs':'mix:b33@49,x',
    'J9s':'x','J8s':'x','ATo':'mix:b33@49,x','KTo':'b33','QTo':'b33','JTo':'mix:x@46,b33',
    'TT':'b33','T9s':'mix:b33@54,x','T8s':'mix:x@50,b33','T7s':'x','A9o':'mix:b33@52,x','K9o':'b33',
    'T9o':'mix:x@57,b33','99':'mix:b33@59,b50','98s':'b33','97s':'mix:b33@68,x','A8o':'b33','98o':'b33',
    '88':'b33','87s':'b33','86s':'b33','77':'b33','76s':'b33','66':'mix:b33@65,x',
    '65s':'mix:x@49,b33','55':'b33','54s':'mix:x@67,b33','44':'mix:x@51,b33','43s':'mix:b33@55,x','33':'mix:x@56,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s7s5d_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'mix:f@50,c','ATs':'mix:f@50,c','A9s':'c','A8s':'mix:rbig@58,r',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'mix:f@49,c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:f@50,c','KJs':'mix:f@51,c','KTs':'mix:f@57,c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'mix:r@36,c','K5s':'c','AQo':'c','KQo':'mix:f@50,c','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'c','AJo':'mix:f@50,c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'mix:f@50,c','KTo':'f','QTo':'f',
    'JTo':'c','TT':'mix:r@56,rbig','T9s':'c','T8s':'c','A9o':'mix:c@53,rbig','K9o':'mix:c@57,r',
    'T9o':'mix:c@56,rbig','99':'rbig','98s':'mix:r@61,rbig','97s':'c','88':'c','87s':'mix:r@64,c',
    '86s':'mix:r@61,rbig','77':'mix:r@61,c','76s':'mix:rbig@53,c','66':'c','65s':'c','55':'mix:r@68,c',
    '54s':'c','44':'c','43s':'mix:f@68,c','33':'mix:c@55,f','22':'mix:f@50,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s7s5d_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'mix:f@50,c','ATs':'mix:f@50,c','A9s':'c','A8s':'r',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:f@50,c','KJs':'f','KTs':'f','K9s':'f','K8s':'c',
    'K7s':'c','K6s':'mix:c@49,rbig','K5s':'c','AQo':'c','KQo':'mix:f@56,c','QJs':'f',
    'QTs':'f','Q9s':'mix:c@38,f','Q8s':'c','AJo':'mix:f@58,c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'mix:c@54,rbig','J8s':'c','ATo':'mix:f@64,c','KTo':'f','QTo':'f',
    'JTo':'c','TT':'rbig','T9s':'c','T8s':'c','A9o':'mix:c@43,rbig','K9o':'mix:f@50,c',
    'T9o':'mix:c@48,rbig','99':'rbig','98s':'rbig','97s':'c','88':'c','87s':'mix:c@60,r',
    '86s':'mix:rbig@63,r','77':'mix:c@44,rbig','76s':'mix:rbig@48,c','66':'c','65s':'c','55':'mix:c@45,rbig',
    '54s':'c','44':'mix:c@58,f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s7s5d_bb_facing_cbet_large: {
    'AKs':'f','AQs':'mix:f@60,c','AJs':'f','ATs':'f','A9s':'mix:f@45,r','A8s':'r',
    'A7s':'mix:f@69,c','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'mix:r@57,c',
    'K7s':'mix:c@50,f','K6s':'mix:c@63,r','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'mix:c@59,r','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:f@65,r','J9s':'mix:r@57,c','J8s':'r','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'r','T8s':'mix:c@47,r','A9o':'mix:r@47,f','K9o':'f',
    'T9o':'r','99':'r','98s':'r','97s':'r','88':'mix:c@63,r','87s':'mix:r@65,c',
    '86s':'r','77':'mix:r@69,c','76s':'r','66':'r','65s':'r','55':'mix:r@67,c',
    '54s':'mix:f@38,r','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s7s5d_bb_facing_cbet_allin: {
    'AKs':'mix:f@67,c','AQs':'f','AJs':'f','ATs':'f','A9s':'mix:c@52,f','A8s':'c',
    'A7s':'f','A6s':'mix:f@55,c','A5s':'mix:f@67,c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'mix:f@57,c','K5s':'mix:f@67,c','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'mix:f@59,c','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'mix:c@60,f','T8s':'c','A9o':'mix:f@56,c','K9o':'f',
    'T9o':'mix:c@61,f','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'f','43s':'f','33':'f','22':'f',
  },

}
