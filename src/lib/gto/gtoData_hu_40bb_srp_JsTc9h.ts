// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_JsTc9h
// Generated: 2026-04-11T05:56:25.672Z
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

export const HU_40BB_SRP_JSTC9H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_JsTc9h_btn_cbet: {
    'AA':'x','AKs':'mix:x@50,b33','AQs':'mix:b50@36,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'mix:x@48,b33','AKo':'x','KK':'mix:b50@49,b33','KQs':'mix:b33@37,b50','KJs':'mix:x@33,b50','KTs':'mix:x@54,b33',
    'K9s':'x','K8s':'mix:b33@52,b50','K7s':'mix:x@36,b33','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','AQo':'x','KQo':'mix:b33@38,b50','QQ':'mix:b50@60,b33','QJs':'mix:b50@34,x',
    'QTs':'x','Q9s':'x','Q8s':'mix:b50@41,b100','Q7s':'mix:b33@36,b50','Q6s':'mix:b33@36,x','Q5s':'mix:b33@40,x',
    'AJo':'x','KJo':'x','QJo':'mix:x@42,b50','JJ':'mix:x@33,b33','JTs':'mix:b50@34,x','J9s':'mix:x@39,b33',
    'J8s':'mix:x@56,b33','J7s':'x','ATo':'x','KTo':'x','QTo':'x','JTo':'mix:x@36,b50',
    'TT':'mix:b50@40,x','T9s':'mix:x@36,b33','T8s':'x','T7s':'x','A9o':'x','K9o':'x',
    'Q9o':'x','J9o':'x','T9o':'x','99':'mix:b50@35,x','98s':'x','97s':'x',
    'A8o':'mix:b50@43,b33','98o':'x','88':'x','87s':'mix:b50@51,b100','86s':'mix:b50@37,b100','A7o':'x',
    '77':'x','76s':'mix:x@42,b50','75s':'mix:b50@39,x','66':'x','65s':'x','64s':'x',
    '55':'x','54s':'mix:x@38,b50','53s':'x','44':'x','43s':'mix:b50@31,x','33':'x',
    '22':'mix:x@34,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_JsTc9h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:c@69,r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:c@55,r','KJs':'c','KTs':'c','K9s':'c','K8s':'r',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:c@63,r','KQo':'mix:r@61,c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'r','Q7s':'r','AJo':'c','KJo':'c',
    'QJo':'c','JTs':'mix:c@69,r','J9s':'c','J8s':'c','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'mix:c@63,r','TT':'mix:r@54,c','T9s':'c','T8s':'c','A9o':'mix:c@57,f',
    'K9o':'c','T9o':'c','99':'mix:c@58,r','98s':'c','97s':'c','A8o':'c',
    '98o':'mix:c@65,r','88':'c','87s':'mix:r@67,c','86s':'c','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_JsTc9h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@67,f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:c@69,r','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:r@59,c','QJs':'mix:c@53,r',
    'QTs':'c','Q9s':'c','Q8s':'r','Q7s':'r','AJo':'c','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'mix:c@63,r',
    'QTo':'c','JTo':'mix:c@68,r','TT':'mix:c@52,r','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'mix:c@70,r','T9o':'c','99':'mix:c@62,r','98s':'c','97s':'mix:c@67,f','A8o':'f',
    '98o':'c','88':'c','87s':'r','86s':'mix:c@66,f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_JsTc9h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:c@63,f','A9s':'mix:f@62,c','A8s':'mix:f@54,c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@61,c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:f@60,c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:c@56,r','QJs':'mix:c@62,r',
    'QTs':'c','Q9s':'c','Q8s':'r','Q7s':'mix:r@58,c','AJo':'mix:f@51,c','KJo':'c',
    'QJo':'mix:c@63,r','JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'mix:c@54,r',
    'QTo':'c','JTo':'c','TT':'mix:r@69,c','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'mix:c@44,f','T9o':'c','99':'r','98s':'c','97s':'f','A8o':'f',
    '98o':'mix:f@58,c','88':'f','87s':'r','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_JsTc9h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'mix:f@58,c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'c','QJs':'c',
    'QTs':'mix:f@56,c','Q9s':'f','Q8s':'c','Q7s':'f','AJo':'f','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'mix:c@68,f','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'c','T8s':'f','A9o':'f',
    'K9o':'f','T9o':'c','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'c','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

}
