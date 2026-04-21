// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Ah8h3c
// Generated: 2026-04-16T12:28:19.085Z
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

export const HU_13BB_SRP_AH8H3C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Ah8h3c_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'b33','ATs':'mix:b33@59,x','A9s':'mix:b33@53,x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'mix:b33@69,x','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:b33@61,x','K8s':'x','AQo':'b33','KQo':'x','QQ':'x','QJs':'x',
    'QTs':'mix:x@59,b33','Q9s':'mix:b33@57,x','AJo':'b33','KJo':'x','QJo':'mix:x@65,b33','JJ':'x',
    'JTs':'mix:x@67,b33','J9s':'mix:x@53,b33','ATo':'mix:b33@65,x','KTo':'mix:x@66,b33','QTo':'mix:b33@55,x','JTo':'x',
    'TT':'mix:x@60,b33','T9s':'x','T8s':'x','A9o':'mix:x@57,b33','99':'mix:x@50,b33','98s':'x',
    '97s':'mix:x@68,b33','88':'x','87s':'x','77':'x','76s':'mix:x@53,b33','66':'x',
    '65s':'mix:b33@69,x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ah8h3c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:c@58,r','A9s':'mix:c@54,r','A8s':'mix:r@55,c',
    'A7s':'mix:c@52,r','A6s':'mix:r@56,c','A5s':'mix:r@52,c','A4s':'mix:c@52,r','A3s':'mix:r@67,c','A2s':'mix:r@51,c',
    'AKo':'r','KQs':'f','KJs':'mix:f@66,c','KTs':'f','K9s':'f','AQo':'r',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'mix:c@68,r','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'mix:c@45,f','98s':'mix:c@65,r','88':'c','87s':'mix:r@65,c','77':'mix:f@62,c',
    '76s':'f','66':'mix:f@69,c','65s':'f','55':'mix:f@50,r','54s':'r','44':'mix:f@50,r',
    '33':'mix:c@50,r','22':'mix:f@50,r',
  },

  // ──────────────────────────────
  hu_13bb_srp_Ah8h3c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'mix:c@61,f',
    'T9s':'f','99':'mix:c@58,f','98s':'mix:c@70,f','88':'c','87s':'mix:c@67,f','77':'mix:f@61,c',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'c','22':'f',
  },

}
