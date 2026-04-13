// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_Kc8h3s
// Generated: 2026-04-12T05:15:49.138Z
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

export const HU_25BB_SRP_FLOP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_Kc8h3s_btn_cbet: {
    'AA':'b33','AKs':'b33','AQs':'x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'b33','A7s':'b33','A6s':'b33','A5s':'b33','A4s':'mix:b33@53,x','A3s':'mix:x@53,b33',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'b33','K7s':'x','K6s':'x','K5s':'x','AQo':'x',
    'KQo':'b33','QQ':'x','QJs':'x','QTs':'x','Q9s':'b33','Q8s':'b33',
    'Q7s':'b33','AJo':'mix:x@66,b33','KJo':'b33','QJo':'b33','JJ':'x','JTs':'x',
    'J9s':'mix:b33@61,x','J8s':'b33','ATo':'mix:x@61,b33','KTo':'mix:b33@54,x','QTo':'mix:b33@69,x','JTo':'b33',
    'TT':'mix:x@54,b33','T9s':'x','T8s':'x','T7s':'mix:b33@62,x','A9o':'b33','K9o':'mix:x@59,b33',
    'T9o':'b33','99':'b33','98s':'mix:b33@68,x','97s':'mix:x@60,b33','A8o':'b33','98o':'x',
    '88':'b33','87s':'mix:b33@56,x','86s':'mix:b33@60,x','77':'mix:x@65,b33','76s':'mix:x@51,b33','66':'mix:x@67,b33',
    '65s':'mix:b33@54,x','55':'mix:x@67,b33','54s':'mix:b33@53,x','44':'x','43s':'mix:x@67,b33','33':'b33',
    '22':'x',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Kc8h3s_bb_facing_cbet_small: {
    'AKs':'mix:c@52,r','AQs':'c','AJs':'mix:r@60,c','ATs':'c','A9s':'c','A8s':'r',
    'A7s':'mix:r@61,f','A6s':'r','A5s':'r','A4s':'r','A3s':'c','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'mix:r@68,c','K9s':'mix:r@59,c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'mix:c@45,r',
    'QTs':'c','Q9s':'f','Q8s':'mix:c@63,r','AJo':'mix:c@41,f','KJo':'r','QJo':'f',
    'JTs':'r','J9s':'mix:r@47,c','J8s':'c','ATo':'f','KTo':'c','QTo':'f',
    'JTo':'f','TT':'c','T9s':'mix:c@51,f','T8s':'c','A9o':'f','K9o':'c',
    'T9o':'f','99':'mix:c@54,r','98s':'c','97s':'mix:f@48,r','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'f','66':'c','65s':'mix:r@56,f','55':'c',
    '54s':'mix:r@61,f','44':'c','43s':'c','33':'r','22':'mix:f@65,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Kc8h3s_bb_facing_cbet_mid: {
    'AKs':'mix:c@55,r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'mix:f@45,r','A5s':'mix:r@40,c','A4s':'mix:r@45,f','A3s':'c','A2s':'mix:r@61,f',
    'AKo':'mix:r@65,c','KQs':'r','KJs':'r','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'mix:f@45,c',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'mix:f@47,c','KJo':'r','QJo':'f',
    'JTs':'mix:f@68,c','J9s':'f','J8s':'c','ATo':'f','KTo':'c','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'c','A9o':'f','K9o':'c',
    'T9o':'f','99':'c','98s':'c','97s':'f','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'f','66':'c','65s':'mix:f@69,r','55':'c',
    '54s':'f','44':'mix:f@52,c','43s':'c','33':'c','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Kc8h3s_bb_facing_cbet_large: {
    'AKs':'c','AQs':'mix:c@52,r','AJs':'mix:c@39,f','ATs':'mix:f@54,c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'mix:f@57,r','A4s':'mix:f@58,r','A3s':'mix:r@64,c','A2s':'mix:f@57,r',
    'AKo':'c','KQs':'r','KJs':'mix:r@67,c','KTs':'mix:c@53,r','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:f@69,c','KQo':'r','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'f','KJo':'mix:r@69,c','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'c','ATo':'f','KTo':'mix:c@52,r','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'c','A9o':'f','K9o':'c',
    'T9o':'f','99':'mix:c@69,f','98s':'c','97s':'f','88':'c','87s':'mix:c@61,r',
    '86s':'mix:c@60,r','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'mix:r@59,c','33':'c','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Kc8h3s_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'f','AJs':'f','ATs':'f','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:f@66,c','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'f','KQo':'c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'f','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'mix:c@65,f','ATo':'f','KTo':'c','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'mix:c@59,f','A9o':'f','K9o':'c',
    'T9o':'f','99':'c','98s':'mix:f@58,c','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'c','22':'f',
  },

}
