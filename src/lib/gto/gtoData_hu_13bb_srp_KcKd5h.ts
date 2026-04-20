// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_KcKd5h
// Generated: 2026-04-16T12:32:42.275Z
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

export const HU_13BB_SRP_KCKD5H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_KcKd5h_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'b33','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'b33','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'x','KK':'x','KQs':'x','KJs':'mix:x@54,b33','KTs':'mix:x@63,b33',
    'K9s':'mix:x@67,b33','K8s':'mix:x@51,b33','AQo':'mix:b33@51,x','KQo':'x','QQ':'mix:b33@60,x','QJs':'x',
    'QTs':'x','Q9s':'x','AJo':'x','KJo':'mix:b33@58,x','QJo':'mix:x@63,b33','JJ':'mix:b33@68,x',
    'JTs':'x','J9s':'x','ATo':'x','KTo':'x','QTo':'mix:x@54,b33','JTo':'mix:b33@61,x',
    'TT':'b33','T9s':'mix:x@69,b33','T8s':'x','A9o':'mix:x@64,b33','99':'b33','98s':'x',
    '97s':'x','88':'b33','87s':'x','77':'b33','76s':'x','66':'x',
    '65s':'x','55':'x','54s':'x','44':'x','33':'x','22':'x',
  },

  // ──────────────────────────────
  hu_13bb_srp_KcKd5h_bb_facing_cbet_small: {
    'AKs':'mix:c@57,r','AQs':'r','AJs':'r','ATs':'c','A9s':'mix:c@37,r','A8s':'mix:r@70,f',
    'A7s':'f','A6s':'f','A5s':'r','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'mix:c@50,r','KQs':'mix:c@57,r','KJs':'r','KTs':'r','K9s':'r','AQo':'r',
    'KQo':'mix:r@59,c','QJs':'mix:c@57,r','QTs':'mix:f@45,c','AJo':'mix:f@39,c','KJo':'r','QJo':'f',
    'JTs':'r','J9s':'f','ATo':'f','KTo':'r','JTo':'f','TT':'r',
    'T9s':'f','99':'r','98s':'f','88':'r','87s':'f','77':'r',
    '76s':'f','66':'r','65s':'mix:r@63,c','55':'mix:r@61,c','54s':'r','44':'f',
    '33':'f','22':'f',
  },

  // ──────────────────────────────
  hu_13bb_srp_KcKd5h_bb_facing_cbet_mid: {
    'AKs':'c','AQs':'mix:f@51,c','AJs':'mix:c@52,f','ATs':'mix:c@53,f','A9s':'mix:f@67,c','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'c','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'c','K9s':'c','AQo':'mix:f@54,c',
    'KQo':'c','QJs':'f','QTs':'f','AJo':'mix:c@53,f','KJo':'c','QJo':'f',
    'JTs':'f','J9s':'f','ATo':'mix:f@57,c','KTo':'c','JTo':'f','TT':'c',
    'T9s':'f','99':'c','98s':'f','88':'c','87s':'f','77':'c',
    '76s':'f','66':'c','65s':'mix:c@63,f','55':'c','54s':'mix:c@55,f','44':'mix:f@51,c',
    '33':'f','22':'f',
  },

}
