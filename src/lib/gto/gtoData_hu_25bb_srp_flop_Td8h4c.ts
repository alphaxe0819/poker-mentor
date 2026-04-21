// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_Td8h4c
// Generated: 2026-04-12T05:38:45.182Z
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

export const HU_25BB_SRP_FLOP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_Td8h4c_btn_cbet: {
    'AA':'mix:b33@65,b50','AKs':'mix:b33@63,x','AQs':'mix:x@65,b33','AJs':'x','ATs':'b33','A9s':'x',
    'A8s':'mix:b33@60,x','A7s':'b33','A6s':'mix:b33@59,x','A5s':'mix:b33@48,b50','A4s':'mix:x@55,b33','A3s':'mix:b33@42,x',
    'A2s':'mix:b33@51,b50','AKo':'x','KK':'mix:b33@57,b50','KQs':'x','KJs':'b33','KTs':'b33',
    'K9s':'x','K8s':'x','K7s':'mix:b33@54,x','K6s':'mix:b33@50,x','K5s':'mix:b33@52,x','AQo':'x',
    'KQo':'mix:b33@48,x','QQ':'mix:b33@64,b50','QJs':'mix:b33@56,b50','QTs':'mix:b33@66,b50','Q9s':'mix:x@47,b33','Q8s':'mix:x@59,b33',
    'Q7s':'mix:b33@62,b50','AJo':'mix:x@49,b33','KJo':'mix:b33@43,x','QJo':'mix:b33@56,x','JJ':'mix:b33@61,b50','JTs':'mix:b33@52,x',
    'J9s':'x','J8s':'mix:x@57,b33','ATo':'b33','KTo':'b33','QTo':'b33','JTo':'mix:x@64,b33',
    'TT':'x','T9s':'mix:b33@67,b50','T8s':'b33','T7s':'x','A9o':'b33','K9o':'b33',
    'T9o':'mix:b33@53,x','99':'mix:x@49,b33','98s':'b33','97s':'x','A8o':'b33','98o':'x',
    '88':'b33','87s':'mix:b33@60,x','86s':'mix:x@66,b33','77':'mix:x@68,b33','76s':'x','66':'mix:x@69,b33',
    '65s':'x','55':'x','54s':'x','44':'b33','43s':'x','33':'mix:x@52,b33',
    '22':'mix:b33@47,x',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Td8h4c_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'r','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'r',
    'QTs':'mix:r@59,c','Q9s':'c','Q8s':'c','AJo':'f','KJo':'f','QJo':'mix:r@49,c',
    'JTs':'mix:c@58,r','J9s':'c','J8s':'c','ATo':'r','KTo':'mix:r@55,c','QTo':'mix:c@64,r',
    'JTo':'c','TT':'c','T9s':'c','T8s':'r','A9o':'f','K9o':'f',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'f',
    '54s':'c','44':'r','43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Td8h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:rbig@50,r','A9s':'mix:f@58,c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:c@45,r','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@63,f','KQo':'f','QJs':'mix:rbig@57,r',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'f','KJo':'f','QJo':'mix:rbig@49,r',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'mix:r@50,rbig','KTo':'mix:r@34,c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'mix:c@68,f','76s':'c','66':'f','65s':'c','55':'f',
    '54s':'c','44':'c','43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Td8h4c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'mix:c@51,f','ATs':'r','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:c@68,f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,c','KQs':'mix:f@49,c','KJs':'f','KTs':'mix:r@63,c','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'r',
    'QTs':'mix:r@65,c','Q9s':'mix:c@61,f','Q8s':'c','AJo':'f','KJo':'f','QJo':'r',
    'JTs':'mix:c@56,r','J9s':'c','J8s':'c','ATo':'r','KTo':'mix:r@61,c','QTo':'mix:r@62,c',
    'JTo':'mix:c@56,r','TT':'c','T9s':'mix:c@60,r','T8s':'mix:c@60,r','A9o':'f','K9o':'f',
    'T9o':'mix:c@44,r','99':'f','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'f','76s':'c','66':'f','65s':'f','55':'f',
    '54s':'c','44':'c','43s':'mix:c@69,f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_Td8h4c_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'f','A8s':'mix:c@58,f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'c','K9s':'f','K8s':'mix:c@53,f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'c','Q9s':'f','Q8s':'mix:c@58,f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'mix:c@58,f','J8s':'mix:c@61,f','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f','K9o':'f',
    'T9o':'c','99':'mix:f@56,c','98s':'mix:c@61,f','97s':'f','88':'c','87s':'mix:c@60,f',
    '86s':'mix:c@61,f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'c','43s':'f','33':'f','22':'f',
  },

}
