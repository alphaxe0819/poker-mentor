// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_Js9c3h
// Generated: 2026-04-11T05:41:52.320Z
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

export const HU_40BB_SRP_JS9C3H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_Js9c3h_btn_cbet: {
    'AA':'mix:b100@68,b50','AKs':'x','AQs':'x','AJs':'b50','ATs':'x','A9s':'b50',
    'A8s':'x','A7s':'mix:x@55,b50','A6s':'x','A5s':'x','A4s':'mix:b100@44,x','A3s':'x',
    'A2s':'mix:b100@48,x','AKo':'x','KK':'mix:b100@60,b50','KQs':'mix:b100@50,b50','KJs':'mix:b100@36,b50','KTs':'x',
    'K9s':'x','K8s':'b50','K7s':'b50','K6s':'mix:x@38,b50','K5s':'mix:x@43,b50','K4s':'mix:b100@33,b50',
    'K3s':'x','K2s':'mix:b50@32,b100','AQo':'mix:b100@35,x','KQo':'mix:b50@38,x','QQ':'mix:b100@54,b50','QJs':'b50',
    'QTs':'mix:b50@48,b33','Q9s':'x','Q8s':'mix:b100@39,x','Q7s':'mix:b50@45,b33','Q6s':'mix:b50@32,b100','Q5s':'mix:b50@32,b100',
    'AJo':'mix:b50@56,b100','KJo':'mix:b100@39,b50','QJo':'x','JJ':'mix:b33@52,x','JTs':'mix:b50@43,b100','J9s':'mix:b50@59,b100',
    'J8s':'mix:x@65,b50','J7s':'x','ATo':'b50','KTo':'mix:b100@49,b50','QTo':'mix:x@50,b50','JTo':'mix:x@48,b50',
    'TT':'x','T9s':'mix:b50@41,x','T8s':'x','T7s':'mix:b100@48,x','A9o':'mix:x@43,b50','K9o':'mix:x@48,b50',
    'Q9o':'x','J9o':'mix:b50@56,b100','T9o':'x','99':'mix:b33@52,b50','98s':'mix:x@40,b33','97s':'x',
    'A8o':'mix:x@39,b50','98o':'x','88':'x','87s':'x','86s':'x','A7o':'x',
    '77':'x','76s':'mix:x@60,b50','75s':'mix:x@45,b50','66':'x','65s':'mix:b100@33,x','64s':'mix:b100@34,b50',
    '55':'x','54s':'x','53s':'mix:x@43,b50','44':'x','43s':'mix:x@44,b50','33':'mix:b50@57,b100',
    '22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Js9c3h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'mix:r@69,c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:f@67,r','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'r','KJs':'mix:r@64,c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@51,f','KQo':'mix:r@58,c','QJs':'mix:c@59,r',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'f','AJo':'r','KJo':'mix:r@57,c',
    'QJo':'c','JTs':'mix:c@68,r','J9s':'r','J8s':'c','ATo':'f','KTo':'mix:c@58,r',
    'QTo':'mix:c@62,r','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'c','99':'mix:c@63,r','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'c','87s':'mix:c@67,r','86s':'f','77':'c','76s':'f',
    '75s':'f','66':'c','65s':'f','55':'c','54s':'f','44':'mix:f@59,c',
    '43s':'c','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Js9c3h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'mix:c@58,f','KQs':'r','KJs':'mix:c@57,r','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'mix:c@59,r','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'mix:c@57,r','Q7s':'f','AJo':'mix:r@65,c','KJo':'mix:r@52,c',
    'QJo':'c','JTs':'c','J9s':'r','J8s':'c','ATo':'f','KTo':'mix:c@65,r',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'c','99':'r','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'f','87s':'c','86s':'f','77':'mix:f@69,c','76s':'f',
    '75s':'f','66':'mix:c@62,f','65s':'f','55':'mix:f@67,c','54s':'f','44':'f',
    '43s':'c','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Js9c3h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'f','KQs':'mix:r@52,allin','KJs':'c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'mix:f@54,c','Q7s':'f','AJo':'mix:c@50,allin','KJo':'mix:c@41,r',
    'QJo':'c','JTs':'c','J9s':'mix:c@57,r','J8s':'c','ATo':'f','KTo':'mix:f@70,c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'mix:f@52,c','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'c','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Js9c3h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'c','ATs':'f','A9s':'mix:c@60,f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:f@60,c','KJs':'c','KTs':'f','K9s':'mix:c@55,f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'f','Q9s':'mix:c@54,f','Q8s':'f','Q7s':'f','AJo':'c','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'mix:c@54,f','T9s':'f','T8s':'f','A9o':'mix:f@58,c',
    'K9o':'mix:f@66,c','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'c','22':'f',
  },

}
