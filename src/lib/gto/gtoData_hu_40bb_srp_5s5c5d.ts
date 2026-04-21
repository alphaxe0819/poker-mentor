// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_5s5c5d
// Generated: 2026-04-20T06:01:13.410Z
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

export const HU_40BB_SRP_5S5C5D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_5s5c5d_btn_cbet: {
    'AA':'b50','AKs':'b100','AQs':'b100','AJs':'mix:b50@52,b100','ATs':'mix:b50@54,b100','A9s':'mix:b50@58,b100',
    'A8s':'mix:b50@51,b100','A7s':'mix:b50@46,x','A6s':'mix:b50@45,x','A5s':'b50','A4s':'mix:x@56,b50','A3s':'x',
    'A2s':'x','AKo':'b100','KK':'mix:b50@61,b100','KQs':'b50','KJs':'b50','KTs':'mix:b50@45,x',
    'K9s':'mix:x@54,b50','K8s':'mix:x@60,b50','K7s':'mix:x@60,b50','K6s':'x','K5s':'mix:b50@57,b100','K4s':'x',
    'K3s':'mix:x@46,b50','K2s':'mix:x@35,b50','AQo':'mix:b100@69,b50','KQo':'b50','QQ':'mix:b50@55,b100','QJs':'mix:x@64,b50',
    'QTs':'x','Q9s':'x','Q8s':'x','Q7s':'x','Q6s':'x','Q5s':'mix:b100@52,b50',
    'Q4s':'x','Q3s':'mix:x@54,b50','Q2s':'mix:x@42,b50','AJo':'mix:b50@56,b100','KJo':'b50','QJo':'mix:x@48,b50',
    'JJ':'mix:b50@68,b100','JTs':'x','J9s':'x','J8s':'x','J7s':'x','J6s':'x',
    'J5s':'mix:b50@53,b100','J4s':'mix:x@38,b50','J3s':'mix:b50@40,x','J2s':'b50','ATo':'mix:b50@58,b100','KTo':'mix:x@52,b50',
    'QTo':'x','JTo':'mix:x@61,b50','TT':'mix:b50@57,b100','T9s':'mix:x@47,b50','T8s':'mix:x@45,b50','T7s':'mix:x@48,b50',
    'T6s':'mix:x@46,b50','T5s':'mix:b50@57,b100','T4s':'mix:b50@40,x','T3s':'mix:b50@44,x','T2s':'mix:b50@45,x','A9o':'mix:b50@57,b100',
    'K9o':'x','Q9o':'x','J9o':'mix:x@54,b50','T9o':'mix:b50@36,x','99':'mix:b50@55,b100','98s':'mix:x@48,b50',
    '97s':'mix:x@44,b50','96s':'mix:x@43,b50','95s':'mix:b50@58,b100','94s':'mix:b50@39,x','93s':'mix:b50@41,x','92s':'mix:b50@43,b100',
    'A8o':'mix:b50@44,x','K8o':'x','Q8o':'x','J8o':'mix:x@50,b50','T8o':'mix:x@37,b50','98o':'mix:x@39,b50',
    '88':'mix:b50@50,b100','87s':'mix:x@52,b50','86s':'mix:x@48,b50','85s':'mix:b50@60,b100','84s':'mix:b50@36,x','83s':'mix:b50@38,x',
    '82s':'mix:b50@40,b100','A7o':'mix:x@47,b50','K7o':'x','Q7o':'x','J7o':'mix:x@51,b50','T7o':'mix:x@41,b50',
    '97o':'mix:x@36,b50','87o':'mix:x@44,b50','77':'mix:b50@51,b100','76s':'x','75s':'mix:b50@64,b100','74s':'mix:x@44,b50',
    '73s':'mix:b50@38,b100','72s':'mix:b50@40,b100','A6o':'mix:x@66,b50','K6o':'x','Q6o':'x','J6o':'mix:x@50,b50',
    'T6o':'mix:x@41,b50','96o':'mix:b50@38,x','86o':'mix:b50@37,x','76o':'mix:x@39,b50','66':'mix:b50@56,b100','65s':'mix:b50@67,b100',
    '64s':'x','63s':'mix:x@52,b50','62s':'mix:b50@41,b100','A5o':'b50','K5o':'mix:b50@54,b100','Q5o':'mix:b50@51,b100',
    'J5o':'mix:b50@56,b100','T5o':'mix:b50@58,b100','95o':'mix:b50@61,b100','85o':'mix:b50@63,b100','75o':'mix:b50@67,b100','65o':'mix:b50@69,b100',
    '54s':'mix:b50@61,b100','53s':'mix:b50@58,b100','52s':'mix:b50@58,b100','K4o':'x','Q4o':'mix:x@49,b50','J4o':'mix:b50@37,x',
    '74o':'mix:b50@39,x','64o':'mix:x@40,b50','54o':'mix:b50@63,b100','44':'mix:b50@52,b100','43s':'mix:x@52,b50','42s':'mix:b50@40,x',
    'K3o':'mix:x@41,b50','Q3o':'mix:x@41,b50','J3o':'mix:b50@40,b100','33':'mix:b50@52,b100','32s':'mix:b50@49,b100','K2o':'mix:b50@35,x',
    'Q2o':'mix:b50@38,x','J2o':'mix:b50@42,b100','22':'mix:b100@51,b50',
  },

  // ──────────────────────────────
  hu_40bb_srp_5s5c5d_bb_facing_cbet_small: {
    'A9s':'r','A8s':'mix:r@59,c','A7s':'mix:r@50,c','A6s':'mix:c@61,r','A5s':'c','A4s':'mix:c@50,allin',
    'A3s':'mix:allin@52,c','A2s':'mix:allin@56,c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'mix:r@54,c','Q4s':'c','Q3s':'c',
    'Q2s':'c','QJo':'c','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'r','J4s':'c','J3s':'c','J2s':'c','ATo':'mix:r@70,allin',
    'KTo':'c','QTo':'c','JTo':'c','T9s':'c','T8s':'c','T7s':'mix:c@63,f',
    'T6s':'mix:c@63,f','T5s':'r','T4s':'mix:c@61,f','T3s':'mix:c@61,f','T2s':'mix:c@66,f','A9o':'r',
    'K9o':'c','Q9o':'c','J9o':'c','T9o':'c','98s':'c','97s':'c',
    '95s':'r','94s':'mix:c@60,f','93s':'mix:c@60,f','92s':'mix:c@64,f','A8o':'mix:r@46,c','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'mix:r@52,c','87s':'c',
    '84s':'mix:c@52,f','83s':'mix:c@55,f','82s':'mix:c@59,f','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'mix:c@69,f','97o':'mix:c@64,f','87o':'mix:c@58,f','77':'mix:c@57,r','76s':'c',
    '73s':'mix:c@46,f','72s':'mix:c@50,f','A6o':'c','K6o':'c','Q6o':'c','J6o':'c',
    'T6o':'mix:c@69,f','96o':'mix:c@65,f','86o':'mix:c@55,f','76o':'mix:c@50,f','66':'c','62s':'mix:c@50,f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'r','T5o':'r','95o':'r',
    '85o':'mix:r@70,c','75o':'r','52s':'r','A4o':'c','K4o':'c','Q4o':'c',
    '84o':'mix:c@50,f','74o':'mix:f@52,c','44':'allin','42s':'mix:c@53,f','A3o':'mix:c@69,allin','K3o':'c',
    'Q3o':'c','63o':'mix:f@55,c','53o':'r','43o':'mix:f@57,c','33':'allin','32s':'mix:c@47,f',
    'A2o':'mix:c@68,allin','K2o':'c','Q2o':'c','22':'allin',
  },

  // ──────────────────────────────
  hu_40bb_srp_5s5c5d_bb_facing_cbet_mid: {
    'A9s':'r','A8s':'r','A7s':'r','A6s':'mix:r@49,c','A5s':'c','A4s':'mix:allin@64,c',
    'A3s':'mix:allin@66,c','A2s':'mix:allin@62,c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'c','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'c','Q3s':'c',
    'Q2s':'mix:c@63,f','QJo':'c','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'mix:c@65,f','J5s':'r','J4s':'mix:c@65,f','J3s':'mix:c@58,f','J2s':'mix:c@49,f','ATo':'r',
    'KTo':'c','QTo':'c','JTo':'c','T9s':'c','T8s':'mix:c@49,f','T7s':'mix:f@48,c',
    'T6s':'mix:f@55,c','T5s':'r','T4s':'mix:f@54,c','T3s':'mix:f@56,c','T2s':'mix:f@69,c','A9o':'r',
    'K9o':'c','Q9o':'c','J9o':'mix:c@65,f','T9o':'mix:f@52,c','98s':'c','97s':'mix:c@50,f',
    '95s':'r','94s':'mix:f@66,c','93s':'f','92s':'f','A8o':'r','K8o':'c',
    'Q8o':'c','J8o':'mix:c@60,f','T8o':'mix:f@63,c','98o':'mix:f@63,c','88':'r','87s':'mix:c@52,f',
    '84s':'mix:f@67,c','83s':'f','82s':'f','A7o':'mix:c@62,r','K7o':'c','Q7o':'mix:c@62,f',
    'J7o':'mix:f@53,c','T7o':'f','97o':'f','87o':'f','77':'r','76s':'mix:c@57,f',
    '73s':'f','72s':'f','A6o':'c','K6o':'c','Q6o':'mix:c@52,f','J6o':'mix:f@58,c',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'mix:r@50,allin','62s':'f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'mix:c@52,r','T5o':'mix:c@63,r','95o':'mix:c@52,r',
    '85o':'mix:r@63,c','75o':'mix:r@67,c','52s':'r','A4o':'c','K4o':'c','Q4o':'mix:f@48,c',
    '84o':'f','74o':'f','44':'allin','42s':'f','A3o':'c','K3o':'c',
    'Q3o':'mix:f@51,c','63o':'f','53o':'mix:r@68,c','43o':'f','33':'allin','32s':'f',
    'A2o':'c','K2o':'c','Q2o':'mix:f@63,c','22':'allin',
  },

  // ──────────────────────────────
  hu_40bb_srp_5s5c5d_bb_facing_cbet_large: {
    'A9s':'mix:allin@50,r','A8s':'mix:allin@55,c','A7s':'mix:allin@54,c','A6s':'mix:allin@51,c','A5s':'c','A4s':'mix:allin@63,c',
    'A3s':'mix:allin@65,c','A2s':'mix:allin@57,c','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'c','K2s':'c','QTs':'mix:c@51,allin','Q9s':'mix:c@49,allin',
    'Q8s':'mix:c@48,allin','Q7s':'c','Q6s':'mix:c@61,f','Q5s':'c','Q4s':'mix:c@59,f','Q3s':'mix:c@56,f',
    'Q2s':'mix:f@51,c','QJo':'c','JTs':'c','J9s':'c','J8s':'mix:c@63,f','J7s':'mix:c@57,f',
    'J6s':'mix:c@53,f','J5s':'c','J4s':'mix:c@54,f','J3s':'mix:f@51,c','J2s':'mix:f@59,c','ATo':'mix:r@54,allin',
    'KTo':'c','QTo':'c','JTo':'mix:c@62,f','T9s':'mix:c@45,f','T8s':'mix:c@43,f','T7s':'mix:f@57,c',
    'T6s':'mix:f@60,c','T5s':'c','T4s':'mix:f@59,c','T3s':'mix:f@65,c','T2s':'f','A9o':'mix:allin@45,r',
    'K9o':'c','Q9o':'mix:c@61,f','J9o':'mix:f@50,c','T9o':'mix:f@69,c','98s':'mix:c@43,f','97s':'mix:f@49,c',
    '95s':'c','94s':'f','93s':'f','92s':'f','A8o':'mix:c@41,allin','K8o':'c',
    'Q8o':'mix:f@51,c','J8o':'mix:f@64,c','T8o':'f','98o':'f','88':'mix:r@62,allin','87s':'mix:c@46,f',
    '84s':'f','83s':'f','82s':'f','A7o':'c','K7o':'c','Q7o':'mix:f@67,c',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'allin','76s':'mix:c@53,f',
    '73s':'f','72s':'f','A6o':'c','K6o':'c','Q6o':'mix:f@70,c','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'allin','62s':'f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','52s':'c','A4o':'c','K4o':'c','Q4o':'mix:f@68,c',
    '84o':'f','74o':'f','44':'allin','42s':'f','A3o':'mix:c@70,allin','K3o':'c',
    'Q3o':'f','63o':'f','53o':'c','43o':'f','33':'allin','32s':'f',
    'A2o':'c','K2o':'c','Q2o':'f','22':'allin',
  },

  // ──────────────────────────────
  hu_40bb_srp_5s5c5d_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'c','A7s':'mix:c@64,f','A6s':'mix:c@61,f','A5s':'c','A4s':'mix:c@63,f',
    'A3s':'mix:c@63,f','A2s':'mix:c@61,f','K9s':'mix:f@62,c','K8s':'mix:f@62,c','K7s':'mix:f@67,c','K6s':'f',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'c','J4s':'f','J3s':'f','J2s':'f','ATo':'c',
    'KTo':'mix:f@65,c','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'c','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'mix:f@63,c','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'f',
    '95s':'c','94s':'f','93s':'f','92s':'f','A8o':'mix:c@67,f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'f',
    '84s':'f','83s':'f','82s':'f','A7o':'mix:c@61,f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'f','77':'c','76s':'f',
    '73s':'f','72s':'f','A6o':'mix:c@57,f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'f','66':'c','62s':'f',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','52s':'c','A4o':'mix:c@59,f','K4o':'f','Q4o':'f',
    '84o':'f','74o':'f','44':'c','42s':'f','A3o':'mix:c@59,f','K3o':'f',
    'Q3o':'f','63o':'f','53o':'c','43o':'f','33':'c','32s':'f',
    'A2o':'mix:c@56,f','K2o':'f','Q2o':'f','22':'c',
  },

}
