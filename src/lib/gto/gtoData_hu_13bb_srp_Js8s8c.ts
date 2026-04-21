// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Js8s8c
// Generated: 2026-04-16T12:30:36.944Z
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

export const HU_13BB_SRP_JS8S8C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Js8s8c_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'x','AJs':'b33','ATs':'x','A9s':'mix:b33@68,x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'mix:b33@55,x','A3s':'b33',
    'A2s':'b33','AKo':'mix:b33@68,x','KK':'b33','KQs':'x','KJs':'mix:x@56,b33','KTs':'mix:x@55,b33',
    'K9s':'mix:b33@52,x','K8s':'x','AQo':'x','KQo':'x','QQ':'b33','QJs':'b33',
    'QTs':'x','Q9s':'x','AJo':'mix:b33@60,x','KJo':'mix:x@68,b33','QJo':'b33','JJ':'x',
    'JTs':'b33','J9s':'b33','ATo':'x','KTo':'mix:x@67,b33','QTo':'x','JTo':'b33',
    'TT':'x','T9s':'x','T8s':'x','A9o':'mix:x@67,b33','99':'x','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'mix:b33@50,x','66':'x',
    '65s':'mix:b33@61,x','55':'x','54s':'b33','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Js8s8c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'mix:r@67,f','AJs':'r','ATs':'f','A9s':'f','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'f','KJs':'r','KTs':'f','K9s':'f','AQo':'r',
    'KQo':'f','QJs':'r','QTs':'r','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'f','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'mix:c@53,r','87s':'r','77':'mix:f@65,r',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Js8s8c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:f@68,c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'f','KJs':'c','KTs':'f','K9s':'f','AQo':'mix:c@68,f',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'f','99':'c','98s':'c','88':'c','87s':'c','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
