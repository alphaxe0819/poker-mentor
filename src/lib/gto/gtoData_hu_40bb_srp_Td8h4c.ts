// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_flop_Td8h4c
// Generated: 2026-04-11T07:08:48.369Z
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

export const HU_40BB_SRP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_flop_Td8h4c_btn_cbet: {
    'AA':'b100','AKs':'mix:x@40,b33','AQs':'x','AJs':'x','ATs':'mix:b100@48,b50','A9s':'x',
    'A8s':'mix:b50@37,x','A7s':'x','A6s':'mix:x@50,b100','A5s':'mix:x@59,b100','A4s':'x','A3s':'mix:x@58,b100',
    'A2s':'mix:x@47,b100','AKo':'x','KK':'mix:b50@45,b100','KQs':'x','KJs':'mix:b100@36,x','KTs':'mix:b50@51,b33',
    'K9s':'mix:b100@40,b50','K8s':'x','K7s':'mix:b50@39,b100','K6s':'mix:x@33,b100','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','AQo':'x','KQo':'mix:x@37,b50','QQ':'mix:b100@57,b50','QJs':'mix:b100@48,b50',
    'QTs':'mix:b100@41,b50','Q9s':'mix:x@43,b33','Q8s':'x','Q7s':'mix:b50@39,b100','Q6s':'b50','Q5s':'mix:b50@34,x',
    'AJo':'x','KJo':'mix:b50@34,x','QJo':'mix:x@30,b50','JJ':'b100','JTs':'b50','J9s':'mix:b33@48,b50',
    'J8s':'x','J7s':'mix:b100@59,x','ATo':'mix:b100@53,b50','KTo':'mix:b50@39,x','QTo':'x','JTo':'x',
    'TT':'b33','T9s':'b50','T8s':'mix:b50@56,b100','T7s':'x','A9o':'mix:x@50,b50','K9o':'mix:b50@30,b33',
    'Q9o':'mix:b100@39,b50','J9o':'mix:x@48,b50','T9o':'mix:x@47,b50','99':'x','98s':'mix:x@49,b50','97s':'x',
    'A8o':'mix:x@37,b50','98o':'x','88':'mix:b33@56,b50','87s':'x','86s':'x','A7o':'b50',
    '77':'x','76s':'x','75s':'x','66':'x','65s':'mix:x@68,b100','64s':'x',
    '55':'x','54s':'x','53s':'b50','44':'mix:b50@64,b100','43s':'x','33':'x',
    '22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Td8h4c_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'mix:c@46,r','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:r@56,c','K9s':'mix:c@52,f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'c','KQo':'f','QJs':'r',
    'QTs':'mix:r@49,c','Q9s':'c','Q8s':'c','Q7s':'f','AJo':'mix:c@50,f','KJo':'f',
    'QJo':'mix:r@38,allin','JTs':'mix:c@63,r','J9s':'c','J8s':'c','ATo':'mix:r@59,allin','KTo':'mix:c@59,r',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'r','A9o':'f',
    'K9o':'f','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'c',
    '98o':'c','88':'mix:r@52,c','87s':'c','86s':'c','77':'c','76s':'c',
    '75s':'c','66':'c','65s':'c','55':'c','54s':'c','44':'r',
    '43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Td8h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'r','A9s':'c','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:c@69,r','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'mix:c@51,f','KQo':'f','QJs':'r',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'f','AJo':'mix:f@50,r','KJo':'f',
    'QJo':'mix:c@41,r','JTs':'c','J9s':'c','J8s':'c','ATo':'r','KTo':'c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'mix:c@65,r','T8s':'r','A9o':'f',
    'K9o':'f','T9o':'c','99':'c','98s':'c','97s':'c','A8o':'c',
    '98o':'c','88':'mix:r@63,c','87s':'c','86s':'c','77':'c','76s':'c',
    '75s':'c','66':'f','65s':'c','55':'f','54s':'c','44':'r',
    '43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Td8h4c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:allin@66,r','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'mix:f@54,c','KTs':'c','K9s':'f','K8s':'c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:allin@55,r',
    'QTs':'c','Q9s':'c','Q8s':'c','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'mix:c@53,allin','JTs':'c','J9s':'c','J8s':'c','ATo':'allin','KTo':'c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'mix:r@54,allin','A9o':'f',
    'K9o':'f','T9o':'c','99':'f','98s':'c','97s':'c','A8o':'c',
    '98o':'c','88':'c','87s':'c','86s':'c','77':'f','76s':'c',
    '75s':'c','66':'f','65s':'c','55':'f','54s':'c','44':'mix:r@53,c',
    '43s':'c','33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_flop_Td8h4c_bb_facing_cbet_allin: {
    'AKs':'f','AQs':'f','AJs':'f','ATs':'c','A9s':'f','A8s':'mix:f@61,c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'f','KQs':'f','KJs':'f','KTs':'c','K9s':'f','K8s':'mix:f@69,c',
    'K7s':'f','K6s':'f','K5s':'f','AQo':'f','KQo':'f','QJs':'mix:f@52,c',
    'QTs':'c','Q9s':'f','Q8s':'mix:f@65,c','Q7s':'f','AJo':'f','KJo':'f',
    'QJo':'mix:f@67,c','JTs':'c','J9s':'f','J8s':'mix:f@51,c','ATo':'c','KTo':'c',
    'QTo':'c','JTo':'c','TT':'c','T9s':'c','T8s':'c','A9o':'f',
    'K9o':'f','T9o':'mix:c@68,f','99':'f','98s':'mix:f@64,c','97s':'f','A8o':'f',
    '98o':'f','88':'c','87s':'f','86s':'f','77':'f','76s':'f',
    '75s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'c',
    '43s':'f','33':'f','22':'f',
  },

}
