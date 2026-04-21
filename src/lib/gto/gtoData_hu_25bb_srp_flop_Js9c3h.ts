// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_Js9c3h
// Generated: 2026-04-12T05:05:42.986Z
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

export const HU_25BB_SRP_FLOP_JS9C3H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_Js9c3h_btn_cbet: {
    'AA':'mix:b33@55,b50','AKs':'mix:b33@48,x','AQs':'mix:x@43,b33','AJs':'b33','ATs':'x','A9s':'mix:x@59,b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:x@38,b33','A3s':'x',
    'A2s':'b33','AKo':'x','KK':'mix:b33@48,b50','KQs':'b33','KJs':'mix:b33@61,b50','KTs':'x',
    'K9s':'mix:x@59,b33','K8s':'b33','K7s':'b33','K6s':'mix:b33@45,x','K5s':'mix:b33@47,b50','AQo':'mix:b33@48,x',
    'KQo':'mix:b33@56,x','QQ':'mix:b33@62,b50','QJs':'mix:b33@46,x','QTs':'x','Q9s':'mix:x@70,b33','Q8s':'mix:x@42,b33',
    'Q7s':'b33','AJo':'b33','KJo':'mix:b33@60,b50','QJo':'mix:x@44,b33','JJ':'b33','JTs':'b33',
    'J9s':'mix:b33@70,b50','J8s':'x','ATo':'b33','KTo':'mix:b33@52,b50','QTo':'mix:b33@55,x','JTo':'b33',
    'TT':'mix:x@65,b33','T9s':'mix:b33@55,x','T8s':'x','T7s':'mix:x@48,b50','A9o':'mix:b33@47,x','K9o':'mix:x@51,b33',
    'T9o':'x','99':'b33','98s':'mix:b33@49,x','97s':'x','A8o':'mix:b33@52,x','98o':'mix:x@57,b33',
    '88':'x','87s':'x','86s':'b33','77':'x','76s':'mix:b33@51,x','66':'x',
    '65s':'mix:b33@46,x','55':'x','54s':'mix:b33@39,x','44':'x','43s':'x','33':'mix:b33@63,b50',
    '22':'mix:x@49,b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Js9c3h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'mix:r@53,c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'r','KJs':'mix:r@61,c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:r@57,c','KQo':'mix:r@39,rbig','QJs':'mix:c@65,r',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'mix:rbig@51,r','KJo':'r','QJo':'mix:c@51,r',
    'JTs':'c','J9s':'mix:r@55,c','J8s':'c','ATo':'f','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'f','55':'c',
    '54s':'f','44':'f','43s':'c','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Js9c3h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'mix:rbig@45,c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'mix:rbig@57,r','KJs':'c','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'mix:rbig@62,r','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'mix:rbig@62,r','KJo':'mix:rbig@43,r','QJo':'mix:c@42,rbig',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'f','87s':'c',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'c','33':'mix:c@40,r','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Js9c3h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'mix:r@62,c','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'mix:f@56,c','KQs':'r','KJs':'r','KTs':'c','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'r','QJs':'mix:r@56,c',
    'QTs':'c','Q9s':'c','Q8s':'f','AJo':'r','KJo':'r','QJo':'mix:r@55,c',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f','QTo':'c',
    'JTo':'c','TT':'f','T9s':'c','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'c','33':'mix:r@60,c','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Js9c3h_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'c','ATs':'f','A9s':'mix:c@63,f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'mix:c@67,f','KJs':'c','KTs':'f','K9s':'mix:c@57,f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'mix:c@62,f','QJs':'c',
    'QTs':'f','Q9s':'mix:c@58,f','Q8s':'f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'c','TT':'mix:c@58,f','T9s':'mix:c@56,f','T8s':'f','A9o':'mix:c@53,f','K9o':'mix:f@56,c',
    'T9o':'mix:f@54,c','99':'c','98s':'mix:f@57,c','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'c','22':'f',
  },

}
