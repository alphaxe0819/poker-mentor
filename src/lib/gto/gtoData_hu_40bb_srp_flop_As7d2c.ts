// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_As7d2c
// Generated: 2026-04-11T05:11:34.463Z
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

export const HU_40BB_SRP_FLOP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_As7d2c_btn_cbet: {
    'AA':'mix:b33@43,x','AKs':'mix:b50@55,b33','AQs':'mix:b33@37,b50','AJs':'mix:b33@35,b50','ATs':'mix:b33@35,b50','A9s':'mix:x@38,b33',
    'A8s':'mix:x@38,b33','A7s':'b33','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'mix:b33@68,b50','AKo':'mix:b50@56,b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:x@64,b33','K7s':'mix:b50@50,b33','K6s':'mix:b33@48,x','K5s':'mix:x@38,b33','K4s':'mix:b33@38,x',
    'K3s':'mix:b50@38,x','K2s':'b33','AQo':'mix:x@50,b33','KQo':'x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'mix:x@46,b50','Q8s':'mix:x@45,b33','Q7s':'mix:b33@65,b50','Q6s':'mix:x@40,b33','Q5s':'mix:b50@39,x',
    'AJo':'x','KJo':'x','QJo':'mix:b33@38,x','JJ':'x','JTs':'x','J9s':'mix:x@43,b50',
    'J8s':'mix:x@40,b33','J7s':'b33','ATo':'mix:x@58,b33','KTo':'x','QTo':'mix:b33@38,x','JTo':'mix:b33@41,b50',
    'TT':'x','T9s':'mix:x@51,b33','T8s':'mix:x@55,b50','T7s':'mix:x@61,b33','A9o':'x','K9o':'x',
    'Q9o':'x','J9o':'mix:x@41,b33','T9o':'mix:x@42,b33','99':'mix:x@49,b50','98s':'mix:x@52,b33','97s':'mix:x@62,b33',
    'A8o':'x','98o':'mix:b50@41,b33','88':'mix:x@47,b33','87s':'x','86s':'mix:x@52,b33','A7o':'mix:b33@64,b50',
    '77':'mix:b50@52,b33','76s':'mix:x@49,b33','75s':'mix:b50@39,b33','66':'mix:x@67,b33','65s':'mix:x@43,b50','64s':'mix:x@40,b50',
    '55':'mix:x@67,b33','54s':'mix:b33@45,b50','53s':'mix:b50@47,b33','44':'mix:x@67,b33','43s':'mix:b33@38,b50','33':'x',
    '22':'mix:b50@63,b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'mix:c@53,r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:r@68,c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:c@64,r','K6s':'c','K5s':'r','AQo':'c','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'mix:c@59,f','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'f','JTs':'c','J9s':'c','J8s':'mix:c@56,f','ATo':'c','KTo':'mix:f@59,c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'c','T8s':'mix:c@49,r','A9o':'c',
    'K9o':'f','T9o':'f','99':'c','98s':'mix:r@58,c','97s':'c','A8o':'c',
    '98o':'f','88':'c','87s':'c','86s':'mix:r@64,c','77':'r','76s':'mix:c@66,r',
    '75s':'c','66':'c','65s':'r','55':'c','54s':'r','44':'c',
    '43s':'r','33':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_As7d2c_bb_facing_cbet_mid: {
    'AKs':'mix:r@50,c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:r@61,c','K6s':'mix:c@57,f','K5s':'r','AQo':'c','KQo':'mix:c@53,f','QJs':'c',
    'QTs':'c','Q9s':'f','Q8s':'f','Q7s':'c','AJo':'c','KJo':'f',
    'QJo':'f','JTs':'c','J9s':'f','J8s':'f','ATo':'c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'c','T9s':'mix:f@55,c','T8s':'c','A9o':'c',
    'K9o':'f','T9o':'f','99':'c','98s':'c','97s':'c','A8o':'c',
    '98o':'f','88':'c','87s':'c','86s':'mix:c@38,r','77':'mix:c@59,r','76s':'c',
    '75s':'c','66':'c','65s':'mix:r@69,f','55':'c','54s':'mix:r@70,c','44':'c',
    '43s':'r','33':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_As7d2c_bb_facing_cbet_large: {
    'AKs':'mix:c@52,r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:r@57,c','KQs':'c','KJs':'mix:c@61,f','KTs':'mix:f@58,c','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'mix:f@57,r','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'c','AJo':'c','KJo':'f',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c',
    'K9o':'f','T9o':'f','99':'c','98s':'f','97s':'c','A8o':'c',
    '98o':'f','88':'c','87s':'c','86s':'f','77':'c','76s':'c',
    '75s':'c','66':'mix:c@65,f','65s':'f','55':'mix:c@58,f','54s':'c','44':'mix:c@58,f',
    '43s':'c','33':'mix:c@48,f','22':'mix:c@55,r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_As7d2c_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@70,f','A8s':'mix:c@67,f',
    'A7s':'c','A6s':'mix:c@63,f','A5s':'mix:c@65,f','A4s':'mix:c@65,f','A3s':'mix:c@65,f','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'mix:f@58,c','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'mix:f@55,c','AJo':'c','KJo':'f',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'mix:c@69,f','KTo':'f',
    'QTo':'f','JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'mix:c@67,f',
    'K9o':'f','T9o':'f','99':'f','98s':'f','97s':'mix:f@61,c','A8o':'mix:c@64,f',
    '98o':'f','88':'f','87s':'mix:f@62,c','86s':'f','77':'c','76s':'f',
    '75s':'mix:f@62,c','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'c',
  },

}
