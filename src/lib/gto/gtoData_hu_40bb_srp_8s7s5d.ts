// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_8s7s5d
// Generated: 2026-04-20T07:38:57.743Z
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

export const HU_40BB_SRP_8S7S5D: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_8s7s5d_btn_cbet: {
    'AA':'mix:b100@45,b50','AKs':'x','AQs':'x','AJs':'mix:x@60,b50','ATs':'mix:x@51,b50','A9s':'mix:x@39,b50',
    'A8s':'mix:b50@68,b100','A7s':'mix:x@49,b50','A6s':'x','A5s':'x','A4s':'x','A3s':'x',
    'A2s':'x','AKo':'mix:x@39,b50','KK':'mix:b100@48,b50','KQs':'x','KJs':'x','KTs':'mix:x@46,b50',
    'K9s':'mix:x@38,b50','K8s':'mix:x@33,b50','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'x','AQo':'x','KQo':'x','QQ':'mix:b50@50,b100','QJs':'mix:x@59,b50',
    'QTs':'mix:b50@42,x','Q9s':'mix:x@37,b50','Q8s':'mix:x@61,b50','Q7s':'x','Q6s':'mix:b100@34,b50','Q5s':'x',
    'Q4s':'x','Q3s':'x','Q2s':'x','AJo':'mix:b50@40,x','KJo':'mix:x@29,b50','QJo':'mix:b50@44,b100',
    'JJ':'mix:b100@55,b50','JTs':'x','J9s':'mix:x@54,b50','J8s':'mix:b50@37,b100','J7s':'x','J6s':'b50',
    'J5s':'x','J4s':'mix:x@40,b50','J3s':'x','J2s':'x','ATo':'mix:b50@44,x','KTo':'mix:b50@43,b100',
    'QTo':'mix:b50@47,b100','JTo':'x','TT':'mix:b100@55,b50','T9s':'mix:x@52,b50','T8s':'mix:b100@30,b50','T7s':'x',
    'T6s':'mix:x@60,b50','T5s':'x','T4s':'mix:b50@42,b100','T3s':'x','T2s':'mix:x@50,b100','A9o':'mix:b50@39,b100',
    'K9o':'mix:b50@41,b100','Q9o':'mix:b50@44,b100','J9o':'x','T9o':'x','99':'b100','98s':'mix:b50@63,b100',
    '97s':'x','96s':'b50','95s':'x','94s':'mix:b100@45,x','93s':'b50','92s':'mix:b50@42,b100',
    'A8o':'mix:b50@67,b100','K8o':'mix:x@41,b50','Q8o':'x','J8o':'mix:b50@40,x','T8o':'mix:x@45,b50','98o':'mix:b50@59,b100',
    '88':'mix:b33@48,b50','87s':'mix:b100@50,b50','86s':'mix:b100@48,b50','85s':'mix:b50@37,x','84s':'x','83s':'x',
    '82s':'x','A7o':'mix:x@44,b50','K7o':'mix:x@48,b50','Q7o':'mix:x@60,b50','J7o':'x','T7o':'x',
    '97o':'x','87o':'mix:b100@51,b50','77':'mix:b50@48,b100','76s':'mix:b50@35,x','75s':'mix:b50@56,b100','74s':'x',
    '73s':'x','72s':'x','A6o':'x','K6o':'mix:x@45,b50','Q6o':'mix:b50@42,b100','J6o':'mix:b100@45,b50',
    'T6o':'mix:x@40,b50','96o':'mix:b50@63,b100','86o':'mix:b100@49,b50','76o':'mix:x@41,b50','66':'x','65s':'x',
    '64s':'mix:b50@52,b100','63s':'mix:b50@35,b100','62s':'mix:b100@42,b50','A5o':'x','K5o':'x','Q5o':'x',
    'J5o':'x','T5o':'x','95o':'x','85o':'mix:x@36,b50','75o':'mix:b50@54,b100','65o':'x',
    '55':'mix:b50@59,b100','54s':'x','53s':'x','52s':'x','K4o':'mix:b50@36,b100','Q4o':'mix:x@38,b50',
    'J4o':'mix:b50@38,x','74o':'x','64o':'mix:b100@51,b50','54o':'x','44':'x','43s':'x',
    '42s':'x','K3o':'x','Q3o':'x','J3o':'x','33':'x','32s':'mix:x@46,b50',
    'K2o':'x','Q2o':'x','J2o':'mix:x@47,b50','22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s7s5d_bb_facing_cbet_small: {
    'A9s':'c','A8s':'mix:allin@54,r','A7s':'c','A6s':'c','A5s':'c','A4s':'mix:f@50,c',
    'A3s':'f','A2s':'f','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'mix:f@50,c','K3s':'f','K2s':'f','QTs':'mix:f@50,c','Q9s':'c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'c','J4s':'f','J3s':'f','J2s':'f','ATo':'mix:f@50,c',
    'KTo':'mix:f@64,c','QTo':'f','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'c','T5s':'c','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'c','Q9o':'mix:c@63,r','J9o':'c','T9o':'c','98s':'mix:r@53,c','97s':'c',
    '95s':'c','94s':'mix:f@52,c','93s':'mix:f@50,c','92s':'mix:f@50,c','A8o':'mix:allin@69,r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'mix:r@50,c','88':'c','87s':'mix:allin@51,r',
    '84s':'c','83s':'c','82s':'c','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'c','97o':'c','87o':'allin','77':'mix:r@58,c','76s':'c',
    '73s':'c','72s':'c','A6o':'c','K6o':'c','Q6o':'mix:c@58,allin','J6o':'c',
    'T6o':'mix:c@61,r','96o':'r','86o':'allin','76o':'mix:allin@48,c','66':'c','62s':'c',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'c','T5o':'c','95o':'c',
    '85o':'c','75o':'c','55':'r','52s':'c','A4o':'mix:f@65,c','K4o':'f',
    'Q4o':'f','84o':'c','74o':'c','44':'mix:c@61,f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'mix:c@56,r','53o':'c','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s7s5d_bb_facing_cbet_mid: {
    'A9s':'c','A8s':'mix:allin@49,r','A7s':'c','A6s':'c','A5s':'mix:c@59,f','A4s':'mix:f@50,c',
    'A3s':'f','A2s':'f','K9s':'mix:c@50,f','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'mix:f@50,c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'mix:c@68,f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'c','J5s':'mix:f@67,c','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'c','T5s':'mix:f@64,c','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'mix:c@49,f','Q9o':'mix:f@50,r','J9o':'c','T9o':'c','98s':'mix:r@54,c','97s':'c',
    '95s':'c','94s':'f','93s':'f','92s':'f','A8o':'allin','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'mix:r@63,c','88':'c','87s':'mix:allin@53,r',
    '84s':'c','83s':'c','82s':'c','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'c','97o':'c','87o':'allin','77':'r','76s':'mix:c@46,r',
    '73s':'mix:f@66,c','72s':'mix:f@55,c','A6o':'c','K6o':'c','Q6o':'c','J6o':'c',
    'T6o':'c','96o':'r','86o':'allin','76o':'mix:allin@45,c','66':'c','62s':'mix:c@50,r',
    'A5o':'c','K5o':'c','Q5o':'c','J5o':'mix:c@50,f','T5o':'mix:c@62,f','95o':'c',
    '85o':'c','75o':'c','55':'r','52s':'mix:f@67,c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'c','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'mix:r@57,f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s7s5d_bb_facing_cbet_large: {
    'A9s':'mix:c@50,f','A8s':'mix:allin@56,c','A7s':'c','A6s':'c','A5s':'mix:f@67,c','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'mix:f@50,c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'mix:f@67,c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'mix:f@50,c',
    'Q8s':'c','Q7s':'c','Q6s':'c','Q5s':'mix:f@67,c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'mix:c@50,f','J9s':'c','J8s':'c','J7s':'mix:c@62,f',
    'J6s':'c','J5s':'mix:f@67,c','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'mix:c@50,f','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'c','T5s':'mix:f@67,c','T4s':'f','T3s':'f','T2s':'f','A9o':'mix:c@53,f',
    'K9o':'mix:f@55,c','Q9o':'f','J9o':'mix:c@61,allin','T9o':'c','98s':'mix:c@38,r','97s':'c',
    '95s':'c','94s':'f','93s':'f','92s':'f','A8o':'mix:allin@58,c','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'mix:allin@44,r','88':'c','87s':'allin',
    '84s':'c','83s':'mix:c@56,r','82s':'c','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'mix:c@61,f','T7o':'c','97o':'c','87o':'allin','77':'allin','76s':'mix:c@53,allin',
    '73s':'mix:f@67,c','72s':'mix:f@67,c','A6o':'c','K6o':'mix:c@70,allin','Q6o':'mix:c@70,allin','J6o':'c',
    'T6o':'c','96o':'mix:c@47,r','86o':'allin','76o':'mix:allin@68,c','66':'c','62s':'mix:f@50,c',
    'A5o':'mix:c@56,f','K5o':'mix:c@56,f','Q5o':'mix:c@58,f','J5o':'mix:c@56,f','T5o':'mix:c@56,f','95o':'c',
    '85o':'c','75o':'c','55':'allin','52s':'mix:f@67,c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'mix:f@67,c','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

  // ──────────────────────────────
  hu_40bb_srp_8s7s5d_bb_facing_cbet_allin: {
    'A9s':'f','A8s':'c','A7s':'f','A6s':'f','A5s':'mix:f@67,c','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'f','K8s':'c','K7s':'f','K6s':'f',
    'K5s':'mix:f@67,c','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'mix:c@53,f','Q7s':'f','Q6s':'f','Q5s':'mix:f@67,c','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'mix:f@62,c','J8s':'mix:f@60,c','J7s':'f',
    'J6s':'f','J5s':'mix:f@67,c','J4s':'f','J3s':'f','J2s':'f','ATo':'f',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'mix:f@65,c','T7s':'f',
    'T6s':'f','T5s':'mix:f@67,c','T4s':'f','T3s':'f','T2s':'f','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'c','97s':'c',
    '95s':'mix:f@67,c','94s':'f','93s':'f','92s':'f','A8o':'c','K8o':'c',
    'Q8o':'mix:c@54,f','J8o':'mix:f@59,c','T8o':'mix:f@67,c','98o':'c','88':'c','87s':'c',
    '84s':'c','83s':'f','82s':'f','A7o':'f','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'c','87o':'c','77':'c','76s':'c',
    '73s':'f','72s':'f','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'c','86o':'c','76o':'c','66':'c','62s':'f',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'c','75o':'c','55':'c','52s':'mix:f@67,c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'c','74o':'f','44':'f','42s':'f','A3o':'f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'f',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

}
