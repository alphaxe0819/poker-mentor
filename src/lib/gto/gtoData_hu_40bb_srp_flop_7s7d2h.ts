// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_7s7d2h
// Generated: 2026-04-11T04:27:00.964Z
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

export const HU_40BB_SRP_FLOP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_7s7d2h_btn_cbet: {
    'AA':'mix:x@57,b33','AKs':'mix:b33@52,b50','AQs':'mix:b33@55,b50','AJs':'mix:b33@61,b50','ATs':'b33','A9s':'mix:b33@53,x',
    'A8s':'x','A7s':'mix:b33@59,b50','A6s':'mix:x@48,b50','A5s':'mix:x@56,b33','A4s':'x','A3s':'mix:x@65,b33',
    'A2s':'b50','AKo':'mix:b33@55,b50','KK':'mix:b33@55,b50','KQs':'mix:b33@56,x','KJs':'mix:x@63,b33','KTs':'mix:x@68,b33',
    'K9s':'mix:x@56,b33','K8s':'mix:b33@46,b50','K7s':'mix:b50@50,b33','K6s':'mix:b33@53,b50','K5s':'mix:b33@58,b50','K4s':'b33',
    'K3s':'mix:b33@49,x','K2s':'b50','AQo':'mix:b33@45,x','KQo':'x','QQ':'mix:b50@54,b33','QJs':'mix:b33@60,x',
    'QTs':'mix:b33@43,x','Q9s':'mix:x@41,b33','Q8s':'mix:b50@45,x','Q7s':'mix:b33@52,b50','Q6s':'mix:b50@44,b33','Q5s':'b33',
    'AJo':'mix:x@49,b33','KJo':'x','QJo':'mix:b33@44,b50','JJ':'b50','JTs':'mix:b33@63,b50','J9s':'mix:b33@54,b50',
    'J8s':'mix:b50@46,b33','J7s':'mix:b33@69,b50','ATo':'mix:x@67,b33','KTo':'mix:b50@42,x','QTo':'mix:b50@49,b33','JTo':'mix:b50@51,b33',
    'TT':'b50','T9s':'b50','T8s':'mix:b50@39,b33','T7s':'b33','A9o':'mix:x@64,b33','K9o':'mix:b50@43,b33',
    'Q9o':'mix:b33@42,b50','J9o':'mix:b50@46,b33','T9o':'mix:b33@43,b50','99':'mix:b50@57,b33','98s':'b33','97s':'mix:b33@52,b50',
    'A8o':'mix:b50@39,b33','98o':'b50','88':'mix:b50@54,b33','87s':'mix:b50@51,b33','86s':'mix:b33@40,x','A7o':'mix:b33@59,b50',
    '77':'mix:x@66,b33','76s':'mix:b33@60,b50','75s':'mix:b33@51,b50','66':'mix:b33@54,b50','65s':'mix:x@49,b33','64s':'mix:b50@44,b33',
    '55':'mix:b33@50,b50','54s':'mix:x@50,b33','53s':'mix:b50@47,x','44':'mix:b33@44,b50','43s':'mix:b33@44,b50','33':'mix:b33@41,b50',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_7s7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'mix:r@60,c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:r@46,c','A5s':'c','A4s':'c','A3s':'c','A2s':'mix:c@57,r',
    'AKo':'mix:c@53,r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@54,f',
    'K7s':'mix:r@70,c','K6s':'mix:r@39,c','K5s':'mix:c@41,r','AQo':'c','KQo':'c','QJs':'c',
    'QTs':'mix:c@48,r','Q9s':'f','Q8s':'f','Q7s':'r','AJo':'c','KJo':'mix:f@63,c',
    'QJo':'f','JTs':'mix:c@38,r','J9s':'f','J8s':'f','ATo':'c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'mix:r@59,c','T9s':'mix:r@50,c','T8s':'mix:r@39,c','A9o':'c',
    'K9o':'f','T9o':'f','99':'mix:r@55,c','98s':'mix:r@51,c','97s':'r','A8o':'mix:r@46,c',
    '98o':'f','88':'mix:r@60,c','87s':'r','86s':'r','77':'c','76s':'r',
    '75s':'r','66':'mix:r@54,c','65s':'mix:r@46,c','55':'mix:c@64,r','54s':'mix:c@37,r','44':'c',
    '43s':'f','33':'mix:c@62,r','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_7s7d2h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:c@46,r','A5s':'c','A4s':'c','A3s':'c','A2s':'r',
    'AKo':'mix:c@56,r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'r','K6s':'mix:f@41,c','K5s':'f','AQo':'c','KQo':'mix:c@51,f','QJs':'c',
    'QTs':'mix:c@60,f','Q9s':'f','Q8s':'f','Q7s':'r','AJo':'c','KJo':'f',
    'QJo':'f','JTs':'mix:c@48,f','J9s':'f','J8s':'f','ATo':'c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'mix:r@68,c','T9s':'mix:f@52,r','T8s':'r','A9o':'mix:c@67,f',
    'K9o':'f','T9o':'f','99':'mix:r@52,c','98s':'r','97s':'r','A8o':'f',
    '98o':'f','88':'mix:r@55,c','87s':'r','86s':'r','77':'c','76s':'r',
    '75s':'r','66':'mix:c@59,r','65s':'r','55':'c','54s':'mix:f@59,r','44':'c',
    '43s':'f','33':'mix:r@59,c','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_7s7d2h_bb_facing_cbet_large: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:r@42,f','A5s':'mix:f@35,r','A4s':'mix:f@54,r','A3s':'mix:f@56,r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:f@58,c','K8s':'f',
    'K7s':'mix:c@55,r','K6s':'f','K5s':'f','AQo':'mix:c@62,f','KQo':'f','QJs':'mix:f@50,c',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'r','AJo':'mix:f@42,c','KJo':'f',
    'QJo':'f','JTs':'mix:f@67,c','J9s':'f','J8s':'f','ATo':'mix:f@39,c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'r','T9s':'f','T8s':'f','A9o':'mix:f@60,c',
    'K9o':'f','T9o':'f','99':'mix:r@66,c','98s':'f','97s':'mix:r@57,c','A8o':'mix:f@63,r',
    '98o':'f','88':'mix:r@63,c','87s':'mix:r@62,c','86s':'mix:f@67,r','77':'c','76s':'mix:r@52,c',
    '75s':'mix:r@53,c','66':'mix:c@52,r','65s':'mix:f@66,r','55':'c','54s':'f','44':'c',
    '43s':'f','33':'mix:c@49,f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_7s7d2h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'mix:f@67,c','AJs':'f','ATs':'mix:f@56,c','A9s':'f','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'mix:c@67,f','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'c','AJo':'f','KJo':'f',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'mix:f@69,c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'f','T9o':'f','99':'c','98s':'f','97s':'c','A8o':'f',
    '98o':'f','88':'c','87s':'c','86s':'f','77':'c','76s':'c',
    '75s':'c','66':'c','65s':'f','55':'c','54s':'f','44':'c',
    '43s':'f','33':'f','22':'c',
  },

}
