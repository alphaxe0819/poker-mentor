// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_Ah8h3c
// Generated: 2026-04-20T09:53:13.652Z
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

export const HU_40BB_SRP_AH8H3C: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_Ah8h3c_btn_cbet: {
    'AA':'b33','AKs':'mix:b33@51,b50','AQs':'mix:b33@53,b50','AJs':'mix:b33@50,b50','ATs':'mix:b33@55,b50','A9s':'mix:b33@56,b50',
    'A8s':'mix:b33@59,b50','A7s':'mix:x@45,b33','A6s':'mix:x@55,b33','A5s':'mix:x@49,b33','A4s':'mix:x@58,b33','A3s':'b33',
    'A2s':'mix:x@63,b33','AKo':'mix:b50@43,b33','KK':'x','KQs':'mix:x@45,b33','KJs':'mix:x@57,b33','KTs':'mix:x@59,b33',
    'K9s':'x','K8s':'mix:b33@53,b50','K7s':'x','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'mix:b33@44,b50','K2s':'x','AQo':'mix:b50@48,b33','KQo':'mix:x@46,b33','QQ':'x','QJs':'x',
    'QTs':'x','Q9s':'x','Q8s':'mix:b33@45,b50','Q7s':'x','Q6s':'x','Q5s':'x',
    'Q4s':'x','Q3s':'mix:b33@47,x','Q2s':'mix:x@55,b33','AJo':'mix:b50@48,b33','KJo':'mix:x@48,b33','QJo':'x',
    'JJ':'mix:x@59,b33','JTs':'mix:b33@52,x','J9s':'mix:x@41,b33','J8s':'mix:b33@44,b50','J7s':'x','J6s':'x',
    'J5s':'x','J4s':'mix:x@34,b50','J3s':'mix:b33@45,x','J2s':'mix:x@36,b50','ATo':'mix:b33@41,b50','KTo':'mix:b33@49,x',
    'QTo':'x','JTo':'mix:x@42,b33','TT':'mix:b33@45,x','T9s':'mix:x@32,b33','T8s':'mix:x@41,b33','T7s':'x',
    'T6s':'mix:x@46,b33','T5s':'mix:x@46,b50','T4s':'b50','T3s':'mix:x@49,b33','T2s':'b50','A9o':'mix:b33@41,b50',
    'K9o':'x','Q9o':'x','J9o':'mix:b50@35,x','T9o':'mix:x@38,b50','99':'mix:b50@52,b33','98s':'mix:x@56,b33',
    '97s':'mix:x@54,b33','96s':'mix:x@66,b33','95s':'mix:b50@42,b33','94s':'mix:b50@42,b33','93s':'mix:b33@50,x','92s':'mix:b50@42,b33',
    'A8o':'mix:b33@53,b50','K8o':'mix:b33@44,b50','Q8o':'mix:x@36,b33','J8o':'mix:x@37,b33','T8o':'x','98o':'x',
    '88':'mix:b33@56,b50','87s':'mix:b33@40,x','86s':'mix:x@37,b33','85s':'mix:b33@42,x','84s':'x','83s':'mix:b50@56,b100',
    '82s':'x','A7o':'mix:x@47,b33','K7o':'x','Q7o':'x','J7o':'mix:x@44,b33','T7o':'x',
    '97o':'x','87o':'mix:x@54,b33','77':'x','76s':'mix:b33@42,x','75s':'mix:x@56,b33','74s':'mix:x@40,b50',
    '73s':'x','72s':'mix:b33@41,b50','A6o':'x','K6o':'x','Q6o':'x','J6o':'x',
    'T6o':'mix:b33@53,b50','96o':'mix:b33@44,b50','86o':'x','76o':'x','66':'x','65s':'mix:x@52,b33',
    '64s':'x','63s':'x','62s':'mix:b33@52,b50','A5o':'mix:x@51,b33','K5o':'x','Q5o':'mix:x@56,b33',
    'J5o':'mix:b33@42,x','T5o':'mix:b33@40,b50','95o':'mix:b33@56,b50','85o':'mix:x@56,b33','75o':'mix:b33@34,b50','65o':'x',
    '55':'x','54s':'b33','53s':'x','52s':'x','K4o':'x','Q4o':'mix:b33@38,b50',
    'J4o':'mix:b33@40,b50','74o':'mix:b33@57,b50','64o':'mix:b33@38,x','54o':'mix:x@36,b33','44':'mix:x@55,b33','43s':'x',
    '42s':'mix:b33@38,x','K3o':'mix:b50@39,b33','Q3o':'mix:x@36,b33','J3o':'mix:x@44,b33','33':'mix:b33@54,b50','32s':'x',
    'K2o':'mix:x@44,b33','Q2o':'mix:b33@49,b50','J2o':'mix:b33@47,b50','22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah8h3c_bb_facing_cbet_small: {
    'A9s':'r','A8s':'r','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'mix:r@64,c','A2s':'c','K9s':'c','K8s':'c','K7s':'mix:c@50,f','K6s':'mix:c@50,f',
    'K5s':'mix:c@57,f','K4s':'mix:c@50,f','K3s':'c','K2s':'mix:f@50,c','QTs':'c','Q9s':'mix:c@65,f',
    'Q8s':'c','Q7s':'mix:f@50,c','Q6s':'mix:f@50,c','Q5s':'mix:f@50,c','Q4s':'mix:f@50,c','Q3s':'c',
    'Q2s':'mix:f@50,c','QJo':'c','JTs':'c','J9s':'mix:c@63,f','J8s':'c','J7s':'mix:f@50,c',
    'J6s':'mix:f@67,c','J5s':'mix:f@50,c','J4s':'mix:f@50,c','J3s':'c','J2s':'f','ATo':'r',
    'KTo':'c','QTo':'c','JTo':'mix:c@68,r','T9s':'mix:r@57,c','T8s':'c','T7s':'mix:f@50,r',
    'T6s':'mix:f@50,c','T5s':'mix:f@56,r','T4s':'mix:f@55,r','T3s':'c','T2s':'f','A9o':'r',
    'K9o':'c','Q9o':'mix:c@51,f','J9o':'mix:c@41,f','T9o':'mix:r@62,c','98s':'c','97s':'mix:f@46,r',
    '95s':'mix:f@50,r','94s':'mix:f@59,r','93s':'c','92s':'mix:f@69,r','A8o':'r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'r','87s':'mix:c@69,r',
    '84s':'mix:c@68,r','83s':'r','82s':'c','A7o':'c','K7o':'mix:c@50,f','Q7o':'mix:f@67,c',
    'J7o':'f','T7o':'mix:f@50,r','97o':'mix:f@45,c','87o':'c','77':'c','76s':'mix:f@50,r',
    '73s':'mix:c@69,r','72s':'f','A6o':'c','K6o':'mix:f@50,c','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'mix:f@50,c','86o':'c','76o':'mix:f@61,c','66':'c','62s':'f',
    'A5o':'c','K5o':'mix:c@51,f','Q5o':'mix:f@58,c','J5o':'f','T5o':'f','95o':'mix:f@57,r',
    '85o':'c','75o':'f','55':'c','52s':'r','A4o':'c','K4o':'mix:f@50,c',
    'Q4o':'f','84o':'c','74o':'f','44':'c','42s':'mix:c@66,r','A3o':'r',
    'K3o':'c','Q3o':'c','63o':'mix:c@64,r','53o':'c','43o':'mix:c@69,r','33':'r',
    '32s':'c','A2o':'c','K2o':'mix:f@51,c','Q2o':'f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah8h3c_bb_facing_cbet_mid: {
    'A9s':'mix:r@64,c','A8s':'r','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'mix:r@57,c','A2s':'c','K9s':'c','K8s':'c','K7s':'mix:f@50,c','K6s':'mix:f@50,c',
    'K5s':'mix:f@50,c','K4s':'mix:f@50,c','K3s':'c','K2s':'mix:f@50,c','QTs':'c','Q9s':'mix:c@50,f',
    'Q8s':'c','Q7s':'mix:f@58,c','Q6s':'mix:f@57,c','Q5s':'mix:f@50,c','Q4s':'mix:f@53,c','Q3s':'c',
    'Q2s':'mix:f@61,c','QJo':'c','JTs':'c','J9s':'mix:c@53,f','J8s':'c','J7s':'mix:f@64,c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'c','J2s':'f','ATo':'r',
    'KTo':'c','QTo':'c','JTo':'mix:c@68,r','T9s':'mix:c@52,r','T8s':'c','T7s':'mix:f@55,c',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'c','T2s':'f','A9o':'mix:r@65,c',
    'K9o':'mix:c@61,f','Q9o':'mix:f@50,c','J9o':'mix:f@49,c','T9o':'mix:r@46,c','98s':'c','97s':'mix:f@50,c',
    '95s':'f','94s':'f','93s':'c','92s':'f','A8o':'r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'mix:c@64,r','87s':'c',
    '84s':'c','83s':'r','82s':'c','A7o':'c','K7o':'mix:f@59,c','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'mix:f@50,r','87o':'c','77':'c','76s':'mix:f@69,c',
    '73s':'c','72s':'f','A6o':'c','K6o':'mix:f@67,c','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'c','76o':'f','66':'c','62s':'f',
    'A5o':'c','K5o':'mix:f@52,c','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'c','75o':'f','55':'c','52s':'c','A4o':'c','K4o':'mix:f@65,c',
    'Q4o':'f','84o':'c','74o':'f','44':'c','42s':'c','A3o':'mix:r@51,c',
    'K3o':'c','Q3o':'c','63o':'c','53o':'c','43o':'c','33':'r',
    '32s':'mix:c@70,r','A2o':'c','K2o':'f','Q2o':'f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah8h3c_bb_facing_cbet_large: {
    'A9s':'mix:c@59,r','A8s':'r','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'mix:c@68,r','A2s':'c','K9s':'mix:c@50,f','K8s':'c','K7s':'mix:f@55,c','K6s':'mix:f@61,c',
    'K5s':'mix:f@53,c','K4s':'mix:f@58,c','K3s':'c','K2s':'mix:f@58,c','QTs':'mix:c@64,f','Q9s':'mix:c@50,f',
    'Q8s':'c','Q7s':'mix:f@69,c','Q6s':'f','Q5s':'mix:f@69,c','Q4s':'f','Q3s':'c',
    'Q2s':'f','QJo':'c','JTs':'c','J9s':'mix:c@50,f','J8s':'c','J7s':'f',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'c','J2s':'f','ATo':'r',
    'KTo':'mix:c@39,f','QTo':'mix:c@54,f','JTo':'mix:c@61,f','T9s':'mix:c@45,f','T8s':'c','T7s':'f',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'c','T2s':'f','A9o':'mix:c@54,r',
    'K9o':'mix:f@50,c','Q9o':'mix:f@55,c','J9o':'mix:f@52,c','T9o':'mix:f@46,r','98s':'c','97s':'f',
    '95s':'f','94s':'f','93s':'c','92s':'f','A8o':'r','K8o':'c',
    'Q8o':'c','J8o':'c','T8o':'c','98o':'c','88':'c','87s':'c',
    '84s':'c','83s':'r','82s':'c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'c','77':'c','76s':'f',
    '73s':'c','72s':'f','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'c','76o':'f','66':'c','62s':'f',
    'A5o':'c','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'c','75o':'f','55':'c','52s':'c','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'c','74o':'f','44':'c','42s':'c','A3o':'mix:c@68,r',
    'K3o':'c','Q3o':'c','63o':'c','53o':'c','43o':'c','33':'r',
    '32s':'c','A2o':'c','K2o':'f','Q2o':'f','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_Ah8h3c_bb_facing_cbet_allin: {
    'A9s':'c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'c','K9s':'f','K8s':'c','K7s':'f','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'mix:f@61,c','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'c','Q7s':'f','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'mix:f@67,c',
    'Q2s':'f','QJo':'f','JTs':'f','J9s':'f','J8s':'mix:c@68,f','J7s':'f',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'mix:f@67,c','J2s':'f','ATo':'c',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'mix:c@61,f','T7s':'f',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'mix:f@67,c','T2s':'f','A9o':'c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'mix:c@53,f','97s':'f',
    '95s':'f','94s':'f','93s':'mix:f@67,c','92s':'f','A8o':'c','K8o':'c',
    'Q8o':'c','J8o':'mix:c@69,f','T8o':'mix:c@61,f','98o':'mix:c@54,f','88':'c','87s':'mix:f@61,c',
    '84s':'mix:f@66,c','83s':'c','82s':'mix:f@66,c','A7o':'c','K7o':'f','Q7o':'f',
    'J7o':'f','T7o':'f','97o':'f','87o':'mix:f@60,c','77':'f','76s':'f',
    '73s':'mix:f@67,c','72s':'f','A6o':'c','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:f@68,c','76o':'f','66':'f','62s':'f',
    'A5o':'c','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'mix:f@64,c','75o':'f','55':'f','52s':'f','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'mix:f@66,c','74o':'f','44':'f','42s':'f','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'c',
    '32s':'mix:f@67,c','A2o':'c','K2o':'f','Q2o':'f','22':'f',
  },

}
