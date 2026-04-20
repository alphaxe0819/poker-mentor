// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_QsJh2h
// Generated: 2026-04-11T06:47:56.397Z
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

export const HU_40BB_SRP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_QsJh2h_btn_cbet: {
    'AA':'mix:b100@41,b50','AKs':'mix:b50@34,x','AQs':'mix:b50@44,b33','AJs':'mix:x@54,b50','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'mix:x@47,b50','A6s':'mix:x@44,b50','A5s':'mix:b50@39,x','A4s':'b50','A3s':'mix:b50@45,b100',
    'A2s':'x','AKo':'x','KK':'b50','KQs':'mix:b50@48,b100','KJs':'x','KTs':'mix:x@34,b33',
    'K9s':'x','K8s':'x','K7s':'mix:b50@34,x','K6s':'mix:x@35,b50','K5s':'mix:x@39,b50','K4s':'mix:x@38,b50',
    'K3s':'mix:b50@35,x','K2s':'x','AQo':'mix:b50@39,b100','KQo':'b50','QQ':'mix:b33@49,b50','QJs':'mix:b50@48,b100',
    'QTs':'mix:x@36,b50','Q9s':'mix:b50@37,x','Q8s':'x','Q7s':'x','Q6s':'x','Q5s':'x',
    'AJo':'x','KJo':'x','QJo':'mix:b50@49,b100','JJ':'mix:b50@52,b33','JTs':'x','J9s':'x',
    'J8s':'x','J7s':'x','ATo':'x','KTo':'x','QTo':'mix:x@52,b50','JTo':'x',
    'TT':'x','T9s':'x','T8s':'mix:x@40,b50','T7s':'x','A9o':'x','K9o':'mix:x@44,b50',
    'Q9o':'mix:x@50,b50','J9o':'x','T9o':'mix:x@43,b50','99':'x','98s':'mix:x@47,b50','97s':'x',
    'A8o':'x','98o':'mix:x@48,b50','88':'x','87s':'x','86s':'x','A7o':'mix:b50@35,x',
    '77':'x','76s':'x','75s':'x','66':'x','65s':'mix:x@43,b50','64s':'mix:x@37,b50',
    '55':'x','54s':'mix:x@43,b50','53s':'mix:x@36,b50','44':'x','43s':'b50','33':'mix:x@52,b50',
    '22':'mix:b100@57,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_QsJh2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:r@62,c','AJs':'c','ATs':'c','A9s':'mix:f@59,c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'mix:c@66,r','KJs':'c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:r@58,c','KQo':'c','QJs':'r',
    'QTs':'mix:c@69,r','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'r','JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'mix:c@67,r',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'c','T9o':'mix:c@63,r','99':'c','98s':'mix:f@57,r','97s':'f','A8o':'f',
    '98o':'f','88':'mix:c@70,f','87s':'f','86s':'f','77':'c','76s':'f',
    '75s':'f','66':'mix:c@60,f','65s':'f','55':'mix:c@52,f','54s':'f','44':'mix:f@50,c',
    '43s':'f','33':'mix:f@50,c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_QsJh2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:c@60,r','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:f@50,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@55,r','KQo':'c','QJs':'r',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'r','JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'mix:f@50,c','T9s':'c','T8s':'mix:c@50,f','A9o':'f',
    'K9o':'mix:f@58,r','T9o':'c','99':'mix:c@50,f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'mix:f@68,c','87s':'f','86s':'f','77':'mix:f@56,c','76s':'f',
    '75s':'f','66':'mix:f@50,c','65s':'f','55':'mix:f@63,c','54s':'f','44':'f',
    '43s':'f','33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_QsJh2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@50,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:f@46,c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'c','QJs':'r',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'r','JTs':'mix:c@63,f','J9s':'mix:c@68,f','J8s':'mix:c@64,f','ATo':'mix:f@60,c','KTo':'c',
    'QTo':'c','JTo':'mix:c@57,f','TT':'f','T9s':'c','T8s':'f','A9o':'f',
    'K9o':'f','T9o':'c','99':'f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_QsJh2h_bb_facing_cbet_allin: {
    'AKs':'mix:f@67,c','AQs':'c','AJs':'mix:c@51,f','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'mix:f@66,c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'mix:f@51,c','KJo':'mix:f@66,c',
    'QJo':'c','JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'f',
    'QTo':'c','JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'f','T9o':'f','99':'f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'c',
  },

}
