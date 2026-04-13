// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_9d5c2h
// Generated: 2026-04-12T04:43:46.851Z
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

export const HU_25BB_SRP_FLOP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_9d5c2h_btn_cbet: {
    'AA':'mix:b50@47,b33','AKs':'mix:b50@69,b33','AQs':'mix:b33@37,x','AJs':'x','ATs':'x','A9s':'b50',
    'A8s':'mix:b50@68,x','A7s':'b50','A6s':'b50','A5s':'b50','A4s':'x','A3s':'x',
    'A2s':'mix:x@65,b50','AKo':'mix:b50@48,x','KK':'b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'b50','K8s':'b50','K7s':'mix:b50@59,b33','K6s':'mix:b50@67,b33','K5s':'x','AQo':'x',
    'KQo':'x','QQ':'b50','QJs':'x','QTs':'mix:x@54,b50','Q9s':'b50','Q8s':'mix:b50@67,b33',
    'Q7s':'mix:b50@58,b33','AJo':'x','KJo':'mix:b50@55,x','QJo':'b50','JJ':'b50','JTs':'b50',
    'J9s':'mix:b50@40,b33','J8s':'mix:b50@51,x','ATo':'x','KTo':'b50','QTo':'mix:b50@57,x','JTo':'mix:b50@48,x',
    'TT':'b50','T9s':'mix:b50@49,b33','T8s':'mix:b50@53,x','T7s':'b50','A9o':'b50','K9o':'b50',
    'T9o':'mix:x@65,b50','99':'x','98s':'b50','97s':'mix:x@52,b50','A8o':'mix:b50@58,b33','98o':'mix:b50@50,x',
    '88':'x','87s':'x','86s':'x','77':'mix:x@52,b50','76s':'x','66':'b50',
    '65s':'x','55':'mix:b33@55,b50','54s':'x','44':'mix:x@52,b50','43s':'mix:x@48,b50','33':'mix:b50@46,x',
    '22':'mix:b33@60,b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9d5c2h_bb_facing_cbet_small: {
    'AKs':'mix:c@59,r','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'mix:c@52,f',
    'A7s':'r','A6s':'r','A5s':'mix:c@60,r','A4s':'mix:c@57,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'mix:r@59,f','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'mix:c@50,f','Q9s':'mix:c@54,r','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:c@40,r','J9s':'c','J8s':'mix:f@68,r','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:c@65,r','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'mix:r@52,c','33':'mix:c@70,r','22':'mix:r@65,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9d5c2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'mix:f@60,r',
    'A7s':'f','A6s':'mix:f@67,r','A5s':'c','A4s':'mix:c@58,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'f','AJo':'mix:f@45,c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'c','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'c','33':'mix:f@58,r','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9d5c2h_bb_facing_cbet_large: {
    'AKs':'mix:c@54,r','AQs':'c','AJs':'mix:c@63,f','ATs':'mix:f@54,c','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'r','A3s':'r','A2s':'mix:c@44,r',
    'AKo':'mix:f@68,c','KQs':'mix:c@46,f','KJs':'mix:f@47,c','KTs':'f','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'f','KQo':'f','QJs':'mix:r@37,f',
    'QTs':'f','Q9s':'mix:r@65,c','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:f@48,r','J9s':'r','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:c@64,r','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'mix:c@67,r','99':'c','98s':'mix:r@69,c','97s':'mix:r@64,c','88':'f','87s':'mix:c@40,r',
    '86s':'mix:c@44,r','77':'f','76s':'mix:c@39,r','66':'f','65s':'mix:c@68,r','55':'c',
    '54s':'mix:c@63,r','44':'f','43s':'r','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9d5c2h_bb_facing_cbet_allin: {
    'AKs':'mix:c@57,f','AQs':'f','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:c@56,f','A4s':'mix:f@66,c','A3s':'mix:f@70,c','A2s':'mix:c@57,f',
    'AKo':'mix:f@59,c','KQs':'f','KJs':'f','KTs':'f','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'mix:c@53,f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'c','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'c','T8s':'f','A9o':'c','K9o':'c',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'mix:f@58,c','87s':'f',
    '86s':'f','77':'mix:f@62,c','76s':'f','66':'mix:f@54,c','65s':'mix:c@57,f','55':'c',
    '54s':'mix:c@57,f','44':'mix:f@53,c','43s':'f','33':'f','22':'c',
  },

}
