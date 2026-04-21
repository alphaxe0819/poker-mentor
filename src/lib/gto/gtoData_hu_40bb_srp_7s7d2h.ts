// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// =============================================================
// GTO Postflop Range Data — HU Tournament
// Source: TexasSolver v0.2.0 (AGPL-3.0, generated locally)
// Scenario: hu_40bb_srp_7s7d2h
// Generated: 2026-04-20T06:49:26.730Z
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

export const HU_40BB_SRP_7S7D2H: GtoDatabase = {

  // ──────────────────────────────
  hu_40bb_srp_7s7d2h_btn_cbet: {
    'AA':'x','AKs':'b33','AQs':'b33','AJs':'b33','ATs':'b33','A9s':'b33',
    'A8s':'mix:b33@60,x','A7s':'mix:b33@69,x','A6s':'mix:b33@51,x','A5s':'mix:x@62,b33','A4s':'x','A3s':'x',
    'A2s':'mix:b33@60,b50','AKo':'b33','KK':'x','KQs':'b33','KJs':'mix:b33@69,x','KTs':'mix:b33@58,x',
    'K9s':'mix:x@55,b33','K8s':'x','K7s':'b33','K6s':'x','K5s':'x','K4s':'x',
    'K3s':'x','K2s':'b33','AQo':'mix:b33@50,x','KQo':'mix:x@53,b33','QQ':'b33','QJs':'mix:x@51,b33',
    'QTs':'mix:x@70,b33','Q9s':'mix:x@64,b33','Q8s':'mix:x@58,b33','Q7s':'b33','Q6s':'mix:b33@52,x','Q5s':'mix:x@51,b33',
    'Q4s':'mix:b33@62,x','Q3s':'x','Q2s':'b33','AJo':'mix:b33@54,x','KJo':'mix:x@66,b33','QJo':'x',
    'JJ':'b33','JTs':'mix:b33@54,x','J9s':'mix:b33@67,x','J8s':'b33','J7s':'b33','J6s':'mix:b33@58,x',
    'J5s':'mix:b33@56,x','J4s':'mix:b33@63,x','J3s':'mix:x@68,b33','J2s':'b33','ATo':'mix:b33@61,x','KTo':'mix:x@65,b33',
    'QTo':'x','JTo':'mix:x@55,b33','TT':'b33','T9s':'mix:b33@66,x','T8s':'mix:b33@52,x','T7s':'b33',
    'T6s':'mix:b33@66,x','T5s':'mix:b33@54,x','T4s':'mix:b33@59,x','T3s':'mix:x@46,b33','T2s':'b33','A9o':'mix:x@50,b33',
    'K9o':'x','Q9o':'mix:x@60,b33','J9o':'mix:b33@63,x','T9o':'mix:x@52,b33','99':'b33','98s':'mix:b33@65,x',
    '97s':'b33','96s':'mix:b33@53,x','95s':'mix:b33@54,x','94s':'mix:b33@65,x','93s':'b33','92s':'mix:b33@67,x',
    'A8o':'mix:x@64,b33','K8o':'x','Q8o':'mix:b33@54,x','J8o':'b33','T8o':'mix:b33@63,x','98o':'mix:x@63,b33',
    '88':'mix:b33@56,b50','87s':'b33','86s':'b33','85s':'x','84s':'mix:b33@53,x','83s':'mix:b33@61,b50',
    '82s':'b33','A7o':'mix:b33@68,x','K7o':'b33','Q7o':'b33','J7o':'b33','T7o':'b33',
    '97o':'b33','87o':'mix:b33@68,x','77':'x','76s':'b33','75s':'b33','74s':'b33',
    '73s':'b33','72s':'x','A6o':'x','K6o':'x','Q6o':'mix:b33@56,x','J6o':'b33',
    'T6o':'b33','96o':'b33','86o':'mix:x@60,b33','76o':'b33','66':'mix:b33@62,b50','65s':'b33',
    '64s':'mix:x@54,b33','63s':'mix:x@49,b33','62s':'mix:b33@64,x','A5o':'x','K5o':'x','Q5o':'mix:b33@62,x',
    'J5o':'b33','T5o':'b33','95o':'b33','85o':'b33','75o':'b33','65o':'mix:x@52,b33',
    '55':'b33','54s':'b33','53s':'x','52s':'mix:b33@55,x','K4o':'mix:b33@67,x','Q4o':'b33',
    'J4o':'b33','74o':'b33','64o':'b33','54o':'mix:x@68,b33','44':'b33','43s':'x',
    '42s':'mix:b33@50,x','K3o':'mix:x@55,b33','Q3o':'b33','J3o':'b33','33':'b33','32s':'mix:x@66,b33',
    'K2o':'b33','Q2o':'mix:b33@54,x','J2o':'mix:b33@51,x','22':'mix:x@62,b33',
  },

  // ──────────────────────────────
  hu_40bb_srp_7s7d2h_bb_facing_cbet_small: {
    'A9s':'mix:r@64,c','A8s':'c','A7s':'c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'r','K9s':'c','K8s':'c','K7s':'c','K6s':'c',
    'K5s':'c','K4s':'c','K3s':'mix:c@38,r','K2s':'r','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'r','Q6s':'mix:c@43,r','Q5s':'mix:r@47,c','Q4s':'r','Q3s':'mix:r@69,f',
    'Q2s':'mix:r@62,c','QJo':'c','JTs':'mix:r@51,c','J9s':'mix:r@48,c','J8s':'mix:r@40,c','J7s':'r',
    'J6s':'mix:c@57,f','J5s':'mix:c@44,r','J4s':'mix:r@45,c','J3s':'mix:r@55,f','J2s':'mix:c@55,r','ATo':'mix:r@61,c',
    'KTo':'c','QTo':'mix:c@52,f','JTo':'mix:c@49,r','T9s':'r','T8s':'r','T7s':'r',
    'T6s':'mix:r@65,f','T5s':'mix:r@41,c','T4s':'mix:r@53,f','T3s':'mix:r@62,f','T2s':'r','A9o':'mix:c@63,r',
    'K9o':'c','Q9o':'f','J9o':'f','T9o':'mix:r@54,c','98s':'r','97s':'mix:r@64,c',
    '95s':'mix:r@69,f','94s':'mix:r@39,f','93s':'mix:f@56,r','92s':'r','A8o':'c','K8o':'mix:c@66,r',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'mix:r@60,c','88':'mix:r@53,c','87s':'mix:c@51,r',
    '84s':'mix:r@64,f','83s':'f','82s':'r','A7o':'c','K7o':'c','Q7o':'r',
    'J7o':'r','T7o':'r','97o':'mix:r@64,c','87o':'mix:c@53,r','77':'c','76s':'r',
    '73s':'r','72s':'c','A6o':'c','K6o':'mix:c@41,f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:r@65,c','76o':'r','66':'mix:c@61,r','62s':'r',
    'A5o':'c','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'r','55':'mix:c@69,r','52s':'r','A4o':'c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'r','44':'mix:c@52,r','42s':'r','A3o':'c',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'r',
    '32s':'r','A2o':'r','K2o':'mix:r@61,c','Q2o':'mix:c@57,r','22':'mix:r@52,c',
  },

  // ──────────────────────────────
  hu_40bb_srp_7s7d2h_bb_facing_cbet_mid: {
    'A9s':'r','A8s':'c','A7s':'mix:r@59,c','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'r','K9s':'c','K8s':'c','K7s':'mix:r@63,c','K6s':'c',
    'K5s':'c','K4s':'mix:c@66,f','K3s':'mix:c@52,f','K2s':'r','QTs':'c','Q9s':'c',
    'Q8s':'c','Q7s':'r','Q6s':'c','Q5s':'mix:c@44,f','Q4s':'mix:r@35,f','Q3s':'mix:f@44,r',
    'Q2s':'mix:r@55,c','QJo':'c','JTs':'c','J9s':'c','J8s':'mix:c@48,r','J7s':'r',
    'J6s':'mix:f@38,c','J5s':'mix:f@58,c','J4s':'mix:f@55,r','J3s':'mix:f@64,r','J2s':'c','ATo':'mix:r@62,c',
    'KTo':'c','QTo':'f','JTo':'mix:f@68,c','T9s':'mix:c@50,r','T8s':'mix:r@51,c','T7s':'r',
    'T6s':'r','T5s':'f','T4s':'f','T3s':'f','T2s':'r','A9o':'mix:r@58,c',
    'K9o':'mix:f@54,c','Q9o':'f','J9o':'f','T9o':'mix:f@47,r','98s':'mix:r@54,c','97s':'mix:r@70,c',
    '95s':'mix:r@58,f','94s':'f','93s':'f','92s':'r','A8o':'mix:r@64,c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'mix:f@63,r','98o':'r','88':'r','87s':'mix:r@59,c',
    '84s':'mix:r@69,f','83s':'f','82s':'r','A7o':'mix:r@61,c','K7o':'mix:r@65,c','Q7o':'r',
    'J7o':'r','T7o':'r','97o':'mix:r@69,c','87o':'mix:r@56,c','77':'c','76s':'r',
    '73s':'r','72s':'c','A6o':'mix:c@49,r','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:r@62,f','76o':'r','66':'r','62s':'r',
    'A5o':'mix:c@66,r','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'r','55':'c','52s':'r','A4o':'mix:r@62,c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'r','44':'mix:c@58,r','42s':'r','A3o':'r',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'r',
    '32s':'r','A2o':'r','K2o':'mix:r@69,c','Q2o':'mix:c@63,r','22':'mix:c@68,r',
  },

  // ──────────────────────────────
  hu_40bb_srp_7s7d2h_bb_facing_cbet_large: {
    'A9s':'mix:r@64,c','A8s':'mix:c@54,r','A7s':'r','A6s':'c','A5s':'c','A4s':'c',
    'A3s':'c','A2s':'r','K9s':'c','K8s':'c','K7s':'r','K6s':'c',
    'K5s':'mix:c@60,f','K4s':'mix:f@45,c','K3s':'mix:f@49,r','K2s':'r','QTs':'c','Q9s':'mix:c@54,f',
    'Q8s':'mix:f@45,c','Q7s':'r','Q6s':'mix:f@62,c','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'mix:r@52,c','QJo':'mix:c@52,f','JTs':'mix:c@50,r','J9s':'mix:c@47,r','J8s':'mix:c@40,f','J7s':'r',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'f','J2s':'mix:c@67,r','ATo':'mix:r@59,c',
    'KTo':'mix:f@48,c','QTo':'f','JTo':'f','T9s':'mix:r@39,c','T8s':'mix:r@44,c','T7s':'r',
    'T6s':'mix:f@63,r','T5s':'f','T4s':'f','T3s':'f','T2s':'r','A9o':'mix:r@63,c',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'mix:f@67,r','98s':'mix:r@43,c','97s':'r',
    '95s':'f','94s':'f','93s':'f','92s':'mix:r@66,c','A8o':'mix:r@69,c','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'mix:f@66,r','98o':'mix:f@49,r','88':'r','87s':'r',
    '84s':'mix:f@68,r','83s':'f','82s':'r','A7o':'r','K7o':'r','Q7o':'r',
    'J7o':'r','T7o':'r','97o':'r','87o':'r','77':'mix:r@69,c','76s':'r',
    '73s':'r','72s':'mix:c@59,r','A6o':'mix:r@41,f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'mix:f@64,r','76o':'r','66':'r','62s':'r',
    'A5o':'mix:c@41,r','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'r','55':'mix:r@64,c','52s':'mix:r@68,c','A4o':'mix:r@50,c','K4o':'f',
    'Q4o':'f','84o':'f','74o':'r','44':'mix:r@52,c','42s':'r','A3o':'mix:r@61,f',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'mix:r@62,c',
    '32s':'r','A2o':'r','K2o':'r','Q2o':'mix:c@51,r','22':'c',
  },

  // ──────────────────────────────
  hu_40bb_srp_7s7d2h_bb_facing_cbet_allin: {
    'A9s':'mix:f@63,c','A8s':'f','A7s':'c','A6s':'f','A5s':'f','A4s':'f',
    'A3s':'f','A2s':'c','K9s':'f','K8s':'f','K7s':'c','K6s':'f',
    'K5s':'f','K4s':'f','K3s':'f','K2s':'c','QTs':'f','Q9s':'f',
    'Q8s':'f','Q7s':'c','Q6s':'f','Q5s':'f','Q4s':'f','Q3s':'f',
    'Q2s':'c','QJo':'f','JTs':'f','J9s':'f','J8s':'f','J7s':'c',
    'J6s':'f','J5s':'f','J4s':'f','J3s':'f','J2s':'c','ATo':'mix:f@68,c',
    'KTo':'f','QTo':'f','JTo':'f','T9s':'f','T8s':'f','T7s':'c',
    'T6s':'f','T5s':'f','T4s':'f','T3s':'f','T2s':'c','A9o':'f',
    'K9o':'f','Q9o':'f','J9o':'f','T9o':'f','98s':'f','97s':'c',
    '95s':'f','94s':'f','93s':'f','92s':'c','A8o':'f','K8o':'f',
    'Q8o':'f','J8o':'f','T8o':'f','98o':'f','88':'c','87s':'c',
    '84s':'f','83s':'f','82s':'c','A7o':'c','K7o':'c','Q7o':'c',
    'J7o':'c','T7o':'c','97o':'c','87o':'c','77':'c','76s':'c',
    '73s':'c','72s':'c','A6o':'f','K6o':'f','Q6o':'f','J6o':'f',
    'T6o':'f','96o':'f','86o':'f','76o':'c','66':'c','62s':'c',
    'A5o':'f','K5o':'f','Q5o':'f','J5o':'f','T5o':'f','95o':'f',
    '85o':'f','75o':'c','55':'c','52s':'c','A4o':'f','K4o':'f',
    'Q4o':'f','84o':'f','74o':'c','44':'c','42s':'c','A3o':'mix:f@56,c',
    'K3o':'f','Q3o':'f','63o':'f','53o':'f','43o':'f','33':'c',
    '32s':'c','A2o':'c','K2o':'c','Q2o':'c','22':'c',
  },

}
