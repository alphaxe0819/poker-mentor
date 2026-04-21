// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_6d5h4c
// Generated: 2026-04-16T12:25:18.384Z
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

export const HU_13BB_SRP_6D5H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_6d5h4c_btn_cbet: {
    'AA':'x','AKs':'mix:b33@63,x','AQs':'x','AJs':'x','ATs':'x','A9s':'mix:b33@53,x',
    'A8s':'x','A7s':'x','A6s':'b33','A5s':'b33','A4s':'b33','A3s':'x',
    'A2s':'x','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','AQo':'x','KQo':'x','QQ':'mix:x@55,b33','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'x','QJo':'mix:b33@54,x','JJ':'b33',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'mix:x@53,b33','QTo':'mix:b33@64,x','JTo':'mix:b33@51,x',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'mix:x@54,b33','99':'b33','98s':'x',
    '97s':'x','88':'b33','87s':'x','77':'b33','76s':'b33','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'b33','22':'b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_6d5h4c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'c','A9s':'r','A8s':'r',
    'A7s':'mix:r@70,c','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'mix:r@52,c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'mix:c@61,f','K9s':'mix:c@37,r','AQo':'mix:r@48,c',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'r','88':'r','87s':'c','77':'r',
    '76s':'r','66':'mix:c@63,r','65s':'r','55':'mix:c@62,r','54s':'r','44':'mix:c@62,r',
    '33':'r','22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_6d5h4c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'mix:c@51,f','ATs':'mix:f@54,c','A9s':'f','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'mix:f@61,c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'mix:c@65,f',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'f','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'c','55':'c','54s':'c','44':'c',
    '33':'c','22':'c',
  },

}
