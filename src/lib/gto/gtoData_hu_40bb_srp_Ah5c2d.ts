// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_Ah5c2d
// Generated: 2026-04-20T09:33:43.842Z
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

export const HU_40BB_SRP_AH5C2D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_Ah5c2d_btn_cbet: {
    'AA':'mix:b33@66,b50','AKs':'mix:b33@55,b50','AQs':'mix:b33@59,b50','AJs':'mix:b33@53,b50','ATs':'mix:b33@52,b50','A9s':'mix:b33@56,b50',
    'A8s':'mix:b33@60,b50','A7s':'mix:b33@55,b50','A6s':'mix:b33@53,b50','A5s':'mix:b33@64,b50','A4s':'mix:b33@62,b50','A3s':'mix:b33@53,b50',
    'A2s':'mix:b33@56,b50','AKo':'mix:b33@47,b50','KK':'x','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'x','K6s':'x','K5s':'mix:b33@60,b50','K4s':'mix:x@50,b33',
    'K3s':'mix:x@50,b33','K2s':'b33','AQo':'mix:b33@43,b50','KQo':'mix:b33@57,x','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'x','Q8s':'x','Q7s':'x','Q6s':'x','Q5s':'mix:b33@66,b50',
    'Q4s':'mix:b33@53,x','Q3s':'mix:b33@53,x','Q2s':'b33','AJo':'mix:b50@49,b33','KJo':'mix:x@54,b33','QJo':'x',
    'JJ':'x','JTs':'x','J9s':'x','J8s':'x','J7s':'x','J6s':'x',
    'J5s':'mix:b33@39,b50','J4s':'b33','J3s':'mix:b33@50,x','J2s':'mix:b33@66,x','ATo':'mix:b50@44,b33','KTo':'mix:x@67,b33',
    'QTo':'x','JTo':'mix:b50@39,b33','TT':'x','T9s':'x','T8s':'x','T7s':'x',
    'T6s':'x','T5s':'mix:b33@42,b50','T4s':'b33','T3s':'b33','T2s':'mix:x@65,b33','A9o':'mix:b33@50,b50',
    'K9o':'x','Q9o':'x','J9o':'mix:b33@44,x','T9o':'mix:b33@44,x','99':'x','98s':'x',
    '97s':'x','96s':'x','95s':'mix:b33@52,b50','94s':'b33','93s':'mix:b33@55,b50','92s':'mix:x@70,b33',
    'A8o':'mix:b33@52,x','K8o':'x','Q8o':'mix:x@45,b33','J8o':'mix:b33@56,b50','T8o':'mix:b33@53,b50','98o':'mix:b33@40,b50',
    '88':'mix:x@54,b33','87s':'x','86s':'mix:x@52,b33','85s':'mix:b33@49,b50','84s':'mix:b33@63,x','83s':'b33',
    '82s':'x','A7o':'mix:x@49,b33','K7o':'mix:x@59,b33','Q7o':'mix:b33@43,b50','J7o':'mix:b33@58,b50','T7o':'mix:b33@56,b50',
    '97o':'mix:b33@52,b50','87o':'mix:b50@39,b33','77':'mix:b33@47,b50','76s':'x','75s':'mix:x@50,b33','74s':'b33',
    '73s':'mix:b33@63,x','72s':'x','A6o':'mix:x@50,b33','K6o':'mix:x@40,b33','Q6o':'mix:b33@60,b50','J6o':'mix:b33@63,b50',
    'T6o':'mix:b33@64,b50','96o':'mix:b33@59,b50','86o':'mix:x@38,b50','76o':'x','66':'mix:b50@52,b33','65s':'mix:b33@64,x',
    '64s':'mix:b33@70,x','63s':'mix:b33@61,x','62s':'x','A5o':'b33','K5o':'mix:b33@61,b50','Q5o':'mix:b33@54,b50',
    'J5o':'mix:b50@38,b33','T5o':'x','95o':'x','85o':'x','75o':'x','65o':'x',
    '55':'mix:b33@46,x','54s':'mix:b33@43,b50','53s':'mix:b33@43,b50','52s':'mix:b33@63,b50','K4o':'x','Q4o':'mix:x@34,b50',
    'J4o':'b50','74o':'mix:x@53,b33','64o':'x','54o':'mix:b33@44,b50','44':'mix:b33@43,x','43s':'mix:b33@64,b50',
    '42s':'mix:x@65,b33','K3o':'x','Q3o':'mix:x@50,b33','J3o':'mix:x@37,b33','33':'mix:b33@44,x','32s':'mix:x@49,b33',
    'K2o':'mix:x@34,b33','Q2o':'x','J2o':'x','22':'mix:b33@54,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah5c2d_bb_facing_cbet_small: {
    'A9s':'r','A8s':'r','A7s':'mix:c@53,r','A6s':'mix:c@68,r','A5s':'r','A4s':'mix:r@66,c',
    'A3s':'r','A2s':'mix:r@58,c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'r','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'r','Q4s':'c','Q3s':'mix:c@67,r',
    'Q2s':'c','QJo':'mix:c@65,f','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'mix:c@43,r','J5s':'mix:c@67,r','J4s':'c','J3s':'mix:c@59,r','J2s':'c','ATo':'r',
    'KTo':'c','QTo':'f','JTo':'f','T9s':'mix:r@46,c','T8s':'mix:r@38,c','T7s':'mix:c@43,r',
    'T6s':'mix:r@59,f','T5s':'c','T4s':'mix:r@67,c','T3s':'r','T2s':'c','A9o':'mix:r@68,c',
    'K9o':'mix:c@64,f','Q9o':'f','J9o':'f','T9o':'f','98s':'mix:r@69,f','97s':'mix:r@65,f',
    '95s':'c','94s':'r','93s':'r','92s':'c','A8o':'mix:c@53,r','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'r',
    '84s':'mix:r@61,c','83s':'r','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'r',
    '73s':'mix:c@54,r','72s':'c','A6o':'c','K6o':'c','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:r@38,c','76o':'mix:f@38,c','66':'mix:c@68,r','62s':'c',
    'A5o':'r','K5o':'r','Q5o':'mix:c@56,r','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'mix:r@56,c','52s':'r','A4o':'mix:c@61,r','K4o':'mix:c@64,r',
    'Q4o':'mix:r@61,c','84o':'r','74o':'mix:r@69,c','44':'mix:c@61,r','42s':'c','A3o':'mix:r@55,c',
    'K3o':'mix:r@51,c','Q3o':'r','63o':'mix:c@59,r','53o':'r','43o':'r','33':'c',
    '32s':'c','A2o':'mix:r@58,c','K2o':'mix:c@53,r','Q2o':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah5c2d_bb_facing_cbet_mid: {
    'A9s':'mix:r@66,c','A8s':'c','A7s':'c','A6s':'c','A5s':'r','A4s':'mix:r@70,c',
    'A3s':'r','A2s':'r','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'r','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'mix:r@54,c','Q4s':'c','Q3s':'c',
    'Q2s':'c','QJo':'f','JTs':'c','J9s':'c','J8s':'mix:f@53,c','J7s':'f',
    'J6s':'mix:c@50,f','J5s':'c','J4s':'c','J3s':'c','J2s':'c','ATo':'r',
    'KTo':'c','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'c','T3s':'mix:r@54,c','T2s':'c','A9o':'mix:r@51,c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'mix:f@49,r','97s':'f',
    '95s':'c','94s':'mix:c@53,r','93s':'r','92s':'c','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'mix:c@59,f',
    '84s':'c','83s':'mix:c@57,r','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'mix:r@39,c',
    '73s':'c','72s':'c','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'c',
    'A5o':'r','K5o':'r','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'c','52s':'r','A4o':'mix:r@57,c','K4o':'c',
    'Q4o':'mix:r@69,c','84o':'r','74o':'mix:r@65,c','44':'c','42s':'c','A3o':'r',
    'K3o':'mix:r@56,c','Q3o':'r','63o':'mix:c@65,r','53o':'r','43o':'r','33':'c',
    '32s':'c','A2o':'r','K2o':'mix:c@51,r','Q2o':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah5c2d_bb_facing_cbet_large: {
    'A9s':'mix:c@59,r','A8s':'c','A7s':'c','A6s':'c','A5s':'r','A4s':'mix:r@69,c',
    'A3s':'r','A2s':'r','K9s':'mix:c@50,f','K8s':'mix:f@52,c','K7s':'mix:f@62,c','K6s':'c',
    'K5s':'r','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'c','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'c','J3s':'c','J2s':'c','ATo':'r',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'c','T3s':'c','T2s':'c','A9o':'mix:c@63,r',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'f',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'f',
    '84s':'c','83s':'c','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'f',
    '73s':'c','72s':'c','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'c',
    'A5o':'r','K5o':'r','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'c','52s':'r','A4o':'mix:r@68,c','K4o':'mix:c@67,r',
    'Q4o':'mix:r@59,c','84o':'r','74o':'mix:r@45,c','44':'c','42s':'c','A3o':'r',
    'K3o':'mix:c@59,r','Q3o':'mix:r@68,c','63o':'c','53o':'r','43o':'mix:r@65,c','33':'c',
    '32s':'c','A2o':'r','K2o':'c','Q2o':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah5c2d_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'f','K8s':'f','K7s':'f','K6s':'f',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'f','J3s':'f','J2s':'f','ATo':'c',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'f',
    '95s':'c','94s':'f','93s':'f','92s':'f','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'f',
    '84s':'f','83s':'f','82s':'f','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'f',
    '73s':'f','72s':'f','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'mix:c@69,f',
    '85o':'mix:c@59,f','75o':'mix:f@51,c','55':'c','52s':'c','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'f','42s':'mix:f@52,c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'f','53o':'c','43o':'c','33':'f',
    '32s':'mix:f@53,c','A2o':'c','K2o':'f','Q2o':'f','22':'c',
  },

}
