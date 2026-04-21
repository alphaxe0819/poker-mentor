// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_9h8d7c
// Generated: 2026-04-16T13:22:05.364Z
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

export const HU_25BB_SRP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_9h8d7c_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'x','AJs':'x','ATs':'b33','A9s':'b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b33@52,x','A4s':'mix:b33@53,x','A3s':'mix:b33@69,x',
    'A2s':'b33','AKo':'mix:x@60,b33','KK':'b33','KQs':'mix:b33@66,x','KJs':'x','KTs':'mix:x@68,b33',
    'K9s':'mix:b33@58,x','K8s':'x','K7s':'x','K6s':'x','K5s':'b33','AQo':'b33',
    'KQo':'b33','QQ':'b33','QJs':'x','QTs':'x','Q9s':'x','Q8s':'x',
    'Q7s':'x','AJo':'b33','KJo':'b33','QJo':'b33','JJ':'b33','JTs':'b33',
    'J9s':'b33','J8s':'x','ATo':'mix:b33@57,x','KTo':'mix:b33@62,x','QTo':'mix:b33@55,x','JTo':'b33',
    'TT':'b33','T9s':'b33','T8s':'mix:b33@50,x','T7s':'x','A9o':'mix:x@59,b33','K9o':'x',
    'T9o':'b33','99':'mix:x@56,b33','98s':'b33','97s':'mix:x@51,b33','A8o':'mix:b33@67,x','98o':'b33',
    '88':'mix:b33@68,x','87s':'b33','86s':'b33','77':'b33','76s':'mix:b33@58,x','66':'x',
    '65s':'b33','55':'mix:x@58,b33','54s':'b33','44':'x','43s':'b33','33':'mix:b33@53,x',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_9h8d7c_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'c','KTs':'rbig','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'mix:c@47,r','Q9s':'c','Q8s':'c','AJo':'mix:c@65,r','KJo':'mix:f@56,r','QJo':'c',
    'JTs':'mix:r@59,c','J9s':'r','J8s':'c','ATo':'mix:c@56,rbig','KTo':'c','QTo':'c',
    'JTo':'r','TT':'rbig','T9s':'mix:r@53,rbig','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'rbig','99':'c','98s':'mix:c@59,r','97s':'c','88':'r','87s':'c',
    '86s':'r','77':'r','76s':'c','66':'c','65s':'mix:rbig@57,r','55':'mix:r@52,c',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_9h8d7c_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'mix:f@68,c','AJs':'c','ATs':'mix:c@47,rbig','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'mix:f@52,c','KTs':'mix:c@39,rbig','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'mix:rbig@49,c','Q9s':'c','Q8s':'c','AJo':'mix:f@60,c','KJo':'f','QJo':'mix:c@54,f',
    'JTs':'c','J9s':'r','J8s':'c','ATo':'mix:c@53,rbig','KTo':'c','QTo':'mix:c@66,rbig',
    'JTo':'c','TT':'rbig','T9s':'rbig','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'rbig','99':'c','98s':'mix:r@56,rbig','97s':'c','88':'mix:r@47,rbig','87s':'c',
    '86s':'mix:r@62,c','77':'mix:r@52,rbig','76s':'c','66':'c','65s':'mix:rbig@62,r','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_9h8d7c_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'mix:f@61,c','ATs':'mix:r@59,c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'mix:c@58,f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'mix:c@44,r','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'mix:c@57,f','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:f@69,c',
    'QTs':'mix:r@60,c','Q9s':'c','Q8s':'mix:f@66,c','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:r@60,c','J9s':'mix:r@61,c','J8s':'c','ATo':'mix:r@50,c','KTo':'mix:f@54,c','QTo':'mix:c@53,r',
    'JTo':'mix:r@60,c','TT':'r','T9s':'r','T8s':'mix:r@56,c','A9o':'c','K9o':'mix:f@57,c',
    'T9o':'r','99':'mix:r@56,c','98s':'mix:r@55,c','97s':'mix:c@63,r','88':'r','87s':'c',
    '86s':'mix:c@51,r','77':'r','76s':'mix:c@55,r','66':'mix:f@61,c','65s':'r','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_9h8d7c_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'mix:f@66,c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'c','K9s':'mix:f@55,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'mix:c@55,f','Q9s':'mix:f@63,c','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'mix:f@65,c','QTo':'f',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'mix:c@67,f','65s':'c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

}
