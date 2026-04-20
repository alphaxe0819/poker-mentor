// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_6d5h4c
// Generated: 2026-04-20T06:29:49.800Z
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

export const HU_40BB_SRP_6D5H4C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_6d5h4c_btn_cbet: {
    'AA':'mix:b100@49,b50','AKs':'x','AQs':'x','AJs':'x','ATs':'x','A9s':'x',
    'A8s':'x','A7s':'mix:b50@44,b100','A6s':'mix:b100@55,b50','A5s':'mix:b50@37,x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'mix:b50@49,b100','KK':'mix:b100@57,b50','KQs':'x','KJs':'x','KTs':'x',
    'K9s':'x','K8s':'x','K7s':'mix:b50@38,b100','K6s':'mix:b50@55,b100','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','AQo':'x','KQo':'x','QQ':'mix:b100@48,b50','QJs':'x',
    'QTs':'x','Q9s':'x','Q8s':'x','Q7s':'mix:x@47,b50','Q6s':'mix:b50@52,b100','Q5s':'x',
    'Q4s':'x','Q3s':'x','Q2s':'x','AJo':'x','KJo':'x','QJo':'x',
    'JJ':'mix:b50@48,b100','JTs':'x','J9s':'mix:b50@48,b100','J8s':'x','J7s':'x','J6s':'mix:b100@47,b50',
    'J5s':'x','J4s':'x','J3s':'x','J2s':'x','ATo':'x','KTo':'mix:x@62,b50',
    'QTo':'x','JTo':'x','TT':'mix:b50@48,b100','T9s':'mix:b50@40,b100','T8s':'x','T7s':'x',
    'T6s':'mix:b50@35,x','T5s':'x','T4s':'x','T3s':'mix:x@53,b50','T2s':'mix:x@37,b100','A9o':'mix:b50@38,x',
    'K9o':'b50','Q9o':'mix:b50@42,x','J9o':'mix:b50@49,b100','T9o':'mix:x@40,b50','99':'mix:b50@66,b100','98s':'x',
    '97s':'x','96s':'mix:b50@49,b100','95s':'x','94s':'x','93s':'b50','92s':'mix:b100@57,b50',
    'A8o':'mix:x@42,b50','K8o':'mix:b100@41,b50','Q8o':'mix:b50@52,b100','J8o':'mix:b50@54,b100','T8o':'mix:b50@53,b100','98o':'x',
    '88':'b100','87s':'b50','86s':'mix:b50@53,b100','85s':'mix:b50@40,b100','84s':'x','83s':'x',
    '82s':'x','A7o':'x','K7o':'x','Q7o':'mix:x@38,b50','J7o':'mix:b50@44,b100','T7o':'mix:b50@42,b100',
    '97o':'x','87o':'b50','77':'b100','76s':'mix:b50@63,b100','75s':'mix:b50@61,b100','74s':'mix:b50@34,x',
    '73s':'mix:b50@51,b33','72s':'b100','A6o':'mix:b100@55,b50','K6o':'mix:b50@55,b100','Q6o':'mix:x@50,b50','J6o':'x',
    'T6o':'x','96o':'x','86o':'mix:b50@47,b100','76o':'mix:b50@61,b100','66':'mix:b50@57,b33','65s':'mix:b100@52,b50',
    '64s':'b50','63s':'mix:b100@51,b50','62s':'mix:x@64,b50','A5o':'b50','K5o':'mix:x@45,b50','Q5o':'x',
    'J5o':'x','T5o':'x','95o':'x','85o':'x','75o':'mix:b50@57,b100','65o':'mix:b100@56,b50',
    '55':'b50','54s':'mix:b100@50,b50','53s':'mix:b100@69,b50','52s':'x','K4o':'mix:x@58,b50','Q4o':'mix:x@49,b50',
    'J4o':'mix:b50@40,b100','74o':'x','64o':'mix:b50@55,b100','54o':'mix:b100@53,b50','44':'mix:b50@58,b100','43s':'x',
    '42s':'x','K3o':'x','Q3o':'mix:b50@42,b100','J3o':'mix:b50@38,b100','33':'x','32s':'b50',
    'K2o':'mix:x@38,b50','Q2o':'mix:x@38,b50','J2o':'mix:x@57,b50','22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_6d5h4c_bb_facing_cbet_small: {
    'A9s':'c','A8s':'c','A7s':'mix:r@67,c','A6s':'r','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'c','K8s':'c','K7s':'mix:c@56,r','K6s':'mix:r@62,c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'mix:c@52,r','Q6s':'c','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'mix:c@49,f','QJo':'f','JTs':'f','J9s':'f','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'c','J4s':'c','J3s':'c','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'c','T7s':'mix:c@58,allin',
    'T6s':'c','T5s':'c','T4s':'c','T3s':'c','T2s':'f','A9o':'mix:c@56,f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'mix:r@64,c',
    '95s':'c','94s':'c','93s':'c','92s':'mix:f@58,c','A8o':'mix:c@52,r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'allin','87s':'mix:r@68,c',
    '84s':'c','83s':'r','82s':'c','A7o':'c','K7o':'c','Q7o':'mix:c@54,allin',
    'J7o':'c','T7o':'mix:c@47,allin','97o':'c','87o':'mix:r@68,c','77':'mix:r@70,allin','76s':'r',
    '73s':'r','72s':'c','A6o':'allin','K6o':'c','Q6o':'c','J6o':'c',
    'T6o':'c','96o':'c','86o':'allin','76o':'mix:r@55,allin','66':'c','62s':'c',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'mix:c@62,allin','55':'c','52s':'c','A4o':'c','K4o':'c',
    'Q4o':'c','84o':'c','74o':'c','44':'mix:r@64,c','42s':'mix:c@70,r','A3o':'c',
    'K3o':'c','Q3o':'c','63o':'mix:allin@70,r','53o':'allin','43o':'mix:c@39,r','33':'c',
    '32s':'r','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_6d5h4c_bb_facing_cbet_mid: {
    'A9s':'c','A8s':'c','A7s':'mix:r@51,c','A6s':'mix:allin@55,r','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'c','K8s':'c','K7s':'mix:r@52,c','K6s':'mix:c@64,r',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'c','J4s':'c','J3s':'c','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'c','T7s':'mix:allin@62,c',
    'T6s':'c','T5s':'c','T4s':'c','T3s':'c','T2s':'f','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'mix:c@53,r',
    '95s':'c','94s':'c','93s':'c','92s':'f','A8o':'c','K8o':'c',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'c','88':'allin','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'c','K7o':'c','Q7o':'mix:c@57,allin',
    'J7o':'c','T7o':'mix:c@64,allin','97o':'c','87o':'c','77':'allin','76s':'r',
    '73s':'mix:r@65,c','72s':'c','A6o':'allin','K6o':'c','Q6o':'c','J6o':'c',
    'T6o':'c','96o':'c','86o':'mix:allin@47,r','76o':'allin','66':'c','62s':'c',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'mix:allin@67,c','55':'c','52s':'c','A4o':'c','K4o':'mix:f@59,c',
    'Q4o':'mix:f@53,c','84o':'c','74o':'c','44':'r','42s':'c','A3o':'c',
    'K3o':'c','Q3o':'c','63o':'allin','53o':'allin','43o':'mix:allin@39,c','33':'c',
    '32s':'r','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_6d5h4c_bb_facing_cbet_large: {
    'A9s':'c','A8s':'c','A7s':'c','A6s':'allin','A5s':'c','A4s':'mix:c@67,f',
    'A3s':'c','A2s':'f','K9s':'f','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'c','J7s':'mix:allin@53,c',
    'J6s':'c','J5s':'c','J4s':'c','J3s':'c','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'c','T7s':'allin',
    'T6s':'c','T5s':'c','T4s':'c','T3s':'c','T2s':'f','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'c',
    '95s':'c','94s':'c','93s':'c','92s':'f','A8o':'c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'c','88':'allin','87s':'c',
    '84s':'c','83s':'c','82s':'c','A7o':'mix:c@66,allin','K7o':'c','Q7o':'mix:c@67,allin',
    'J7o':'c','T7o':'mix:c@60,allin','97o':'c','87o':'c','77':'allin','76s':'allin',
    '73s':'c','72s':'c','A6o':'allin','K6o':'c','Q6o':'c','J6o':'c',
    'T6o':'c','96o':'c','86o':'mix:allin@61,c','76o':'allin','66':'c','62s':'c',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'allin','55':'c','52s':'mix:c@67,f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'c','44':'allin','42s':'mix:c@67,f','A3o':'c',
    'K3o':'c','Q3o':'mix:f@59,c','63o':'allin','53o':'allin','43o':'mix:allin@58,c','33':'c',
    '32s':'allin','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_6d5h4c_bb_facing_cbet_allin: {
    'A9s':'f','A8s':'f','A7s':'c','A6s':'c','A5s':'f','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'f','K8s':'f','K7s':'mix:f@61,c','K6s':'c',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'mix:c@54,f','Q6s':'c','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'mix:f@61,c',
    'J6s':'mix:c@60,f','J5s':'f','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'f','T2s':'f','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'mix:f@52,c',
    '95s':'f','94s':'f','93s':'f','92s':'f','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'f','A7o':'mix:c@54,f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'c','77':'c','76s':'c',
    '73s':'c','72s':'f','A6o':'c','K6o':'c','Q6o':'c','J6o':'f',
    'T6o':'f','96o':'f','86o':'c','76o':'c','66':'c','62s':'c',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'mix:c@57,f','75o':'c','55':'c','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'c','44':'c','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'c','53o':'c','43o':'mix:c@52,f','33':'f',
    '32s':'c','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

}
