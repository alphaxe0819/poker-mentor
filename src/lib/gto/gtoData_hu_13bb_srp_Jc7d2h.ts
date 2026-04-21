// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Jc7d2h
// Generated: 2026-04-16T12:29:55.445Z
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

export const HU_13BB_SRP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Jc7d2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'x','AJs':'mix:x@65,b33','ATs':'x','A9s':'x',
    'A8s':'mix:b33@58,x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'b33','AKo':'mix:x@55,b33','KK':'mix:x@66,b33','KQs':'mix:x@50,b33','KJs':'b33','KTs':'x',
    'K9s':'x','K8s':'mix:x@65,b33','AQo':'x','KQo':'x','QQ':'b33','QJs':'mix:b33@57,x',
    'QTs':'x','Q9s':'x','AJo':'mix:b33@64,x','KJo':'b33','QJo':'b33','JJ':'x',
    'JTs':'b33','J9s':'b33','ATo':'x','KTo':'mix:b33@65,x','QTo':'b33','JTo':'b33',
    'TT':'x','T9s':'x','T8s':'x','A9o':'b33','99':'b33','98s':'x',
    '97s':'x','88':'mix:x@67,b33','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Jc7d2h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'mix:r@44,c','AJs':'r','ATs':'mix:c@60,f','A9s':'f','A8s':'f',
    'A7s':'r','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'f','K9s':'f','AQo':'mix:f@69,c',
    'KQo':'mix:f@44,r','QJs':'r','QTs':'f','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'mix:r@69,c','ATo':'f','KTo':'f','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'c',
    '76s':'r','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_Jc7d2h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:f@55,c','AJs':'c','ATs':'mix:f@61,c','A9s':'f','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:c@59,f',
    'AKo':'mix:f@58,c','KQs':'mix:f@65,c','KJs':'c','KTs':'f','K9s':'f','AQo':'f',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'mix:f@68,c','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

}
