// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_KsQd4h
// Generated: 2026-04-11T06:37:05.248Z
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

export const HU_40BB_SRP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_KsQd4h_btn_cbet: {
    'AA':'b100','AKs':'mix:b100@47,b50','AQs':'mix:x@39,b50','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'mix:x@38,b100','A6s':'mix:x@34,b100','A5s':'mix:b100@60,b50','A4s':'x','A3s':'mix:b100@66,b50',
    'A2s':'mix:b100@55,b50','AKo':'mix:b100@65,b50','KK':'mix:b33@46,x','KQs':'mix:b100@63,b50','KJs':'mix:b100@46,b50','KTs':'mix:x@31,b100',
    'K9s':'mix:x@33,b50','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'mix:b50@40,b33',
    'K3s':'x','K2s':'x','AQo':'x','KQo':'b100','QQ':'mix:b33@50,b50','QJs':'x',
    'QTs':'x','Q9s':'x','Q8s':'x','Q7s':'x','Q6s':'x','Q5s':'x',
    'AJo':'mix:x@42,b100','KJo':'mix:b100@42,b50','QJo':'x','JJ':'x','JTs':'mix:x@40,b100','J9s':'x',
    'J8s':'mix:x@36,b50','J7s':'x','ATo':'x','KTo':'x','QTo':'x','JTo':'x',
    'TT':'x','T9s':'mix:x@56,b100','T8s':'mix:b50@40,x','T7s':'mix:x@51,b50','A9o':'x','K9o':'x',
    'Q9o':'x','J9o':'mix:b100@33,b50','T9o':'mix:b100@38,b50','99':'x','98s':'x','97s':'mix:x@63,b33',
    'A8o':'x','98o':'x','88':'x','87s':'x','86s':'x','A7o':'x',
    '77':'x','76s':'mix:x@53,b100','75s':'mix:b100@44,x','66':'x','65s':'mix:b100@44,x','64s':'b100',
    '55':'x','54s':'mix:x@40,b100','53s':'mix:x@50,b100','44':'mix:b100@67,b50','43s':'mix:x@34,b100','33':'x',
    '22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KsQd4h_bb_facing_cbet_small: {
    'AKs':'mix:r@67,c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@53,f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:c@61,f','A4s':'c','A3s':'mix:f@48,c','A2s':'mix:f@46,c',
    'AKo':'r','KQs':'mix:r@62,c','KJs':'mix:c@64,r','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'mix:c@67,r',
    'QJo':'c','JTs':'c','J9s':'mix:c@62,r','J8s':'f','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'mix:r@50,c','TT':'c','T9s':'mix:r@64,c','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'mix:c@67,r','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'c','87s':'f','86s':'f','77':'c','76s':'f',
    '75s':'f','66':'c','65s':'f','55':'mix:c@65,f','54s':'mix:c@62,r','44':'r',
    '43s':'mix:c@57,r','33':'f','22':'mix:f@63,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KsQd4h_bb_facing_cbet_mid: {
    'AKs':'mix:c@51,r','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:c@52,r','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'c','JTs':'c','J9s':'mix:c@66,r','J8s':'f','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'mix:c@69,r','TT':'c','T9s':'mix:c@57,r','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'mix:c@55,f','99':'mix:c@67,f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'mix:c@63,f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'mix:f@60,c','65s':'f','55':'f','54s':'c','44':'r',
    '43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KsQd4h_bb_facing_cbet_large: {
    'AKs':'mix:c@53,r','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'mix:r@61,c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'c','AJo':'c','KJo':'c',
    'QJo':'mix:c@67,f','JTs':'c','J9s':'f','J8s':'f','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'f','T9s':'mix:c@52,f','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'f','99':'f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'c','44':'c',
    '43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KsQd4h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'mix:c@67,f','AJs':'f','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:c@57,f','KQo':'c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'c',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'c',
    'QTo':'f','JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'f','99':'f','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'f','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'c',
    '43s':'f','33':'f','22':'f',
  },

}
