// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_As7d2c
// Generated: 2026-04-12T04:28:19.934Z
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

export const HU_13BB_SRP_FLOP_AS7D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_As7d2c_btn_cbet: {
    'AA':'x','AKs':'mix:b33@69,x','AQs':'b33','AJs':'b33','ATs':'b33','A9s':'mix:b33@59,x',
    'A8s':'mix:x@66,b33','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'b33','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'mix:b33@59,x','K8s':'b33','AQo':'b33','KQo':'x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'b33','AJo':'b33','KJo':'x','QJo':'mix:b33@65,x','JJ':'x',
    'JTs':'x','J9s':'b33','ATo':'b33','KTo':'mix:b33@49,x','QTo':'mix:b33@61,x','JTo':'mix:b33@64,x',
    'TT':'mix:x@63,b33','T9s':'mix:x@59,b33','T8s':'mix:b33@57,x','A9o':'mix:x@52,b33','99':'mix:b33@64,x','98s':'mix:x@60,b33',
    '97s':'mix:x@60,b33','88':'b33','87s':'b33','77':'x','76s':'b33','66':'mix:x@51,b33',
    '65s':'mix:x@55,b33','55':'mix:x@52,b33','54s':'x','44':'mix:x@62,b33','33':'mix:x@60,b33','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:c@64,r','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'r','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'r',
    'KQo':'mix:c@52,f','QJs':'r','QTs':'mix:f@49,r','AJo':'r','KJo':'mix:f@64,c','QJo':'f',
    'JTs':'r','J9s':'mix:r@56,f','ATo':'r','KTo':'f','JTo':'f','TT':'c',
    'T9s':'mix:r@61,f','99':'c','98s':'r','88':'c','87s':'c','77':'c',
    '76s':'c','66':'c','65s':'r','55':'c','54s':'r','44':'c',
    '33':'mix:r@58,c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_As7d2c_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:r@58,c','A9s':'mix:c@60,r','A8s':'mix:r@64,c',
    'A7s':'r','A6s':'r','A5s':'r','A4s':'r','A3s':'r','A2s':'r',
    'AKo':'r','KQs':'mix:f@35,r','KJs':'mix:r@40,f','KTs':'f','K9s':'f','AQo':'r',
    'KQo':'f','QJs':'f','QTs':'f','AJo':'mix:r@68,c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'mix:f@64,r','ATo':'mix:r@51,c','KTo':'f','JTo':'f','TT':'mix:f@65,r',
    'T9s':'f','99':'r','98s':'mix:f@51,r','88':'r','87s':'r','77':'mix:r@69,c',
    '76s':'r','66':'mix:r@48,f','65s':'mix:f@50,r','55':'r','54s':'r','44':'mix:r@59,f',
    '33':'mix:r@50,f','22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_As7d2c_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'c','A6s':'c','A5s':'c','A4s':'c','A3s':'c','A2s':'c',
    'AKo':'c','KQs':'mix:f@68,c','KJs':'mix:f@68,c','KTs':'f','K9s':'f','AQo':'c',
    'KQo':'mix:f@64,c','QJs':'f','QTs':'f','AJo':'c','KJo':'f','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'c','KTo':'f','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'c','77':'c',
    '76s':'c','66':'mix:c@62,f','65s':'f','55':'mix:c@54,f','54s':'f','44':'mix:f@55,c',
    '33':'mix:f@69,c','22':'c',
  },

}
