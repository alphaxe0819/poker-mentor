// =============================================================
// mtt_9max_ranges.mjs — Course-sourced MTT 9-max preflop ranges
// =============================================================
// T-075 Phase 1 (2026-04-21)
// Source: pokerdinosaur "Course" project (S0 課程表格)
//   - Total tables: 353 / distinct names: 149
//   - auto-parseable: 205 tables → 110 distinct names (58% parse rate)
// 本檔自動產出（別手改；重跑 build-mtt-ranges-tmp.mjs 更新）
//
// 每 entry = 一個 pd table.name（對應 N 個 scenario_id/depth variant）
// hero / villain 欄位是 parseTableName 結果；null 表 parser 未 confirm
// scenario_tag 值：open / flat / 3bet / limp / jam
// range 字串：TexasSolver notation（comma-separated），含全部 hero non-fold hands
// =============================================================

export const COURSE_RANGES = {
  "open_25bb": {
    hero: null, villain: null, scenario: "open", depth_bb: 25, covered_sids: 1, hand_count: 152, raw_name: "20-25BB VS RAISE",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,98o,97o,96o,95o,87o,86o,85o,76o,75o,74o,65o,64o,54o,53o,43o",
  },
  "flat_bb_vs_sb": {
    hero: "BB", villain: "SB", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 148, raw_name: "BB VS SB",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,T9o,T8o,T7o,T6o,98o,97o,96o,87o,86o,85o,76o,75o,74o,65o,64o,54o,53o,43o",
  },
  "open_btn_vs_ep_v4": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 25, raw_name: "BU VS EP OPEN + EP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A5s,KQs,KJs,QJs,65s,54s,AKo,AQo",
  },
  "flat_bb_vs_utg_v3": {
    hero: "BB", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 7, raw_name: "MP-BB VS UTG-UTG2",
    range: "AA,KK,QQ,JJ,AKs,AQs,AKo",
  },
  "flat_mp": {
    hero: "MP", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 8, raw_name: "MP VS MP/UTG & UTG/UTG",
    range: "AA,KK,QQ,JJ,AKs,AQs,KQs,AKo",
  },
  "flat_mp_vs_utg_v2": {
    hero: "MP", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 8, raw_name: "BB-MP VS UTG/UTG2",
    range: "AA,KK,QQ,JJ,AKs,AQs,KQs,AKo",
  },
  "flat_bb_vs_ep": {
    hero: "BB", villain: "EP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 14, raw_name: "BB VS EP/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,A5s,A4s,KJs,KTs,QJs,JTs,AKo,AQo",
  },
  "open_btn_vs_ep_v5": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 44, raw_name: "BU VS EP OPEN AND EP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,KQo",
  },
  "open_btn_vs_co": {
    hero: "BTN", villain: "CO", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 39, raw_name: "BU VS CO OPEN + HJ FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,65s,54s,AKo,AQo,AJo,ATo,KQo",
  },
  "flat_bb_vs_btn": {
    hero: "BB", villain: "BTN", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 147, raw_name: "BB VS BU",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,T9o,T8o,T7o,T6o,98o,97o,96o,87o,86o,85o,76o,75o,65o,64o,54o,53o,43o",
  },
  "open_20bb": {
    hero: null, villain: null, scenario: "open", depth_bb: 20, covered_sids: 1, hand_count: 157, raw_name: "15-20BB VS RAISE",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,T5o,T4o,T3o,98o,97o,96o,95o,94o,87o,86o,85o,76o,75o,74o,65o,64o,63o,54o,53o,43o",
  },
  "flat_bb_vs_mp_v3": {
    hero: "BB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 23, raw_name: "BB VS MP/LP",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,A9s,A8s,A5s,A4s,KJs,KTs,K9s,QJs,J9s,T8s,98s,87s,76s,65s,AKo,AQo",
  },
  "flat_btn_vs_utg_v2": {
    hero: "BTN", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 9, raw_name: "HJ/CO/BU VS UTG/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AJs,KQs,AKo",
  },
  "flat_bb_vs_utgp1": {
    hero: "BB", villain: "UTG+1", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 7, raw_name: "HJ-BB VS UTG+1/2-MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AKo",
  },
  "open_btn_vs_hj": {
    hero: "BTN", villain: "HJ", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 52, raw_name: "BU VS HJ OPEN & CO FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,ATo,KQo",
  },
  "flat_hj_vs_utg_v2": {
    hero: "HJ", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 9, raw_name: "BB-HJ VS UTG/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AJs,KQs,AKo",
  },
  "open_btn_vs_ep_v6": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 45, raw_name: "BU VS EP OPEN AND MP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,T8s,98s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,KQo",
  },
  "open_btn_vs_ep": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 48, raw_name: "BU VS EP OPEN AND CO FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,KQo",
  },
  "flat_co_vs_hj": {
    hero: "CO", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 10, raw_name: "BB-CO VS HJ/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AJs,KQs,AKo,AQo",
  },
  "open_btn_vs_ep_v3": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 26, raw_name: "BU VS EP OPEN + MP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,65s,54s,AKo,AQo",
  },
  "flat_bb_vs_utg_v2": {
    hero: "BB", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 9, raw_name: "SB/BB VS UTG/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,KQs,AKo,AQo",
  },
  "flat_bb_vs_co_v2": {
    hero: "BB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 146, raw_name: "BB VS CO",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,T9o,T8o,T7o,T6o,98o,97o,96o,87o,86o,76o,75o,65o,64o,54o,53o,43o",
  },
  "limp_25bb": {
    hero: null, villain: null, scenario: "limp", depth_bb: 25, covered_sids: 1, hand_count: 169, raw_name: "20-25BB VS LIMP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,T5o,T4o,T3o,T2o,98o,97o,96o,95o,94o,93o,92o,87o,86o,85o,84o,83o,82o,76o,75o,74o,73o,72o,65o,64o,63o,62o,54o,53o,52o,43o,42o,32o",
  },
  "flat_bb_vs_co_v3": {
    hero: "BB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 39, raw_name: "BB VS CO/BU/SB",
    range: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A9s,A5s,A4s,A3s,A2s,KQs,KJs,K8s,QJs,Q9s,Q8s,J9s,J8s,T9s,T8s,T7s,98s,97s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,A5o,KQo,KJo",
  },
  "flat_bb_vs_hj_v3": {
    hero: "BB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 9, raw_name: "CO-BB VS HJ/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AJs,KQs,AKo",
  },
  "flat_bb_vs_mp": {
    hero: "BB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 128, raw_name: "BB VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,QJo,QTo,Q9o,Q8o,JTo,J9o,J8o,T9o,T8o,98o,97o,87o,86o,76o,75o,65o,64o,54o,43o",
  },
  "flat_sb_vs_ep": {
    hero: "SB", villain: "EP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 20, raw_name: "SB VS EP/MP",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,A8s,A7s,A5s,A4s,KQs,KJs,KTs,QJs,JTs,AKo,AQo,AJo,KQo",
  },
  "flat_bb_vs_hj_v2": {
    hero: "BB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 3, hand_count: 136, raw_name: "BB VS HJ",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,JTo,J9o,J8o,J7o,T9o,T8o,T7o,98o,97o,87o,86o,76o,75o,65o,64o,54o,53o",
  },
  "limp_10bb": {
    hero: null, villain: null, scenario: "limp", depth_bb: 10, covered_sids: 1, hand_count: 142, raw_name: "LIMP/SHOVING 8-10BB",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,T9o,T8o,T7o,T6o,98o,97o,96o,87o,86o,85o,76o,75o,65o,64o,54o",
  },
  "open_btn_vs_ep_v2": {
    hero: "BTN", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 47, raw_name: "BU VS EP OPEN + CO FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,75s,65s,64s,54s,43s,AKo,AQo,AJo,KQo",
  },
  "flat_bb_vs_co": {
    hero: "BB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 13, raw_name: "SB/BB VS CO/BU",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,KQs,KJs,AKo,AQo",
  },
  "limp_20bb": {
    hero: null, villain: null, scenario: "limp", depth_bb: 20, covered_sids: 1, hand_count: 169, raw_name: "15-20BB VS LIMP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,T5o,T4o,T3o,T2o,98o,97o,96o,95o,94o,93o,92o,87o,86o,85o,84o,83o,82o,76o,75o,74o,73o,72o,65o,64o,63o,62o,54o,53o,52o,43o,42o,32o",
  },
  "flat_btn_vs_co_v2": {
    hero: "BTN", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 14, raw_name: "BU VS CO/HJ",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,ATs,A5s,KQs,KJs,AKo,AQo",
  },
  "flat_btn_vs_utgp2_v2": {
    hero: "BTN", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 8, raw_name: "CO/BU VS UTG+2/MP",
    range: "AA,KK,QQ,JJ,AKs,AQs,AKo,AQo",
  },
  "open_btn_vs_hj_v2": {
    hero: "BTN", villain: "HJ", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 53, raw_name: "BU VS HJ OPEN + CO FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,ATo,KQo",
  },
  "flat_bb_vs_utg": {
    hero: "BB", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 4, hand_count: 95, raw_name: "BB VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,T9s,T8s,T7s,T6s,98s,97s,96s,95s,87s,86s,85s,84s,76s,75s,74s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,KQo,KJo,KTo,QJo,QTo,JTo,J9o,T9o,76o,75o,65o",
  },
  "flat_sb_vs_mp_v2": {
    hero: "SB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 21, raw_name: "SB VS MP/LP",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,A9s,A8s,A7s,A5s,KTs,K9s,QTs,JTs,T9s,98s,AKo,AQo,AJo,KQo",
  },
  "open_co_vs_ep_v2": {
    hero: "CO", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 29, raw_name: "CO VS EP OPEN + EP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,JTs,87s,76s,65s,54s,AKo,AQo",
  },
  "jam_bb": {
    hero: "BB", villain: null, scenario: "jam", depth_bb: null, covered_sids: 1, hand_count: 3, raw_name: "BB 5BET ALL IN VS COOPEN,BU3BET,SB 4BET",
    range: "AA,KK,AKs",
  },
  "flat_hj_vs_mp_v3": {
    hero: "HJ", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 7, raw_name: "HJ VS MP/UTG",
    range: "AA,KK,QQ,JJ,AKs,AQs,AKo",
  },
  "limp_15bb": {
    hero: null, villain: null, scenario: "limp", depth_bb: 15, covered_sids: 1, hand_count: 169, raw_name: "10-15BB VS LIMP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,T5o,T4o,T3o,T2o,98o,97o,96o,95o,94o,93o,92o,87o,86o,85o,84o,83o,82o,76o,75o,74o,73o,72o,65o,64o,63o,62o,54o,53o,52o,43o,42o,32o",
  },
  "flat_bb_vs_co_v5": {
    hero: "BB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 13, raw_name: "SB/BB VS CO/HJ",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,KQs,KJs,AKo,AQo",
  },
  "open_btn_vs_mp": {
    hero: "BTN", villain: "MP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 49, raw_name: "BU VS MP OPEN + CO FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,KQo",
  },
  "open_co_vs_ep": {
    hero: "CO", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 31, raw_name: "CO VS EP OPEN + MP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A5s,KQs,KJs,KTs,QJs,JTs,87s,76s,65s,54s,AKo,AQo,AJo",
  },
  "flat_sb_vs_btn": {
    hero: "SB", villain: "BTN", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 62, raw_name: "SB VS BU",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,QJs,QTs,Q9s,Q8s,JTs,J9s,T9s,T8s,98s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,QJo,QTo,JTo",
  },
  "flat_co_vs_mp_v2": {
    hero: "CO", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 10, raw_name: "CO VS MP/HJ",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,KQs,AKo,AQo",
  },
  "open_hj_vs_ep": {
    hero: "HJ", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 24, raw_name: "HJ VS EP OPEN AND EP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,JTs,65s,54s,AKo,AQo",
  },
  "flat_bb_vs_utgp2": {
    hero: "BB", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 112, raw_name: "BB VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,87s,86s,85s,84s,76s,75s,74s,73s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A5o,A4o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o,98o,87o,76o,65o,54o,43o",
  },
  "flat_bb_vs_btn_v2": {
    hero: "BB", villain: "BTN", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 14, raw_name: "SB/BB VS BU/CO",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,ATs,A5s,KQs,KJs,AKo,AQo",
  },
  "open_15bb": {
    hero: null, villain: null, scenario: "open", depth_bb: 15, covered_sids: 1, hand_count: 151, raw_name: "10-15BB VS RAISE",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,K4o,K3o,K2o,QJo,QTo,Q9o,Q8o,Q7o,Q6o,Q5o,Q4o,Q3o,Q2o,JTo,J9o,J8o,J7o,J6o,J5o,J4o,J3o,J2o,T9o,T8o,T7o,T6o,98o,97o,96o,95o,87o,86o,85o,76o,75o,65o,64o,54o,53o,43o",
  },
  "flat_bb_vs_utgp1_v2": {
    hero: "BB", villain: "UTG+1", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 127, raw_name: "BB VS UTG+1",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,KQo,KJo,KTo,K9o,K8o,K5o,QJo,QTo,Q9o,Q8o,JTo,J9o,J8o,T9o,T8o,98o,97o,87o,86o,76o,75o,65o,64o,54o,43o",
  },
  "flat_sb_vs_hj_v3": {
    hero: "SB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 30, raw_name: "SB VS HJ/CO/BU",
    range: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,A8s,A7s,A5s,A4s,A3s,KTs,K9s,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo",
  },
  "flat_sb_vs_co": {
    hero: "SB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 58, raw_name: "SB VS CO",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,87s,76s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,KQo,KJo,QJo",
  },
  "flat_btn_vs_mp": {
    hero: "BTN", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 11, raw_name: "BU VS MP/HJ",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,KQs,AKo,AQo",
  },
  "open_ep": {
    hero: "EP", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 15, raw_name: "EP+2 VS EP OPEN + EP+1 FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo",
  },
  "flat_btn_vs_ep": {
    hero: "BTN", villain: "EP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 12, raw_name: "BU VS EP/MP",
    range: "AA,KK,QQ,JJ,AKs,A7s,A5s,KTs,QTs,AKo,AQo,KQo",
  },
  "open_co_vs_mp": {
    hero: "CO", villain: "MP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 37, raw_name: "CO VS MP OPEN + HJ FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A5s,A4s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo",
  },
  "flat_sb_vs_mp": {
    hero: "SB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 50, raw_name: "SB VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,KQo,KJo",
  },
  "flat_sb_vs_mp_v3": {
    hero: "SB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 10, raw_name: "SB VS MP/HJ",
    range: "AA,KK,QQ,JJ,AKs,AQs,AJs,KQs,AKo,AQo",
  },
  "open_mp_vs_ep_v3": {
    hero: "MP", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 17, raw_name: "MP VS EP OPEN + EP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,QJs,AKo,AQo",
  },
  "flat_btn_vs_mp_v3": {
    hero: "BTN", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 20, raw_name: "BU VS MP/LP",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,A8s,A7s,A5s,A4s,A3s,KTs,K9s,Q9s,87s,76s,65s,AKo,AQo",
  },
  "open_hj_vs_ep_v2": {
    hero: "HJ", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 24, raw_name: "HJ VS EP OPEN + EP/MP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,KQs,KJs,KTs,QJs,76s,65s,54s,AKo,AQo",
  },
  "open_mp_vs_ep": {
    hero: "MP", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 13, raw_name: "MP VS EP OPEN + EP/MP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,KQs,AKo,AQo",
  },
  "flat_btn_vs_hj_v2": {
    hero: "BTN", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 2, hand_count: 14, raw_name: "BU VS HJ/CO",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,KQs,KJs,AKo,AQo,KQo",
  },
  "flat_sb_vs_utg": {
    hero: "SB", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 41, raw_name: "SB VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,65s,AKo,AQo,AJo,KQo",
  },
  "open_sb_vs_ep_v3": {
    hero: "SB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 26, raw_name: "SB VS EP OPEN & EP/MP FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo",
  },
  "flat_bb_vs_mp_v4": {
    hero: "BB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 12, raw_name: "BB VS MP/HJ",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,ATs,KQs,AKo,AQo",
  },
  "flat_sb_vs_hj": {
    hero: "SB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 54, raw_name: "SB VS HJ",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,97s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo,QTo",
  },
  "open_sb_vs_co": {
    hero: "SB", villain: "CO", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 52, raw_name: "SB VS CO OPEN + BU FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K5s,K4s,K3s,K2s,QJs,QTs,JTs,T9s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,KQo,KJo,KTo,QJo",
  },
  "flat_btn_vs_co": {
    hero: "BTN", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 61, raw_name: "BU VS CO",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,65s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,KQo,KJo,KTo,QJo,QTo,JTo",
  },
  "flat_hj_vs_ep": {
    hero: "HJ", villain: "EP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 12, raw_name: "HJ VS EP/MP",
    range: "AA,KK,QQ,JJ,AKs,ATs,A5s,KJs,KTs,JTs,AKo,AQo",
  },
  "flat_bb_vs_mp_v2": {
    hero: "BB", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 12, raw_name: "SB/BB VS MP/BU",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,KQs,AKo,AQo",
  },
  "open_sb_vs_ep_v4": {
    hero: "SB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 32, raw_name: "SB VS EP OPEN + LP FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A5s,A4s,KQs,KJs,KTs,QJs,JTs,87s,76s,65s,54s,AKo,AQo,AJo",
  },
  "open_bb_vs_ep_v4": {
    hero: "BB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 86, raw_name: "BB VS EP OPEN & EP/MP FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,JTs,J9s,J8s,J7s,T9s,T8s,T7s,T6s,98s,97s,96s,95s,87s,86s,85s,84s,76s,75s,74s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo,QTo,JTo,T9o,98o,87o,76o,65o,54o",
  },
  "flat_btn_vs_mp_v2": {
    hero: "BTN", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 4, hand_count: 53, raw_name: "BU VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,76s,65s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo",
  },
  "open_sb_vs_ep": {
    hero: "SB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 26, raw_name: "SB VS EP OPEN + EP/MP FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A5s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo",
  },
  "open_sb_vs_ep_v2": {
    hero: "SB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 39, raw_name: "SB VS EP OPEN + LP FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,98s,87s,76s,65s,54s,AKo,AQo,KQo",
  },
  "flat_co_vs_hj_v2": {
    hero: "CO", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 3, hand_count: 45, raw_name: "CO VS HJ",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo,KJo",
  },
  "open_bb_vs_ep_v3": {
    hero: "BB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 105, raw_name: "BB VS EP OPEN + BU/CO FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,87s,86s,85s,84s,76s,75s,74s,73s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo,QTo,JTo,T9o,98o,87o,76o,65o,64o,54o,53o,43o",
  },
  "flat_hj_vs_mp_v2": {
    hero: "HJ", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 14, raw_name: "HJ VS MP/MP",
    range: "AA,KK,QQ,JJ,AKs,A9s,A5s,KJs,KTs,QJs,JTs,AKo,AQo,AJo",
  },
  "flat_co_vs_mp": {
    hero: "CO", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 26, raw_name: "CO VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,A8s,KQs,KJs,KTs,K9s,QJs,JTs,AKo,AQo,AJo,KQo",
  },
  "flat_sb_vs_hj_v2": {
    hero: "SB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 14, raw_name: "SB VS HJ/CO",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,A5s,KQs,KJs,AKo,AQo,KQo",
  },
  "flat_sb_vs_utgp2": {
    hero: "SB", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 47, raw_name: "SB VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,QJs,QTs,Q9s,JTs,J9s,T9s,T8s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo,JTo",
  },
  "open_bb_vs_ep": {
    hero: "BB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 2, hand_count: 126, raw_name: "BB VS EP OPEN + SB FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,QJo,QTo,Q9o,Q8o,JTo,J9o,T9o,98o,97o,87o,86o,76o,75o,65o,64o,54o,53o,43o",
  },
  "open_bb_vs_ep_v2": {
    hero: "BB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 126, raw_name: "BB VS EP OPEN & SB FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,QJo,QTo,Q9o,Q8o,JTo,J9o,T9o,98o,97o,87o,86o,76o,75o,65o,64o,54o,53o,43o",
  },
  "open_mp_vs_ep_v2": {
    hero: "MP", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 8, raw_name: "MP VS EP/EP OR EP/MP",
    range: "AA,KK,QQ,AKs,ATs,KJs,AKo,AQo",
  },
  "flat_btn_vs_mp_v4": {
    hero: "BTN", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 53, raw_name: " BU VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,76s,65s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo",
  },
  "flat_bb_vs_hj": {
    hero: "BB", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 15, raw_name: "BB VS HJ/CO",
    range: "AA,KK,QQ,JJ,TT,AKs,AQs,AJs,ATs,A5s,KQs,KJs,AKo,AQo,KQo",
  },
  "flat_hj_vs_mp": {
    hero: "HJ", villain: "MP", scenario: "flat", depth_bb: null, covered_sids: 4, hand_count: 21, raw_name: "HJ VS MP",
    range: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A9s,KQs,KJs,KTs,QJs,AKo,AQo,AJo,KQo",
  },
  "flat_btn_vs_utg": {
    hero: "BTN", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 59, raw_name: "BU VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,64s,54s,53s,43s,AKo,AQo,AJo,ATo,KQo,KJo",
  },
  "open_bb_vs_ep_v5": {
    hero: "BB", villain: "EP", scenario: "open", depth_bb: null, covered_sids: 1, hand_count: 105, raw_name: "BB VS EP OPEN & BU/CO FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,87s,86s,85s,84s,76s,75s,74s,73s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,KQo,KJo,KTo,QJo,QTo,JTo,T9o,98o,87o,76o,65o,64o,54o,53o,43o",
  },
  "open_sb_20bb": {
    hero: "SB", villain: null, scenario: "open", depth_bb: 20, covered_sids: 1, hand_count: 52, raw_name: "SB VS 20BB CO OPEN + BU FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,JTs,T9s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A5o,A4o,KQo,KJo,KTo,QJo,QTo,JTo",
  },
  "flat_sb_vs_co_v2": {
    hero: "SB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 15, raw_name: "SB VS CO/BU",
    range: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,ATs,A5s,KQs,AKo,AQo,KQo",
  },
  "flat_btn_vs_hj": {
    hero: "BTN", villain: "HJ", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 59, raw_name: "BU VS HJ",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,54s,53s,43s,AKo,AQo,AJo,ATo,KQo,KJo,QJo",
  },
  "flat_co_vs_utg": {
    hero: "CO", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 45, raw_name: "CO VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,QJs,QTs,Q9s,JTs,J9s,T9s,98s,87s,76s,65s,54s,AKo,AQo,AJo,ATo,KQo",
  },
  "open_bb_vs_mp_v2": {
    hero: "BB", villain: "MP", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 116, raw_name: "BB VS MP OPEN + LP FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,87s,86s,85s,84s,83s,76s,75s,74s,73s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o,98o,87o,76o,65o,54o,53o,43o",
  },
  "flat_bb_vs_co_v4": {
    hero: "BB", villain: "CO", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 15, raw_name: "BB VS CO/BU",
    range: "AA,KK,QQ,JJ,TT,99,AKs,AQs,AJs,A5s,KQs,KJs,AKo,AQo,KQo",
  },
  "open_bb_vs_mp": {
    hero: "BB", villain: "MP", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 124, raw_name: "BB VS MP OPEN + SB FLATCALL",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,QJo,QTo,Q9o,JTo,J9o,T9o,98o,87o,86o,76o,75o,65o,64o,54o,53o,43o",
  },
  "flat_hj_vs_utg": {
    hero: "HJ", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 3, hand_count: 27, raw_name: "HJ VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,AKs,AQs,AJs,ATs,A9s,A5s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,AKo,AQo,AJo",
  },
  "flat_btn_vs_utgp2": {
    hero: "BTN", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 56, raw_name: "BU VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,QJs,QTs,Q9s,Q8s,JTs,J9s,J8s,T9s,T8s,98s,97s,87s,86s,76s,75s,65s,64s,54s,43s,AKo,AQo,AJo,ATo,KQo",
  },
  "open_bb_vs_co": {
    hero: "BB", villain: "CO", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 121, raw_name: "BB VS CO OPEN AND BU FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,QJo,QTo,Q9o,JTo,J9o,T9o,98o,87o,76o,65o,64o,54o,53o,43o",
  },
  "flat_mp_vs_utg": {
    hero: "MP", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 5, hand_count: 15, raw_name: "MP VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,AKo,AQo",
  },
  "3bet_mp_vs_utg": {
    hero: "MP", villain: "UTG", scenario: "3bet", depth_bb: null, covered_sids: 1, hand_count: 24, raw_name: "MP VS UTG 3B ONLY",
    range: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,A9s,A5s,KQs,KJs,KTs,QJs,QTs,JTs,AKo,AQo,AJo,KQo",
  },
  "flat_utgp1_vs_utg": {
    hero: "UTG+1", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 4, hand_count: 16, raw_name: "UTG+1 VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,KQs,KJs,QJs,AKo,AQo",
  },
  "open_bb_vs_btn": {
    hero: "BB", villain: "BTN", scenario: "open", depth_bb: null, covered_sids: 3, hand_count: 133, raw_name: "BB VS BU OPEN + SB FLAT",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A6s,A5s,A4s,A3s,A2s,KQs,KJs,KTs,K9s,K8s,K7s,K6s,K5s,K4s,K3s,K2s,QJs,QTs,Q9s,Q8s,Q7s,Q6s,Q5s,Q4s,Q3s,Q2s,JTs,J9s,J8s,J7s,J6s,J5s,J4s,J3s,J2s,T9s,T8s,T7s,T6s,T5s,T4s,T3s,T2s,98s,97s,96s,95s,94s,93s,92s,87s,86s,85s,84s,83s,82s,76s,75s,74s,73s,72s,65s,64s,63s,62s,54s,53s,52s,43s,42s,32s,AKo,AQo,AJo,ATo,A9o,A8o,A7o,A6o,A5o,A4o,A3o,A2o,KQo,KJo,KTo,K9o,K8o,K7o,K6o,K5o,QJo,QTo,Q9o,Q8o,JTo,J9o,J8o,J7o,T9o,T8o,T7o,98o,97o,87o,86o,76o,75o,65o,64o,54o,53o,43o",
  },
  "3bet_utgp1_vs_utg": {
    hero: "UTG+1", villain: "UTG", scenario: "3bet", depth_bb: null, covered_sids: 1, hand_count: 18, raw_name: "UTG+1 VS UTG 3B ONLY",
    range: "AA,KK,QQ,JJ,TT,99,88,AKs,AQs,AJs,ATs,A9s,KQs,KJs,KTs,AKo,AQo,KQo",
  },
  "flat_co_vs_utgp2": {
    hero: "CO", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 41, raw_name: "CO VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,22,AKs,AQs,AJs,ATs,A9s,A8s,A7s,A5s,A4s,A3s,KQs,KJs,KTs,K9s,QJs,QTs,JTs,T9s,T8s,98s,87s,76s,65s,54s,AKo,AQo,AJo,KQo",
  },
  "flat_hj_vs_utgp2": {
    hero: "HJ", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 29, raw_name: "HJ VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,44,33,AKs,AQs,AJs,ATs,A9s,A5s,A4s,KQs,KJs,KTs,QJs,QTs,JTs,T9s,AKo,AQo,KQo",
  },
  "flat_mp_vs_utgp2": {
    hero: "MP", villain: "UTG+2", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 24, raw_name: "MP VS UTG+2",
    range: "AA,KK,QQ,JJ,TT,99,88,77,66,55,AKs,AQs,AJs,ATs,A9s,A5s,KQs,KJs,KTs,QJs,JTs,AKo,AQo,KQo",
  },
  "flat_utgp2_vs_utg": {
    hero: "UTG+2", villain: "UTG", scenario: "flat", depth_bb: null, covered_sids: 1, hand_count: 18, raw_name: "UTG+2 VS UTG",
    range: "AA,KK,QQ,JJ,TT,99,88,77,AKs,AQs,AJs,ATs,KQs,KJs,QJs,JTs,AKo,AQo",
  },
}

export const COURSE_RANGES_META = {
  project: 'Course',
  project_id: 'f443feb0-c8e1-4bb1-9a76-e40ba6e4eb46',
  total_entries: 110,
  source_parseable_tables: 205,
  source_total_tables: 353,
  parse_rate: '58.1%',
  generated_at: '2026-04-21T09:42:36.455Z',
}
