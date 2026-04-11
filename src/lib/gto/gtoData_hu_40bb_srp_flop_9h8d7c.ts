// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_9h8d7c
// Generated: 2026-04-11T04:57:00.259Z
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

export const HU_40BB_SRP_FLOP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_9h8d7c_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'mix:b33@53,b50','ATs':'mix:b50@45,b33','A9s':'mix:b33@44,b50',
    'A8s':'x','A7s':'x','A6s':'mix:b33@35,x','A5s':'x','A4s':'x','A3s':'mix:x@55,b50',
    'A2s':'mix:x@40,b50','AKo':'x','KK':'mix:x@50,b33','KQs':'mix:x@61,b50','KJs':'x','KTs':'mix:b33@49,b50',
    'K9s':'mix:x@49,b33','K8s':'x','K7s':'x','K6s':'mix:x@39,b33','K5s':'x','K4s':'x',
    'K3s':'mix:x@41,b50','K2s':'mix:b50@39,x','AQo':'mix:b50@53,b33','KQo':'mix:b50@36,b33','QQ':'mix:b50@45,b33','QJs':'mix:x@51,b33',
    'QTs':'mix:b33@40,b50','Q9s':'mix:x@55,b33','Q8s':'x','Q7s':'x','Q6s':'b33','Q5s':'mix:b50@54,x',
    'AJo':'mix:b50@46,x','KJo':'mix:b50@55,b33','QJo':'mix:x@56,b50','JJ':'b50','JTs':'mix:b33@46,b50','J9s':'mix:b50@59,b33',
    'J8s':'x','J7s':'x','ATo':'x','KTo':'x','QTo':'mix:x@37,b50','JTo':'mix:b33@47,b50',
    'TT':'b50','T9s':'b50','T8s':'x','T7s':'x','A9o':'mix:b50@52,x','K9o':'x',
    'Q9o':'x','J9o':'mix:x@40,b50','T9o':'mix:x@41,b50','99':'mix:x@56,b33','98s':'mix:b50@44,b33','97s':'x',
    'A8o':'x','98o':'mix:x@40,b50','88':'mix:b50@53,b33','87s':'mix:b33@34,x','86s':'x','A7o':'x',
    '77':'mix:b33@49,b50','76s':'mix:b50@46,x','75s':'x','66':'x','65s':'b50','64s':'mix:x@57,b50',
    '55':'x','54s':'mix:b50@43,x','53s':'mix:b50@43,x','44':'x','43s':'mix:b50@58,b33','33':'x',
    '22':'mix:x@41,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9h8d7c_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'mix:c@64,r','ATs':'mix:r@62,c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'mix:f@57,c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'mix:c@51,r','KTs':'mix:c@68,r','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:c@66,r',
    'QTs':'mix:r@55,c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'mix:r@55,c','KJo':'c',
    'QJo':'mix:c@63,r','JTs':'r','J9s':'mix:c@65,r','J8s':'c','ATo':'c','KTo':'mix:r@52,c',
    'QTo':'mix:r@59,c','JTo':'r','TT':'r','T9s':'mix:c@54,r','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'c','99':'c','98s':'mix:r@62,c','97s':'c','A8o':'c',
    '98o':'mix:c@61,r','88':'mix:r@62,c','87s':'c','86s':'mix:c@55,r','77':'r','76s':'c',
    '75s':'c','66':'c','65s':'r','55':'mix:f@61,c','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9h8d7c_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'mix:f@66,c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'mix:c@67,f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:c@67,f','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'r','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'r','KJo':'f',
    'QJo':'c','JTs':'r','J9s':'c','J8s':'c','ATo':'c','KTo':'mix:r@64,c',
    'QTo':'c','JTo':'r','TT':'r','T9s':'r','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'c','99':'c','98s':'r','97s':'c','A8o':'f',
    '98o':'mix:c@51,r','88':'mix:r@69,c','87s':'c','86s':'c','77':'r','76s':'c',
    '75s':'c','66':'c','65s':'r','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9h8d7c_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'c','ATs':'mix:c@63,r','A9s':'c','A8s':'mix:c@58,f',
    'A7s':'mix:f@58,c','A6s':'mix:c@64,f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'mix:f@64,c','KTs':'c','K9s':'c','K8s':'mix:c@64,f',
    'K7s':'mix:c@51,f','K6s':'mix:f@69,c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'mix:allin@41,r','Q9s':'c','Q8s':'mix:c@67,f','Q7s':'mix:c@63,f','AJo':'f','KJo':'f',
    'QJo':'mix:c@50,f','JTs':'c','J9s':'mix:c@58,r','J8s':'c','ATo':'c','KTo':'mix:f@48,c',
    'QTo':'mix:c@41,allin','JTo':'mix:c@61,r','TT':'mix:allin@57,r','T9s':'mix:c@41,r','T8s':'c','A9o':'c',
    'K9o':'c','T9o':'mix:c@51,r','99':'c','98s':'mix:r@44,c','97s':'c','A8o':'f',
    '98o':'mix:c@43,r','88':'r','87s':'c','86s':'c','77':'mix:r@69,allin','76s':'c',
    '75s':'mix:c@67,f','66':'mix:f@64,c','65s':'mix:r@54,allin','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9h8d7c_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'mix:c@64,f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'f','K9s':'mix:c@51,f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'f','JTs':'c','J9s':'c','J8s':'f','ATo':'mix:f@54,c','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'mix:c@68,f',
    'K9o':'f','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'c','87s':'c','86s':'mix:c@51,f','77':'c','76s':'f',
    '75s':'f','66':'f','65s':'c','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

}
