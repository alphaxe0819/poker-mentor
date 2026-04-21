// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_9s7s3s
// Generated: 2026-04-16T13:23:52.779Z
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

export const HU_25BB_SRP_9S7S3S: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_9s7s3s_btn_cbet: {
    'AA':'mix:b33@49,x','AKs':'x','AQs':'x','AJs':'mix:x@55,b33','ATs':'mix:x@54,b33','A9s':'mix:b33@40,x',
    'A8s':'b33','A7s':'mix:b33@63,x','A6s':'b33','A5s':'b33','A4s':'b33','A3s':'x',
    'A2s':'b33','AKo':'mix:x@52,b33','KK':'mix:b33@62,b50','KQs':'x','KJs':'mix:b33@56,x','KTs':'mix:b33@59,x',
    'K9s':'mix:x@65,b33','K8s':'b33','K7s':'x','K6s':'b33','K5s':'b33','AQo':'x',
    'KQo':'x','QQ':'b33','QJs':'b33','QTs':'b33','Q9s':'mix:x@70,b33','Q8s':'b33',
    'Q7s':'mix:x@65,b33','AJo':'mix:x@61,b33','KJo':'mix:x@62,b33','QJo':'mix:x@49,b33','JJ':'mix:b33@45,b50','JTs':'mix:b33@53,x',
    'J9s':'x','J8s':'mix:x@62,b33','ATo':'mix:x@61,b33','KTo':'mix:b33@52,x','QTo':'mix:b33@57,x','JTo':'mix:x@65,b33',
    'TT':'mix:b33@62,b50','T9s':'mix:x@60,b33','T8s':'x','T7s':'mix:x@62,b33','A9o':'b33','K9o':'mix:x@51,b33',
    'T9o':'mix:b33@49,x','99':'b33','98s':'mix:b33@51,x','97s':'b33','A8o':'mix:b33@60,x','98o':'b33',
    '88':'mix:b33@49,x','87s':'mix:x@52,b33','86s':'x','77':'b33','76s':'mix:x@54,b33','66':'mix:x@58,b33',
    '65s':'x','55':'x','54s':'mix:b33@55,x','44':'mix:x@66,b33','43s':'mix:x@58,b33','33':'b33',
    '22':'mix:x@53,b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_9s7s3s_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'mix:c@59,f','ATs':'mix:f@69,c','A9s':'mix:rbig@53,c','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'mix:c@50,rbig','KQs':'mix:c@53,f','KJs':'f','KTs':'f','K9s':'c','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'c','KQo':'mix:c@41,f','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'f','AJo':'mix:c@52,f','KJo':'mix:f@50,c','QJo':'mix:f@50,c',
    'JTs':'c','J9s':'c','J8s':'c','ATo':'mix:f@47,c','KTo':'mix:f@50,c','QTo':'mix:f@50,c',
    'JTo':'mix:c@61,rbig','TT':'mix:rbig@56,c','T9s':'c','T8s':'c','A9o':'mix:rbig@54,c','K9o':'c',
    'T9o':'mix:c@67,rbig','99':'c','98s':'c','97s':'rbig','88':'mix:c@61,rbig','87s':'c',
    '86s':'c','77':'rbig','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'c','33':'rbig','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_9s7s3s_bb_facing_cbet_mid: {
    'AKs':'mix:c@61,f','AQs':'mix:c@52,f','AJs':'f','ATs':'f','A9s':'mix:c@45,rbig','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'mix:rbig@42,f','KQs':'f','KJs':'f','KTs':'f','K9s':'c','K8s':'f',
    'K7s':'c','K6s':'f','K5s':'f','AQo':'mix:c@41,f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'f','AJo':'f','KJo':'mix:f@50,c','QJo':'mix:f@50,c',
    'JTs':'mix:c@39,f','J9s':'c','J8s':'mix:f@50,c','ATo':'mix:f@50,c','KTo':'mix:f@50,c','QTo':'mix:f@50,c',
    'JTo':'mix:c@33,rbig','TT':'mix:rbig@59,c','T9s':'c','T8s':'c','A9o':'rbig','K9o':'mix:c@66,rbig',
    'T9o':'mix:c@66,rbig','99':'c','98s':'c','97s':'mix:rbig@53,r','88':'mix:f@50,rbig','87s':'c',
    '86s':'c','77':'mix:rbig@58,r','76s':'c','66':'mix:f@50,c','65s':'c','55':'mix:f@50,c',
    '54s':'f','44':'mix:f@50,c','43s':'c','33':'mix:rbig@66,r','22':'mix:f@50,c',
  },

  // ──────────────────────────────
  hu_25bb_srp_9s7s3s_bb_facing_cbet_large: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'f','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:r@50,f','KQs':'f','KJs':'f','KTs':'f','K9s':'mix:c@36,r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:f@50,r','KQo':'mix:f@51,r','QJs':'f',
    'QTs':'f','Q9s':'mix:f@60,c','Q8s':'f','AJo':'mix:f@51,r','KJo':'mix:f@51,r','QJo':'mix:f@51,c',
    'JTs':'f','J9s':'mix:f@41,c','J8s':'f','ATo':'mix:f@52,r','KTo':'mix:f@51,c','QTo':'mix:f@51,c',
    'JTo':'mix:f@51,r','TT':'r','T9s':'f','T8s':'mix:c@44,f','A9o':'r','K9o':'mix:r@58,c',
    'T9o':'mix:f@45,r','99':'r','98s':'f','97s':'r','88':'mix:f@50,r','87s':'f',
    '86s':'mix:f@40,c','77':'r','76s':'f','66':'mix:f@51,r','65s':'mix:c@39,f','55':'mix:f@56,r',
    '54s':'f','44':'mix:f@59,r','43s':'f','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_9s7s3s_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:c@50,f','KQs':'f','KJs':'f','KTs':'f','K9s':'mix:f@66,c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@50,f','KQo':'mix:f@53,c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','AJo':'mix:f@60,c','KJo':'mix:f@66,c','QJo':'f',
    'JTs':'f','J9s':'mix:f@66,c','J8s':'f','ATo':'f','KTo':'mix:f@64,c','QTo':'f',
    'JTo':'mix:f@50,c','TT':'c','T9s':'f','T8s':'f','A9o':'c','K9o':'mix:f@56,c',
    'T9o':'mix:f@63,c','99':'c','98s':'f','97s':'c','88':'mix:c@50,f','87s':'f',
    '86s':'f','77':'c','76s':'f','66':'mix:c@50,f','65s':'f','55':'f',
    '54s':'f','44':'f','43s':'f','33':'c','22':'f',
  },

}
