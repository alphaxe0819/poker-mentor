// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_As7d2c
// Generated: 2026-04-16T12:28:50.178Z
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

export const HU_13BB_SRP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_As7d2c_btn_cbet: {
    'AA':'x','AKs':'mix:b33@60,x','AQs':'b33','AJs':'b33','ATs':'mix:b33@52,x','A9s':'mix:x@70,b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:b33@56,x','K8s':'mix:b33@65,x','AQo':'b33','KQo':'x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'mix:b33@61,x','AJo':'b33','KJo':'x','QJo':'mix:x@53,b33','JJ':'x',
    'JTs':'x','J9s':'mix:x@54,b33','ATo':'mix:b33@53,x','KTo':'mix:x@66,b33','QTo':'mix:b33@65,x','JTo':'mix:b33@51,x',
    'TT':'mix:x@57,b33','T9s':'x','T8s':'x','A9o':'x','99':'mix:b33@52,x','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'mix:b33@62,x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'mix:f@65,c','K9s':'f','AQo':'r',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'r','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'mix:c@70,r','98s':'mix:r@54,f','88':'mix:c@69,f','87s':'mix:r@53,c','77':'c',
    '76s':'r','66':'f','65s':'f','55':'mix:c@50,f','54s':'r','44':'mix:r@43,c',
    '33':'mix:r@46,c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_As7d2c_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'f','KJs':'f','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'mix:c@63,f','98s':'f','88':'mix:c@58,f','87s':'mix:c@63,f','77':'c',
    '76s':'mix:c@62,f','66':'mix:f@68,c','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

}
