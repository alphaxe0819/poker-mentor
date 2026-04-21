// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_Kc8h3s
// Generated: 2026-04-12T04:30:52.671Z
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

export const HU_13BB_SRP_FLOP_KC8H3S: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_Kc8h3s_btn_cbet: {
    'AA':'x','AKs':'mix:b33@66,x','AQs':'b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'b33','A7s':'mix:b33@52,x','A6s':'mix:x@62,b33','A5s':'x','A4s':'mix:x@59,b33','A3s':'b33',
    'A2s':'mix:b33@67,x','AKo':'b33','KK':'mix:x@60,b33','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'mix:x@68,b33','K8s':'b33','AQo':'mix:b33@55,x','KQo':'b33','QQ':'mix:x@60,b33','QJs':'x',
    'QTs':'x','Q9s':'mix:b33@64,x','AJo':'x','KJo':'b33','QJo':'mix:x@51,b33','JJ':'b33',
    'JTs':'x','J9s':'mix:b33@64,x','ATo':'x','KTo':'b33','QTo':'b33','JTo':'b33',
    'TT':'b33','T9s':'mix:x@57,b33','T8s':'mix:x@51,b33','A9o':'b33','99':'b33','98s':'mix:x@59,b33',
    '97s':'mix:x@55,b33','88':'mix:x@66,b33','87s':'mix:b33@58,x','77':'x','76s':'mix:b33@55,x','66':'x',
    '65s':'mix:b33@51,x','55':'mix:x@64,b33','54s':'mix:x@54,b33','44':'mix:b33@59,x','33':'x','22':'b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Kc8h3s_bb_facing_cbet_small: {
    'AKs':'c','AQs':'mix:c@58,r','AJs':'c','ATs':'c','A9s':'c','A8s':'r',
    'A7s':'mix:f@50,c','A6s':'f','A5s':'r','A4s':'mix:r@62,f','A3s':'r','A2s':'mix:f@58,r',
    'AKo':'c','KQs':'r','KJs':'r','KTs':'mix:r@52,c','K9s':'c','AQo':'mix:r@53,c',
    'KQo':'r','QJs':'r','QTs':'mix:c@57,f','AJo':'c','KJo':'r','QJo':'f',
    'JTs':'r','J9s':'f','ATo':'mix:f@60,c','KTo':'r','JTo':'f','TT':'r',
    'T9s':'mix:f@70,c','99':'r','98s':'c','88':'c','87s':'r','77':'c',
    '76s':'f','66':'c','65s':'f','55':'c','54s':'f','44':'c',
    '33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Kc8h3s_bb_facing_cbet_mid: {
    'AKs':'mix:r@63,c','AQs':'r','AJs':'r','ATs':'mix:r@44,c','A9s':'f','A8s':'r',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'r','A2s':'f',
    'AKo':'mix:r@67,c','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'mix:f@56,r','QTs':'mix:f@64,r','AJo':'mix:f@54,r','KJo':'r','QJo':'f',
    'JTs':'mix:f@60,r','J9s':'f','ATo':'f','KTo':'r','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'r','88':'mix:c@52,r','87s':'r','77':'mix:r@52,f',
    '76s':'f','66':'mix:f@58,r','65s':'f','55':'mix:f@62,r','54s':'f','44':'mix:f@63,r',
    '33':'mix:r@57,c','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_Kc8h3s_bb_facing_cbet_large: {
    'AKs':'c','AQs':'mix:c@58,f','AJs':'mix:c@52,f','ATs':'mix:f@51,c','A9s':'f','A8s':'c',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'mix:c@61,f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'mix:c@57,f',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'mix:f@54,c','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'c','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'c','88':'c','87s':'c','77':'c',
    '76s':'f','66':'c','65s':'f','55':'mix:c@58,f','54s':'f','44':'mix:f@51,c',
    '33':'c','22':'f',
  },

}
