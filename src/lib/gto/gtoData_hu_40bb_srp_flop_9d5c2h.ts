// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_9d5c2h
// Generated: 2026-04-11T04:42:09.409Z
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

export const HU_40BB_SRP_FLOP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_9d5c2h_btn_cbet: {
    'AA':'mix:b33@42,b50','AKs':'mix:b33@36,x','AQs':'mix:x@52,b33','AJs':'x','ATs':'x','A9s':'mix:b100@58,b50',
    'A8s':'x','A7s':'mix:b100@54,x','A6s':'mix:b50@50,b100','A5s':'mix:b50@51,b100','A4s':'mix:x@39,b50','A3s':'x',
    'A2s':'x','AKo':'x','KK':'mix:b50@45,b33','KQs':'x','KJs':'mix:x@64,b33','KTs':'x',
    'K9s':'mix:b50@44,b100','K8s':'mix:b50@36,b33','K7s':'mix:b33@33,x','K6s':'mix:b50@45,b33','K5s':'x','K4s':'mix:b50@38,b100',
    'K3s':'mix:b100@38,b50','K2s':'x','AQo':'x','KQo':'x','QQ':'mix:b50@43,b100','QJs':'b33',
    'QTs':'b33','Q9s':'mix:b50@51,b33','Q8s':'mix:b50@46,b33','Q7s':'mix:b50@33,b33','Q6s':'mix:b50@45,b33','Q5s':'x',
    'AJo':'x','KJo':'mix:x@35,b50','QJo':'mix:x@37,b50','JJ':'mix:b100@54,b50','JTs':'b50','J9s':'mix:b50@45,b33',
    'J8s':'mix:x@41,b100','J7s':'b50','ATo':'x','KTo':'b50','QTo':'mix:x@30,b50','JTo':'mix:x@28,b100',
    'TT':'mix:b100@50,b50','T9s':'mix:b50@48,b33','T8s':'mix:x@48,b50','T7s':'b50','A9o':'b100','K9o':'mix:b100@45,b50',
    'Q9o':'mix:x@37,b50','J9o':'x','T9o':'x','99':'b33','98s':'mix:b50@51,b33','97s':'mix:x@48,b50',
    'A8o':'mix:b50@37,b33','98o':'mix:x@38,b50','88':'x','87s':'x','86s':'x','A7o':'mix:b50@44,b33',
    '77':'x','76s':'x','75s':'x','66':'mix:b50@37,x','65s':'x','64s':'x',
    '55':'mix:b50@52,b33','54s':'mix:x@45,b33','53s':'mix:x@44,b33','44':'x','43s':'mix:x@36,b33','33':'mix:x@40,b100',
    '22':'mix:b50@61,b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9d5c2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'c',
    'A7s':'mix:c@55,f','A6s':'mix:r@62,f','A5s':'mix:c@57,r','A4s':'mix:c@53,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'mix:c@45,r','KJs':'mix:c@53,r','KTs':'mix:c@39,r','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'c','KQo':'f','QJs':'mix:r@53,c',
    'QTs':'mix:c@38,r','Q9s':'c','Q8s':'f','Q7s':'f','AJo':'mix:c@62,f','KJo':'f',
    'QJo':'f','JTs':'r','J9s':'c','J8s':'mix:f@64,c','ATo':'mix:f@63,c','KTo':'f',
    'QTo':'f','JTo':'f','TT':'r','T9s':'c','T8s':'mix:f@46,c','A9o':'r',
    'K9o':'mix:r@56,c','T9o':'c','99':'c','98s':'mix:c@50,r','97s':'c','A8o':'f',
    '98o':'c','88':'c','87s':'c','86s':'mix:c@53,r','77':'c','76s':'mix:c@55,r',
    '75s':'c','66':'c','65s':'c','55':'mix:r@63,c','54s':'c','44':'c',
    '43s':'mix:r@66,c','33':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9d5c2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'mix:f@51,r',
    'A7s':'f','A6s':'mix:f@55,r','A5s':'c','A4s':'c','A3s':'mix:r@53,c','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'mix:c@65,f','KQo':'f','QJs':'c',
    'QTs':'mix:c@41,r','Q9s':'c','Q8s':'f','Q7s':'f','AJo':'mix:f@49,c','KJo':'f',
    'QJo':'f','JTs':'mix:r@44,c','J9s':'c','J8s':'f','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'f','TT':'r','T9s':'c','T8s':'f','A9o':'r',
    'K9o':'mix:r@58,c','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'c','87s':'c','86s':'c','77':'c','76s':'c',
    '75s':'c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '43s':'mix:c@65,r','33':'mix:f@53,c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9d5c2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'mix:c@61,r','A3s':'mix:c@67,r','A2s':'c',
    'AKo':'mix:c@61,f','KQs':'c','KJs':'c','KTs':'mix:f@63,c','K9s':'mix:r@60,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'mix:f@55,c','KQo':'f','QJs':'c',
    'QTs':'mix:c@56,f','Q9s':'c','Q8s':'f','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'f','JTs':'mix:c@59,f','J9s':'c','J8s':'f','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'f','TT':'r','T9s':'c','T8s':'f','A9o':'r',
    'K9o':'mix:r@64,c','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'mix:c@52,f','87s':'c','86s':'c','77':'f','76s':'c',
    '75s':'c','66':'f','65s':'c','55':'c','54s':'c','44':'f',
    '43s':'c','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_9d5c2h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:f@58,c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'f','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'f','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'f','JTs':'f','J9s':'c','J8s':'f','ATo':'f','KTo':'f',
    'QTo':'f','JTo':'f','TT':'c','T9s':'c','T8s':'f','A9o':'c',
    'K9o':'c','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'f',
    '98o':'c','88':'mix:f@67,c','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'c','54s':'f','44':'f',
    '43s':'f','33':'f','22':'c',
  },

}
