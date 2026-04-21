// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_QsJh2h
// Generated: 2026-04-12T05:29:49.446Z
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

export const HU_25BB_SRP_FLOP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_QsJh2h_btn_cbet: {
    'AA':'mix:b33@50,b50','AKs':'mix:b33@52,b50','AQs':'mix:b33@52,b50','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:x@40,b33','A4s':'mix:b33@41,b50','A3s':'mix:b50@49,b33',
    'A2s':'mix:b50@52,x','AKo':'mix:x@51,b33','KK':'mix:b33@55,b50','KQs':'mix:b33@43,b50','KJs':'x','KTs':'mix:x@60,b33',
    'K9s':'x','K8s':'mix:x@49,b33','K7s':'mix:x@37,b33','K6s':'mix:x@37,b33','K5s':'mix:x@37,b33','AQo':'mix:b50@47,b33',
    'KQo':'mix:b50@48,b33','QQ':'b33','QJs':'mix:b50@59,b33','QTs':'mix:b33@49,b50','Q9s':'x','Q8s':'x',
    'Q7s':'mix:x@70,b33','AJo':'x','KJo':'x','QJo':'mix:b50@64,b33','JJ':'b33','JTs':'x',
    'J9s':'x','J8s':'x','ATo':'mix:b50@36,x','KTo':'mix:x@55,b33','QTo':'mix:b33@40,x','JTo':'mix:x@59,b33',
    'TT':'x','T9s':'x','T8s':'mix:b50@49,x','T7s':'mix:x@60,b33','A9o':'x','K9o':'mix:b50@40,b33',
    'T9o':'mix:x@46,b33','99':'x','98s':'x','97s':'x','A8o':'mix:x@49,b33','98o':'mix:x@54,b50',
    '88':'x','87s':'x','86s':'x','77':'x','76s':'mix:x@54,b33','66':'x',
    '65s':'mix:x@49,b33','55':'x','54s':'mix:x@46,b33','44':'x','43s':'mix:b50@37,b33','33':'mix:x@40,b50',
    '22':'b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_QsJh2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:c@45,r','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:rbig@42,r','KQo':'c','QJs':'r',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'c','KJo':'c','QJo':'r',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'mix:c@59,r',
    'T9o':'c','99':'c','98s':'f','97s':'f','88':'mix:c@58,f','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'mix:c@57,f','65s':'f','55':'mix:f@50,c',
    '54s':'f','44':'mix:f@50,c','43s':'f','33':'mix:f@50,c','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_QsJh2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:c@56,rbig','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:f@50,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@47,rbig','KQo':'c','QJs':'mix:r@58,rbig',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'c','KJo':'c','QJo':'mix:r@53,rbig',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'mix:c@50,f','T9s':'c','T8s':'mix:c@50,f','A9o':'f','K9o':'mix:f@70,c',
    'T9o':'c','99':'mix:f@50,c','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'mix:f@50,c','76s':'f','66':'mix:f@68,c','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_QsJh2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'mix:c@58,r','AJs':'c','ATs':'mix:f@53,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:f@63,c',
    'AKo':'c','KQs':'mix:c@57,r','KJs':'c','KTs':'c','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:r@53,c','KQo':'mix:c@60,r','QJs':'r',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'c','KJo':'c','QJo':'r',
    'JTs':'c','J9s':'mix:c@55,f','J8s':'mix:c@53,f','ATo':'f','KTo':'c','QTo':'c',
    'JTo':'mix:c@68,f','TT':'f','T9s':'c','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'c','99':'f','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_QsJh2h_bb_facing_cbet_allin: {
    'AKs':'mix:f@65,c','AQs':'c','AJs':'mix:c@55,f','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'c','KJs':'mix:c@54,f','KTs':'mix:f@66,c','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'mix:c@55,f','KJo':'mix:c@55,f','QJo':'c',
    'JTs':'mix:f@54,c','J9s':'f','J8s':'f','ATo':'f','KTo':'f','QTo':'c',
    'JTo':'mix:f@55,c','TT':'f','T9s':'f','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'f','99':'f','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'c',
  },

}
