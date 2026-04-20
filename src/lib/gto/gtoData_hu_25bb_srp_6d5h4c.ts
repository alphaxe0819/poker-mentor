// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_6d5h4c
// Generated: 2026-04-16T12:50:14.188Z
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

export const HU_25BB_SRP_6D5H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_6d5h4c_btn_cbet: {
    'AA':'mix:b33@56,x','AKs':'b33','AQs':'mix:b33@64,x','AJs':'mix:x@58,b33','ATs':'x','A9s':'x',
    'A8s':'b33','A7s':'mix:x@65,b33','A6s':'b33','A5s':'mix:b33@58,x','A4s':'x','A3s':'x',
    'A2s':'mix:b33@54,x','AKo':'mix:b33@63,x','KK':'b33','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@69,b33','K8s':'b33','K7s':'mix:x@56,b33','K6s':'mix:b33@54,x','K5s':'x','AQo':'mix:b33@52,x',
    'KQo':'x','QQ':'b33','QJs':'x','QTs':'x','Q9s':'mix:b33@57,x','Q8s':'b33',
    'Q7s':'mix:x@56,b33','AJo':'mix:x@61,b33','KJo':'mix:x@66,b33','QJo':'b33','JJ':'b33','JTs':'mix:x@65,b33',
    'J9s':'mix:x@49,b33','J8s':'mix:b33@63,x','ATo':'mix:x@69,b33','KTo':'mix:b33@54,x','QTo':'b33','JTo':'b33',
    'TT':'b33','T9s':'mix:x@53,b33','T8s':'mix:b33@57,x','T7s':'b33','A9o':'mix:b33@52,x','K9o':'b33',
    'T9o':'b33','99':'b33','98s':'mix:x@58,b33','97s':'mix:x@57,b33','A8o':'mix:x@51,b33','98o':'mix:b33@68,x',
    '88':'b33','87s':'mix:x@50,b33','86s':'b33','77':'b33','76s':'b33','66':'b33',
    '65s':'b33','55':'b33','54s':'b33','44':'b33','43s':'b33','33':'mix:b33@60,x',
    '22':'x',
  },

  // ──────────────────────────────
  hu_25bb_srp_6d5h4c_bb_facing_cbet_small: {
    'AKs':'mix:r@55,c','AQs':'mix:c@68,r','AJs':'c','ATs':'c','A9s':'c','A8s':'r',
    'A7s':'c','A6s':'r','A5s':'c','A4s':'c','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'mix:c@55,r','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'c','Q9s':'mix:r@59,f','Q8s':'c','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:r@54,f','J9s':'mix:r@66,f','J8s':'c','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'f','99':'r','98s':'c','97s':'c','88':'r','87s':'c',
    '86s':'c','77':'r','76s':'mix:r@67,c','66':'c','65s':'r','55':'c',
    '54s':'r','44':'c','43s':'r','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_6d5h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'mix:rbig@54,r',
    'A7s':'c','A6s':'mix:r@58,rbig','A5s':'c','A4s':'c','A3s':'mix:rbig@37,r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:c@52,r','K6s':'c','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'mix:f@58,c','Q9s':'f','Q8s':'c','AJo':'mix:c@57,f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'c','ATo':'mix:f@53,c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'mix:r@50,rbig','T9s':'f','T8s':'c','A9o':'mix:c@55,f','K9o':'f',
    'T9o':'f','99':'mix:rbig@58,r','98s':'c','97s':'c','88':'mix:rbig@56,r','87s':'c',
    '86s':'c','77':'r','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'c','33':'mix:rbig@52,r','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_6d5h4c_bb_facing_cbet_large: {
    'AKs':'r','AQs':'mix:r@37,f','AJs':'mix:f@40,c','ATs':'mix:f@50,c','A9s':'mix:f@48,c','A8s':'r',
    'A7s':'mix:r@60,c','A6s':'r','A5s':'r','A4s':'r','A3s':'mix:r@56,c','A2s':'mix:f@56,c',
    'AKo':'mix:f@64,r','KQs':'mix:f@68,c','KJs':'mix:f@69,c','KTs':'f','K9s':'f','K8s':'mix:c@36,f',
    'K7s':'mix:r@63,c','K6s':'r','K5s':'mix:r@55,c','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'mix:c@42,f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'mix:f@41,c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'mix:f@64,c','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'mix:c@44,r','97s':'mix:r@52,c','88':'r','87s':'c',
    '86s':'r','77':'r','76s':'r','66':'mix:c@57,r','65s':'mix:r@65,c','55':'mix:c@54,r',
    '54s':'mix:r@64,c','44':'mix:c@53,r','43s':'r','33':'r','22':'mix:f@50,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_6d5h4c_bb_facing_cbet_allin: {
    'AKs':'mix:c@67,f','AQs':'mix:c@58,f','AJs':'mix:f@69,c','ATs':'f','A9s':'f','A8s':'mix:c@67,f',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'f',
    'AKo':'mix:c@59,f','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'mix:c@64,f',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:f@54,c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'mix:f@69,c','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'mix:f@55,c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'c','33':'c','22':'mix:c@58,f',
  },

}
