// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_8s5h2c
// Generated: 2026-04-16T13:04:01.986Z
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

export const HU_25BB_SRP_8S5H2C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_8s5h2c_btn_cbet: {
    'AA':'mix:b33@49,b50','AKs':'b50','AQs':'mix:b33@43,x','AJs':'mix:x@53,b33','ATs':'x','A9s':'x',
    'A8s':'b50','A7s':'b50','A6s':'mix:b50@70,b33','A5s':'b50','A4s':'x','A3s':'mix:b50@45,x',
    'A2s':'mix:x@58,b50','AKo':'mix:b50@43,x','KK':'b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:x@44,b50','K8s':'b50','K7s':'mix:b50@53,b33','K6s':'b50','K5s':'x','AQo':'mix:x@50,b50',
    'KQo':'x','QQ':'mix:b50@67,b33','QJs':'x','QTs':'mix:x@66,b33','Q9s':'b50','Q8s':'b50',
    'Q7s':'mix:b50@60,b33','AJo':'x','KJo':'mix:b50@48,x','QJo':'b50','JJ':'mix:b50@68,b33','JTs':'mix:x@49,b33',
    'J9s':'mix:b50@48,x','J8s':'b50','ATo':'x','KTo':'b50','QTo':'mix:b50@60,b33','JTo':'b50',
    'TT':'b50','T9s':'mix:x@52,b33','T8s':'mix:b50@61,b33','T7s':'mix:b50@58,x','A9o':'mix:b50@56,x','K9o':'mix:b50@64,b33',
    'T9o':'b50','99':'b50','98s':'b50','97s':'x','A8o':'b50','98o':'b50',
    '88':'mix:b33@53,x','87s':'mix:b50@58,b33','86s':'b50','77':'x','76s':'x','66':'mix:b50@40,x',
    '65s':'x','55':'mix:b33@65,b50','54s':'mix:b50@47,x','44':'mix:x@43,b50','43s':'mix:b50@53,x','33':'b50',
    '22':'mix:b33@56,b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s5h2c_bb_facing_cbet_small: {
    'AKs':'mix:r@55,c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'r',
    'A7s':'mix:c@50,r','A6s':'r','A5s':'r','A4s':'mix:c@70,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'r',
    'K7s':'mix:c@45,r','K6s':'mix:r@42,c','K5s':'c','AQo':'c','KQo':'mix:f@64,c','QJs':'c',
    'QTs':'c','Q9s':'mix:r@45,f','Q8s':'r','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'mix:c@38,r','J8s':'r','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:r@46,c','T8s':'mix:c@70,r','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'mix:c@67,r','97s':'c','88':'c','87s':'r',
    '86s':'mix:r@70,c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'mix:r@59,c','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s5h2c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'r',
    'A7s':'mix:c@49,r','A6s':'r','A5s':'mix:r@58,c','A4s':'mix:c@52,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'r',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'c','Q9s':'f','Q8s':'r','AJo':'mix:c@68,f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'r','ATo':'mix:f@62,c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:c@52,f','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'c','97s':'c','88':'c','87s':'r',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'mix:rbig@56,r','33':'mix:c@69,f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s5h2c_bb_facing_cbet_large: {
    'AKs':'mix:r@55,c','AQs':'mix:c@54,r','AJs':'c','ATs':'mix:c@62,f','A9s':'mix:f@52,c','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'mix:r@61,c','A3s':'mix:r@58,c','A2s':'mix:r@62,c',
    'AKo':'mix:f@47,r','KQs':'mix:c@54,f','KJs':'mix:f@52,c','KTs':'f','K9s':'f','K8s':'r',
    'K7s':'f','K6s':'f','K5s':'mix:c@62,r','AQo':'f','KQo':'f','QJs':'mix:f@60,c',
    'QTs':'f','Q9s':'f','Q8s':'r','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'r','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'mix:r@55,c','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'r','97s':'mix:r@66,c','88':'c','87s':'r',
    '86s':'r','77':'mix:f@45,r','76s':'mix:r@52,c','66':'mix:f@57,r','65s':'mix:c@50,r','55':'c',
    '54s':'mix:r@51,c','44':'f','43s':'r','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_8s5h2c_bb_facing_cbet_allin: {
    'AKs':'mix:c@63,f','AQs':'mix:c@60,f','AJs':'f','ATs':'f','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'mix:f@61,c','A3s':'f','A2s':'mix:c@61,f',
    'AKo':'mix:c@62,f','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'mix:f@50,c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'f','99':'c','98s':'c','97s':'f','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'f','66':'mix:c@62,f','65s':'c','55':'c',
    '54s':'c','44':'mix:c@52,f','43s':'f','33':'mix:c@54,f','22':'c',
  },

}
