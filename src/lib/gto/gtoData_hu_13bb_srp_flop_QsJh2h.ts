// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_13bb_srp_flop_QsJh2h
// Generated: 2026-04-12T04:32:30.107Z
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

export const HU_13BB_SRP_FLOP_QSJH2H: GtoDatabase = {

  // ──────────────────────────────
  hu_13bb_srp_flop_QsJh2h_btn_cbet: {
    'AA':'b33','AKs':'mix:x@56,b33','AQs':'mix:b33@34,x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:x@55,b33','A4s':'mix:b33@55,x','A3s':'mix:b33@59,b50',
    'A2s':'mix:b33@60,b50','AKo':'b33','KK':'b33','KQs':'mix:b50@45,x','KJs':'x','KTs':'mix:x@64,b33',
    'K9s':'mix:x@69,b33','K8s':'b33','AQo':'b33','KQo':'mix:b33@63,b50','QQ':'x','QJs':'b33',
    'QTs':'mix:b33@33,b50','Q9s':'x','AJo':'x','KJo':'mix:x@52,b33','QJo':'b33','JJ':'x',
    'JTs':'x','J9s':'x','ATo':'mix:x@69,b33','KTo':'mix:x@60,b33','QTo':'b33','JTo':'x',
    'TT':'x','T9s':'x','T8s':'x','A9o':'mix:x@61,b33','99':'x','98s':'x',
    '97s':'mix:x@62,b33','88':'x','87s':'mix:x@68,b33','77':'x','76s':'x','66':'x',
    '65s':'mix:x@50,b33','55':'x','54s':'mix:x@57,b33','44':'x','33':'mix:x@55,b33','22':'mix:b50@51,b33',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_QsJh2h_bb_facing_cbet_small: {
    'AKs':'mix:c@50,r','AQs':'mix:r@67,c','AJs':'c','ATs':'c','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'c',
    'AKo':'r','KQs':'r','KJs':'c','KTs':'mix:r@57,c','K9s':'mix:f@50,c','AQo':'r',
    'KQo':'r','QJs':'r','QTs':'mix:r@67,c','AJo':'c','KJo':'mix:c@58,r','QJo':'r',
    'JTs':'c','J9s':'c','ATo':'c','KTo':'mix:c@62,r','JTo':'c','TT':'c',
    'T9s':'c','99':'mix:f@57,c','98s':'f','88':'mix:c@50,f','87s':'f','77':'mix:f@50,c',
    '76s':'f','66':'mix:f@52,c','65s':'f','55':'mix:f@70,c','54s':'f','44':'f',
    '33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_QsJh2h_bb_facing_cbet_mid: {
    'AKs':'mix:r@63,c','AQs':'r','AJs':'c','ATs':'mix:c@52,f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'mix:c@52,r',
    'AKo':'r','KQs':'r','KJs':'c','KTs':'mix:c@51,r','K9s':'f','AQo':'mix:r@69,c',
    'KQo':'r','QJs':'r','QTs':'r','AJo':'c','KJo':'c','QJo':'r',
    'JTs':'mix:c@60,r','J9s':'c','ATo':'mix:c@50,f','KTo':'mix:r@56,c','JTo':'mix:c@60,r','TT':'mix:c@46,f',
    'T9s':'c','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'r',
  },

  // ──────────────────────────────
  hu_13bb_srp_flop_QsJh2h_bb_facing_cbet_large: {
    'AKs':'c','AQs':'c','AJs':'c','ATs':'f','A9s':'f','A8s':'f',
    'A7s':'f','A6s':'f','A5s':'f','A4s':'f','A3s':'f','A2s':'f',
    'AKo':'c','KQs':'c','KJs':'c','KTs':'mix:f@50,c','K9s':'f','AQo':'c',
    'KQo':'c','QJs':'c','QTs':'c','AJo':'c','KJo':'c','QJo':'c',
    'JTs':'c','J9s':'c','ATo':'f','KTo':'mix:f@56,c','JTo':'c','TT':'c',
    'T9s':'f','99':'f','98s':'f','88':'f','87s':'f','77':'f',
    '76s':'f','66':'f','65s':'f','55':'f','54s':'f','44':'f',
    '33':'f','22':'c',
  },

}
