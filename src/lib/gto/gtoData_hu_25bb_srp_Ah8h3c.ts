// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_Ah8h3c
// Generated: 2026-04-16T13:42:11.512Z
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

export const HU_25BB_SRP_AH8H3C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_Ah8h3c_btn_cbet: {
    'AA':'mix:x@62,b33','AKs':'b33','AQs':'b33','AJs':'mix:x@52,b33','ATs':'mix:x@64,b33','A9s':'mix:x@50,b33',
    'A8s':'b33','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'b33',
    'A2s':'x','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','K7s':'mix:b33@66,x','K6s':'mix:b33@58,x','K5s':'b33','AQo':'b33',
    'KQo':'x','QQ':'x','QJs':'mix:x@68,b33','QTs':'mix:x@61,b33','Q9s':'b33','Q8s':'b33',
    'Q7s':'mix:b33@55,x','AJo':'mix:x@49,b33','KJo':'x','QJo':'mix:b33@63,x','JJ':'x','JTs':'mix:x@49,b33',
    'J9s':'mix:b33@61,x','J8s':'mix:x@63,b33','ATo':'mix:x@60,b33','KTo':'mix:x@69,b33','QTo':'mix:b33@62,x','JTo':'mix:b33@61,x',
    'TT':'mix:x@68,b33','T9s':'mix:x@55,b33','T8s':'x','T7s':'mix:b33@57,x','A9o':'mix:x@56,b33','K9o':'mix:x@48,b33',
    'T9o':'mix:b33@57,x','99':'mix:x@60,b33','98s':'mix:x@62,b33','97s':'mix:b33@48,x','A8o':'b33','98o':'mix:x@66,b33',
    '88':'b33','87s':'mix:b33@61,x','86s':'mix:b33@69,x','77':'x','76s':'mix:x@49,b33','66':'x',
    '65s':'mix:x@48,b33','55':'x','54s':'mix:b33@48,x','44':'mix:b33@48,x','43s':'mix:b33@50,x','33':'b33',
    '22':'mix:b33@49,x',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah8h3c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'mix:c@65,r','A2s':'c',
    'AKo':'r','KQs':'mix:c@53,f','KJs':'mix:c@50,f','KTs':'mix:f@57,c','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'r','KQo':'mix:f@49,c','QJs':'mix:f@50,c',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'c','KJo':'mix:f@50,c','QJo':'mix:f@50,r',
    'JTs':'mix:f@50,c','J9s':'mix:f@64,c','J8s':'c','ATo':'c','KTo':'mix:f@67,c','QTo':'mix:f@67,c',
    'JTo':'mix:f@50,c','TT':'c','T9s':'f','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'c','97s':'f','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'mix:f@60,r','66':'c','65s':'mix:f@50,r','55':'c',
    '54s':'mix:r@61,c','44':'mix:r@51,c','43s':'mix:c@50,r','33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah8h3c_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:r@66,c','KQs':'mix:f@45,c','KJs':'mix:f@58,c','KTs':'f','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:r@66,c','KQo':'mix:f@48,c','QJs':'mix:f@65,c',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'c','KJo':'mix:f@62,c','QJo':'mix:f@62,c',
    'JTs':'mix:f@70,c','J9s':'f','J8s':'c','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'c','97s':'f','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'f','66':'mix:c@69,f','65s':'f','55':'c',
    '54s':'c','44':'mix:c@48,r','43s':'c','33':'mix:r@66,c','22':'mix:c@50,f',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah8h3c_bb_facing_cbet_large: {
    'AKs':'r','AQs':'mix:r@66,c','AJs':'mix:r@59,c','ATs':'mix:r@50,c','A9s':'mix:c@64,r','A8s':'mix:c@58,r',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'mix:c@58,r','A2s':'c',
    'AKo':'mix:r@63,c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:r@60,c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'mix:r@54,c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'c','ATo':'mix:c@50,r','KTo':'f','QTo':'f',
    'JTo':'f','TT':'mix:c@67,f','T9s':'f','T8s':'c','A9o':'mix:c@64,r','K9o':'f',
    'T9o':'f','99':'mix:f@53,c','98s':'c','97s':'f','88':'c','87s':'c',
    '86s':'c','77':'mix:f@66,c','76s':'f','66':'mix:f@68,c','65s':'f','55':'mix:f@63,c',
    '54s':'r','44':'mix:f@66,c','43s':'mix:r@51,c','33':'mix:c@56,r','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah8h3c_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'f','98s':'mix:f@65,c','97s':'f','88':'c','87s':'mix:f@70,c',
    '86s':'mix:f@70,c','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'mix:f@67,c','33':'c','22':'f',
  },

}
