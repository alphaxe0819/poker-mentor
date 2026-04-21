// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_AsAd7c
// Generated: 2026-04-16T12:29:22.735Z
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

export const HU_13BB_SRP_ASAD7C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_AsAd7c_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'mix:x@53,b33','AJs':'mix:b33@68,x','ATs':'b33','A9s':'mix:b33@55,x',
    'A8s':'x','A7s':'x','A6s':'mix:x@53,b33','A5s':'b33','A4s':'mix:b33@54,x','A3s':'x',
    'A2s':'mix:x@64,b33','AKo':'x','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:x@63,b33','AQo':'mix:b33@53,x','KQo':'x','QQ':'mix:b33@53,x','QJs':'x',
    'QTs':'x','Q9s':'mix:b33@50,x','AJo':'b33','KJo':'x','QJo':'mix:b33@50,x','JJ':'mix:b33@62,x',
    'JTs':'x','J9s':'mix:x@51,b33','ATo':'b33','KTo':'x','QTo':'mix:b33@66,x','JTo':'mix:b33@56,x',
    'TT':'b33','T9s':'x','T8s':'x','A9o':'x','99':'mix:x@52,b33','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'mix:x@61,b33','55':'x','54s':'mix:x@65,b33','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_AsAd7c_bb_facing_cbet_small: {
    'AKs':'mix:r@52,c','AQs':'r','AJs':'r','ATs':'r','A9s':'c','A8s':'mix:c@70,r',
    'A7s':'c','A6s':'mix:r@65,c','A5s':'r','A4s':'r','A3s':'mix:r@64,c','A2s':'r',
    'AKo':'r','KQs':'mix:c@52,r','KJs':'mix:c@51,r','KTs':'c','K9s':'r','AQo':'r',
    'KQo':'mix:c@41,f','QJs':'r','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'mix:f@66,r','ATo':'mix:r@66,c','KTo':'f','JTo':'f','TT':'mix:r@68,c',
    'T9s':'f','99':'mix:r@60,c','98s':'f','88':'c','87s':'mix:c@64,f','77':'c',
    '76s':'mix:c@48,f','66':'mix:f@59,r','65s':'f','55':'f','54s':'f','44':'f',
    '33':'mix:f@66,r','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_AsAd7c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'mix:c@61,f','KJs':'mix:f@54,c','KTs':'mix:f@69,c','K9s':'f','AQo':'c',
    'KQo':'mix:c@56,f','QJs':'f','QTs':'f','AJo':'c','KJo':'mix:f@65,c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'mix:c@52,f','77':'c',
    '76s':'f','66':'mix:f@62,c','65s':'f','55':'mix:f@59,c','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
