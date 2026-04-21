// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_Kc8h3s
// Generated: 2026-04-11T06:11:32.576Z
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

export const HU_40BB_SRP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_Kc8h3s_btn_cbet: {
    'AA':'mix:b50@52,b100','AKs':'mix:b50@47,b33','AQs':'mix:x@64,b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'mix:b33@47,b50','A7s':'mix:x@41,b50','A6s':'b50','A5s':'mix:b50@38,x','A4s':'b50','A3s':'x',
    'A2s':'b50','AKo':'mix:b50@47,b100','KK':'mix:b33@41,x','KQs':'mix:b50@47,b100','KJs':'mix:b50@45,b33','KTs':'mix:b50@44,x',
    'K9s':'mix:b50@51,b33','K8s':'b50','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'mix:b50@50,b33','K2s':'x','AQo':'x','KQo':'mix:b50@47,b100','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'mix:b50@43,x','Q8s':'mix:b50@38,x','Q7s':'x','Q6s':'x','Q5s':'x',
    'AJo':'x','KJo':'mix:x@46,b50','QJo':'mix:x@41,b50','JJ':'x','JTs':'mix:x@39,b50','J9s':'mix:x@44,b50',
    'J8s':'mix:x@58,b33','J7s':'mix:x@45,b50','ATo':'x','KTo':'x','QTo':'mix:x@37,b50','JTo':'mix:x@38,b50',
    'TT':'mix:x@45,b50','T9s':'x','T8s':'x','T7s':'x','A9o':'x','K9o':'x',
    'Q9o':'mix:x@38,b50','J9o':'mix:b50@37,x','T9o':'b50','99':'b50','98s':'mix:x@43,b33','97s':'mix:x@55,b50',
    'A8o':'mix:b50@51,b33','98o':'x','88':'mix:b50@52,b33','87s':'mix:b50@38,x','86s':'mix:x@47,b50','A7o':'b50',
    '77':'x','76s':'x','75s':'mix:x@43,b50','66':'x','65s':'mix:x@52,b50','64s':'x',
    '55':'x','54s':'x','53s':'mix:x@44,b50','44':'x','43s':'mix:b50@42,x','33':'mix:b50@53,b33',
    '22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Kc8h3s_bb_facing_cbet_small: {
    'AKs':'mix:r@65,c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@67,f','A6s':'mix:r@56,f','A5s':'mix:r@45,c','A4s':'r','A3s':'c','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'mix:c@66,r','KTs':'c','K9s':'c','K8s':'mix:r@59,c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'mix:r@57,c','QJs':'c',
    'QTs':'c','Q9s':'mix:c@54,f','Q8s':'c','Q7s':'f','AJo':'c','KJo':'c',
    'QJo':'f','JTs':'mix:c@54,r','J9s':'mix:c@57,f','J8s':'c','ATo':'mix:f@48,c','KTo':'c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'mix:c@53,r','T8s':'c','A9o':'f',
    'K9o':'c','T9o':'f','99':'c','98s':'c','97s':'mix:f@43,c','A8o':'c',
    '98o':'c','88':'mix:c@68,r','87s':'c','86s':'c','77':'c','76s':'mix:c@46,f',
    '75s':'f','66':'c','65s':'mix:r@41,c','55':'c','54s':'mix:r@60,f','44':'c',
    '43s':'mix:c@64,r','33':'r','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Kc8h3s_bb_facing_cbet_mid: {
    'AKs':'mix:c@59,r','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@49,f','A6s':'mix:r@63,f','A5s':'r','A4s':'r','A3s':'c','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'c','KTs':'c','K9s':'c','K8s':'mix:c@70,r',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'c','KQo':'r','QJs':'c',
    'QTs':'c','Q9s':'f','Q8s':'c','Q7s':'f','AJo':'mix:f@50,c','KJo':'c',
    'QJo':'f','JTs':'c','J9s':'f','J8s':'c','ATo':'f','KTo':'c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'mix:f@46,c','T8s':'c','A9o':'f',
    'K9o':'c','T9o':'f','99':'c','98s':'c','97s':'f','A8o':'mix:c@68,r',
    '98o':'c','88':'c','87s':'c','86s':'c','77':'c','76s':'f',
    '75s':'f','66':'c','65s':'f','55':'c','54s':'mix:f@64,r','44':'c',
    '43s':'mix:c@54,r','33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Kc8h3s_bb_facing_cbet_large: {
    'AKs':'mix:c@57,r','AQs':'c','AJs':'c','ATs':'mix:c@64,f','A9s':'mix:f@57,c','A8s':'c',
    'A7s':'f','A6s':'mix:f@65,r','A5s':'mix:f@51,r','A4s':'mix:r@48,f','A3s':'c','A2s':'mix:r@57,f',
    'AKo':'mix:r@55,c','KQs':'r','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'mix:f@52,c','KQo':'r','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'c','Q7s':'f','AJo':'f','KJo':'c',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'c','ATo':'f','KTo':'c',
    'QTo':'f','JTo':'f','TT':'c','T9s':'f','T8s':'c','A9o':'f',
    'K9o':'c','T9o':'f','99':'mix:f@51,c','98s':'c','97s':'f','A8o':'c',
    '98o':'c','88':'c','87s':'c','86s':'c','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'c','33':'mix:r@58,c','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Kc8h3s_bb_facing_cbet_allin: {
    'AKs':'c','AQs':'f','AJs':'f','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'c','AQo':'f','KQo':'c','QJs':'f',
    'QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','AJo':'f','KJo':'c',
    'QJo':'f','JTs':'f','J9s':'f','J8s':'f','ATo':'f','KTo':'c',
    'QTo':'f','JTo':'f','TT':'f','T9s':'f','T8s':'f','A9o':'f',
    'K9o':'c','T9o':'f','99':'mix:c@57,f','98s':'mix:c@62,f','97s':'f','A8o':'f',
    '98o':'mix:c@55,f','88':'c','87s':'mix:c@56,f','86s':'mix:c@56,f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '43s':'f','33':'c','22':'f',
  },

}
