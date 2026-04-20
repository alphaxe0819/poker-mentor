// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_Ah2d2c
// Generated: 2026-04-20T09:04:40.277Z
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

export const HU_40BB_SRP_AH2D2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_Ah2d2c_btn_cbet: {
    'AA':'mix:b33@62,x','AKs':'b33','AQs':'mix:b33@66,b50','AJs':'b33','ATs':'b33','A9s':'b33',
    'A8s':'mix:b33@65,x','A7s':'mix:b33@58,x','A6s':'mix:b33@55,x','A5s':'mix:b33@54,x','A4s':'mix:x@58,b33','A3s':'mix:x@69,b33',
    'A2s':'b33','AKo':'b33','KK':'x','KQs':'b33','KJs':'b33','KTs':'b33',
    'K9s':'b33','K8s':'mix:b33@61,x','K7s':'mix:x@54,b33','K6s':'mix:x@53,b33','K5s':'b33','K4s':'b33',
    'K3s':'mix:b33@68,x','K2s':'b33','AQo':'mix:b33@54,b50','KQo':'mix:b33@67,b50','QQ':'x','QJs':'b33',
    'QTs':'mix:b33@56,x','Q9s':'x','Q8s':'x','Q7s':'x','Q6s':'mix:x@64,b33','Q5s':'mix:x@64,b33',
    'Q4s':'mix:x@64,b33','Q3s':'x','Q2s':'mix:b33@67,b50','AJo':'b33','KJo':'b33','QJo':'mix:x@68,b33',
    'JJ':'x','JTs':'mix:x@49,b33','J9s':'x','J8s':'x','J7s':'x','J6s':'mix:x@66,b33',
    'J5s':'mix:x@55,b33','J4s':'mix:x@52,b33','J3s':'mix:x@55,b33','J2s':'b33','ATo':'mix:b33@65,x','KTo':'mix:b33@65,x',
    'QTo':'x','JTo':'x','TT':'x','T9s':'mix:x@57,b33','T8s':'mix:x@62,b33','T7s':'mix:x@61,b33',
    'T6s':'mix:x@54,b33','T5s':'mix:b33@53,x','T4s':'mix:x@49,b33','T3s':'mix:b33@47,x','T2s':'b33','A9o':'mix:b33@56,x',
    'K9o':'mix:x@55,b33','Q9o':'x','J9o':'mix:b33@53,x','T9o':'mix:b33@67,x','99':'x','98s':'mix:x@47,b33',
    '97s':'mix:b33@48,x','96s':'mix:b33@53,x','95s':'mix:b33@60,x','94s':'mix:b33@51,x','93s':'mix:b33@52,x','92s':'mix:b33@63,b50',
    'A8o':'mix:b33@51,x','K8o':'x','Q8o':'x','J8o':'mix:b33@53,x','T8o':'mix:b33@65,x','98o':'mix:b33@60,x',
    '88':'mix:b33@41,x','87s':'mix:b33@50,x','86s':'mix:b33@53,x','85s':'mix:b33@57,x','84s':'mix:b33@50,x','83s':'mix:b33@50,x',
    '82s':'mix:b33@69,b50','A7o':'mix:b33@50,x','K7o':'x','Q7o':'x','J7o':'mix:x@54,b33','T7o':'mix:b33@65,x',
    '97o':'mix:b33@61,x','87o':'mix:b33@60,x','77':'mix:b33@57,b50','76s':'mix:b33@48,b50','75s':'mix:b33@57,x','74s':'mix:b33@49,x',
    '73s':'mix:b33@51,x','72s':'mix:b33@58,b50','A6o':'mix:x@51,b33','K6o':'x','Q6o':'x','J6o':'mix:b33@60,x',
    'T6o':'b33','96o':'b33','86o':'b33','76o':'b33','66':'mix:b33@67,b50','65s':'mix:x@50,b33',
    '64s':'mix:x@50,b33','63s':'mix:b33@50,x','62s':'mix:b33@54,b50','A5o':'mix:x@51,b33','K5o':'x','Q5o':'x',
    'J5o':'mix:b33@63,x','T5o':'b33','95o':'mix:b33@61,b50','85o':'mix:b33@60,b50','75o':'b33','65o':'mix:x@54,b33',
    '55':'mix:b33@64,b50','54s':'b33','53s':'x','52s':'mix:b50@51,b33','K4o':'mix:x@63,b33','Q4o':'mix:b33@53,x',
    'J4o':'b33','74o':'mix:b33@58,b50','64o':'b33','54o':'mix:b33@52,x','44':'mix:b33@70,b50','43s':'mix:x@67,b33',
    '42s':'mix:b33@54,b50','K3o':'mix:x@53,b33','Q3o':'b33','J3o':'mix:b33@56,b50','33':'b33','32s':'mix:b33@65,b50',
    'K2o':'b33','Q2o':'mix:b33@69,b50','J2o':'b33','22':'b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah2d2c_bb_facing_cbet_small: {
    'A9s':'mix:r@64,c','A8s':'mix:r@52,c','A7s':'mix:r@50,c','A6s':'mix:c@51,r','A5s':'mix:r@57,c','A4s':'mix:c@50,r',
    'A3s':'mix:c@60,r','A2s':'mix:c@70,r','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'r','QJo':'c','JTs':'mix:c@59,r','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'mix:r@42,c','J4s':'mix:r@48,c','J3s':'mix:r@52,c','J2s':'r','ATo':'mix:r@52,c',
    'KTo':'c','QTo':'c','JTo':'mix:r@55,c','T9s':'mix:r@43,c','T8s':'mix:c@46,r','T7s':'mix:c@48,r',
    'T6s':'mix:c@50,r','T5s':'mix:r@54,c','T4s':'r','T3s':'r','T2s':'r','A9o':'mix:c@53,r',
    'K9o':'c','Q9o':'c','J9o':'f','T9o':'f','98s':'mix:r@48,c','97s':'mix:r@44,c',
    '95s':'r','94s':'r','93s':'r','92s':'r','A8o':'mix:c@67,r','K8o':'c',
    'Q8o':'mix:c@50,f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'mix:r@43,c',
    '84s':'r','83s':'r','82s':'r','A7o':'c','K7o':'c','Q7o':'mix:f@54,c',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'mix:r@41,c',
    '73s':'r','72s':'r','A6o':'c','K6o':'c','Q6o':'mix:f@64,c','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'r',
    'A5o':'mix:c@61,r','K5o':'c','Q5o':'mix:c@59,r','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'f','55':'mix:c@65,r','52s':'r','A4o':'mix:c@70,r','K4o':'c',
    'Q4o':'mix:r@45,c','84o':'f','74o':'f','44':'c','42s':'r','A3o':'c',
    'K3o':'c','Q3o':'mix:r@48,f','63o':'f','53o':'r','43o':'r','33':'c',
    '32s':'r','A2o':'mix:c@64,r','K2o':'c','Q2o':'r','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah2d2c_bb_facing_cbet_mid: {
    'A9s':'r','A8s':'mix:r@64,c','A7s':'mix:r@65,c','A6s':'r','A5s':'r','A4s':'r',
    'A3s':'r','A2s':'mix:r@58,c','K9s':'mix:c@54,r','K8s':'mix:r@52,c','K7s':'mix:c@63,r','K6s':'c',
    'K5s':'c','K4s':'mix:c@56,r','K3s':'mix:r@55,c','K2s':'r','QTs':'mix:c@64,r','Q9s':'mix:c@65,r',
    'Q8s':'mix:c@53,r','Q7s':'mix:c@55,r','Q6s':'c','Q5s':'mix:c@57,r','Q4s':'mix:c@48,r','Q3s':'mix:r@47,c',
    'Q2s':'r','QJo':'mix:r@56,c','JTs':'mix:c@48,r','J9s':'mix:c@55,r','J8s':'mix:c@53,r','J7s':'mix:c@51,f',
    'J6s':'mix:c@49,f','J5s':'mix:c@40,r','J4s':'mix:r@40,c','J3s':'mix:r@50,c','J2s':'r','ATo':'mix:r@68,c',
    'KTo':'r','QTo':'mix:r@61,c','JTo':'f','T9s':'mix:r@42,c','T8s':'mix:c@41,r','T7s':'mix:f@42,c',
    'T6s':'mix:f@53,c','T5s':'mix:r@44,f','T4s':'mix:r@47,f','T3s':'mix:r@62,f','T2s':'r','A9o':'mix:r@65,c',
    'K9o':'r','Q9o':'f','J9o':'f','T9o':'f','98s':'mix:c@41,r','97s':'mix:f@43,c',
    '95s':'mix:r@47,f','94s':'mix:r@50,f','93s':'mix:r@65,f','92s':'r','A8o':'mix:r@55,c','K8o':'r',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'mix:f@53,c',
    '84s':'mix:f@45,r','83s':'mix:r@57,f','82s':'r','A7o':'mix:r@55,c','K7o':'mix:r@49,c','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'mix:c@61,r','76s':'f',
    '73s':'mix:f@60,r','72s':'r','A6o':'mix:r@60,c','K6o':'mix:f@49,r','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'mix:r@59,c','62s':'r',
    'A5o':'mix:r@66,c','K5o':'mix:r@50,c','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'f','55':'mix:r@63,c','52s':'r','A4o':'mix:r@64,c','K4o':'r',
    'Q4o':'f','84o':'f','74o':'f','44':'mix:r@67,c','42s':'r','A3o':'mix:r@63,c',
    'K3o':'r','Q3o':'f','63o':'f','53o':'r','43o':'r','33':'mix:r@67,c',
    '32s':'r','A2o':'mix:r@63,c','K2o':'r','Q2o':'r','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah2d2c_bb_facing_cbet_large: {
    'A9s':'r','A8s':'r','A7s':'r','A6s':'r','A5s':'r','A4s':'r',
    'A3s':'r','A2s':'r','K9s':'mix:c@48,r','K8s':'mix:c@46,r','K7s':'mix:c@48,r','K6s':'mix:c@46,r',
    'K5s':'mix:r@51,c','K4s':'mix:r@60,c','K3s':'r','K2s':'r','QTs':'mix:c@60,r','Q9s':'mix:c@40,f',
    'Q8s':'mix:f@43,c','Q7s':'mix:f@51,c','Q6s':'mix:f@56,c','Q5s':'mix:f@43,r','Q4s':'mix:f@40,r','Q3s':'mix:r@43,f',
    'Q2s':'r','QJo':'mix:f@45,r','JTs':'mix:f@40,c','J9s':'mix:f@55,c','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'mix:f@60,r','J4s':'mix:f@56,r','J3s':'mix:f@53,r','J2s':'r','ATo':'r',
    'KTo':'r','QTo':'mix:f@56,r','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'mix:f@66,r','T4s':'mix:f@61,r','T3s':'mix:f@58,r','T2s':'r','A9o':'r',
    'K9o':'mix:r@54,f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'f',
    '95s':'mix:f@67,r','94s':'mix:f@61,r','93s':'mix:f@58,r','92s':'r','A8o':'mix:r@67,c','K8o':'mix:r@49,f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'f',
    '84s':'mix:f@65,r','83s':'mix:f@62,r','82s':'r','A7o':'mix:r@66,c','K7o':'mix:f@54,r','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'f',
    '73s':'mix:f@70,r','72s':'r','A6o':'mix:r@68,c','K6o':'mix:f@60,r','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'r',
    'A5o':'mix:r@69,c','K5o':'mix:r@54,f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'f','55':'mix:c@69,r','52s':'r','A4o':'mix:r@70,c','K4o':'mix:r@61,f',
    'Q4o':'mix:f@69,r','84o':'f','74o':'f','44':'mix:c@53,r','42s':'r','A3o':'r',
    'K3o':'mix:r@66,f','Q3o':'mix:f@65,r','63o':'f','53o':'mix:r@58,c','43o':'mix:r@59,c','33':'mix:r@61,c',
    '32s':'r','A2o':'r','K2o':'r','Q2o':'r','22':'mix:r@63,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah2d2c_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'f','K8s':'f','K7s':'f','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'c','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'f','J2s':'c','ATo':'c',
    'KTo':'mix:f@69,c','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'f','T2s':'c','A9o':'c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'f',
    '95s':'f','94s':'f','93s':'f','92s':'c','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'f',
    '84s':'f','83s':'f','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'f',
    '73s':'f','72s':'c','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'mix:c@57,f','62s':'c',
    'A5o':'c','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'f','55':'mix:f@54,c','52s':'c','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'f','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'c','A2o':'c','K2o':'c','Q2o':'c','22':'c',
  },

}
