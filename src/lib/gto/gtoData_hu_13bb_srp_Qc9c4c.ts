// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Qc9c4c
// Generated: 2026-04-16T12:34:04.074Z
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

export const HU_13BB_SRP_QC9C4C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Qc9c4c_btn_cbet: {
    'AA':'mix:b33@59,x','AKs':'x','AQs':'mix:b33@54,b50','AJs':'x','ATs':'x','A9s':'mix:b50@41,x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'mix:b33@52,x',
    'A2s':'mix:b33@68,x','AKo':'mix:x@60,b33','KK':'b33','KQs':'mix:b33@63,b50','KJs':'x','KTs':'x',
    'K9s':'mix:b50@38,b33','K8s':'mix:x@56,b33','AQo':'mix:b33@63,b50','KQo':'b33','QQ':'mix:x@67,b33','QJs':'mix:b33@55,b50',
    'QTs':'mix:b33@59,b50','Q9s':'mix:b33@64,b50','AJo':'x','KJo':'mix:x@49,b33','QJo':'mix:b33@64,b50','JJ':'mix:b33@67,b50',
    'JTs':'mix:x@66,b50','J9s':'mix:b33@46,b50','ATo':'x','KTo':'mix:x@59,b50','QTo':'mix:b33@68,b50','JTo':'mix:x@44,b50',
    'TT':'mix:b33@60,b50','T9s':'mix:b33@37,b50','T8s':'x','A9o':'mix:x@47,b33','99':'mix:x@67,b33','98s':'mix:b50@55,b33',
    '97s':'mix:b50@50,x','88':'x','87s':'mix:b33@58,x','77':'x','76s':'mix:x@62,b33','66':'mix:x@68,b33',
    '65s':'mix:b33@52,x','55':'x','54s':'mix:b50@64,x','44':'mix:b33@68,b50','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qc9c4c_bb_facing_cbet_small: {
    'AKs':'f','AQs':'r','AJs':'f','ATs':'f','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:r@50,f','KQs':'r','KJs':'f','KTs':'f','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'mix:f@50,r','KJo':'mix:r@52,f','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'mix:f@50,r','KTo':'mix:r@50,f','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'mix:f@46,c','88':'mix:r@50,f','87s':'f','77':'mix:r@50,f',
    '76s':'f','66':'mix:r@50,f','65s':'f','55':'mix:r@50,f','54s':'f','44':'r',
    '33':'mix:f@50,r','22':'mix:f@50,r',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qc9c4c_bb_facing_cbet_mid: {
    'AKs':'f','AQs':'c','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:c@50,f','KQs':'c','KJs':'f','KTs':'f','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'mix:c@50,f','KJo':'mix:c@50,f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'mix:c@50,f','KTo':'mix:c@50,f','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'mix:f@65,c','88':'mix:c@50,f','87s':'f','77':'mix:c@50,f',
    '76s':'f','66':'mix:c@50,f','65s':'f','55':'mix:c@50,f','54s':'f','44':'c',
    '33':'mix:c@50,f','22':'mix:c@50,f',
  },

}
