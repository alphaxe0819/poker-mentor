// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_Js9c3h
// Generated: 2026-04-16T12:31:11.296Z
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

export const HU_13BB_SRP_JS9C3H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_Js9c3h_btn_cbet: {
    'AA':'mix:b33@58,x','AKs':'mix:b33@60,x','AQs':'x','AJs':'mix:x@67,b33','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'x','A4s':'x','A3s':'b33',
    'A2s':'b33','AKo':'mix:b33@48,x','KK':'b33','KQs':'mix:b33@62,x','KJs':'b33','KTs':'x',
    'K9s':'x','K8s':'b33','AQo':'x','KQo':'mix:b33@61,x','QQ':'b33','QJs':'b33',
    'QTs':'x','Q9s':'x','AJo':'mix:x@44,b33','KJo':'b33','QJo':'b33','JJ':'x',
    'JTs':'b33','J9s':'x','ATo':'b33','KTo':'x','QTo':'x','JTo':'b33',
    'TT':'x','T9s':'x','T8s':'x','A9o':'x','99':'x','98s':'x',
    '97s':'x','88':'x','87s':'x','77':'x','76s':'mix:x@51,b33','66':'x',
    '65s':'b33','55':'x','54s':'mix:b33@50,x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_Js9c3h_bb_facing_cbet_small: {
    'AKs':'r','AQs':'r','AJs':'r','ATs':'f','A9s':'r','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'r','A2s':'f',
    'AKo':'r','KQs':'r','KJs':'r','KTs':'r','K9s':'r','AQo':'f',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'r','KJo':'r','QJo':'r',
    'JTs':'r','J9s':'r','ATo':'f','KTo':'f','JTo':'r','TT':'r',
    'T9s':'r','99':'r','98s':'r','88':'mix:f@65,r','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'r','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_Js9c3h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'mix:c@52,f','A9s':'c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'c','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'f',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'f','JTo':'c','TT':'c',
    'T9s':'c','99':'c','98s':'c','88':'mix:f@57,c','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'c','22':'f',
  },

}
