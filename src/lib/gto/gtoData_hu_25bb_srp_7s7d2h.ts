// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_7s7d2h
// Generated: 2026-04-16T12:56:18.492Z
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

export const HU_25BB_SRP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_7s7d2h_btn_cbet: {
    'AA':'mix:x@69,b33','AKs':'mix:b33@51,b50','AQs':'mix:b33@61,b50','AJs':'b33','ATs':'b33','A9s':'mix:x@69,b33',
    'A8s':'x','A7s':'b33','A6s':'mix:b33@46,x','A5s':'x','A4s':'mix:x@57,b33','A3s':'x',
    'A2s':'mix:b33@68,b50','AKo':'mix:b33@64,b50','KK':'mix:b33@64,b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:b33@54,x','K7s':'b33','K6s':'b33','K5s':'mix:b33@68,b50','AQo':'mix:x@46,b33',
    'KQo':'x','QQ':'b33','QJs':'x','QTs':'x','Q9s':'mix:x@52,b33','Q8s':'mix:b33@51,x',
    'Q7s':'b33','AJo':'x','KJo':'x','QJo':'b33','JJ':'b33','JTs':'b33',
    'J9s':'mix:x@52,b33','J8s':'mix:b33@54,x','ATo':'x','KTo':'x','QTo':'b33','JTo':'mix:b33@52,x',
    'TT':'mix:b33@62,b50','T9s':'b33','T8s':'mix:b33@54,x','T7s':'b33','A9o':'x','K9o':'mix:b33@69,b50',
    'T9o':'mix:b33@46,x','99':'mix:b50@57,b33','98s':'mix:x@53,b33','97s':'b33','A8o':'b33','98o':'mix:b33@41,b50',
    '88':'mix:b50@60,b33','87s':'b33','86s':'x','77':'x','76s':'mix:b33@61,b50','66':'mix:b33@68,b50',
    '65s':'mix:x@42,b33','55':'b33','54s':'mix:b33@46,x','44':'mix:b33@52,x','43s':'b33','33':'mix:x@59,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_7s7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:r@55,c','A5s':'c','A4s':'c','A3s':'mix:c@42,r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'r','K5s':'r','AQo':'c','KQo':'c','QJs':'mix:c@55,f',
    'QTs':'mix:c@64,f','Q9s':'f','Q8s':'mix:f@59,c','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:c@53,f','J9s':'f','J8s':'mix:f@67,c','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:f@60,c','T8s':'f','A9o':'c','K9o':'f',
    'T9o':'f','99':'r','98s':'mix:c@60,f','97s':'mix:r@55,c','88':'r','87s':'mix:r@68,c',
    '86s':'mix:c@48,r','77':'c','76s':'mix:c@65,r','66':'r','65s':'mix:c@42,r','55':'r',
    '54s':'mix:r@41,c','44':'c','43s':'mix:f@60,r','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_7s7d2h_bb_facing_cbet_mid: {
    'AKs':'mix:r@64,c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'r','K5s':'r','AQo':'c','KQo':'mix:c@56,f','QJs':'mix:r@38,c',
    'QTs':'mix:c@49,f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:f@45,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'mix:r@51,c','T9s':'mix:f@66,c','T8s':'f','A9o':'mix:c@46,f','K9o':'f',
    'T9o':'f','99':'r','98s':'c','97s':'c','88':'r','87s':'c',
    '86s':'mix:c@52,f','77':'c','76s':'c','66':'r','65s':'mix:r@43,c','55':'r',
    '54s':'mix:f@63,r','44':'mix:c@54,r','43s':'f','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_7s7d2h_bb_facing_cbet_large: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:r@60,f','A9s':'mix:f@48,r','A8s':'f',
    'A7s':'mix:r@54,c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'mix:r@70,c','K6s':'f','K5s':'f','AQo':'r','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:f@45,r','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'f','97s':'r','88':'r','87s':'mix:r@68,c',
    '86s':'f','77':'mix:r@58,c','76s':'mix:r@64,c','66':'r','65s':'f','55':'r',
    '54s':'f','44':'mix:r@67,f','43s':'f','33':'mix:r@61,f','22':'mix:r@62,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_7s7d2h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'mix:c@65,f','A8s':'mix:f@57,c',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:c@51,f','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'c','65s':'f','55':'c',
    '54s':'f','44':'c','43s':'f','33':'c','22':'c',
  },

}
