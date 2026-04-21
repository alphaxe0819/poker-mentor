// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_9h8d7c
// Generated: 2026-04-20T08:36:13.755Z
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

export const HU_40BB_SRP_9H8D7C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_9h8d7c_btn_cbet: {
    'AA':'x','AKs':'x','AQs':'x','AJs':'mix:x@41,b33','ATs':'mix:b100@38,b50','A9s':'mix:b50@40,b100',
    'A8s':'x','A7s':'x','A6s':'mix:b50@37,b33','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'x','KK':'mix:b100@43,b50','KQs':'x','KJs':'mix:b33@50,x','KTs':'b50',
    'K9s':'mix:b50@37,b100','K8s':'mix:x@54,b33','K7s':'x','K6s':'mix:b50@39,b33','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'mix:x@62,b100','AQo':'x','KQo':'mix:x@53,b50','QQ':'mix:b50@54,b100','QJs':'mix:b33@44,b50',
    'QTs':'b50','Q9s':'mix:b50@32,b100','Q8s':'mix:x@46,b33','Q7s':'x','Q6s':'mix:b50@47,b33','Q5s':'x',
    'Q4s':'mix:x@62,b100','Q3s':'mix:x@67,b100','Q2s':'mix:x@45,b100','AJo':'x','KJo':'mix:b100@37,x','QJo':'x',
    'JJ':'b100','JTs':'mix:b50@46,b33','J9s':'mix:b50@51,b100','J8s':'mix:b50@36,b33','J7s':'mix:b33@37,b50','J6s':'mix:b100@42,b50',
    'J5s':'mix:x@58,b33','J4s':'x','J3s':'x','J2s':'x','ATo':'x','KTo':'mix:x@58,b50',
    'QTo':'x','JTo':'mix:b50@46,b33','TT':'mix:b100@56,b50','T9s':'mix:b50@45,b100','T8s':'mix:x@35,b50','T7s':'mix:b50@40,b100',
    'T6s':'mix:b50@39,b33','T5s':'x','T4s':'mix:x@58,b33','T3s':'mix:x@46,b33','T2s':'mix:b33@44,x','A9o':'mix:b50@43,b33',
    'K9o':'x','Q9o':'x','J9o':'mix:b50@54,b100','T9o':'mix:b50@41,b100','99':'x','98s':'mix:b100@49,b50',
    '97s':'mix:b33@31,b50','96s':'mix:b100@41,b50','95s':'mix:x@53,b33','94s':'x','93s':'x','92s':'x',
    'A8o':'x','K8o':'x','Q8o':'x','J8o':'x','T8o':'x','98o':'mix:b100@50,b50',
    '88':'x','87s':'mix:b50@44,b33','86s':'mix:b50@28,b100','85s':'x','84s':'x','83s':'x',
    '82s':'x','A7o':'mix:x@47,b33','K7o':'x','Q7o':'x','J7o':'x','T7o':'x',
    '97o':'x','87o':'mix:b50@34,b33','77':'mix:b100@60,b50','76s':'b100','75s':'x','74s':'x',
    '73s':'x','72s':'x','A6o':'x','K6o':'mix:b100@36,b50','Q6o':'mix:b100@44,b50','J6o':'mix:b50@35,b33',
    'T6o':'mix:b50@38,b33','96o':'mix:b100@33,b50','86o':'x','76o':'x','66':'x','65s':'mix:b50@48,b100',
    '64s':'x','63s':'x','62s':'x','A5o':'mix:b50@34,b33','K5o':'mix:b50@43,b33','Q5o':'b50',
    'J5o':'x','T5o':'b100','95o':'x','85o':'x','75o':'x','65o':'mix:b50@48,b100',
    '55':'x','54s':'x','53s':'x','52s':'x','K4o':'x','Q4o':'mix:x@47,b33',
    'J4o':'mix:x@26,b50','74o':'x','64o':'mix:b50@42,b100','54o':'x','44':'x','43s':'x',
    '42s':'mix:x@45,b50','K3o':'x','Q3o':'x','J3o':'mix:x@30,b50','33':'x','32s':'mix:x@48,b50',
    'K2o':'mix:x@44,b50','Q2o':'mix:x@39,b50','J2o':'mix:b50@36,b100','22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_9h8d7c_bb_facing_cbet_small: {
    'A9s':'mix:r@66,c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'mix:c@63,f',
    'A3s':'mix:c@68,f','A2s':'mix:c@68,f','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'mix:c@57,r','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'c','JTs':'r','J9s':'mix:c@54,r','J8s':'c','J7s':'c',
    'J6s':'r','J5s':'c','J4s':'c','J3s':'mix:r@60,c','J2s':'mix:c@57,r','ATo':'c',
    'KTo':'c','QTo':'mix:c@58,r','JTo':'r','T9s':'mix:r@53,c','T8s':'c','T7s':'c',
    'T6s':'r','T5s':'c','T4s':'c','T3s':'r','T2s':'mix:r@66,c','A9o':'r',
    'K9o':'c','Q9o':'c','J9o':'mix:c@52,r','T9o':'mix:c@51,r','98s':'mix:r@57,c','97s':'c',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'mix:c@68,r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'mix:r@61,c','88':'mix:r@61,c','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'c','K7o':'c','Q7o':'mix:c@65,r',
    'J7o':'c','T7o':'c','97o':'c','87o':'c','77':'r','76s':'mix:c@57,r',
    '73s':'c','72s':'c','A6o':'c','K6o':'c','Q6o':'c','J6o':'r',
    'T6o':'r','96o':'r','86o':'c','76o':'c','66':'c','62s':'mix:c@65,r',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'c','T5o':'mix:r@51,c','95o':'c',
    '85o':'c','75o':'c','55':'c','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'c','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'c','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_9h8d7c_bb_facing_cbet_mid: {
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'f','QTs':'mix:c@51,r','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'c','JTs':'mix:r@57,c','J9s':'mix:c@52,r','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'c','J4s':'mix:c@46,f','J3s':'mix:r@64,f','J2s':'mix:r@50,f','ATo':'c',
    'KTo':'c','QTo':'c','JTo':'mix:r@64,c','T9s':'r','T8s':'c','T7s':'c',
    'T6s':'r','T5s':'c','T4s':'c','T3s':'c','T2s':'c','A9o':'c',
    'K9o':'c','Q9o':'c','J9o':'mix:r@50,c','T9o':'r','98s':'mix:r@66,c','97s':'c',
    '95s':'c','94s':'c','93s':'mix:c@67,r','92s':'mix:c@67,r','A8o':'mix:c@64,r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'r','88':'r','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'mix:c@46,f','K7o':'mix:c@52,f','Q7o':'c',
    'J7o':'c','T7o':'c','97o':'c','87o':'c','77':'r','76s':'mix:c@63,r',
    '73s':'mix:c@67,f','72s':'mix:c@67,f','A6o':'c','K6o':'c','Q6o':'c','J6o':'mix:c@53,r',
    'T6o':'r','96o':'mix:r@69,c','86o':'c','76o':'c','66':'c','62s':'mix:c@55,f',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'mix:c@49,r','T5o':'r','95o':'mix:c@56,r',
    '85o':'c','75o':'f','55':'f','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'mix:f@67,c','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_9h8d7c_bb_facing_cbet_large: {
    'A9s':'c','A8s':'c','A7s':'mix:c@69,f','A6s':'c','A5s':'f','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'f','QTs':'mix:c@47,r','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'c','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'c','J4s':'f','J3s':'mix:f@61,r','J2s':'f','ATo':'c',
    'KTo':'c','QTo':'c','JTo':'c','T9s':'r','T8s':'c','T7s':'c',
    'T6s':'r','T5s':'c','T4s':'c','T3s':'c','T2s':'c','A9o':'c',
    'K9o':'c','Q9o':'c','J9o':'c','T9o':'r','98s':'r','97s':'c',
    '95s':'c','94s':'mix:c@67,r','93s':'mix:c@67,r','92s':'mix:c@67,r','A8o':'c','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'r','88':'r','87s':'c',
    '84s':'mix:c@67,f','83s':'mix:c@67,f','82s':'mix:c@67,f','A7o':'f','K7o':'f','Q7o':'mix:c@57,f',
    'J7o':'c','T7o':'c','97o':'c','87o':'c','77':'r','76s':'c',
    '73s':'mix:c@67,f','72s':'mix:c@67,f','A6o':'c','K6o':'mix:f@55,c','Q6o':'mix:f@59,c','J6o':'c',
    'T6o':'r','96o':'r','86o':'c','76o':'c','66':'mix:c@67,r','62s':'f',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'r','95o':'mix:c@66,r',
    '85o':'mix:c@35,r','75o':'f','55':'f','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_9h8d7c_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'f','A7s':'f','A6s':'f','A5s':'f','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'mix:c@70,f','K8s':'f','K7s':'f','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'f','QTs':'mix:c@51,f','Q9s':'mix:c@70,f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'c','J9s':'c','J8s':'c','J7s':'mix:f@64,c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'f','J2s':'f','ATo':'mix:f@51,c',
    'KTo':'mix:f@50,c','QTo':'f','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'c','T5s':'f','T4s':'f','T3s':'f','T2s':'f','A9o':'mix:c@67,f',
    'K9o':'mix:c@65,f','Q9o':'mix:c@65,f','J9o':'c','T9o':'c','98s':'c','97s':'c',
    '95s':'c','94s':'mix:f@59,c','93s':'mix:f@58,c','92s':'mix:f@58,c','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'c','T8o':'c','98o':'c','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'f','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'c','97o':'c','87o':'c','77':'c','76s':'mix:f@52,c',
    '73s':'f','72s':'f','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'c','96o':'c','86o':'c','76o':'f','66':'mix:f@69,c','62s':'f',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'c',
    '85o':'f','75o':'f','55':'f','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

}
