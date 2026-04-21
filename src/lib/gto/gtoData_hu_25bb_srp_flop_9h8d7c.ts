// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_flop_9h8d7c
// Generated: 2026-04-12T04:48:13.241Z
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

export const HU_25BB_SRP_FLOP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_flop_9h8d7c_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'x','AJs':'mix:b33@53,x','ATs':'b33','A9s':'b33',
    'A8s':'x','A7s':'x','A6s':'mix:x@65,b33','A5s':'mix:b33@51,x','A4s':'mix:b33@51,x','A3s':'mix:b33@66,x',
    'A2s':'b33','AKo':'mix:x@59,b33','KK':'b33','KQs':'mix:b33@64,x','KJs':'x','KTs':'x',
    'K9s':'mix:b33@67,x','K8s':'x','K7s':'x','K6s':'mix:x@65,b33','K5s':'b33','AQo':'b33',
    'KQo':'b33','QQ':'b33','QJs':'x','QTs':'x','Q9s':'x','Q8s':'x',
    'Q7s':'x','AJo':'b33','KJo':'b33','QJo':'mix:b33@68,x','JJ':'b33','JTs':'b33',
    'J9s':'b33','J8s':'x','ATo':'mix:b33@51,x','KTo':'mix:b33@60,x','QTo':'mix:b33@68,x','JTo':'b33',
    'TT':'b33','T9s':'b33','T8s':'mix:x@55,b33','T7s':'x','A9o':'mix:x@53,b33','K9o':'x',
    'T9o':'b33','99':'mix:x@57,b33','98s':'b33','97s':'mix:x@52,b33','A8o':'mix:b33@66,x','98o':'b33',
    '88':'mix:b33@68,x','87s':'b33','86s':'b33','77':'b33','76s':'mix:b33@59,x','66':'x',
    '65s':'b33','55':'mix:x@64,b33','54s':'b33','44':'x','43s':'b33','33':'mix:b33@53,x',
    '22':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9h8d7c_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'c','KTs':'mix:rbig@69,c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'mix:r@54,c','Q9s':'c','Q8s':'c','AJo':'mix:c@55,r','KJo':'mix:f@54,r','QJo':'c',
    'JTs':'r','J9s':'r','J8s':'c','ATo':'c','KTo':'mix:c@66,r','QTo':'c',
    'JTo':'r','TT':'rbig','T9s':'r','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'mix:rbig@50,r','99':'c','98s':'mix:r@51,c','97s':'c','88':'mix:r@66,c','87s':'c',
    '86s':'mix:r@56,c','77':'r','76s':'c','66':'c','65s':'r','55':'mix:r@55,c',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9h8d7c_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'f','AJs':'c','ATs':'mix:c@49,rbig','A9s':'c','A8s':'c',
    'A7s':'mix:c@68,f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'c','KTs':'mix:rbig@47,c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'f','AQo':'f','KQo':'f','QJs':'c',
    'QTs':'mix:rbig@50,c','Q9s':'c','Q8s':'c','AJo':'mix:f@59,c','KJo':'f','QJo':'mix:c@57,f',
    'JTs':'c','J9s':'r','J8s':'c','ATo':'mix:c@59,rbig','KTo':'mix:c@69,rbig','QTo':'mix:c@66,rbig',
    'JTo':'c','TT':'rbig','T9s':'rbig','T8s':'c','A9o':'c','K9o':'c',
    'T9o':'rbig','99':'c','98s':'mix:r@45,rbig','97s':'c','88':'mix:rbig@37,r','87s':'c',
    '86s':'mix:c@52,r','77':'mix:r@48,rbig','76s':'c','66':'c','65s':'rbig','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9h8d7c_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'mix:f@49,c','ATs':'mix:r@51,c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'mix:c@48,r','K9s':'c','K8s':'mix:f@69,c',
    'K7s':'f','K6s':'mix:c@67,f','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:f@53,c',
    'QTs':'mix:r@55,c','Q9s':'c','Q8s':'mix:f@57,c','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'mix:c@58,r','J9s':'r','J8s':'c','ATo':'mix:r@49,c','KTo':'mix:f@51,c','QTo':'mix:c@55,r',
    'JTo':'mix:c@55,r','TT':'r','T9s':'r','T8s':'c','A9o':'mix:c@61,f','K9o':'mix:f@53,c',
    'T9o':'r','99':'mix:c@64,r','98s':'mix:c@55,r','97s':'c','88':'r','87s':'c',
    '86s':'mix:c@64,r','77':'r','76s':'c','66':'f','65s':'r','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_flop_9h8d7c_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'mix:f@68,c','ATs':'mix:f@52,c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'mix:c@66,f','K9s':'mix:f@61,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'mix:f@54,c','Q9s':'mix:f@68,c','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'mix:f@67,c','KTo':'mix:f@63,c','QTo':'f',
    'JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'c','K9o':'f',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'mix:f@64,c','65s':'c','55':'f',
    '54s':'f','44':'f','43s':'f','33':'f','22':'f',
  },

}
