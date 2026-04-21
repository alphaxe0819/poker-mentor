// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_7s7d2h
// Generated: 2026-04-12T04:37:51.434Z
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

export const HU_25BB_SRP_FLOP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_7s7d2h_btn_cbet: {
    'AA':'x','AKs':'mix:b50@54,b33','AQs':'b33','AJs':'b33','ATs':'mix:b33@67,x','A9s':'mix:x@68,b33',
    'A8s':'x','A7s':'mix:b33@67,b50','A6s':'mix:b33@48,x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'mix:b33@53,b50','AKo':'mix:b33@50,b50','KK':'mix:b33@60,b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:b33@51,x','K7s':'b33','K6s':'mix:b33@54,b50','K5s':'mix:b33@57,b50','AQo':'mix:b33@44,x',
    'KQo':'x','QQ':'mix:b33@62,b50','QJs':'x','QTs':'x','Q9s':'mix:x@49,b33','Q8s':'mix:b33@48,b50',
    'Q7s':'b33','AJo':'x','KJo':'x','QJo':'b33','JJ':'mix:b33@65,b50','JTs':'b33',
    'J9s':'mix:x@45,b33','J8s':'mix:b33@51,x','ATo':'x','KTo':'x','QTo':'b33','JTo':'mix:b33@48,x',
    'TT':'mix:b33@53,b50','T9s':'mix:b33@59,b50','T8s':'mix:b33@48,x','T7s':'b33','A9o':'x','K9o':'mix:b33@61,b50',
    'T9o':'mix:b33@43,x','99':'mix:b50@59,b33','98s':'mix:x@48,b33','97s':'mix:b33@66,b50','A8o':'mix:b33@65,b50','98o':'mix:b50@41,b33',
    '88':'mix:b50@60,b33','87s':'mix:b33@64,b50','86s':'mix:x@62,b50','77':'mix:x@63,b33','76s':'mix:b50@51,b33','66':'mix:b33@63,b50',
    '65s':'mix:x@42,b50','55':'mix:b33@68,b50','54s':'mix:b33@44,x','44':'mix:b33@47,x','43s':'mix:b33@61,b50','33':'mix:x@59,b33',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_7s7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'mix:r@67,c','A5s':'mix:c@64,r','A4s':'mix:c@53,r','A3s':'mix:r@39,c','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'mix:r@57,c','K6s':'r','K5s':'r','AQo':'c','KQo':'c','QJs':'mix:c@70,f',
    'QTs':'mix:f@50,c','Q9s':'f','Q8s':'mix:f@59,c','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:f@59,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:f@52,c','T8s':'mix:f@47,r','A9o':'c','K9o':'f',
    'T9o':'f','99':'r','98s':'mix:c@41,r','97s':'r','88':'r','87s':'r',
    '86s':'mix:r@59,c','77':'c','76s':'mix:r@66,c','66':'r','65s':'mix:r@47,c','55':'mix:r@59,c',
    '54s':'r','44':'c','43s':'f','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_7s7d2h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'mix:c@52,r','A2s':'r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'r','K5s':'mix:r@61,f','AQo':'c','KQo':'mix:c@51,f','QJs':'mix:r@43,c',
    'QTs':'mix:f@59,c','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'mix:f@66,c','J9s':'f','J8s':'f','ATo':'c','KTo':'f','QTo':'f',
    'JTo':'f','TT':'mix:r@54,c','T9s':'mix:f@67,c','T8s':'f','A9o':'mix:c@53,f','K9o':'f',
    'T9o':'f','99':'r','98s':'mix:c@57,f','97s':'c','88':'r','87s':'c',
    '86s':'mix:c@46,r','77':'c','76s':'c','66':'r','65s':'mix:r@42,f','55':'r',
    '54s':'f','44':'c','43s':'f','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_7s7d2h_bb_facing_cbet_large: {
    'AKs':'r','AQs':'r','AJs':'mix:r@53,c','ATs':'mix:f@40,c','A9s':'mix:f@44,c','A8s':'mix:f@44,c',
    'A7s':'c','A6s':'mix:f@53,r','A5s':'mix:f@53,r','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'mix:f@49,c','KJs':'mix:f@55,c','KTs':'mix:f@66,c','K9s':'f','K8s':'f',
    'K7s':'mix:r@54,c','K6s':'f','K5s':'f','AQo':'r','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'mix:f@49,r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'f','A9o':'f','K9o':'f',
    'T9o':'f','99':'r','98s':'f','97s':'r','88':'r','87s':'mix:r@61,c',
    '86s':'f','77':'mix:c@69,r','76s':'mix:r@53,c','66':'r','65s':'f','55':'r',
    '54s':'f','44':'r','43s':'f','33':'mix:r@59,f','22':'mix:c@58,r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_7s7d2h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'mix:c@67,f','AJs':'mix:c@64,f','ATs':'mix:c@65,f','A9s':'mix:f@53,c','A8s':'mix:f@66,c',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:c@66,f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'mix:c@62,f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:c@56,f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:f@65,c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'c','66':'c','65s':'f','55':'c',
    '54s':'f','44':'c','43s':'f','33':'mix:c@64,f','22':'c',
  },

}
