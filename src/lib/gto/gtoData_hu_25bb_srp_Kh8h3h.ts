// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_25bb_srp_Kh8h3h
// Generated: 2026-04-20T16:01:49.221Z
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

export const HU_25BB_SRP_KH8H3H: GtoDatabase = {

  // ──────────────────────────────
  hu_25bb_srp_Kh8h3h_btn_cbet: {
    'A9s':'mix:b33@62,x','AKo':'b33','KK':'b33','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'b33','K7s':'mix:x@68,b33','K6s':'x','AQo':'mix:b33@65,x','KQo':'b33',
    'QQ':'mix:b33@50,x','QJs':'x','QTs':'x','Q9s':'x','Q8s':'mix:b33@53,x','Q6s':'x',
    'Q5s':'mix:b33@51,x','Q4s':'b33','Q3s':'mix:b33@52,x','Q2s':'b33','AJo':'b33','KJo':'b33',
    'QJo':'x','JJ':'mix:b33@53,x','JTs':'b33','J9s':'b33','J8s':'mix:b33@66,x','J6s':'mix:x@54,b33',
    'J5s':'b33','J4s':'b33','J3s':'mix:b33@66,x','J2s':'b33','ATo':'b33','KTo':'b33',
    'QTo':'x','JTo':'mix:x@52,b33','TT':'mix:b33@63,x','T9s':'b33','T8s':'mix:b33@66,x','T6s':'mix:b33@58,x',
    'T5s':'b33','T4s':'b33','T3s':'mix:b33@66,x','T2s':'b33','A9o':'mix:b33@48,x','99':'b33',
    '98s':'mix:x@52,b33','97s':'b33','96s':'mix:b33@66,x','95s':'b33','94s':'b33','93s':'mix:b33@53,x',
    'A8o':'b33','K8o':'b33','Q8o':'mix:b33@56,x','J8o':'mix:b33@70,x','T8o':'mix:b33@67,x','98o':'mix:b33@53,x',
    '88':'b33','87s':'mix:b33@66,x','86s':'mix:b33@59,x','85s':'mix:b33@67,x','84s':'mix:b33@67,x','83s':'b33',
    'K7o':'mix:x@54,b33','Q7o':'x','J7o':'mix:x@59,b33','T7o':'mix:x@52,b33','97o':'mix:x@56,b33','87o':'mix:b33@65,x',
    '77':'x','76s':'mix:b33@68,x','75s':'b33','74s':'b33','73s':'mix:b33@54,x','K6o':'mix:x@59,b33',
    'Q6o':'x','J6o':'mix:x@63,b33','T6o':'mix:b33@55,x','96o':'mix:b33@50,x','86o':'mix:b33@51,x','76o':'mix:b33@50,x',
    '66':'x','65s':'b33','63s':'mix:b33@56,x','K5o':'mix:x@57,b33','Q5o':'mix:x@66,b33','55':'mix:x@51,b100',
    'K4o':'mix:x@61,b33','Q4o':'mix:b33@58,x','K3o':'b33','Q3o':'mix:b33@51,x','K2o':'mix:x@64,b33','Q2o':'b33',
  },

  // ──────────────────────────────
  hu_25bb_srp_Kh8h3h_bb_facing_cbet_small: {
    'A5s':'c','A4s':'c','A3s':'c','A2s':'mix:c@68,r','K9s':'mix:rbig@60,c','K8s':'mix:rbig@65,c',
    'K7s':'c','K6s':'c','K5s':'c','K4s':'c','K3s':'c','K2s':'c',
    'QJs':'c','QTs':'c','Q9s':'mix:f@61,c','Q8s':'c','Q7s':'f','Q6s':'f',
    'Q5s':'f','Q4s':'f','Q3s':'c','Q2s':'f','KJo':'mix:rbig@55,r','QJo':'c',
    'JTs':'mix:c@50,f','J9s':'f','J8s':'c','J7s':'f','J6s':'f','J5s':'f',
    'J4s':'f','J3s':'c','J2s':'f','KTo':'mix:rbig@66,r','QTo':'c','JTo':'mix:c@48,f',
    'T9s':'f','T8s':'c','T7s':'f','T6s':'f','T5s':'f','T4s':'f',
    'T3s':'c','T2s':'f','K9o':'rbig','Q9o':'mix:c@54,f','J9o':'mix:f@50,c','T9o':'mix:f@50,c',
    '98s':'c','97s':'f','96s':'f','95s':'f','94s':'f','93s':'c',
    '92s':'f','K8o':'mix:rbig@59,c','Q8o':'c','J8o':'c','T8o':'c','98o':'mix:c@67,rbig',
    '87s':'c','86s':'c','85s':'c','84s':'c','83s':'rbig','82s':'c',
    'K7o':'mix:c@66,rbig','Q7o':'mix:f@50,c','J7o':'mix:f@50,c','T7o':'mix:f@50,c','97o':'mix:f@50,c','87o':'c',
    '76s':'f','75s':'f','73s':'c','K6o':'mix:c@67,rbig','Q6o':'mix:f@50,c','J6o':'mix:f@50,c',
    'T6o':'mix:f@50,c','96o':'mix:f@50,c','86o':'mix:c@67,rbig','76o':'mix:f@50,c','65s':'f','64s':'f',
    '62s':'f','A5o':'c','K5o':'mix:c@67,rbig','Q5o':'mix:f@50,c','J5o':'mix:f@50,c','85o':'mix:c@67,rbig',
    '54s':'f','52s':'f','A4o':'c','K4o':'mix:c@67,rbig','Q4o':'mix:f@50,c','A3o':'c',
    'K3o':'c','Q3o':'mix:c@67,rbig','32s':'c','A2o':'c','K2o':'mix:c@67,rbig','Q2o':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_Kh8h3h_bb_facing_cbet_mid: {
    'A5s':'f','A4s':'f','A3s':'mix:c@59,f','A2s':'f','K9s':'c','K8s':'r',
    'K7s':'c','K6s':'c','K5s':'c','K4s':'c','K3s':'r','K2s':'c',
    'QJs':'f','QTs':'f','Q9s':'f','Q8s':'mix:c@70,f','Q7s':'f','Q6s':'f',
    'Q5s':'f','Q4s':'f','Q3s':'f','Q2s':'f','KJo':'mix:rbig@58,r','QJo':'mix:f@50,c',
    'JTs':'f','J9s':'f','J8s':'mix:c@52,f','J7s':'f','J6s':'f','J5s':'f',
    'J4s':'f','J3s':'f','J2s':'f','KTo':'mix:rbig@46,c','QTo':'mix:f@50,c','JTo':'mix:f@50,c',
    'T9s':'f','T8s':'mix:f@50,c','T7s':'f','T6s':'f','T5s':'f','T4s':'f',
    'T3s':'f','T2s':'f','K9o':'mix:c@51,rbig','Q9o':'mix:f@54,c','J9o':'mix:f@54,c','T9o':'mix:f@53,c',
    '98s':'mix:c@51,f','97s':'f','96s':'f','95s':'f','94s':'f','93s':'f',
    '92s':'f','K8o':'r','Q8o':'c','J8o':'mix:c@38,f','T8o':'mix:c@33,f','98o':'mix:c@35,f',
    '87s':'f','86s':'f','85s':'mix:f@59,c','84s':'mix:f@64,c','83s':'mix:r@70,rbig','82s':'mix:f@67,c',
    'K7o':'mix:c@61,rbig','Q7o':'mix:f@59,c','J7o':'mix:f@61,c','T7o':'mix:f@58,c','97o':'mix:f@60,c','87o':'f',
    '76s':'f','75s':'f','73s':'f','K6o':'mix:c@61,rbig','Q6o':'mix:f@65,c','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','65s':'f','64s':'f',
    '62s':'f','A5o':'mix:f@50,c','K5o':'mix:c@57,rbig','Q5o':'f','J5o':'f','85o':'f',
    '54s':'f','52s':'f','A4o':'mix:f@50,c','K4o':'mix:c@54,rbig','Q4o':'f','A3o':'mix:c@40,f',
    'K3o':'r','Q3o':'f','32s':'f','A2o':'mix:f@54,c','K2o':'mix:c@58,rbig','Q2o':'f',
  },

  // ──────────────────────────────
  hu_25bb_srp_Kh8h3h_bb_facing_cbet_large: {
    'A5s':'f','A4s':'f','A3s':'f','A2s':'f','K9s':'c','K8s':'c',
    'K7s':'c','K6s':'c','K5s':'mix:f@57,c','K4s':'mix:c@60,f','K3s':'c','K2s':'mix:f@59,c',
    'QJs':'f','QTs':'f','Q9s':'f','Q8s':'f','Q7s':'f','Q6s':'f',
    'Q5s':'f','Q4s':'f','Q3s':'f','Q2s':'f','KJo':'c','QJo':'mix:f@50,c',
    'JTs':'f','J9s':'f','J8s':'f','J7s':'f','J6s':'f','J5s':'f',
    'J4s':'f','J3s':'f','J2s':'f','KTo':'c','QTo':'mix:f@50,c','JTo':'mix:f@50,c',
    'T9s':'f','T8s':'f','T7s':'f','T6s':'f','T5s':'f','T4s':'f',
    'T3s':'f','T2s':'f','K9o':'c','Q9o':'f','J9o':'mix:f@67,c','T9o':'mix:f@55,c',
    '98s':'f','97s':'f','96s':'f','95s':'f','94s':'f','93s':'f',
    '92s':'f','K8o':'c','Q8o':'mix:f@67,c','J8o':'mix:f@67,c','T8o':'mix:f@67,c','98o':'mix:f@67,c',
    '87s':'f','86s':'f','85s':'f','84s':'f','83s':'c','82s':'f',
    'K7o':'c','Q7o':'f','J7o':'f','T7o':'f','97o':'f','87o':'mix:f@67,c',
    '76s':'f','75s':'f','73s':'f','K6o':'c','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:f@67,c','76o':'f','65s':'f','64s':'f',
    '62s':'f','A5o':'f','K5o':'mix:c@66,f','Q5o':'f','J5o':'f','85o':'mix:f@67,c',
    '54s':'f','52s':'f','A4o':'f','K4o':'c','Q4o':'f','A3o':'mix:f@67,c',
    'K3o':'c','Q3o':'mix:f@67,c','32s':'f','A2o':'f','K2o':'mix:c@68,f','Q2o':'f',
  },

}
