// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_Ah2d2c
// Generated: 2026-04-16T13:29:24.657Z
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

export const HU_25BB_SRP_AH2D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_Ah2d2c_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'b33','ATs':'b33','A9s':'b33',
    'A8s':'b33','A7s':'mix:x@63,b33','A6s':'mix:x@66,b33','A5s':'mix:x@57,b33','A4s':'x','A3s':'mix:x@65,b33',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'mix:x@64,b33','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'mix:b33@63,x','K6s':'mix:b33@62,x','K5s':'mix:b33@54,x','AQo':'b33',
    'KQo':'x','QQ':'x','QJs':'mix:b33@57,x','QTs':'mix:b33@54,x','Q9s':'x','Q8s':'mix:x@67,b33',
    'Q7s':'mix:x@54,b33','AJo':'mix:b33@69,x','KJo':'x','QJo':'b33','JJ':'mix:x@61,b33','JTs':'b33',
    'J9s':'mix:x@64,b33','J8s':'mix:x@61,b33','ATo':'mix:b33@51,x','KTo':'x','QTo':'b33','JTo':'b33',
    'TT':'mix:x@63,b33','T9s':'mix:x@64,b33','T8s':'mix:x@69,b33','T7s':'mix:x@67,b33','A9o':'mix:x@53,b33','K9o':'mix:b33@62,x',
    'T9o':'mix:b33@69,x','99':'mix:b33@55,x','98s':'mix:x@62,b33','97s':'mix:b33@54,x','A8o':'mix:x@60,b33','98o':'b33',
    '88':'mix:b33@59,x','87s':'b33','86s':'mix:b33@60,x','77':'mix:b33@62,x','76s':'b33','66':'mix:x@59,b33',
    '65s':'mix:b33@54,x','55':'mix:b33@50,x','54s':'mix:b33@66,x','44':'mix:x@69,b33','43s':'mix:b33@54,x','33':'mix:x@68,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah2d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:c@59,r','A9s':'mix:r@55,c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@60,f',
    'K7s':'mix:r@39,c','K6s':'mix:r@55,f','K5s':'r','AQo':'r','KQo':'c','QJs':'r',
    'QTs':'mix:c@57,r','Q9s':'c','Q8s':'mix:c@38,r','AJo':'mix:r@64,c','KJo':'mix:c@59,r','QJo':'f',
    'JTs':'c','J9s':'mix:c@52,f','J8s':'mix:f@49,c','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'mix:r@63,f','55':'c',
    '54s':'r','44':'mix:r@51,c','43s':'r','33':'c','22':'mix:c@65,r',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah2d2c_bb_facing_cbet_mid: {
    'AKs':'mix:r@61,c','AQs':'mix:r@66,c','AJs':'mix:r@53,c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:c@56,f','K8s':'mix:f@51,c',
    'K7s':'mix:f@55,c','K6s':'mix:f@48,c','K5s':'r','AQo':'r','KQo':'mix:c@47,f','QJs':'mix:c@64,f',
    'QTs':'mix:f@50,c','Q9s':'mix:f@65,c','Q8s':'f','AJo':'mix:r@57,c','KJo':'mix:f@52,c','QJo':'f',
    'JTs':'mix:f@57,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'r','55':'c',
    '54s':'c','44':'mix:c@54,r','43s':'c','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah2d2c_bb_facing_cbet_large: {
    'AKs':'r','AQs':'r','AJs':'mix:r@62,c','ATs':'mix:r@51,c','A9s':'mix:c@61,r','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'mix:c@62,f','KJs':'mix:f@57,c','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'r','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:r@58,c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:c@55,r','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'f','55':'mix:c@54,r',
    '54s':'r','44':'mix:r@52,c','43s':'r','33':'mix:r@52,c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_Ah2d2c_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'mix:c@55,f','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'mix:c@51,f','76s':'f','66':'mix:f@61,c','65s':'f','55':'mix:f@66,c',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

}
