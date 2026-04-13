// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_Jc7d2h
// Generated: 2026-04-12T04:59:56.855Z
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

export const HU_25BB_SRP_FLOP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_Jc7d2h_btn_cbet: {
    'AA':'mix:b33@48,b50','AKs':'mix:b50@53,b33','AQs':'mix:x@48,b33','AJs':'mix:b50@69,b33','ATs':'x','A9s':'x',
    'A8s':'mix:x@67,b50','A7s':'mix:b33@56,b50','A6s':'mix:x@59,b50','A5s':'mix:x@69,b50','A4s':'mix:x@53,b50','A3s':'mix:b50@57,x',
    'A2s':'mix:b33@45,b50','AKo':'x','KK':'mix:b50@64,b33','KQs':'mix:b50@62,b33','KJs':'mix:b50@56,b33','KTs':'x',
    'K9s':'x','K8s':'b50','K7s':'x','K6s':'mix:x@58,b50','K5s':'mix:x@43,b50','AQo':'x',
    'KQo':'mix:x@57,b33','QQ':'mix:b50@51,b33','QJs':'mix:b33@43,b50','QTs':'x','Q9s':'mix:b50@56,x','Q8s':'mix:b50@55,b33',
    'Q7s':'mix:b50@43,b33','AJo':'b50','KJo':'mix:b50@61,b33','QJo':'mix:x@38,b50','JJ':'x','JTs':'mix:b50@67,b33',
    'J9s':'mix:x@50,b50','J8s':'x','ATo':'x','KTo':'b50','QTo':'mix:b50@58,b33','JTo':'mix:b50@70,b33',
    'TT':'x','T9s':'mix:b50@54,b33','T8s':'x','T7s':'mix:x@47,b33','A9o':'mix:x@43,b33','K9o':'mix:b33@58,b50',
    'T9o':'mix:x@47,b33','99':'x','98s':'mix:x@63,b50','97s':'x','A8o':'mix:b33@55,b50','98o':'mix:x@48,b33',
    '88':'mix:b50@42,x','87s':'x','86s':'mix:x@41,b33','77':'b33','76s':'mix:x@64,b33','66':'x',
    '65s':'mix:b33@47,x','55':'x','54s':'mix:x@45,b50','44':'x','43s':'mix:b33@53,b50','33':'mix:x@58,b50',
    '22':'mix:b33@55,b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Jc7d2h_bb_facing_cbet_small: {
    'AKs':'mix:c@58,r','AQs':'c','AJs':'r','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@60,r','A6s':'f','A5s':'mix:r@54,f','A4s':'mix:r@68,f','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'mix:r@67,c','KTs':'mix:c@50,r','K9s':'mix:r@55,f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:c@64,r','QJs':'mix:c@62,r',
    'QTs':'r','Q9s':'mix:r@63,f','Q8s':'f','AJo':'r','KJo':'r','QJo':'mix:c@61,r',
    'JTs':'mix:r@60,c','J9s':'c','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'mix:r@52,c','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'mix:c@59,r','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'c','65s':'f','55':'c',
    '54s':'f','44':'c','43s':'f','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Jc7d2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'r','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'mix:r@56,f','A4s':'mix:r@65,f','A3s':'mix:f@68,r','A2s':'c',
    'AKo':'c','KQs':'mix:r@54,c','KJs':'mix:c@67,r','KTs':'c','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:c@69,r','QJs':'c',
    'QTs':'mix:r@53,f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'r','QJo':'mix:c@55,r',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'c','65s':'f','55':'c',
    '54s':'f','44':'mix:c@52,f','43s':'f','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Jc7d2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'r','ATs':'mix:f@59,c','A9s':'f','A8s':'f',
    'A7s':'mix:c@50,r','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:r@55,c',
    'AKo':'mix:c@66,r','KQs':'mix:r@52,c','KJs':'mix:r@51,c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:c@47,f','KQo':'mix:f@38,c','QJs':'mix:c@54,r',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'mix:r@55,c','QJo':'mix:r@50,c',
    'JTs':'mix:r@50,c','J9s':'c','J8s':'mix:c@64,r','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'mix:r@56,c','TT':'c','T9s':'mix:r@61,c','T8s':'mix:r@43,c','A9o':'f','K9o':'f',
    'T9o':'mix:r@45,c','99':'mix:f@52,c','98s':'mix:c@47,r','97s':'c','88':'f','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Jc7d2h_bb_facing_cbet_allin: {
    'AKs':'mix:c@51,f','AQs':'mix:f@66,c','AJs':'c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:f@56,c',
    'AKo':'mix:f@67,c','KQs':'f','KJs':'c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:f@68,c','KQo':'f','QJs':'c',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'c','TT':'c','T9s':'f','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'mix:f@67,c','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

}
