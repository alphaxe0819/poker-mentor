// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Qh9d6s
// Generated: 2026-04-16T12:35:10.528Z
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

export const HU_13BB_SRP_QH9D6S: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Qh9d6s_btn_cbet: {
    'AA':'b33','AKs':'mix:x@52,b33','AQs':'mix:x@67,b33','AJs':'x','ATs':'b33','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'b33','A5s':'x','A4s':'x','A3s':'b33',
    'A2s':'b33','AKo':'x','KK':'b33','KQs':'b33','KJs':'b33','KTs':'mix:x@62,b50',
    'K9s':'mix:x@40,b33','K8s':'b33','AQo':'mix:x@37,b33','KQo':'b33','QQ':'x','QJs':'b33',
    'QTs':'b33','Q9s':'x','AJo':'x','KJo':'b33','QJo':'b33','JJ':'mix:x@65,b33',
    'JTs':'mix:b33@59,x','J9s':'b33','ATo':'mix:x@59,b33','KTo':'x','QTo':'b33','JTo':'x',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'x','99':'x','98s':'mix:x@68,b33',
    '97s':'x','88':'x','87s':'x','77':'mix:x@68,b33','76s':'x','66':'x',
    '65s':'b33','55':'x','54s':'b33','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qh9d6s_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'f','ATs':'f','A9s':'mix:c@55,r','A8s':'f',
    'A7s':'f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'mix:r@41,c','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'f','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'f','JTo':'mix:c@64,r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'f','87s':'mix:r@66,c','77':'f',
    '76s':'r','66':'r','65s':'mix:r@54,c','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Qh9d6s_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'f','ATs':'f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:c@55,f','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'f','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'f','87s':'mix:f@59,c','77':'f',
    '76s':'c','66':'c','65s':'c','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
