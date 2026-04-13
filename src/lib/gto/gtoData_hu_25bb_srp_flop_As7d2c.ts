// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_As7d2c
// Generated: 2026-04-12T04:53:58.752Z
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

export const HU_25BB_SRP_FLOP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_As7d2c_btn_cbet: {
    'AA':'mix:x@51,b33','AKs':'b33','AQs':'b33','AJs':'b33','ATs':'mix:b33@56,x','A9s':'mix:b33@52,x',
    'A8s':'mix:b33@48,x','A7s':'b33','A6s':'x','A5s':'mix:x@61,b33','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'b33','K7s':'b33','K6s':'b33','K5s':'mix:b33@53,x','AQo':'b33',
    'KQo':'x','QQ':'x','QJs':'mix:x@64,b33','QTs':'x','Q9s':'mix:x@60,b33','Q8s':'b33',
    'Q7s':'b33','AJo':'mix:b33@49,x','KJo':'x','QJo':'b33','JJ':'mix:x@68,b33','JTs':'mix:x@63,b33',
    'J9s':'mix:x@47,b33','J8s':'b33','ATo':'mix:x@59,b33','KTo':'x','QTo':'b33','JTo':'b33',
    'TT':'mix:x@66,b33','T9s':'x','T8s':'mix:x@50,b33','T7s':'x','A9o':'mix:x@66,b33','K9o':'b33',
    'T9o':'b33','99':'mix:b33@62,x','98s':'x','97s':'x','A8o':'x','98o':'b33',
    '88':'b33','87s':'mix:x@54,b33','86s':'x','77':'b33','76s':'mix:x@53,b33','66':'mix:x@66,b33',
    '65s':'mix:b33@48,x','55':'mix:x@57,b33','54s':'mix:b33@65,x','44':'x','43s':'mix:b33@56,x','33':'mix:x@63,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'mix:c@51,r','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@68,f',
    'K7s':'mix:c@53,r','K6s':'mix:r@64,f','K5s':'r','AQo':'r','KQo':'mix:c@54,f','QJs':'mix:c@48,r',
    'QTs':'c','Q9s':'f','Q8s':'f','AJo':'c','KJo':'mix:f@61,c','QJo':'f',
    'JTs':'mix:c@47,r','J9s':'c','J8s':'mix:c@38,r','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'mix:c@44,r','97s':'c','88':'c','87s':'c',
    '86s':'r','77':'mix:c@65,r','76s':'c','66':'c','65s':'r','55':'c',
    '54s':'r','44':'r','43s':'r','33':'mix:c@56,r','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_As7d2c_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:f@55,c','K8s':'f',
    'K7s':'c','K6s':'mix:f@60,r','K5s':'mix:r@69,f','AQo':'r','KQo':'mix:f@66,c','QJs':'mix:c@59,f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:f@61,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'mix:f@57,c','97s':'c','88':'c','87s':'c',
    '86s':'mix:f@51,c','77':'c','76s':'c','66':'c','65s':'r','55':'c',
    '54s':'c','44':'mix:r@68,c','43s':'c','33':'mix:r@59,c','22':'mix:r@69,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_As7d2c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:c@57,r','KQs':'mix:c@70,f','KJs':'mix:c@54,f','KTs':'mix:f@61,c','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:c@57,r','KQo':'f','QJs':'mix:f@69,c',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'mix:c@54,f','65s':'f','55':'mix:c@51,f',
    '54s':'r','44':'mix:f@53,c','43s':'r','33':'mix:f@56,c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_As7d2c_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'mix:f@53,c','98s':'f','97s':'f','88':'mix:f@66,c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

}
