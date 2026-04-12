// =============================================================
// GTO Preflop Range Data — HU Tournament 40BB
// =============================================================
// 來源：手寫近似公開 GTO 資料（PokerCoaching、GTO Wizard 公開知識）
// 用途：v1.0 HU 模擬器翻前決策；v1.1 計畫用 OpenSpiel 升級為 solver 精度
//
// 情境（5 個）：
//   1. SB_RFI            — SB/BTN 開局加注（HU 中 SB 是 BTN）
//   2. BB_vs_SB_open     — BB 面對 SB 開局
//   3. SB_vs_BB_3bet     — SB 面對 BB 3bet
//   4. BB_vs_SB_4bet     — BB 面對 SB 4bet
//   5. SB_vs_BB_5bet     — SB 面對 BB 5bet/allin
//
// HU 40BB 結構：
//   SB/BB = 0.5/1 BB
//   SB open size: 2.5 BB
//   BB 3bet size: 9 BB
//   SB 4bet size: 22 BB (基本承諾)
//   BB 5bet = allin
//
// Action codes（沿用現有 helpers）：
//   'r' = raise (語意依情境：open / 3bet / 4bet)
//   'c' = call
//   'mr:N'      = N% 加注 / 100-N% 棄牌
//   'mix_3b:N'  = N% 3bet / 100-N% 棄牌
//   'allin'     = 全押
// =============================================================

import { makeRange, makeRangeDefaultRaise, type GtoDB } from './helpers'

export const DB_TOURN_HU_40BB: GtoDB = {

  // ════════════════════════════════════════════════════════════
  // SB/BTN OPEN — HU 40BB
  // 範圍 ~70%。HU SB 開很寬因為位置優勢 + 只防一人
  // ════════════════════════════════════════════════════════════
  'tourn_hu_40bb_SB_RFI': makeRangeDefaultRaise(
    // 折牌（最弱手）
    [
      '32o','42o','52o','62o','72o','82o','92o',
      '43o','53o','63o','73o','83o','93o',
      '54o','64o','74o','84o','94o',
      '65o','75o','85o','95o',
      '86o','96o','T2o','T3o','T4o','T5o','T6o','T7o',
      'J2o','J3o','J4o','J5o','J6o','J7o',
      'Q2o','Q3o','Q4o','Q5o','Q6o','Q7o',
      'K2o','K3o','K4o',
    ],
    [], // 沒有純 call 的開局
    {
      // 邊緣 mix
      '32s':'mr:30','42s':'mr:40','52s':'mr:50',
      '76o':'mr:30','87o':'mr:40','98o':'mr:60',
      'T8o':'mr:60','J8o':'mr:60','Q8o':'mr:70','K5o':'mr:60','K6o':'mr:70',
    }
  ),

  // ════════════════════════════════════════════════════════════
  // BB 面對 SB OPEN — HU 40BB
  // 範圍 ~60%。BB 廣防（pot odds 好），polarized 3bet
  // ════════════════════════════════════════════════════════════
  'tourn_hu_40bb_BB_vs_SB_open': makeRange(
    // 3bet 範圍（'r' = 3bet）
    // 為價值：JJ+, AK, AQs+
    // 為詐唬：A2s-A5s, K9s, 一些連張
    [
      'AA','KK','QQ','JJ',
      'AKs','AQs','AKo',
      'A5s','A4s','A3s','A2s',
    ],
    // 平跟範圍
    [
      'TT','99','88','77','66','55','44','33','22',
      'AJs','ATs','A9s','A8s','A7s','A6s','AQo','AJo','ATo','A9o','A8o','A7o',
      'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s',
      'KQo','KJo','KTo','K9o','K8o','K7o',
      'QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s',
      'QJo','QTo','Q9o','Q8o',
      'JTs','J9s','J8s','J7s','J6s',
      'JTo','J9o','J8o',
      'T9s','T8s','T7s','T6s',
      'T9o','T8o',
      '98s','97s','96s','98o',
      '87s','86s','85s','87o',
      '76s','75s','74s',
      '65s','64s',
      '54s','53s',
      '43s',
    ],
    {
      // mix_3b 詐唬
      'TT':'mix_3b:60','AJs':'mix_3b:30',
      'KQs':'mix_3b:30','K9s':'mix_3b:30',
      'QJs':'mix_3b:20',
      'AQo':'mix_3b:40',
    }
  ),

  // ════════════════════════════════════════════════════════════
  // SB 面對 BB 3BET — HU 40BB
  // BB 3bet 至 9BB，pot 約 11.5BB，SB 要 call 6.5 → 36% equity
  // 4bet value: AA, KK, QQ, AKs
  // 4bet 詐唬: A2s-A5s（阻擋牌）
  // ════════════════════════════════════════════════════════════
  'tourn_hu_40bb_SB_vs_BB_3bet': makeRange(
    // 4bet 範圍（'r' = 4bet）
    [
      'AA','KK','QQ','AKs',
      'A5s','A4s','A3s','A2s',
    ],
    // 平跟（範圍要寬，因為 SB 開很寬）
    [
      'JJ','TT','99','88','77','66','55',
      'AKo','AQs','AQo','AJs','AJo','ATs','A9s','A8s','A7s','A6s',
      'KQs','KJs','KTs','K9s','K8s','K7s','KQo','KJo','KTo',
      'QJs','QTs','Q9s','Q8s','QJo','QTo',
      'JTs','J9s','J8s','J7s','JTo','J9o',
      'T9s','T8s','T7s','T9o',
      '98s','97s','98o',
      '87s','86s',
      '76s','75s',
      '65s','64s',
      '54s','53s',
      '43s',
    ],
    {
      'JJ':'mix_3b:50',  // mix 4bet/call
      'AKo':'mix_3b:50', // mix 4bet/call
      'AQs':'mix_3b:30',
    }
  ),

  // ════════════════════════════════════════════════════════════
  // BB 面對 SB 4BET — HU 40BB
  // SB 4bet 至 22BB，BB 已投入 9BB，stack 31BB → 大致 commit
  // 5bet allin: KK+, AKs（極少 AKo bluff）
  // call: rare（深度太淺，4bet 後只剩 18BB pot odds 很差）
  // ════════════════════════════════════════════════════════════
  'tourn_hu_40bb_BB_vs_SB_4bet': makeRange(
    // 'r' 在這裡語意 = 5bet allin
    [
      'AA','KK','AKs',
    ],
    [], // 通常不平跟，要嘛 jam 要嘛 fold
    {
      'QQ':'mr:80',     // 80% jam, 20% fold
      'JJ':'mr:30',     // 30% jam, 70% fold
      'AKo':'mr:50',
      'A5s':'mr:40',    // 詐唬阻擋
    }
  ),

  // ════════════════════════════════════════════════════════════
  // SB 面對 BB 5BET ALLIN — HU 40BB
  // BB jam 40BB，SB call 18BB more → ~30% equity needed
  // ════════════════════════════════════════════════════════════
  'tourn_hu_40bb_SB_vs_BB_5bet': makeRange(
    [], // 這個 spot 沒有 raise（已經 allin）
    // 'c' = call all-in
    [
      'AA','KK','QQ','AKs','AKo',
    ],
    {
      'JJ':'mr:60',  // mix call/fold（pot odds 邊緣）
      'AQs':'mr:30',
    }
  ),
}
