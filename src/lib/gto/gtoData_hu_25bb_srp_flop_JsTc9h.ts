// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_JsTc9h
// Generated: 2026-04-12T05:09:57.909Z
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

export const HU_25BB_SRP_FLOP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_JsTc9h_btn_cbet: {
    'AA':'mix:x@58,b33','AKs':'x','AQs':'b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'mix:x@70,b33','A5s':'mix:x@53,b33','A4s':'mix:x@56,b33','A3s':'mix:x@49,b33',
    'A2s':'mix:b33@43,x','AKo':'mix:b33@46,b50','KK':'mix:b33@55,b50','KQs':'b33','KJs':'b33','KTs':'mix:x@66,b33',
    'K9s':'x','K8s':'b33','K7s':'mix:x@58,b33','K6s':'mix:x@50,b33','K5s':'mix:b33@45,x','AQo':'mix:b33@51,x',
    'KQo':'mix:b33@70,b50','QQ':'mix:b33@66,b50','QJs':'mix:b33@47,x','QTs':'mix:x@54,b33','Q9s':'x','Q8s':'b33',
    'Q7s':'mix:b50@45,x','AJo':'x','KJo':'mix:b33@59,x','QJo':'mix:b33@45,x','JJ':'mix:b33@52,x','JTs':'mix:b33@47,b50',
    'J9s':'mix:x@67,b33','J8s':'mix:x@57,b33','ATo':'mix:b33@45,x','KTo':'mix:x@43,b33','QTo':'x','JTo':'mix:b33@50,b50',
    'TT':'mix:x@43,b33','T9s':'mix:b33@47,x','T8s':'x','T7s':'x','A9o':'x','K9o':'x',
    'T9o':'mix:x@49,b33','99':'mix:b33@39,x','98s':'mix:x@56,b33','97s':'x','A8o':'b33','98o':'mix:x@44,b33',
    '88':'x','87s':'mix:b33@67,b50','86s':'mix:b33@48,b50','77':'x','76s':'mix:b33@59,x','66':'x',
    '65s':'b33','55':'x','54s':'b33','44':'mix:x@67,b33','43s':'mix:b33@52,b50','33':'mix:x@51,b33',
    '22':'mix:b33@50,x',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_JsTc9h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:r@58,c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:r@57,c','K6s':'r','K5s':'r','AQo':'c','KQo':'mix:r@54,c','QJs':'mix:c@60,r',
    'QTs':'c','Q9s':'c','Q8s':'mix:r@69,c','AJo':'c','KJo':'c','QJo':'mix:c@68,r',
    'JTs':'mix:r@64,c','J9s':'c','J8s':'c','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'r','TT':'mix:r@66,c','T9s':'c','T8s':'c','A9o':'mix:c@56,f','K9o':'mix:c@55,r',
    'T9o':'c','99':'r','98s':'c','97s':'c','88':'c','87s':'r',
    '86s':'c','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_JsTc9h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:c@56,r','AJs':'c','ATs':'c','A9s':'mix:c@67,f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'c','QJs':'mix:c@67,r',
    'QTs':'c','Q9s':'c','Q8s':'mix:r@65,c','AJo':'c','KJo':'mix:c@64,r','QJo':'mix:c@57,r',
    'JTs':'mix:r@52,c','J9s':'c','J8s':'c','ATo':'f','KTo':'c','QTo':'c',
    'JTo':'r','TT':'mix:r@61,c','T9s':'c','T8s':'c','A9o':'f','K9o':'c',
    'T9o':'c','99':'r','98s':'c','97s':'mix:c@67,f','88':'mix:c@61,f','87s':'r',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_JsTc9h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'mix:c@58,r','AJs':'c','ATs':'mix:f@67,c','A9s':'mix:f@68,c','A8s':'mix:f@58,c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@53,c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@62,r','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'mix:r@57,c','AJo':'mix:c@52,f','KJo':'mix:c@59,r','QJo':'mix:c@58,r',
    'JTs':'mix:c@58,r','J9s':'c','J8s':'c','ATo':'f','KTo':'mix:c@52,f','QTo':'c',
    'JTo':'mix:r@69,c','TT':'r','T9s':'c','T8s':'c','A9o':'f','K9o':'mix:f@57,c',
    'T9o':'c','99':'r','98s':'c','97s':'f','88':'f','87s':'r',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_JsTc9h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'mix:f@50,c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'c','KTs':'mix:f@65,c','K9s':'mix:f@64,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'c','QJs':'c',
    'QTs':'mix:c@68,f','Q9s':'f','Q8s':'c','AJo':'mix:f@57,c','KJo':'mix:c@69,f','QJo':'c',
    'JTs':'c','J9s':'c','J8s':'mix:c@65,f','ATo':'f','KTo':'f','QTo':'mix:c@64,f',
    'JTo':'c','TT':'c','T9s':'c','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'c','99':'c','98s':'mix:f@57,c','97s':'f','88':'f','87s':'c',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

}
