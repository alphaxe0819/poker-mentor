// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_KcKd5h
// Generated: 2026-04-12T04:31:22.455Z
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

export const HU_13BB_SRP_FLOP_KCKD5H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_KcKd5h_btn_cbet: {
    'AA':'mix:x@59,b33','AKs':'mix:b33@51,x','AQs':'b33','AJs':'mix:b33@58,x','ATs':'mix:x@67,b33','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'mix:b33@57,x','A5s':'b33','A4s':'mix:b33@52,x','A3s':'mix:b33@55,x',
    'A2s':'b33','AKo':'mix:x@56,b33','KK':'x','KQs':'mix:x@62,b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'b33','AQo':'b33','KQo':'mix:x@62,b33','QQ':'mix:b33@69,x','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'b33','QJo':'mix:x@59,b33','JJ':'b33',
    'JTs':'x','J9s':'mix:x@59,b33','ATo':'x','KTo':'mix:b33@70,x','QTo':'mix:b33@65,x','JTo':'mix:b33@59,x',
    'TT':'b33','T9s':'mix:b33@53,x','T8s':'mix:x@54,b33','A9o':'mix:x@64,b33','99':'b33','98s':'mix:b33@57,x',
    '97s':'b33','88':'b33','87s':'mix:b33@52,x','77':'b33','76s':'mix:b33@57,x','66':'mix:x@64,b33',
    '65s':'mix:b33@59,x','55':'x','54s':'x','44':'x','33':'mix:x@58,b33','22':'mix:b33@56,x',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KcKd5h_bb_facing_cbet_small: {
    'AKs':'c','AQs':'r','AJs':'c','ATs':'c','A9s':'c','A8s':'c',
    'A7s':'mix:c@58,f','A6s':'f','A5s':'r','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'r','K9s':'mix:c@55,r','AQo':'r',
    'KQo':'c','QJs':'mix:r@52,c','QTs':'mix:c@58,f','AJo':'c','KJo':'c','QJo':'f',
    'JTs':'r','J9s':'f','ATo':'mix:f@55,c','KTo':'r','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'f','88':'r','87s':'f','77':'r',
    '76s':'f','66':'r','65s':'c','55':'c','54s':'c','44':'c',
    '33':'c','22':'c',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KcKd5h_bb_facing_cbet_mid: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'mix:r@49,c','A9s':'mix:f@48,r','A8s':'mix:f@60,r',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'r',
    'KQo':'r','QJs':'mix:f@50,r','QTs':'f','AJo':'mix:r@53,f','KJo':'r','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'f','KTo':'r','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'f','88':'r','87s':'f','77':'r',
    '76s':'f','66':'r','65s':'r','55':'r','54s':'r','44':'mix:f@61,r',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_KcKd5h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'mix:c@65,f','ATs':'mix:f@50,c','A9s':'mix:f@52,c','A8s':'mix:f@60,c',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'c',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'mix:f@53,c','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'mix:f@54,c','KTo':'c','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'f','77':'c',
    '76s':'f','66':'c','65s':'c','55':'c','54s':'mix:c@66,f','44':'mix:c@54,f',
    '33':'mix:f@54,c','22':'f',
  },

}
