// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Td8h4c
// Generated: 2026-04-16T12:36:10.897Z
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

export const HU_13BB_SRP_TD8H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Td8h4c_btn_cbet: {
    'AA':'x','AKs':'mix:x@57,b33','AQs':'x','AJs':'x','ATs':'b33','A9s':'x',
    'A8s':'mix:x@66,b33','A7s':'x','A6s':'x','A5s':'x','A4s':'b33','A3s':'mix:b33@57,x',
    'A2s':'b33','AKo':'mix:x@58,b33','KK':'x','KQs':'x','KJs':'x','KTs':'b33',
    'K9s':'mix:x@69,b33','K8s':'x','AQo':'x','KQo':'x','QQ':'b33','QJs':'b33',
    'QTs':'b33','Q9s':'x','AJo':'x','KJo':'mix:b33@58,x','QJo':'mix:b33@59,b50','JJ':'b33',
    'JTs':'b33','J9s':'x','ATo':'mix:b33@65,b50','KTo':'b33','QTo':'b33','JTo':'b33',
    'TT':'x','T9s':'b33','T8s':'x','A9o':'b33','99':'b33','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'mix:x@70,b33','54s':'mix:x@69,b33','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Td8h4c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'r','A9s':'f','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'r','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'f','AQo':'f',
    'KQo':'f','QJs':'r','QTs':'r','AJo':'f','KJo':'f','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'r',
    '76s':'r','66':'f','65s':'f','55':'f','54s':'r','44':'r',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Td8h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'c','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'mix:c@60,f','KJs':'mix:c@69,f','KTs':'c','K9s':'f','AQo':'f',
    'KQo':'f','QJs':'c','QTs':'c','AJo':'f','KJo':'f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'mix:c@55,f',
    '76s':'f','66':'mix:f@63,c','65s':'f','55':'f','54s':'c','44':'c',
    '33':'f','22':'f',
  },

}
