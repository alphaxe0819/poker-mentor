// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_9d5c2h
// Generated: 2026-04-20T08:07:41.000Z
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

export const HU_40BB_SRP_9D5C2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_9d5c2h_btn_cbet: {
    'AA':'mix:b50@47,b33','AKs':'mix:b50@36,b100','AQs':'mix:b33@37,b50','AJs':'mix:b33@35,b100','ATs':'b33','A9s':'mix:b100@54,b33',
    'A8s':'x','A7s':'x','A6s':'x','A5s':'mix:b50@41,b100','A4s':'x','A3s':'x',
    'A2s':'mix:b100@50,b50','AKo':'mix:x@35,b33','KK':'mix:b50@48,b100','KQs':'b33','KJs':'mix:b33@37,x','KTs':'mix:x@45,b33',
    'K9s':'mix:b100@45,b50','K8s':'x','K7s':'x','K6s':'x','K5s':'mix:b33@39,b50','K4s':'x',
    'K3s':'x','K2s':'mix:b33@35,b100','AQo':'x','KQo':'x','QQ':'b100','QJs':'mix:b100@34,b50',
    'QTs':'b33','Q9s':'mix:b33@36,b100','Q8s':'x','Q7s':'x','Q6s':'x','Q5s':'mix:b50@32,b33',
    'Q4s':'x','Q3s':'x','Q2s':'mix:b33@31,x','AJo':'x','KJo':'x','QJo':'x',
    'JJ':'mix:b100@69,b50','JTs':'mix:b100@60,b50','J9s':'mix:b33@43,b50','J8s':'x','J7s':'x','J6s':'mix:b100@47,x',
    'J5s':'mix:b100@35,b50','J4s':'x','J3s':'x','J2s':'mix:b33@28,b100','ATo':'x','KTo':'x',
    'QTo':'x','JTo':'mix:x@53,b33','TT':'b100','T9s':'mix:b50@39,b33','T8s':'x','T7s':'x',
    'T6s':'b100','T5s':'mix:b100@34,b50','T4s':'x','T3s':'mix:x@63,b100','T2s':'x','A9o':'b100',
    'K9o':'mix:b100@50,b50','Q9o':'mix:b100@46,b50','J9o':'mix:b100@38,b33','T9o':'mix:x@46,b33','99':'b33','98s':'mix:b100@45,b50',
    '97s':'mix:b50@40,b33','96s':'mix:b50@48,b100','95s':'mix:b50@40,b33','94s':'x','93s':'x','92s':'mix:b50@58,b33',
    'A8o':'x','K8o':'x','Q8o':'mix:b50@37,b100','J8o':'mix:b100@34,x','T8o':'mix:x@45,b100','98o':'b100',
    '88':'x','87s':'mix:b33@53,x','86s':'mix:b33@47,x','85s':'mix:x@48,b33','84s':'mix:b50@39,b100','83s':'mix:b50@35,b33',
    '82s':'x','A7o':'x','K7o':'x','Q7o':'x','J7o':'mix:b50@40,b100','T7o':'mix:b100@36,x',
    '97o':'x','87o':'x','77':'x','76s':'mix:b33@61,x','75s':'mix:x@63,b33','74s':'mix:b100@37,x',
    '73s':'mix:b50@41,b100','72s':'x','A6o':'mix:b100@37,b50','K6o':'mix:b50@34,b100','Q6o':'mix:b100@39,b50','J6o':'mix:b50@39,b33',
    'T6o':'mix:b33@37,b50','96o':'mix:x@36,b100','86o':'x','76o':'x','66':'mix:b100@37,b50','65s':'x',
    '64s':'mix:b33@52,x','63s':'x','62s':'x','A5o':'mix:b100@37,b50','K5o':'mix:x@38,b100','Q5o':'x',
    'J5o':'x','T5o':'x','95o':'mix:b100@38,b50','85o':'x','75o':'x','65o':'x',
    '55':'mix:b33@60,b50','54s':'mix:b100@35,b50','53s':'mix:x@45,b33','52s':'mix:b50@44,b100','K4o':'x','Q4o':'mix:b100@30,x',
    'J4o':'b50','74o':'b33','64o':'x','54o':'x','44':'x','43s':'mix:x@69,b33',
    '42s':'x','K3o':'mix:x@30,b50','Q3o':'mix:b33@34,b50','J3o':'mix:b33@38,b50','33':'x','32s':'x',
    'K2o':'mix:b100@38,x','Q2o':'x','J2o':'x','22':'mix:b33@65,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_9d5c2h_bb_facing_cbet_small: {
    'A9s':'r','A8s':'c','A7s':'c','A6s':'c','A5s':'r','A4s':'c',
    'A3s':'c','A2s':'mix:c@51,r','K9s':'r','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'mix:c@53,f','K2s':'c','QTs':'c','Q9s':'r',
    'Q8s':'mix:c@41,r','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'mix:c@47,r','Q3s':'mix:r@46,c',
    'Q2s':'c','QJo':'c','JTs':'mix:c@69,r','J9s':'r','J8s':'mix:c@45,r','J7s':'mix:c@68,f',
    'J6s':'c','J5s':'c','J4s':'mix:f@44,c','J3s':'mix:f@43,r','J2s':'c','ATo':'c',
    'KTo':'c','QTo':'mix:c@61,r','JTo':'mix:c@63,r','T9s':'mix:r@62,c','T8s':'r','T7s':'mix:r@61,f',
    'T6s':'mix:r@67,f','T5s':'c','T4s':'mix:f@57,c','T3s':'mix:f@58,r','T2s':'c','A9o':'r',
    'K9o':'r','Q9o':'r','J9o':'r','T9o':'mix:c@62,r','98s':'mix:r@69,c','97s':'mix:c@62,r',
    '95s':'r','94s':'c','93s':'c','92s':'c','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'mix:f@66,c','T8o':'f','98o':'mix:c@69,r','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'c','77':'c','76s':'mix:r@53,c',
    '73s':'f','72s':'c','A6o':'c','K6o':'mix:f@65,c','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'mix:r@55,c','76o':'mix:c@57,r','66':'c','62s':'c',
    'A5o':'r','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'r',
    '85o':'c','75o':'c','55':'c','52s':'r','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'c','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'mix:r@58,c','53o':'c','43o':'mix:r@55,c','33':'c',
    '32s':'c','A2o':'mix:r@51,c','K2o':'c','Q2o':'c','22':'r',
  },

  // ──────────────────────────────
  hu_40bb_srp_9d5c2h_bb_facing_cbet_mid: {
    'A9s':'r','A8s':'c','A7s':'c','A6s':'c','A5s':'r','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'r','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'mix:c@53,f','K3s':'mix:c@51,f','K2s':'c','QTs':'c','Q9s':'r',
    'Q8s':'c','Q7s':'mix:c@53,f','Q6s':'mix:r@38,c','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'mix:c@57,r','J8s':'mix:c@55,f','J7s':'mix:c@53,f',
    'J6s':'mix:f@63,r','J5s':'c','J4s':'f','J3s':'f','J2s':'c','ATo':'c',
    'KTo':'c','QTo':'mix:c@64,r','JTo':'c','T9s':'mix:c@59,r','T8s':'r','T7s':'r',
    'T6s':'mix:r@55,f','T5s':'c','T4s':'f','T3s':'f','T2s':'c','A9o':'r',
    'K9o':'r','Q9o':'r','J9o':'mix:c@53,r','T9o':'mix:c@63,r','98s':'mix:c@59,r','97s':'c',
    '95s':'mix:r@64,c','94s':'c','93s':'c','92s':'c','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'c','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'c','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'c','77':'c','76s':'c',
    '73s':'f','72s':'c','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'mix:c@69,r','76o':'mix:c@70,r','66':'mix:c@69,r','62s':'c',
    'A5o':'r','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'r',
    '85o':'c','75o':'c','55':'c','52s':'r','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'c','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'mix:r@54,c','53o':'c','43o':'c','33':'c',
    '32s':'c','A2o':'mix:r@58,c','K2o':'c','Q2o':'c','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_9d5c2h_bb_facing_cbet_large: {
    'A9s':'r','A8s':'mix:c@55,f','A7s':'mix:c@59,f','A6s':'mix:c@49,f','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'r','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'c','QTs':'c','Q9s':'r',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'c','J8s':'mix:r@45,f','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'f','J3s':'f','J2s':'c','ATo':'mix:r@41,c',
    'KTo':'c','QTo':'mix:c@50,f','JTo':'c','T9s':'c','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'f','T3s':'f','T2s':'c','A9o':'r',
    'K9o':'r','Q9o':'r','J9o':'mix:c@63,r','T9o':'c','98s':'c','97s':'c',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'c','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'c','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'c','77':'c','76s':'c',
    '73s':'f','72s':'c','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'c','76o':'c','66':'c','62s':'c',
    'A5o':'mix:c@63,r','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'c','52s':'c','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'mix:f@61,c','42s':'c','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'c','53o':'c','43o':'c','33':'f',
    '32s':'c','A2o':'mix:r@50,c','K2o':'c','Q2o':'c','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_9d5c2h_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'f','A7s':'f','A6s':'f','A5s':'c','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'c','K8s':'f','K7s':'f','K6s':'f',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'c',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'c','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'c','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'mix:c@68,f','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'c','Q9o':'c','J9o':'c','T9o':'c','98s':'c','97s':'c',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'c','88':'mix:c@69,f','87s':'f',
    '84s':'f','83s':'f','82s':'f','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'f','77':'mix:c@67,f','76s':'f',
    '73s':'f','72s':'f','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'f','76o':'f','66':'mix:c@68,f','62s':'f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'mix:c@63,f','T5o':'mix:c@57,f','95o':'c',
    '85o':'mix:f@64,c','75o':'f','55':'c','52s':'c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'c',
  },

}
