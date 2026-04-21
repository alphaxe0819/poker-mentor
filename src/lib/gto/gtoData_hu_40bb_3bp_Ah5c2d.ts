// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_3bp_Ah5c2d
// Generated: 2026-04-21T06:33:44.167Z
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

export const HU_40BB_3BP_AH5C2D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_3bp_Ah5c2d_btn_cbet: {
    'ATs':'x','A9s':'x','A8s':'x','A7s':'x','A6s':'x','A5s':'x',
    'A4s':'x','A3s':'x','A2s':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','KQo':'x','QJs':'x','QTs':'x','Q9s':'x',
    'Q8s':'x','Q7s':'x','Q6s':'x','AJo':'x','KJo':'x','QJo':'x',
    'JTs':'x','J9s':'x','J8s':'x','J7s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','T9s':'x','T8s':'x','T7s':'x','A9o':'x',
    'K9o':'x','Q9o':'x','J9o':'x','98s':'x','97s':'x','A8o':'x',
    '87s':'x','86s':'x','76s':'x','75s':'x','65s':'x','64s':'x',
    '54s':'x',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah5c2d_bb_facing_cbet_small: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'c','KQs':'f','KJs':'f','KTs':'f','AQo':'c','KQo':'f',
    'QQ':'c','QJs':'f','AJo':'c','KJo':'f','JJ':'c','TT':'c',
    '99':'c','96s':'mix:f@65,c','86s':'mix:f@47,c','85s':'c','75s':'c','74s':'c',
    '65s':'c','64s':'c','63s':'c','65o':'c','54s':'c','53s':'c',
    '64o':'c','54o':'c','43s':'c',
  },

  // ──────────────────────────────
  hu_40bb_3bp_Ah5c2d_bb_facing_cbet_mid: {
    'AA':'c','AKs':'c','AQs':'c','AJs':'c','ATs':'c','AKo':'c',
    'KK':'mix:f@65,c','KQs':'f','KJs':'f','KTs':'f','AQo':'c','KQo':'f',
    'QQ':'mix:f@69,c','QJs':'f','AJo':'c','KJo':'f','JJ':'f','TT':'f',
    '99':'f','96s':'f','86s':'f','85s':'mix:f@56,c','75s':'mix:f@55,c','74s':'f',
    '65s':'mix:f@53,c','64s':'f','63s':'f','65o':'mix:f@55,c','54s':'c','53s':'c',
    '64o':'f','54o':'c','43s':'c',
  },

}
