// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_Jc7d2h
// Generated: 2026-04-11T05:26:38.796Z
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

export const HU_40BB_SRP_FLOP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_Jc7d2h_btn_cbet: {
    'AA':'mix:b50@51,b100','AKs':'mix:b50@43,b33','AQs':'mix:x@48,b33','AJs':'mix:b50@41,b100','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'mix:b50@42,b33','A6s':'x','A5s':'x','A4s':'mix:x@42,b100','A3s':'b100',
    'A2s':'b50','AKo':'x','KK':'mix:b100@51,b50','KQs':'b50','KJs':'mix:b50@52,b33','KTs':'x',
    'K9s':'mix:x@53,b50','K8s':'mix:b50@56,b100','K7s':'x','K6s':'x','K5s':'x','K4s':'mix:x@62,b100',
    'K3s':'mix:x@45,b100','K2s':'x','AQo':'x','KQo':'mix:x@41,b50','QQ':'mix:b100@51,b50','QJs':'b50',
    'QTs':'x','Q9s':'mix:b50@36,x','Q8s':'mix:b50@48,b100','Q7s':'mix:b50@42,b33','Q6s':'x','Q5s':'mix:x@55,b100',
    'AJo':'mix:b100@56,b50','KJo':'mix:b100@41,b50','QJo':'mix:x@47,b50','JJ':'mix:b33@46,x','JTs':'b50','J9s':'mix:b50@49,x',
    'J8s':'x','J7s':'b50','ATo':'x','KTo':'mix:b50@36,b100','QTo':'mix:b50@42,b100','JTo':'mix:b50@35,x',
    'TT':'x','T9s':'mix:x@35,b33','T8s':'x','T7s':'x','A9o':'x','K9o':'mix:b50@50,b33',
    'Q9o':'b50','J9o':'x','T9o':'mix:x@46,b50','99':'x','98s':'mix:b33@44,x','97s':'x',
    'A8o':'b50','98o':'mix:x@49,b50','88':'mix:x@57,b50','87s':'x','86s':'mix:x@46,b50','A7o':'b50',
    '77':'mix:b50@59,b33','76s':'mix:x@49,b50','75s':'x','66':'x','65s':'mix:b50@44,x','64s':'mix:x@34,b50',
    '55':'x','54s':'mix:x@47,b50','53s':'mix:x@40,b50','44':'x','43s':'mix:b50@45,b100','33':'x',
    '22':'mix:b50@68,b100',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Jc7d2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'r','ATs':'c','A9s':'c','A8s':'mix:c@59,f',
    'A7s':'mix:c@59,r','A6s':'mix:f@65,c','A5s':'mix:c@40,r','A4s':'mix:r@43,c','A3s':'mix:r@49,c','A2s':'c',
    'AKo':'c','KQs':'mix:c@62,r','KJs':'r','KTs':'c','K9s':'mix:c@52,f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'c','QJs':'mix:c@52,r',
    'QTs':'mix:r@46,c','Q9s':'mix:f@38,r','Q8s':'f','Q7s':'c','AJo':'r','KJo':'mix:r@62,c',
    'QJo':'mix:c@68,r','JTs':'mix:c@54,r','J9s':'c','J8s':'c','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'mix:r@68,c','T8s':'mix:c@69,r','A9o':'f',
    'K9o':'f','T9o':'mix:c@54,r','99':'c','98s':'mix:r@56,c','97s':'c','A8o':'f',
    '98o':'mix:c@58,r','88':'c','87s':'c','86s':'f','77':'c','76s':'c',
    '75s':'c','66':'c','65s':'f','55':'c','54s':'f','44':'c',
    '43s':'f','33':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Jc7d2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'r','ATs':'c','A9s':'c','A8s':'mix:c@48,f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:f@69,r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'mix:c@55,r','KTs':'mix:c@67,f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:c@53,f','QJs':'c',
    'QTs':'mix:r@61,f','Q9s':'f','Q8s':'f','Q7s':'c','AJo':'r','KJo':'mix:r@55,c',
    'QJo':'c','JTs':'mix:c@55,r','J9s':'c','J8s':'c','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'f','T9o':'mix:r@51,c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'mix:c@53,r','88':'c','87s':'c','86s':'f','77':'c','76s':'c',
    '75s':'c','66':'c','65s':'f','55':'mix:c@63,f','54s':'f','44':'mix:c@63,f',
    '43s':'f','33':'mix:c@52,f','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Jc7d2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'r','ATs':'c','A9s':'mix:f@65,c','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'mix:c@58,r','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:c@67,r','KQo':'mix:c@56,f','QJs':'c',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'c','AJo':'r','KJo':'mix:r@57,c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'f','T9o':'mix:f@45,c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'f','88':'c','87s':'c','86s':'f','77':'c','76s':'c',
    '75s':'c','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Jc7d2h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'mix:c@65,f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'mix:f@55,c','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'mix:f@64,c','AJo':'c','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'c','TT':'c','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'f','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'c','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'f','22':'c',
  },

}
