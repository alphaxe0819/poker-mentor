// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_5s5c5d
// Generated: 2026-04-16T12:42:17.849Z
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

export const HU_25BB_SRP_5S5C5D: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_5s5c5d_btn_cbet: {
    'AA':'mix:x@63,b33','AKs':'b50','AQs':'b50','AJs':'b50','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'b33','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'b50','KK':'mix:b50@47,b33','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'mix:b50@35,x','K6s':'mix:b50@44,b33','K5s':'mix:b33@66,b50','AQo':'b50',
    'KQo':'x','QQ':'mix:b50@61,b33','QJs':'x','QTs':'x','Q9s':'x','Q8s':'mix:x@49,b50',
    'Q7s':'mix:x@40,b50','AJo':'b50','KJo':'x','QJo':'mix:x@50,b50','JJ':'b50','JTs':'x',
    'J9s':'x','J8s':'mix:x@52,b50','ATo':'x','KTo':'x','QTo':'mix:x@51,b50','JTo':'mix:x@42,b50',
    'TT':'b50','T9s':'mix:x@61,b440','T8s':'x','T7s':'x','A9o':'x','K9o':'mix:x@56,b50',
    'T9o':'mix:x@43,b50','99':'b50','98s':'x','97s':'x','A8o':'x','98o':'x',
    '88':'b50','87s':'x','86s':'x','77':'mix:b100@42,b50','76s':'x','66':'b100',
    '65s':'b33','54s':'b33','44':'mix:b440@44,b100','43s':'mix:x@55,b50','33':'mix:b440@50,b100','22':'mix:b440@69,b100',
  },

  // ──────────────────────────────
  hu_25bb_srp_5s5c5d_bb_facing_cbet_small: {
    'AKs':'mix:r@67,rbig','AQs':'rbig','AJs':'rbig','ATs':'mix:c@41,r','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:rbig@52,r','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'mix:c@52,rbig','KJo':'c','QJo':'c',
    'JTs':'mix:f@50,c','J9s':'mix:c@53,f','J8s':'mix:c@62,f','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'mix:f@53,c','TT':'mix:c@69,r','T9s':'f','T8s':'mix:f@70,c','A9o':'c','K9o':'c',
    'T9o':'f','99':'mix:r@55,c','98s':'mix:f@65,c','97s':'mix:f@60,c','88':'mix:rbig@60,c','87s':'mix:c@65,f',
    '86s':'mix:c@66,f','77':'rbig','76s':'c','66':'mix:rbig@54,c','65s':'c','54s':'c',
    '44':'rbig','43s':'mix:c@50,f','33':'rbig','22':'rbig',
  },

  // ──────────────────────────────
  hu_25bb_srp_5s5c5d_bb_facing_cbet_mid: {
    'AKs':'mix:r@53,rbig','AQs':'mix:rbig@55,r','AJs':'mix:rbig@37,c','ATs':'mix:c@41,rbig','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'mix:r@50,rbig','KQs':'c','KJs':'c','KTs':'c','K9s':'mix:c@57,f','K8s':'mix:c@66,f',
    'K7s':'mix:c@52,f','K6s':'mix:f@59,c','K5s':'c','AQo':'mix:rbig@59,r','KQo':'c','QJs':'c',
    'QTs':'mix:c@56,f','Q9s':'mix:f@51,c','Q8s':'mix:c@60,f','AJo':'mix:c@40,rbig','KJo':'mix:c@58,f','QJo':'mix:c@64,f',
    'JTs':'mix:f@63,c','J9s':'f','J8s':'mix:f@68,c','ATo':'c','KTo':'mix:f@59,c','QTo':'mix:f@51,c',
    'JTo':'mix:f@70,c','TT':'mix:c@51,r','T9s':'f','T8s':'f','A9o':'c','K9o':'mix:f@65,c',
    'T9o':'f','99':'mix:r@47,rbig','98s':'f','97s':'f','88':'rbig','87s':'f',
    '86s':'f','77':'rbig','76s':'mix:f@68,c','66':'mix:r@35,rbig','65s':'c','54s':'c',
    '44':'r','43s':'f','33':'r','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_5s5c5d_bb_facing_cbet_large: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:r@59,c','A9s':'mix:f@45,c','A8s':'mix:c@42,f',
    'A7s':'mix:c@46,r','A6s':'mix:c@41,r','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'r','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:r@40,f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'f','T8s':'f','A9o':'mix:f@60,c','K9o':'f',
    'T9o':'f','99':'r','98s':'f','97s':'f','88':'r','87s':'f',
    '86s':'f','77':'r','76s':'f','66':'r','65s':'c','54s':'c',
    '44':'r','43s':'f','33':'r','22':'r',
  },

  // ──────────────────────────────
  hu_25bb_srp_5s5c5d_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@52,c','A9s':'mix:f@62,c','A8s':'mix:f@67,c',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'c','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'mix:c@50,f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'f','T8s':'f','A9o':'mix:f@65,c','K9o':'f',
    'T9o':'f','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'c','54s':'c',
    '44':'c','43s':'f','33':'c','22':'f',
  },

}
