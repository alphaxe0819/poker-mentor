// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_KcKd5h
// Generated: 2026-04-12T05:19:58.186Z
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

export const HU_25BB_SRP_FLOP_KCKD5H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_KcKd5h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'mix:x@35,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'mix:b33@41,x','A6s':'mix:b33@55,x','A5s':'b33','A4s':'mix:x@61,b33','A3s':'mix:x@64,b33',
    'A2s':'mix:b33@44,x','AKo':'b33','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'b33','K7s':'mix:b33@55,x','K6s':'mix:x@66,b33','K5s':'x','AQo':'mix:x@67,b33',
    'KQo':'mix:b33@46,b50','QQ':'x','QJs':'x','QTs':'mix:x@67,b33','Q9s':'mix:x@62,b33','Q8s':'mix:x@52,b33',
    'Q7s':'b33','AJo':'x','KJo':'mix:b33@52,b50','QJo':'mix:b33@49,x','JJ':'b33','JTs':'mix:b33@41,x',
    'J9s':'mix:x@53,b33','J8s':'mix:b33@48,b50','ATo':'x','KTo':'b33','QTo':'mix:b33@37,x','JTo':'b33',
    'TT':'b33','T9s':'mix:b33@50,b50','T8s':'mix:b33@45,x','T7s':'b33','A9o':'x','K9o':'b33',
    'T9o':'b33','99':'mix:b33@51,x','98s':'mix:x@63,b33','97s':'mix:x@38,b50','A8o':'b33','98o':'b33',
    '88':'b33','87s':'x','86s':'x','77':'mix:b33@62,x','76s':'x','66':'mix:x@59,b33',
    '65s':'mix:b33@65,x','55':'mix:b33@56,x','54s':'mix:x@67,b33','44':'x','43s':'b33','33':'x',
    '22':'mix:x@58,b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KcKd5h_bb_facing_cbet_small: {
    'AKs':'mix:r@56,c','AQs':'r','AJs':'mix:c@53,r','ATs':'c','A9s':'c','A8s':'mix:c@66,f',
    'A7s':'mix:r@44,f','A6s':'mix:r@63,f','A5s':'r','A4s':'mix:r@57,f','A3s':'mix:r@51,f','A2s':'mix:r@63,f',
    'AKo':'mix:r@61,c','KQs':'r','KJs':'r','KTs':'r','K9s':'r','K8s':'r',
    'K7s':'r','K6s':'r','K5s':'c','AQo':'mix:c@50,r','KQo':'r','QJs':'mix:r@49,c',
    'QTs':'r','Q9s':'mix:r@39,c','Q8s':'f','AJo':'mix:r@46,c','KJo':'r','QJo':'mix:f@53,r',
    'JTs':'r','J9s':'mix:r@41,f','J8s':'f','ATo':'f','KTo':'r','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:f@60,r','T8s':'f','A9o':'f','K9o':'r',
    'T9o':'f','99':'mix:c@67,r','98s':'f','97s':'f','88':'mix:c@60,r','87s':'f',
    '86s':'f','77':'mix:r@66,c','76s':'mix:r@55,f','66':'r','65s':'mix:c@56,r','55':'mix:r@59,c',
    '54s':'c','44':'mix:r@66,c','43s':'f','33':'mix:r@51,c','22':'mix:r@65,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KcKd5h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:r@56,c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@50,f','A6s':'mix:f@46,r','A5s':'r','A4s':'mix:c@41,f','A3s':'mix:f@40,c','A2s':'mix:f@35,r',
    'AKo':'c','KQs':'r','KJs':'r','KTs':'mix:r@68,c','K9s':'mix:r@64,c','K8s':'r',
    'K7s':'mix:r@70,c','K6s':'mix:c@56,r','K5s':'c','AQo':'c','KQo':'r','QJs':'mix:c@58,r',
    'QTs':'c','Q9s':'mix:c@41,f','Q8s':'f','AJo':'c','KJo':'r','QJo':'mix:f@50,r',
    'JTs':'mix:c@54,f','J9s':'mix:f@52,r','J8s':'f','ATo':'f','KTo':'mix:r@70,c','QTo':'f',
    'JTo':'f','TT':'mix:r@62,c','T9s':'f','T8s':'f','A9o':'f','K9o':'mix:r@68,c',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'mix:r@51,f','66':'c','65s':'c','55':'c',
    '54s':'c','44':'mix:c@62,r','43s':'f','33':'mix:c@53,r','22':'mix:c@41,r',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KcKd5h_bb_facing_cbet_large: {
    'AKs':'mix:c@65,r','AQs':'mix:c@51,r','AJs':'mix:c@54,r','ATs':'mix:c@53,f','A9s':'mix:f@61,c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:c@50,r','A4s':'mix:f@63,r','A3s':'mix:f@63,r','A2s':'mix:f@62,r',
    'AKo':'mix:c@56,r','KQs':'mix:c@51,r','KJs':'mix:r@57,c','KTs':'mix:r@61,c','K9s':'mix:c@57,r','K8s':'mix:c@59,r',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:c@38,r','KQo':'mix:r@55,c','QJs':'mix:r@39,f',
    'QTs':'mix:f@52,r','Q9s':'f','Q8s':'f','AJo':'mix:f@60,c','KJo':'mix:r@63,c','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'mix:r@66,c','QTo':'f',
    'JTo':'f','TT':'mix:c@67,r','T9s':'f','T8s':'f','A9o':'f','K9o':'mix:c@56,r',
    'T9o':'f','99':'mix:c@59,r','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'mix:c@64,r','76s':'f','66':'mix:c@61,r','65s':'mix:c@45,f','55':'c',
    '54s':'mix:f@54,c','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KcKd5h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'mix:c@68,f','AJs':'mix:c@65,f','ATs':'mix:f@58,c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:c@70,f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:c@65,f','KQo':'c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'mix:c@53,f','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'c','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'f','K9o':'c',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'c','55':'c',
    '54s':'mix:c@70,f','44':'mix:f@61,c','43s':'f','33':'f','22':'f',
  },

}
