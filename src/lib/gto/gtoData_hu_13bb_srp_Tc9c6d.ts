// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Tc9c6d
// Generated: 2026-04-16T12:35:51.832Z
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

export const HU_13BB_SRP_TC9C6D: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Tc9c6d_btn_cbet: {
    'AA':'b33','AKs':'x','AQs':'x','AJs':'mix:x@66,b33','ATs':'mix:b33@52,b50','A9s':'mix:x@54,b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b33@63,x','A4s':'b33','A3s':'b33',
    'A2s':'b33','AKo':'x','KK':'b33','KQs':'mix:b33@52,b50','KJs':'x','KTs':'mix:b33@64,b50',
    'K9s':'b33','K8s':'x','AQo':'mix:x@54,b50','KQo':'mix:b33@53,b50','QQ':'b33','QJs':'mix:x@62,b50',
    'QTs':'mix:b33@57,b50','Q9s':'mix:b33@64,b50','AJo':'mix:x@59,b33','KJo':'x','QJo':'mix:b50@47,x','JJ':'mix:b33@63,b50',
    'JTs':'b33','J9s':'mix:x@59,b33','ATo':'mix:b33@52,b50','KTo':'mix:b33@63,b50','QTo':'mix:b33@59,b50','JTo':'mix:b33@69,b50',
    'TT':'x','T9s':'mix:x@59,b33','T8s':'b33','A9o':'mix:x@49,b33','99':'x','98s':'b33',
    '97s':'mix:b33@60,b50','88':'mix:b33@50,x','87s':'x','77':'x','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'mix:b33@67,x','44':'x','33':'x','22':'mix:x@58,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_Tc9c6d_bb_facing_cbet_small: {
    'AKs':'mix:f@51,r','AQs':'f','AJs':'f','ATs':'r','A9s':'mix:c@63,r','A8s':'mix:f@50,r',
    'A7s':'mix:f@59,r','A6s':'mix:f@65,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@53,r','KQs':'r','KJs':'mix:f@50,r','KTs':'r','K9s':'r','AQo':'f',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'f','KJo':'mix:f@50,c','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'r','KTo':'r','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'r','87s':'r','77':'c',
    '76s':'r','66':'r','65s':'mix:f@65,r','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Tc9c6d_bb_facing_cbet_mid: {
    'AKs':'mix:c@50,f','AQs':'f','AJs':'f','ATs':'c','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'mix:f@65,c','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:f@50,c','KQs':'c','KJs':'mix:f@69,c','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'f','KJo':'f','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'c','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'c','87s':'c','77':'mix:c@54,f',
    '76s':'c','66':'c','65s':'mix:f@66,c','55':'f','54s':'f','44':'f',
    '33':'f','22':'f',
  },

}
