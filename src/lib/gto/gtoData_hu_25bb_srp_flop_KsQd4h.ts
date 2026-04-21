// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_KsQd4h
// Generated: 2026-04-12T05:25:40.497Z
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

export const HU_25BB_SRP_FLOP_KSQD4H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_KsQd4h_btn_cbet: {
    'AA':'b50','AKs':'mix:b50@63,b33','AQs':'mix:x@56,b33','AJs':'mix:x@47,b50','ATs':'x','A9s':'x',
    'A8s':'mix:b50@48,x','A7s':'mix:x@51,b50','A6s':'mix:x@42,b50','A5s':'mix:b50@64,b33','A4s':'x','A3s':'b50',
    'A2s':'b50','AKo':'b50','KK':'mix:x@53,b33','KQs':'mix:b50@67,b33','KJs':'mix:b50@55,b33','KTs':'mix:b50@50,b33',
    'K9s':'mix:x@42,b50','K8s':'x','K7s':'x','K6s':'mix:x@59,b50','K5s':'x','AQo':'x',
    'KQo':'b50','QQ':'mix:x@57,b33','QJs':'mix:x@62,b33','QTs':'x','Q9s':'x','Q8s':'x',
    'Q7s':'x','AJo':'mix:b50@43,x','KJo':'mix:b50@64,b33','QJo':'mix:x@53,b50','JJ':'x','JTs':'mix:x@57,b50',
    'J9s':'mix:b50@47,x','J8s':'mix:b33@40,x','ATo':'mix:b50@43,x','KTo':'b50','QTo':'x','JTo':'mix:x@41,b33',
    'TT':'mix:x@68,b33','T9s':'x','T8s':'mix:b33@38,b50','T7s':'x','A9o':'x','K9o':'mix:x@50,b50',
    'T9o':'b50','99':'x','98s':'mix:x@46,b33','97s':'mix:x@50,b33','A8o':'x','98o':'x',
    '88':'x','87s':'mix:x@47,b50','86s':'mix:b50@37,x','77':'x','76s':'mix:x@40,b50','66':'x',
    '65s':'mix:b50@50,x','55':'x','54s':'x','44':'mix:b50@64,b33','43s':'x','33':'x',
    '22':'mix:x@47,b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KsQd4h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:r@39,f','A4s':'mix:c@60,r','A3s':'mix:f@42,r','A2s':'mix:f@54,r',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'mix:r@61,c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'mix:c@61,r','KJo':'mix:r@66,c','QJo':'c',
    'JTs':'c','J9s':'mix:c@69,r','J8s':'f','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'mix:r@63,c','T8s':'f','A9o':'f','K9o':'c',
    'T9o':'c','99':'c','98s':'f','97s':'f','88':'c','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'c','65s':'f','55':'c',
    '54s':'c','44':'r','43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KsQd4h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'mix:r@51,c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'c','KJo':'mix:c@66,r','QJo':'c',
    'JTs':'c','J9s':'mix:c@68,r','J8s':'f','ATo':'c','KTo':'c','QTo':'c',
    'JTo':'c','TT':'c','T9s':'c','T8s':'f','A9o':'f','K9o':'c',
    'T9o':'mix:f@68,r','99':'mix:c@52,f','98s':'f','97s':'f','88':'mix:c@56,f','87s':'f',
    '86s':'f','77':'mix:c@50,f','76s':'f','66':'mix:f@64,c','65s':'f','55':'f',
    '54s':'c','44':'c','43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KsQd4h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'mix:c@67,f','A3s':'f','A2s':'f',
    'AKo':'mix:c@53,r','KQs':'c','KJs':'mix:c@55,r','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'c','QJs':'c',
    'QTs':'c','Q9s':'c','Q8s':'c','AJo':'c','KJo':'r','QJo':'c',
    'JTs':'c','J9s':'f','J8s':'f','ATo':'mix:c@69,f','KTo':'c','QTo':'c',
    'JTo':'c','TT':'f','T9s':'f','T8s':'f','A9o':'f','K9o':'c',
    'T9o':'f','99':'f','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'c','44':'c','43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_KsQd4h_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'c','AJs':'mix:f@65,c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'c','QJs':'mix:c@58,f',
    'QTs':'mix:f@60,c','Q9s':'f','Q8s':'f','AJo':'f','KJo':'c','QJo':'mix:f@52,c',
    'JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'c','QTo':'f',
    'JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'f','K9o':'c',
    'T9o':'f','99':'f','98s':'f','97s':'f','88':'f','87s':'f',
    '86s':'f','77':'f','76s':'f','66':'f','65s':'f','55':'f',
    '54s':'f','44':'c','43s':'f','33':'f','22':'f',
  },

}
