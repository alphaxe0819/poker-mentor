// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_Jc7d2h
// Generated: 2026-04-12T04:28:58.289Z
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

export const HU_13BB_SRP_FLOP_JC7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_Jc7d2h_btn_cbet: {
    'AA':'mix:x@61,b33','AKs':'b33','AQs':'mix:b33@51,x','AJs':'b33','ATs':'x','A9s':'x',
    'A8s':'mix:x@52,b33','A7s':'b33','A6s':'x','A5s':'x','A4s':'mix:x@66,b33','A3s':'mix:b33@55,x',
    'A2s':'b33','AKo':'mix:b33@54,x','KK':'b33','KQs':'x','KJs':'b33','KTs':'x',
    'K9s':'b33','K8s':'b33','AQo':'x','KQo':'mix:x@61,b33','QQ':'b33','QJs':'b33',
    'QTs':'mix:x@66,b33','Q9s':'mix:b33@69,x','AJo':'b33','KJo':'b33','QJo':'b33','JJ':'x',
    'JTs':'b33','J9s':'mix:b33@64,x','ATo':'x','KTo':'b33','QTo':'b33','JTo':'b33',
    'TT':'mix:b33@67,x','T9s':'x','T8s':'x','A9o':'b33','99':'b33','98s':'x',
    '97s':'x','88':'b33','87s':'x','77':'x','76s':'mix:x@66,b33','66':'x',
    '65s':'mix:b33@53,x','55':'x','54s':'x','44':'x','33':'mix:b33@59,x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Jc7d2h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'r','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'mix:r@53,c','KQs':'r','KJs':'c','KTs':'c','K9s':'f','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'f','AJo':'r','KJo':'mix:c@56,r','QJo':'mix:c@69,r',
    'JTs':'r','J9s':'mix:c@58,r','ATo':'f','KTo':'f','JTo':'r','TT':'mix:r@53,c',
    'T9s':'mix:r@66,c','99':'r','98s':'c','88':'r','87s':'c','77':'c',
    '76s':'mix:c@68,r','66':'mix:c@68,r','65s':'f','55':'c','54s':'f','44':'c',
    '33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Jc7d2h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'r','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'r',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'f','K9s':'f','AQo':'mix:f@54,r',
    'KQo':'f','QJs':'r','QTs':'f','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'f','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'mix:r@54,c',
    '76s':'r','66':'mix:f@56,r','65s':'f','55':'mix:f@62,r','54s':'f','44':'mix:f@69,r',
    '33':'f','22':'mix:r@57,c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Jc7d2h_bb_facing_cbet_large: {
    'AKs':'mix:c@52,f','AQs':'mix:f@63,c','AJs':'c','ATs':'mix:f@61,c','A9s':'f','A8s':'f',
    'A7s':'c','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:c@56,f',
    'AKo':'mix:f@64,c','KQs':'f','KJs':'c','KTs':'f','K9s':'f','AQo':'mix:f@67,c',
    'KQo':'f','QJs':'c','QTs':'f','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'mix:c@53,f','65s':'f','55':'mix:c@51,f','54s':'f','44':'mix:f@50,c',
    '33':'f','22':'c',
  },

}
