// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_Tc9c6d
// Generated: 2026-04-11T06:56:40.063Z
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

export const HU_40BB_SRP_FLOP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_Tc9c6d_btn_cbet: {
    'AA':'b50','AKs':'x','AQs':'x','AJs':'mix:x@41,b50','ATs':'b50','A9s':'x',
    'A8s':'mix:x@54,b50','A7s':'mix:x@47,b50','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'x','KK':'mix:b100@47,b50','KQs':'mix:x@43,b50','KJs':'mix:x@41,b50','KTs':'mix:b50@42,x',
    'K9s':'x','K8s':'b50','K7s':'b50','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'mix:x@40,b50','AQo':'mix:x@39,b50','KQo':'mix:x@43,b50','QQ':'mix:b50@54,b100','QJs':'mix:b50@44,x',
    'QTs':'mix:x@55,b50','Q9s':'x','Q8s':'mix:x@41,b50','Q7s':'mix:b50@57,b100','Q6s':'x','Q5s':'x',
    'AJo':'b50','KJo':'mix:b50@42,x','QJo':'mix:x@50,b50','JJ':'mix:b50@59,b100','JTs':'x','J9s':'x',
    'J8s':'x','J7s':'mix:x@46,b50','ATo':'mix:b50@41,x','KTo':'mix:x@40,b50','QTo':'mix:x@52,b50','JTo':'x',
    'TT':'mix:b50@52,b33','T9s':'mix:b50@50,b100','T8s':'b50','T7s':'b50','A9o':'x','K9o':'x',
    'Q9o':'mix:x@58,b50','J9o':'x','T9o':'mix:b50@51,b100','99':'mix:b50@56,b33','98s':'mix:x@54,b50','97s':'mix:x@46,b33',
    'A8o':'mix:b50@42,x','98o':'mix:x@35,b50','88':'x','87s':'b50','86s':'x','A7o':'mix:b50@34,x',
    '77':'x','76s':'x','75s':'x','66':'mix:b50@51,b100','65s':'mix:x@60,b50','64s':'mix:x@53,b50',
    '55':'x','54s':'mix:b50@40,x','53s':'mix:b50@41,x','44':'x','43s':'b50','33':'x',
    '22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Tc9c6d_bb_facing_cbet_small: {
    'AKs':'mix:f@50,c','AQs':'mix:f@50,c','AJs':'mix:f@52,c','ATs':'c','A9s':'c','A8s':'mix:c@53,r',
    'A7s':'mix:f@50,r','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,c','KQs':'c','KJs':'c','KTs':'mix:c@59,r','K9s':'c','K8s':'mix:f@50,c',
    'K7s':'mix:f@50,c','K6s':'c','K5s':'f','AQo':'mix:f@68,c','KQo':'c','QJs':'mix:c@58,r',
    'QTs':'c','Q9s':'c','Q8s':'mix:c@61,r','Q7s':'mix:f@50,c','AJo':'f','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'mix:c@59,r','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'mix:r@59,c','T9s':'mix:r@65,allin','T8s':'mix:r@58,c','A9o':'c',
    'K9o':'c','T9o':'mix:allin@56,r','99':'r','98s':'c','97s':'c','A8o':'mix:r@48,c',
    '98o':'mix:c@55,allin','88':'c','87s':'r','86s':'c','77':'c','76s':'c',
    '75s':'mix:f@66,c','66':'r','65s':'c','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Tc9c6d_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'c','A8s':'mix:f@50,c',
    'A7s':'f','A6s':'mix:c@68,f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'mix:c@61,f','KTs':'c','K9s':'c','K8s':'mix:f@51,r',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'mix:c@61,r','Q8s':'c','Q7s':'f','AJo':'f','KJo':'mix:c@52,r',
    'QJo':'c','JTs':'c','J9s':'mix:c@68,r','J8s':'c','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'r','T8s':'r','A9o':'c',
    'K9o':'c','T9o':'mix:r@50,allin','99':'r','98s':'c','97s':'c','A8o':'mix:f@50,c',
    '98o':'c','88':'c','87s':'r','86s':'c','77':'mix:c@67,f','76s':'c',
    '75s':'f','66':'r','65s':'c','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Tc9c6d_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'mix:f@67,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:f@52,c','KJs':'mix:f@64,c','KTs':'c','K9s':'mix:f@66,c','K8s':'f',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'mix:f@50,c','QJs':'c',
    'QTs':'c','Q9s':'mix:f@67,c','Q8s':'c','Q7s':'f','AJo':'f','KJo':'mix:f@63,c',
    'QJo':'mix:c@56,allin','JTs':'c','J9s':'mix:f@66,c','J8s':'c','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'mix:allin@66,r','T8s':'mix:allin@62,r','A9o':'c',
    'K9o':'mix:f@66,c','T9o':'mix:allin@67,r','99':'mix:allin@63,r','98s':'c','97s':'c','A8o':'f',
    '98o':'mix:allin@45,c','88':'mix:c@50,f','87s':'mix:allin@40,r','86s':'c','77':'mix:f@69,c','76s':'c',
    '75s':'f','66':'mix:allin@54,r','65s':'mix:f@67,c','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Tc9c6d_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'mix:f@67,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'mix:c@65,f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'mix:f@67,c','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:f@63,c',
    'QTs':'mix:c@52,f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'f','JTs':'mix:c@56,f','J9s':'f','J8s':'f','ATo':'c','KTo':'mix:c@65,f',
    'QTo':'mix:c@52,f','JTo':'mix:c@53,f','TT':'c','T9s':'c','T8s':'mix:c@69,f','A9o':'f',
    'K9o':'f','T9o':'c','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'c','86s':'mix:f@67,c','77':'f','76s':'mix:f@67,c',
    '75s':'f','66':'c','65s':'mix:f@67,c','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

}
