// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_KcKd5h
// Generated: 2026-04-11T06:22:08.815Z
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

export const HU_40BB_SRP_KCKD5H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_KcKd5h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'mix:b33@61,x','AJs':'mix:b33@52,x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'b33','A5s':'b33','A4s':'mix:x@57,b33','A3s':'mix:x@67,b33',
    'A2s':'mix:x@40,b33','AKo':'b33','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'b33','K7s':'mix:x@49,b33','K6s':'x','K5s':'mix:x@61,b33','K4s':'mix:x@53,b33',
    'K3s':'mix:x@53,b33','K2s':'mix:x@64,b33','AQo':'mix:x@55,b33','KQo':'b33','QQ':'mix:x@68,b33','QJs':'mix:x@54,b33',
    'QTs':'mix:b33@56,x','Q9s':'x','Q8s':'x','Q7s':'mix:b33@48,x','Q6s':'mix:b33@66,b50','Q5s':'mix:b33@57,x',
    'AJo':'mix:x@67,b33','KJo':'b33','QJo':'mix:x@58,b33','JJ':'mix:x@48,b33','JTs':'b33','J9s':'mix:b33@43,x',
    'J8s':'mix:b33@43,x','J7s':'b33','ATo':'x','KTo':'b33','QTo':'mix:b33@51,x','JTo':'mix:b33@60,x',
    'TT':'mix:b33@50,x','T9s':'mix:b33@52,x','T8s':'mix:b33@45,x','T7s':'b33','A9o':'x','K9o':'mix:b33@56,x',
    'Q9o':'mix:b33@48,x','J9o':'mix:b33@49,x','T9o':'b33','99':'mix:b33@46,x','98s':'mix:b33@50,x','97s':'mix:b33@48,x',
    'A8o':'x','98o':'mix:b33@62,x','88':'mix:b33@47,x','87s':'mix:x@48,b33','86s':'mix:b33@50,x','A7o':'b33',
    '77':'mix:b33@56,x','76s':'mix:x@57,b33','75s':'mix:b33@60,x','66':'mix:x@52,b33','65s':'b33','64s':'mix:x@59,b33',
    '55':'b33','54s':'mix:x@60,b33','53s':'mix:x@50,b33','44':'mix:x@64,b33','43s':'b33','33':'mix:x@62,b33',
    '22':'mix:x@58,b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KcKd5h_bb_facing_cbet_small: {
    'AKs':'mix:c@67,r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:r@58,f','A5s':'mix:r@54,c','A4s':'mix:r@49,c','A3s':'mix:r@54,f','A2s':'r',
    'AKo':'mix:c@58,r','KQs':'r','KJs':'mix:r@67,c','KTs':'mix:r@62,c','K9s':'mix:c@50,r','K8s':'mix:r@53,c',
    'K7s':'mix:c@66,r','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'mix:c@51,r',
    'QTs':'mix:r@48,c','Q9s':'c','Q8s':'mix:f@51,c','Q7s':'f','AJo':'c','KJo':'mix:r@69,c',
    'QJo':'mix:f@46,c','JTs':'r','J9s':'mix:f@35,r','J8s':'f','ATo':'c','KTo':'mix:r@59,c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'mix:f@40,r','T8s':'f','A9o':'mix:f@54,c',
    'K9o':'mix:c@58,r','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'c','87s':'mix:f@42,r','86s':'mix:r@47,c','77':'c','76s':'mix:r@53,c',
    '75s':'mix:c@65,r','66':'mix:c@64,r','65s':'mix:c@53,r','55':'c','54s':'mix:c@57,r','44':'c',
    '43s':'mix:r@58,f','33':'mix:c@68,r','22':'mix:c@60,r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KcKd5h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'mix:c@51,r','AJs':'c','ATs':'c','A9s':'c','A8s':'mix:c@58,f',
    'A7s':'mix:f@58,c','A6s':'mix:f@45,r','A5s':'r','A4s':'mix:r@67,f','A3s':'mix:r@68,f','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'mix:r@60,c','K9s':'mix:r@53,c','K8s':'mix:r@56,c',
    'K7s':'mix:r@53,c','K6s':'mix:r@53,c','K5s':'c','AQo':'mix:c@60,r','KQo':'r','QJs':'mix:r@46,c',
    'QTs':'mix:r@54,c','Q9s':'mix:f@50,c','Q8s':'f','Q7s':'f','AJo':'mix:c@52,r','KJo':'r',
    'QJo':'f','JTs':'mix:r@57,c','J9s':'f','J8s':'f','ATo':'mix:f@52,c','KTo':'mix:r@54,c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'mix:c@61,r','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'mix:r@65,c','87s':'f','86s':'f','77':'mix:c@55,r','76s':'mix:f@68,r',
    '75s':'mix:c@59,f','66':'r','65s':'mix:r@37,c','55':'mix:r@56,c','54s':'mix:r@40,f','44':'mix:r@53,c',
    '43s':'f','33':'mix:r@36,c','22':'mix:r@51,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KcKd5h_bb_facing_cbet_large: {
    'AKs':'r','AQs':'mix:r@52,c','AJs':'mix:f@36,c','ATs':'mix:f@55,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'mix:f@65,r','A5s':'r','A4s':'mix:f@60,r','A3s':'mix:f@60,r','A2s':'mix:f@59,r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r',
    'K7s':'r','K6s':'r','K5s':'mix:c@58,r','AQo':'mix:f@51,r','KQo':'r','QJs':'mix:f@53,r',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'r',
    'QJo':'mix:f@67,r','JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'r',
    'QTo':'f','JTo':'f','TT':'mix:c@60,r','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'r','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'mix:c@43,r','87s':'f','86s':'f','77':'mix:c@35,r','76s':'f',
    '75s':'f','66':'mix:r@43,f','65s':'mix:f@54,r','55':'mix:r@59,c','54s':'mix:f@59,r','44':'mix:f@59,r',
    '43s':'mix:f@68,r','33':'mix:f@59,r','22':'mix:f@59,r',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_KcKd5h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'mix:f@66,c','AJs':'f','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'f','KQo':'c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'c',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'f','99':'c','98s':'f','97s':'f','A8o':'f',
    '98o':'f','88':'mix:f@54,c','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'c','54s':'f','44':'f',
    '43s':'f','33':'f','22':'f',
  },

}
