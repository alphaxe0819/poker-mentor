// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_9d5c2h
// Generated: 2026-04-16T13:16:45.585Z
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

export const HU_25BB_SRP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_9d5c2h_btn_cbet: {
    'AA':'mix:b33@42,b50','AKs':'b50','AQs':'mix:b33@40,x','AJs':'x','ATs':'x','A9s':'b50',
    'A8s':'mix:b50@64,x','A7s':'b50','A6s':'b50','A5s':'b50','A4s':'x','A3s':'x',
    'A2s':'mix:x@55,b50','AKo':'mix:b50@54,x','KK':'b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'b50','K8s':'b50','K7s':'mix:b50@61,b33','K6s':'b50','K5s':'x','AQo':'mix:x@67,b50',
    'KQo':'x','QQ':'b50','QJs':'x','QTs':'x','Q9s':'b50','Q8s':'mix:b50@65,b33',
    'Q7s':'mix:b50@61,b33','AJo':'x','KJo':'mix:b50@54,x','QJo':'b50','JJ':'b50','JTs':'mix:b33@52,b50',
    'J9s':'mix:b50@63,b33','J8s':'mix:b50@50,x','ATo':'x','KTo':'b50','QTo':'b50','JTo':'mix:b50@59,x',
    'TT':'b50','T9s':'b50','T8s':'mix:b50@61,x','T7s':'b50','A9o':'b50','K9o':'b50',
    'T9o':'mix:x@50,b50','99':'x','98s':'b50','97s':'b50','A8o':'mix:b50@59,b33','98o':'b50',
    '88':'x','87s':'x','86s':'x','77':'mix:x@60,b50','76s':'x','66':'mix:b50@48,x',
    '65s':'mix:x@45,b50','55':'mix:b33@61,b50','54s':'x','44':'mix:x@45,b50','43s':'mix:x@52,b50','33':'mix:b50@49,x',
    '22':'mix:b33@60,b50',
  },

  // ──────────────────────────────
  hu_25bb_srp_9d5c2h_bb_facing_cbet_small: {
    'AKs':'mix:r@64,c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'mix:c@47,r',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'mix:c@52,r','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'mix:r@63,f','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'c','Q9s':'r','Q8s':'f','AJo':'mix:c@64,f','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'mix:r@51,c','J8s':'mix:f@64,r','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'mix:c@57,r','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'mix:c@57,r','33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_9d5c2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'r','A8s':'mix:r@57,f',
    'A7s':'f','A6s':'r','A5s':'mix:c@62,r','A4s':'mix:r@60,c','A3s':'r','A2s':'c',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'c','AQo':'c','KQo':'f','QJs':'c',
    'QTs':'c','Q9s':'mix:c@60,r','Q8s':'f','AJo':'mix:f@55,c','KJo':'f','QJo':'f',
    'JTs':'c','J9s':'c','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'c','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'c','87s':'c',
    '86s':'c','77':'c','76s':'c','66':'c','65s':'c','55':'c',
    '54s':'c','44':'c','43s':'mix:rbig@42,r','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_9d5c2h_bb_facing_cbet_large: {
    'AKs':'mix:r@42,c','AQs':'mix:c@47,f','AJs':'mix:f@45,c','ATs':'mix:f@66,c','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'mix:r@65,c','A3s':'mix:r@64,c','A2s':'mix:r@48,c',
    'AKo':'f','KQs':'mix:f@60,c','KJs':'f','KTs':'f','K9s':'r','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'mix:r@45,c','AQo':'f','KQo':'f','QJs':'mix:f@57,r',
    'QTs':'f','Q9s':'r','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'r','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'r','T9s':'r','T8s':'f','A9o':'r','K9o':'r',
    'T9o':'mix:r@70,c','99':'c','98s':'r','97s':'r','88':'f','87s':'mix:f@44,r',
    '86s':'mix:f@44,c','77':'f','76s':'mix:f@51,c','66':'f','65s':'mix:r@54,c','55':'c',
    '54s':'mix:r@52,c','44':'f','43s':'r','33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_25bb_srp_9d5c2h_bb_facing_cbet_allin: {
    'AKs':'mix:c@62,f','AQs':'mix:f@63,c','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'mix:c@64,f','A4s':'mix:f@55,c','A3s':'mix:f@61,c','A2s':'mix:c@63,f',
    'AKo':'mix:c@52,f','KQs':'f','KJs':'f','KTs':'f','K9s':'c','K8s':'f',
    'K7s':'f','K6s':'f','K5s':'mix:c@60,f','AQo':'f','KQo':'f','QJs':'f',
    'QTs':'f','Q9s':'c','Q8s':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'c','J8s':'f','ATo':'f','KTo':'f','QTo':'f',
    'JTo':'f','TT':'c','T9s':'c','T8s':'f','A9o':'c','K9o':'c',
    'T9o':'c','99':'c','98s':'c','97s':'c','88':'mix:c@56,f','87s':'f',
    '86s':'f','77':'mix:c@51,f','76s':'f','66':'mix:c@52,f','65s':'mix:c@64,f','55':'c',
    '54s':'mix:c@63,f','44':'mix:c@52,f','43s':'f','33':'f','22':'c',
  },

}
