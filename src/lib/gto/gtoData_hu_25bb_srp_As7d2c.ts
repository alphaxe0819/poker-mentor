// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_As7d2c
// Generated: 2026-04-16T13:49:23.403Z
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

export const HU_25BB_SRP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_As7d2c_btn_cbet: {
    'AA':'mix:x@62,b33','AKs':'b33','AQs':'b33','AJs':'b33','ATs':'mix:b33@64,x','A9s':'mix:b33@62,x',
    'A8s':'mix:b33@56,x','A7s':'b33','A6s':'x','A5s':'mix:x@60,b33','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','K7s':'b33','K6s':'b33','K5s':'mix:b33@69,x','AQo':'b33',
    'KQo':'x','QQ':'x','QJs':'mix:x@64,b33','QTs':'x','Q9s':'mix:x@67,b33','Q8s':'b33',
    'Q7s':'b33','AJo':'mix:b33@57,x','KJo':'x','QJo':'b33','JJ':'x','JTs':'mix:x@56,b33',
    'J9s':'mix:x@51,b33','J8s':'b33','ATo':'mix:x@55,b33','KTo':'x','QTo':'b33','JTo':'b33',
    'TT':'x','T9s':'x','T8s':'mix:x@56,b33','T7s':'x','A9o':'mix:x@62,b33','K9o':'b33',
    'T9o':'b33','99':'mix:b33@60,x','98s':'x','97s':'x','A8o':'x','98o':'b33',
    '88':'b33','87s':'mix:x@67,b33','86s':'x','77':'b33','76s':'mix:x@59,b33','66':'mix:x@64,b33',
    '65s':'mix:b33@56,x','55':'mix:x@56,b33','54s':'mix:b33@59,x','44':'x','43s':'mix:b33@53,x','33':'mix:x@60,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'mix:r@58,c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:c@62,r','K6s':'r','K5s':'r','AQo':'r','KQo':'mix:c@58,f','QJs':'mix:c@53,r',
    'QTs':'c','Q9s':'f','Q8s':'f','AJo':'mix:c@56,r','KJo':'mix:f@63,c','QJo':'f',
    'JTs':'mix:c@59,r','J9s':'c','J8s':'mix:r@35,c','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'mix:r@47,c','97s':'c','88':'c','87s':'c',
    '86s':'r','77':'c','76s':'c','66':'c','65s':'r','55':'c',
    '54s':'r','44':'mix:r@68,c','43s':'r','33':'mix:c@60,r','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_As7d2c_bb_facing_cbet_mid: {
    'AKs':'mix:r@64,c','AQs':'mix:r@69,c','AJs':'mix:c@65,r','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:c@55,f','K8s':'mix:f@62,c',
    'K7s':'c','K6s':'mix:f@61,r','K5s':'mix:r@52,f','AQo':'r','KQo':'mix:f@56,c','QJs':'mix:c@59,f',
    'QTs':'mix:f@70,c','Q9s':'f','Q8s':'f','AJo':'mix:c@59,r','KJo':'f','QJo':'f',
    'JTs':'mix:f@61,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'mix:f@54,c','97s':'c','88':'c','87s':'c',
    '86s':'mix:f@57,c','77':'c','76s':'c','66':'c','65s':'mix:r@68,f','55':'c',
    '54s':'c','44':'mix:r@54,c','43s':'c','33':'mix:c@51,r','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_As7d2c_bb_facing_cbet_large: {
    'AKs':'mix:r@69,c','AQs':'mix:r@67,c','AJs':'mix:r@65,c','ATs':'mix:r@56,c','A9s':'mix:c@54,r','A8s':'c',
    'A7s':'mix:c@66,r','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'mix:c@68,r',
    'AKo':'r','KQs':'mix:f@66,c','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'mix:c@70,r','K6s':'f','K5s':'f','AQo':'r','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:r@61,c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:c@49,r','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'c','88':'c','87s':'mix:c@63,r',
    '86s':'f','77':'c','76s':'mix:r@55,c','66':'mix:f@55,c','65s':'f','55':'mix:f@51,c',
    '54s':'r','44':'mix:f@47,c','43s':'r','33':'mix:f@52,c','22':'mix:r@53,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_As7d2c_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'mix:f@65,c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'f','98s':'f','97s':'f','88':'mix:f@54,c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

}
