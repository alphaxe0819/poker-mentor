// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_9s7s3s
// Generated: 2026-04-20T08:44:33.376Z
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

export const HU_40BB_SRP_9S7S3S: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_9s7s3s_btn_cbet: {
    'AA':'mix:b100@56,b50','AKs':'x','AQs':'x','AJs':'mix:x@40,b33','ATs':'mix:x@37,b50','A9s':'mix:b50@52,b33',
    'A8s':'mix:b50@37,x','A7s':'x','A6s':'mix:b50@34,x','A5s':'mix:x@39,b50','A4s':'mix:x@46,b50','A3s':'x',
    'A2s':'mix:x@37,b50','AKo':'mix:x@31,b50','KK':'mix:b100@49,b50','KQs':'mix:x@39,b50','KJs':'mix:b50@37,b33','KTs':'mix:b50@38,b33',
    'K9s':'b50','K8s':'mix:b50@41,b33','K7s':'mix:x@51,b50','K6s':'mix:b50@35,x','K5s':'x','K4s':'x',
    'K3s':'mix:x@59,b50','K2s':'x','AQo':'x','KQo':'mix:x@55,b50','QQ':'mix:b50@45,b100','QJs':'mix:b50@37,x',
    'QTs':'mix:b50@37,x','Q9s':'x','Q8s':'mix:b50@43,b33','Q7s':'x','Q6s':'mix:b50@34,x','Q5s':'x',
    'Q4s':'x','Q3s':'x','Q2s':'x','AJo':'mix:b33@31,b50','KJo':'mix:x@37,b50','QJo':'x',
    'JJ':'mix:b100@53,b50','JTs':'mix:x@48,b50','J9s':'x','J8s':'mix:x@39,b50','J7s':'x','J6s':'mix:b50@42,b33',
    'J5s':'mix:b50@36,x','J4s':'mix:b50@36,x','J3s':'x','J2s':'mix:x@34,b50','ATo':'x','KTo':'mix:x@41,b50',
    'QTo':'x','JTo':'mix:x@39,b33','TT':'mix:b100@61,b50','T9s':'x','T8s':'x','T7s':'x',
    'T6s':'b50','T5s':'mix:b50@39,b33','T4s':'mix:b50@42,b33','T3s':'x','T2s':'mix:b50@38,b33','A9o':'mix:b50@52,b33',
    'K9o':'b50','Q9o':'mix:x@46,b50','J9o':'mix:x@38,b50','T9o':'mix:x@38,b50','99':'mix:b33@60,b50','98s':'mix:x@46,b50',
    '97s':'mix:b50@55,b100','96s':'mix:x@55,b50','95s':'mix:x@47,b50','94s':'mix:x@42,b50','93s':'mix:b33@51,b50','92s':'x',
    'A8o':'x','K8o':'mix:x@48,b50','Q8o':'mix:x@37,b50','J8o':'x','T8o':'x','98o':'mix:b50@32,x',
    '88':'mix:x@42,b50','87s':'x','86s':'x','85s':'mix:x@43,b50','84s':'mix:b50@43,b33','83s':'x',
    '82s':'mix:b50@43,b33','A7o':'mix:b50@32,b33','K7o':'mix:x@35,b50','Q7o':'mix:x@48,b50','J7o':'mix:x@45,b50','T7o':'x',
    '97o':'mix:b50@56,b100','87o':'x','77':'mix:b50@49,b33','76s':'mix:x@48,b50','75s':'mix:x@41,b50','74s':'mix:b50@35,b33',
    '73s':'mix:b50@39,b33','72s':'x','A6o':'x','K6o':'mix:x@41,b50','Q6o':'mix:x@37,b50','J6o':'mix:b50@38,x',
    'T6o':'mix:x@35,b33','96o':'mix:b50@39,x','86o':'x','76o':'mix:x@48,b50','66':'x','65s':'x',
    '64s':'mix:x@53,b50','63s':'x','62s':'b50','A5o':'x','K5o':'x','Q5o':'x',
    'J5o':'mix:x@38,b50','T5o':'b50','95o':'mix:b50@38,x','85o':'mix:x@41,b33','75o':'x','65o':'x',
    '55':'x','54s':'mix:x@36,b50','53s':'x','52s':'mix:b50@32,b33','K4o':'x','Q4o':'x',
    'J4o':'mix:x@34,b50','74o':'x','64o':'mix:x@49,b33','54o':'x','44':'x','43s':'mix:x@48,b50',
    '42s':'mix:b33@32,b50','K3o':'x','Q3o':'x','J3o':'x','33':'mix:b50@56,b100','32s':'mix:x@49,b50',
    'K2o':'x','Q2o':'x','J2o':'mix:x@35,b50','22':'x',
  },

  // ──────────────────────────────
  hu_40bb_srp_9s7s3s_bb_facing_cbet_small: {
    'A9s':'allin','A8s':'c','A7s':'c','A6s':'mix:f@52,c','A5s':'mix:f@55,c','A4s':'f',
    'A3s':'c','A2s':'f','K9s':'mix:c@41,allin','K8s':'mix:f@61,c','K7s':'c','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'c','K2s':'f','QTs':'mix:c@38,f','Q9s':'c',
    'Q8s':'f','Q7s':'c','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'c',
    'Q2s':'f','QJo':'c','JTs':'c','J9s':'c','J8s':'c','J7s':'c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'c','J2s':'f','ATo':'c',
    'KTo':'c','QTo':'c','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'c','T5s':'f','T4s':'f','T3s':'mix:c@56,r','T2s':'f','A9o':'mix:allin@64,r',
    'K9o':'mix:r@52,c','Q9o':'mix:c@61,r','J9o':'mix:c@67,allin','T9o':'mix:c@67,allin','98s':'c','97s':'allin',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'c','K8o':'mix:c@56,f',
    'Q8o':'mix:f@50,c','J8o':'c','T8o':'c','98o':'c','88':'mix:c@68,allin','87s':'c',
    '84s':'f','83s':'mix:c@59,r','82s':'f','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'mix:c@69,allin','T7o':'mix:c@67,allin','97o':'allin','87o':'mix:c@67,allin','77':'mix:r@60,c','76s':'c',
    '73s':'mix:c@56,allin','72s':'mix:c@70,r','A6o':'mix:c@52,f','K6o':'mix:f@50,c','Q6o':'mix:f@50,c','J6o':'mix:f@50,c',
    'T6o':'c','96o':'c','86o':'c','76o':'mix:c@68,allin','66':'c','62s':'f',
    'A5o':'mix:c@53,f','K5o':'mix:f@50,c','Q5o':'mix:f@50,c','J5o':'mix:f@50,c','T5o':'mix:f@50,c','95o':'mix:c@66,allin',
    '85o':'c','75o':'c','55':'c','52s':'f','A4o':'mix:c@43,f','K4o':'mix:f@50,c',
    'Q4o':'mix:f@50,c','84o':'mix:f@50,c','74o':'c','44':'c','42s':'f','A3o':'c',
    'K3o':'c','Q3o':'c','63o':'mix:c@56,allin','53o':'c','43o':'c','33':'r',
    '32s':'mix:c@67,r','A2o':'mix:f@46,c','K2o':'mix:f@50,c','Q2o':'mix:f@50,c','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_9s7s3s_bb_facing_cbet_mid: {
    'A9s':'allin','A8s':'f','A7s':'c','A6s':'f','A5s':'f','A4s':'f',
    'A3s':'c','A2s':'f','K9s':'mix:c@44,allin','K8s':'f','K7s':'c','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'c','K2s':'f','QTs':'f','Q9s':'c',
    'Q8s':'f','Q7s':'c','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'c',
    'Q2s':'f','QJo':'mix:f@50,c','JTs':'c','J9s':'c','J8s':'mix:c@67,f','J7s':'c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'c','J2s':'f','ATo':'mix:f@41,allin',
    'KTo':'mix:f@50,c','QTo':'mix:f@50,c','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'mix:c@48,r','T2s':'f','A9o':'allin',
    'K9o':'mix:r@41,c','Q9o':'c','J9o':'mix:c@67,allin','T9o':'mix:c@67,allin','98s':'c','97s':'allin',
    '95s':'c','94s':'c','93s':'mix:c@70,allin','92s':'c','A8o':'mix:f@50,c','K8o':'mix:f@50,c',
    'Q8o':'mix:f@50,c','J8o':'c','T8o':'c','98o':'mix:c@67,allin','88':'mix:c@61,allin','87s':'c',
    '84s':'f','83s':'mix:c@45,r','82s':'f','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'mix:c@67,allin','97o':'allin','87o':'mix:c@67,allin','77':'allin','76s':'c',
    '73s':'allin','72s':'c','A6o':'mix:f@50,c','K6o':'mix:f@50,c','Q6o':'mix:f@50,c','J6o':'mix:f@50,c',
    'T6o':'mix:c@52,f','96o':'mix:c@67,allin','86o':'c','76o':'c','66':'mix:c@61,f','62s':'f',
    'A5o':'mix:f@50,c','K5o':'mix:f@50,c','Q5o':'mix:f@50,c','J5o':'mix:f@50,c','T5o':'mix:f@50,c','95o':'mix:c@67,allin',
    '85o':'mix:c@50,f','75o':'c','55':'mix:c@53,f','52s':'f','A4o':'mix:f@50,c','K4o':'mix:f@50,c',
    'Q4o':'mix:f@50,c','84o':'mix:f@50,c','74o':'c','44':'mix:c@50,f','42s':'f','A3o':'c',
    'K3o':'c','Q3o':'c','63o':'mix:c@50,f','53o':'c','43o':'c','33':'allin',
    '32s':'c','A2o':'mix:f@50,c','K2o':'mix:f@50,c','Q2o':'mix:f@57,c','22':'mix:f@50,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_9s7s3s_bb_facing_cbet_large: {
    'A9s':'allin','A8s':'f','A7s':'c','A6s':'f','A5s':'f','A4s':'f',
    'A3s':'mix:c@53,f','A2s':'f','K9s':'mix:c@56,allin','K8s':'f','K7s':'c','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'mix:f@66,c','K2s':'f','QTs':'f','Q9s':'c',
    'Q8s':'f','Q7s':'c','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'mix:f@67,c',
    'Q2s':'f','QJo':'mix:f@50,c','JTs':'c','J9s':'c','J8s':'f','J7s':'c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'mix:f@67,c','J2s':'f','ATo':'mix:f@50,allin',
    'KTo':'mix:f@50,c','QTo':'mix:f@50,c','JTo':'c','T9s':'c','T8s':'c','T7s':'c',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'mix:f@67,c','T2s':'f','A9o':'allin',
    'K9o':'mix:c@51,allin','Q9o':'mix:c@67,allin','J9o':'mix:c@67,allin','T9o':'mix:c@67,allin','98s':'c','97s':'allin',
    '95s':'c','94s':'c','93s':'c','92s':'c','A8o':'mix:f@50,c','K8o':'mix:f@50,c',
    'Q8o':'mix:f@50,c','J8o':'mix:f@50,c','T8o':'c','98o':'mix:c@67,allin','88':'mix:f@42,c','87s':'mix:c@67,f',
    '84s':'f','83s':'mix:f@67,c','82s':'f','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'mix:c@57,allin','97o':'allin','87o':'mix:c@56,allin','77':'allin','76s':'mix:f@66,c',
    '73s':'allin','72s':'mix:f@66,c','A6o':'mix:f@50,c','K6o':'mix:f@50,c','Q6o':'f','J6o':'f',
    'T6o':'mix:f@50,c','96o':'mix:c@67,allin','86o':'c','76o':'mix:c@39,allin','66':'mix:f@50,c','62s':'f',
    'A5o':'mix:f@50,c','K5o':'mix:f@57,c','Q5o':'mix:f@67,c','J5o':'f','T5o':'f','95o':'mix:c@67,allin',
    '85o':'mix:f@50,c','75o':'c','55':'mix:f@50,c','52s':'f','A4o':'mix:f@50,c','K4o':'mix:f@61,c',
    'Q4o':'f','84o':'f','74o':'c','44':'mix:f@50,c','42s':'f','A3o':'c',
    'K3o':'mix:c@52,allin','Q3o':'mix:c@51,allin','63o':'mix:f@44,c','53o':'mix:c@58,f','43o':'mix:c@68,f','33':'allin',
    '32s':'mix:f@67,c','A2o':'f','K2o':'f','Q2o':'f','22':'mix:f@51,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_9s7s3s_bb_facing_cbet_allin: {
    'A9s':'mix:c@62,f','A8s':'f','A7s':'f','A6s':'f','A5s':'f','A4s':'f',
    'A3s':'f','A2s':'f','K9s':'mix:f@50,c','K8s':'f','K7s':'f','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'f','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'f','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'f','QJo':'mix:f@50,c','JTs':'f','J9s':'mix:f@58,c','J8s':'f','J7s':'f',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'f','J2s':'f','ATo':'mix:f@65,c',
    'KTo':'f','QTo':'f','JTo':'mix:f@50,c','T9s':'mix:c@68,f','T8s':'f','T7s':'f',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'f','T2s':'f','A9o':'c',
    'K9o':'mix:c@66,f','Q9o':'mix:f@55,c','J9o':'mix:c@53,f','T9o':'mix:c@69,f','98s':'f','97s':'c',
    '95s':'f','94s':'f','93s':'c','92s':'f','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'mix:c@50,f','98o':'mix:c@51,f','88':'mix:c@50,f','87s':'f',
    '84s':'f','83s':'f','82s':'f','A7o':'mix:f@67,c','K7o':'mix:f@67,c','Q7o':'mix:f@67,c',
    'J7o':'mix:f@67,c','T7o':'mix:f@67,c','97o':'c','87o':'mix:f@67,c','77':'c','76s':'f',
    '73s':'c','72s':'f','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'mix:f@66,c','86o':'f','76o':'mix:f@67,c','66':'f','62s':'f',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'mix:f@67,c',
    '85o':'f','75o':'mix:f@67,c','55':'f','52s':'f','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'mix:f@69,c','44':'f','42s':'f','A3o':'mix:f@67,c',
    'K3o':'mix:f@67,c','Q3o':'mix:f@67,c','63o':'mix:f@69,c','53o':'f','43o':'f','33':'c',
    '32s':'f','A2o':'f','K2o':'f','Q2o':'f','22':'f',
  },

}
