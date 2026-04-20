// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_8s5h2c
// Generated: 2026-04-20T07:19:41.324Z
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

export const HU_40BB_SRP_8S5H2C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_8s5h2c_btn_cbet: {
    'AA':'mix:b50@38,b33','AKs':'mix:b100@35,b33','AQs':'mix:x@28,b33','AJs':'mix:b100@29,b33','ATs':'mix:x@35,b33','A9s':'mix:x@61,b100',
    'A8s':'b100','A7s':'x','A6s':'x','A5s':'mix:b100@48,b50','A4s':'x','A3s':'x',
    'A2s':'b100','AKo':'mix:x@33,b50','KK':'mix:b100@53,b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'mix:b100@57,b50','K7s':'x','K6s':'x','K5s':'mix:b100@31,b50','K4s':'x',
    'K3s':'x','K2s':'b100','AQo':'x','KQo':'x','QQ':'mix:b100@61,b50','QJs':'mix:b33@32,x',
    'QTs':'x','Q9s':'x','Q8s':'mix:b100@59,b50','Q7s':'x','Q6s':'x','Q5s':'mix:b100@34,b50',
    'Q4s':'x','Q3s':'x','Q2s':'mix:x@36,b100','AJo':'x','KJo':'mix:x@50,b100','QJo':'x',
    'JJ':'mix:b100@69,b50','JTs':'mix:b33@42,b100','J9s':'b100','J8s':'mix:b100@45,b33','J7s':'x','J6s':'mix:x@67,b100',
    'J5s':'mix:b100@40,b50','J4s':'mix:x@61,b100','J3s':'x','J2s':'x','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'x','TT':'b100','T9s':'mix:b100@41,b50','T8s':'mix:b50@41,b33','T7s':'x',
    'T6s':'mix:x@60,b100','T5s':'mix:b100@34,b50','T4s':'mix:b100@52,x','T3s':'mix:x@61,b100','T2s':'x','A9o':'x',
    'K9o':'x','Q9o':'b100','J9o':'mix:x@56,b100','T9o':'x','99':'b100','98s':'mix:b100@46,b50',
    '97s':'mix:b33@37,b100','96s':'mix:b100@53,b50','95s':'mix:x@29,b50','94s':'mix:b50@43,b100','93s':'mix:b100@33,b50','92s':'x',
    'A8o':'b100','K8o':'mix:b100@53,b50','Q8o':'mix:b100@59,b50','J8o':'mix:b100@56,b50','T8o':'mix:x@39,b100','98o':'mix:x@42,b100',
    '88':'b33','87s':'mix:b50@40,b100','86s':'mix:b100@53,b50','85s':'mix:b50@41,b100','84s':'mix:b50@31,x','83s':'x',
    '82s':'mix:b50@52,b33','A7o':'mix:x@61,b100','K7o':'x','Q7o':'x','J7o':'mix:b100@44,b50','T7o':'b100',
    '97o':'mix:x@38,b50','87o':'b100','77':'x','76s':'mix:b33@59,b100','75s':'mix:x@57,b33','74s':'x',
    '73s':'mix:b50@46,b33','72s':'x','A6o':'mix:b100@45,x','K6o':'mix:x@36,b100','Q6o':'mix:b100@42,b50','J6o':'mix:b100@41,b50',
    'T6o':'mix:b100@45,b50','96o':'mix:x@44,b100','86o':'b100','76o':'x','66':'mix:x@55,b100','65s':'mix:x@32,b33',
    '64s':'b33','63s':'x','62s':'x','A5o':'mix:b100@50,b50','K5o':'x','Q5o':'x',
    'J5o':'mix:x@48,b100','T5o':'x','95o':'x','85o':'mix:b100@49,b50','75o':'x','65o':'x',
    '55':'mix:b33@51,b50','54s':'mix:b100@34,b33','53s':'x','52s':'mix:b100@51,b50','K4o':'mix:b100@35,b50','Q4o':'mix:b50@36,b100',
    'J4o':'mix:b100@35,b50','74o':'x','64o':'x','54o':'x','44':'x','43s':'x',
    '42s':'x','K3o':'x','Q3o':'b50','J3o':'x','33':'x','32s':'x',
    'K2o':'mix:b100@44,x','Q2o':'x','J2o':'x','22':'mix:b33@51,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s5h2c_bb_facing_cbet_small: {
    'A9s':'c','A8s':'r','A7s':'c','A6s':'c','A5s':'mix:r@59,c','A4s':'mix:c@68,r',
    'A3s':'c','A2s':'mix:c@70,r','K9s':'c','K8s':'r','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'mix:c@48,r','K3s':'mix:c@41,r','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'r','Q7s':'c','Q6s':'mix:c@46,r','Q5s':'c','Q4s':'mix:r@45,c','Q3s':'f',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'c','J8s':'r','J7s':'mix:r@40,c',
    'J6s':'mix:r@44,c','J5s':'c','J4s':'f','J3s':'f','J2s':'c','ATo':'c',
    'KTo':'c','QTo':'mix:f@43,c','JTo':'c','T9s':'r','T8s':'mix:r@68,c','T7s':'r',
    'T6s':'r','T5s':'c','T4s':'f','T3s':'f','T2s':'c','A9o':'c',
    'K9o':'mix:c@62,f','Q9o':'f','J9o':'mix:c@52,f','T9o':'f','98s':'r','97s':'mix:c@55,r',
    '95s':'c','94s':'f','93s':'f','92s':'c','A8o':'r','K8o':'r',
    'Q8o':'r','J8o':'r','T8o':'mix:c@55,r','98o':'mix:c@59,r','88':'mix:c@69,r','87s':'mix:r@55,c',
    '84s':'mix:c@58,r','83s':'c','82s':'c','A7o':'mix:c@64,f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'mix:r@53,c','87o':'c','77':'c','76s':'r',
    '73s':'f','72s':'c','A6o':'mix:c@54,f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'mix:c@64,r','86o':'c','76o':'r','66':'c','62s':'c',
    'A5o':'mix:r@66,c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'r','75o':'c','55':'mix:c@57,r','52s':'r','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'c','74o':'c','44':'c','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'mix:c@67,r','53o':'c','43o':'mix:c@62,r','33':'c',
    '32s':'c','A2o':'mix:c@55,r','K2o':'c','Q2o':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s5h2c_bb_facing_cbet_mid: {
    'A9s':'c','A8s':'r','A7s':'c','A6s':'c','A5s':'c','A4s':'mix:c@63,r',
    'A3s':'mix:c@53,r','A2s':'c','K9s':'c','K8s':'r','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'mix:c@50,r','K3s':'mix:f@67,r','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'r','Q7s':'c','Q6s':'mix:r@51,f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'c','J8s':'mix:r@60,c','J7s':'mix:c@56,f',
    'J6s':'mix:f@60,r','J5s':'c','J4s':'f','J3s':'f','J2s':'c','ATo':'c',
    'KTo':'c','QTo':'f','JTo':'mix:c@63,f','T9s':'r','T8s':'mix:c@57,r','T7s':'r',
    'T6s':'mix:r@62,f','T5s':'c','T4s':'f','T3s':'f','T2s':'c','A9o':'mix:f@34,c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'mix:r@54,c','97s':'c',
    '95s':'c','94s':'f','93s':'f','92s':'c','A8o':'r','K8o':'r',
    'Q8o':'r','J8o':'mix:r@59,c','T8o':'mix:c@61,r','98o':'mix:c@57,r','88':'c','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'mix:c@61,r','87o':'c','77':'c','76s':'mix:c@70,r',
    '73s':'f','72s':'c','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'c','76o':'c','66':'c','62s':'c',
    'A5o':'r','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'r','75o':'c','55':'c','52s':'r','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'c','74o':'mix:c@63,r','44':'c','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'mix:r@65,c','53o':'c','43o':'c','33':'c',
    '32s':'c','A2o':'mix:r@56,c','K2o':'c','Q2o':'c','22':'mix:c@64,r',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s5h2c_bb_facing_cbet_large: {
    'A9s':'c','A8s':'r','A7s':'c','A6s':'mix:c@52,f','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'c','K8s':'r','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'r','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'c','J8s':'c','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'f','J3s':'f','J2s':'c','ATo':'mix:c@43,f',
    'KTo':'c','QTo':'f','JTo':'mix:c@63,f','T9s':'r','T8s':'c','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'f','T3s':'f','T2s':'c','A9o':'mix:f@68,r',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'c',
    '95s':'c','94s':'f','93s':'f','92s':'c','A8o':'r','K8o':'r',
    'Q8o':'r','J8o':'mix:r@56,c','T8o':'c','98o':'mix:c@57,r','88':'c','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'c','77':'c','76s':'c',
    '73s':'f','72s':'c','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'c','76o':'c','66':'c','62s':'c',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'c','52s':'c','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'c','74o':'mix:r@38,c','44':'f','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'mix:f@43,r','53o':'c','43o':'c','33':'f',
    '32s':'c','A2o':'mix:c@59,r','K2o':'c','Q2o':'c','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s5h2c_bb_facing_cbet_allin: {
    'A9s':'f','A8s':'c','A7s':'f','A6s':'f','A5s':'c','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'f','K8s':'c','K7s':'f','K6s':'f',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'c','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'c','J7s':'f',
    'J6s':'f','J5s':'mix:c@66,f','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'c','T7s':'f',
    'T6s':'f','T5s':'mix:c@59,f','T4s':'f','T3s':'f','T2s':'f','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'f',
    '95s':'mix:c@58,f','94s':'f','93s':'f','92s':'f','A8o':'c','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'c','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'c','77':'mix:c@65,f','76s':'f',
    '73s':'f','72s':'f','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'c','76o':'f','66':'mix:c@65,f','62s':'f',
    'A5o':'c','K5o':'mix:c@68,f','Q5o':'mix:c@66,f','J5o':'mix:c@58,f','T5o':'mix:f@56,c','95o':'mix:f@56,c',
    '85o':'c','75o':'f','55':'c','52s':'c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'c',
  },

}
