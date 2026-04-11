# MTT HU 對決模擬器 v1.0 — 設計規格

> **狀態**：✅ 設計完成，所有未決議事項已釐清。GTO 資料層已實作完成，準備進入 implementation plan 階段。
> **日期**：2026-04-10 起草，2026-04-11 完成設計
> **範圍**：僅 v1.0 HU 對決，其他情境（SNG/FT/MTT）延後到 v2-v6

---

## 一句話定義

在 app 內和 AI 對手打一場完整的錦標賽 HU 對戰（直到一方籌碼歸零），全程自行決策翻前+翻後，每手結束後可扣點獲得 AI 分析，整場打完有詳細的 GTO 對照報告。

---

## 路線圖（已確定的分期計劃）

| 版本 | 內容 |
|---|---|
| **v1.0** | HU 對決（本文件範圍） |
| v1.1 | HU + 盲注升級 + 可能 save/resume |
| v1.5 | 積分、排行榜（跨情境共用） |
| v2 | SNG（9 人、30BB、每週 1 場免費） |
| v3 | FT 短碼（10/15/20BB）+ FT 深碼（30BB+） |
| v4 | MTT 截止買入（20BB） |
| v5 | MTT 中盤（40BB） |
| v6 | MTT 完整（100BB 開局） |

---

## v1.0 核心參數

| 項目 | 設定 |
|---|---|
| 玩家數 | 2（真人 vs 1 AI Bot） |
| 桌子 | 單桌 |
| **總籌碼** | **80 BB** |
| **5 種起始籌碼比** | 1:5 / 1:2 / 1:1 / 2:1 / 5:1（玩家可選短碼或大碼方） |
| 盲注 | SB/BB = 1/2 BB，**v1.0 固定不升級** |
| 結束條件 | 一方籌碼歸零 |
| 預期時長 | 25-40 手 × 每手 1-2 分 ≈ 30-60 分鐘 |
| **入場費** | **30 點 / 場** |

---

## 玩家操作模型

### Preflop 按鍵（4 顆）
- `Fold` / `Call` / `Raise`（固定尺度）/ `All-in`
- 加注尺度固定：open 2.2BB、3bet 3x、4bet 2.2x
- 沿用現有 `getGTOAction.ts` 資料，零改動

### Postflop 按鍵（6 顆 + 2 顆隱藏）
- `Fold` / `Check` / **小 (1/3 pot)** / **中 (1/2 pot)** / **大 (1x pot)** / `All-in`
- **隱藏按鍵**（系統偵測自動露出）：
  - `XS`：< 20% pot（有時 1BB），觸發條件 SPR > 10 或 limped pot 或深碼 multi-street
  - `XL`：2x pot，觸發條件 river polarized、大底池 river

### 非 GTO 決策處理
- **允許任何動作**（不擋、不警告）
- 決策當下**不**顯示 GTO 建議（維持訓練純度）
- **賽後**才揭曉對錯
- **翻前**選了 GTO 0% 頻率的動作 → **扣 2 點「GTO 違規金」**，單場上限 10 點
- **翻後**違規不扣點（因資料不完整）

---

## Bot 決策邏輯（B+C 混合）

```
IF 翻前：
    呼叫 getGTOAction(hand, 'tournament', 'hu', 40, position, scenario)
    → 從 gtoData_tourn_hu_40bb.ts 查表
    → 回傳 action ('r' / 'c' / 'f' / '3b' / '4b' / 'allin' / mr:N / mix_3b:N)
IF 翻後：
    呼叫 getHUPostflopAction(ctx)
    1. 嘗試 GTO 查表：
       - 若 street=flop 且 potType=srp 且 board ∈ 13 supported boards
       - 從 gtoData_hu_postflop_index.ts 找對應 board × role
       - 解析 mix:CODE@PCT,CODE 後抽樣
       - 回傳 ActionDecision { action, isFallback: false }
    2. 否則 fallback heuristic：
       - classifyHand(hand, board) → 強度等級（NUTS / MONSTER / ... / AIR）
       - 根據強度查機率表（acting / facing 不同）
       - 套用 personality（standard / rock / aggressive，只在這層）
       - 隨機抽樣動作
       - 回傳 ActionDecision { action, isFallback: true }
```

**Bot 不知道玩家手牌** — 只根據動作序列和位置決策，可被玩家剝削（剝削代價由違規金承擔）。

---

## 翻後 GTO 資料（已產出）

### 覆蓋範圍
- ✅ **flop** only（turn/river 走 fallback heuristic）
- ✅ **SRP**（single raised pot）only（3BP/4BP fallback）
- ✅ **13 個 flop board** 涵蓋所有主要 texture：
  - **乾燥 rainbow（4）**：As7d2c / Kc8h3s / Jc7d2h / 9d5c2h
  - **半濕（3）**：KsQd4h / Td8h4c / Js9c3h
  - **濕（3）**：JsTc9h / 9h8d7c / Tc9c6d
  - **配對（2）**：7s7d2h / KcKd5h
  - **POC 留存（1）**：QsJh2h
- ✅ **5 個角色 / board**：
  1. `btn_cbet` — BB check 後 BTN c-bet 決策
  2. `bb_facing_cbet_small` — BB 面對 33% c-bet
  3. `bb_facing_cbet_mid` — BB 面對 50% c-bet
  4. `bb_facing_cbet_large` — BB 面對 100% c-bet
  5. `bb_facing_cbet_allin` — BB 面對 all-in c-bet
- 總計 **13 × 5 = 65 個 GTO range table**

### 實際格式
```ts
// 檔案：src/lib/gto/gtoData_hu_40bb_srp_flop_<slug>.ts × 13
export const HU_40BB_SRP_FLOP_AS7D2C: GtoDatabase = {
  hu_40bb_srp_flop_As7d2c_btn_cbet: {
    'AA':'mix:b33@43,x','KK':'x','AKs':'mix:b50@55,b33',
    // ... 79 hand classes
  },
  hu_40bb_srp_flop_As7d2c_bb_facing_cbet_small: {
    'AKs':'r','AKo':'mix:r@68,c',
    // ... 63 hand classes
  },
  // 還有 mid / large / allin 三個 scenario
}
```

### Action 編碼
| 編碼 | 意思 | 對應按鍵 |
|---|---|---|
| `x` | check | Check |
| `f` | fold | Fold |
| `c` | call | Call |
| `r` | raise (small) | (視情境映射) |
| `rbig` | raise (big) | (視情境映射) |
| `b33` | bet 1/3 pot | 小 |
| `b50` | bet 1/2 pot | 中 |
| `b100` | bet 1x pot | 大 |
| `allin` | all-in | All-in |
| `mix:CODE@PCT,CODE` | 混合策略 | 例：`mix:b33@60,x` = 60% 小注 / 40% check |

### 整合層
- `src/lib/gto/gtoData_hu_postflop_index.ts` — 集中 13 個 board const
- `src/lib/gto/getHUPostflopAction.ts` — 主查詢函式（GTO lookup → fallback heuristic）
- `src/lib/gto/huHeuristics.ts` — 8 強度分類 + 機率分佈 + 個性修正
- `src/lib/gto/gtoData_tourn_hu_40bb.ts` — 翻前 5 情境（手寫近似）
- `src/lib/gto/gtoData_index.ts` — 已註冊 `tourn_hu` → `thu40` loader

### 資料管線
- `scripts/gto-pipeline/` 完整 pipeline：input templates → TexasSolver CLI → JSON → converter → TS
- 用 `batch-run.ps1` 一鍵跑所有 board（v1.0 用過 1 次，產出 13 個檔）
- 之後新增 board 或 stack ratio 只要更新 `boards.mjs` 重跑

---

## AI 分析系統（兩層）

| 觸發 | 誰能用 | 何時 | 收費 | 模型 |
|---|---|---|---|---|
| **賽中即時分析按鈕** | **僅 PRO 訂閱** | 每手結束瞬間 | **3 點 / 手** | Claude Haiku |
| **賽後 GTO 紅標** | 所有使用者（含免費） | 整場結束後 | **免費** | 無 AI（只 GTO 對照） |
| **賽後深度分析** | 所有付費用戶（Basic+） | 報告頁點任一手 | **3 點 / 手** | Claude Haiku |
| 免費用戶 | 只能看紅標摘要 | — | — | — |

### GTO 紅標判定
- 單純「不是最高頻選項」不算錯
- 只有「GTO 0% 頻率」選項才標紅
- 混合頻率（70/30）選任一頻率內選項都算 pass

---

## 比賽流程（State Machine）

```
進入 MTT 情境主選單 → 選「HU 對決」
  ↓
選 5 種籌碼比 → 選玩家方（短碼/大碼）→ 扣 30 點入場
  ↓
發牌（手牌 1）
  ↓
輪流決策: preflop → flop → turn → river → showdown
  ↓
結算該手 + 記錄到 hand log
  ↓
(PRO 可點「看分析」→ 扣 3 點 → Claude Haiku 分析)
  ↓
IF 一方籌碼 0 → 結束畫面
ELSE → 手牌 N+1（盲注角色互換）
  ↓
結束畫面 → 自動進入賽後報告頁
  ↓
賽後報告頁：所有手列表 + GTO 紅標（免費）
  ↓
點任一手 → 扣 3 點 → Claude Haiku 深度分析（付費用戶）
  ↓
離開 → 回到 MTT 情境主選單
```

---

## UI 架構

### 復用現有元件
| 元件 | 用途 |
|---|---|
| `PokerFelt.tsx`（`tableSize=2`）| 橢圓牌桌 + 2 seats + 底池顯示 |
| `HoleCards.tsx` | 玩家自己手牌 |
| `ActionHistory.tsx` | 動作歷史 log |
| `ActionFeedback.tsx` | GTO 紅標 / 深度分析觸發點 |
| `RoundResultScreen.tsx` | 整場結束總結頁模板 |

### 新建元件
| 元件 | 用途 |
|---|---|
| `CommunityCards.tsx` | flop/turn/river 5 張公共牌顯示 |
| `PostflopActionBar.tsx` | 6+2 隱藏按鍵動作列（preflop 4 顆也共用） |
| `HeadsUpMatchScreen.tsx` | 主容器，管理引擎狀態、輪流、發牌、結算 |
| `HeadsUpReviewScreen.tsx` | 賽後報告頁 |

---

## 後端 / 資料架構

### 新增 Supabase tables

**`tournament_sessions`**
```sql
CREATE TABLE tournament_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  scenario text NOT NULL,  -- 'hu' for v1.0
  stack_ratio text,         -- '1:1', '1:2', ...
  entry_cost int NOT NULL,
  start_stack_bb int NOT NULL,
  result text,              -- 'win' | 'lose' | 'abandoned'
  total_hands int DEFAULT 0,
  violation_points int DEFAULT 0,  -- 該場累計扣了多少違規金
  created_at timestamptz DEFAULT now(),
  ended_at timestamptz
);
```

**`tournament_hands`**
```sql
CREATE TABLE tournament_hands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES tournament_sessions(id) ON DELETE CASCADE,
  hand_number int NOT NULL,
  hero_position text,          -- 'BTN/SB' | 'BB'
  hero_cards text,              -- 'AsKh'
  villain_cards text,           -- only on showdown
  board text,                   -- 'AhKs7d2c3s'
  action_sequence jsonb,        -- [{street:'pre', actor:'hero', action:'r', amount:2.2}, ...]
  pot_total_bb int,
  hero_stack_before int,
  hero_stack_after int,
  hero_won boolean,
  gto_flags jsonb,              -- [{street:'pre', actor:'hero', pass:true/false}]
  created_at timestamptz DEFAULT now()
);
```

**新增 index**：`tournament_sessions(user_id, created_at desc)`、`tournament_hands(session_id, hand_number)`

### 沿用
- `spend_points` RPC → 入場費和 AI 分析扣點
- Claude Haiku API → 分析呼叫（透過 Supabase Edge Function）
- `profiles` table → 區分免費 / Basic / PRO

---

## v1.0 明確 **不** 包含

- ❌ 盲注升級（v1.1）
- ❌ 比賽暫停 / 續玩（v1.1）
- ❌ 積分累計（v1.5+）
- ❌ 排行榜頁面（v1.5+）
- ❌ 獎勵兌換 / WINWINPOKER 門票 / 折價券（v2+）
- ❌ 多桌座位重排（到 v5 才會有）
- ❌ SNG / FT / MTT 情境
- ❌ **深碼 100BB 翻後完整 GTO 資料**
- ❌ turn / river GTO 資料（v1.0 只 flop）
- ❌ 3BP / 4BP 翻後 GTO 資料（v1.0 只 SRP）

---

## 成功標準（v1.0）

1. 玩家能打完一整場 HU 不崩潰、不卡住、結算正確
2. Bot 決策在 preflop 對照 GTO 是正確的；翻後能正常查表或 fallback
3. 賽後報告頁能看到所有手 + GTO 紅標
4. PRO 可即時分析，付費用戶可賽後分析，免費只能看紅標
5. 點數進出正確（入場 -30、分析 -3、違規金 -2）
6. 5 種籌碼比都能正常開場

---

## ✅ 已決議事項（更新 2026-04-11）

| 項目 | 決策 |
|---|---|
| **資料管線** | TexasSolver CLI（AGPL，本機跑）→ JSON → converter → TS 常數檔；位於 `scripts/gto-pipeline/` |
| **翻後 GTO 資料** | **13 個 flop board × 1:1 (40BB) stack**，已產出在 `src/lib/gto/gtoData_hu_40bb_srp_flop_*.ts` |
| **翻前 GTO 資料** | 手寫近似（路徑 Y）—— 5 個情境（SB_RFI / BB_vs_open / SB_vs_3bet / BB_vs_4bet / SB_vs_5bet），檔案 `gtoData_tourn_hu_40bb.ts` |
| **整合層** | `getHUPostflopAction.ts`（GTO 查表 + heuristic fallback）、`gtoData_hu_postflop_index.ts`（13 board 集中） |
| **Bot 決策延遲** | 1 秒動畫 |
| **失敗場景** | 該手判輸 → 從下一手繼續 |
| **啟發式規則** | 8 種強度分類（NUTS/MONSTER/STRONG_VALUE/THIN_VALUE/WEAK_PAIR/STRONG_DRAW/WEAK_DRAW/AIR）+ 機率分佈表 + 個性修正 + 抽樣，實作於 `huHeuristics.ts` |
| **Bot 個性** | 3 種：standard / rock / aggressive，**只影響 fallback heuristic**（不影響有 GTO 資料的 spot） |
| **Action Log 訂閱階層** | 免費 1 場、Basic 30 場、PRO **1 年保留**（之前說無限改 1 年）|
| **PRO 額外福利** | 賽事 log 搜尋、單場 JSON 匯出、標記重要賽事 |
| **儲存量試算** | 1000 用戶（700 免/250 Basic/50 PRO）≈ 655 MB；Supabase Pro tier 8GB 內 |
| **每月成本試算** | Supabase $25 + Vercel $20 + Claude API ~$165 ≈ **$210/月（NT$6,300）**；對應收入 NT$124,750/月，毛利 ~88% |

## 🎨 賽後報告頁佈局（已決議）

**版本 A · 列表式 + inline expand**

### 結構
1. **頂部摘要卡**（對齊 `RoundResultScreen` 風格）
   - 結果圖示（🏆 / 💔）
   - 勝/敗 + 最終 BB 變化
   - 情境（HU 對決 · 1:1 40BB）
   - Stat grid 3 欄：手數、GTO 違規次數、總點數消耗
2. **手牌列表**（每手一行 row）
   - 手號 `#1`
   - Hero hole cards（mini cards）
   - 位置（BTN / BB）
   - 結算（+/- BB）
   - 左色帶：綠 = 贏、紅 = GTO 違規、灰 = 普通輸
   - 整行可點
3. **點擊單手行為：inline expand**
   - 該行展開往下擴張，把後續手牌往下推
   - 展開內容：board 牌、完整 action sequence、結算
   - 右下角按鈕「AI 分析（3 點）」（僅付費用戶可見可點）
   - PRO 用戶：賽中已分析過的手，直接顯示分析內容（不再扣點）
4. **底部按鈕**：回主選單

### 視覺對齊
- 沿用現有 `#0a0a0a` 背景、`#111` 卡片、`#1a1a1a` 邊框
- Accent：紫色 `#7c3aed`
- 勝色 `#10b981` / 敗色 `#ef4444` / 警告 `#fbbf24`
- 圓角 `2xl` (~16px)
- Mobile-first，max-w-sm

### v1.0 不做（往後版本）
- 過濾分頁（贏 / 輸 / 違規）—— v1.1 加
- 卡片網格佈局
- 賽事 log 清單頁（跨多場 HU）—— v1.5 配 leaderboard 一起做

---

## ⚠️ 已知限制（v1.0 故意接受）

- **翻前資料是手寫近似**（90% 準確）：源於 TexasSolver 不支援 preflop tree solving。v1.1 計畫補足。
- **翻前資料只有 1:1 (40BB) 籌碼深度**：其他 4 個 stack ratio（1:5/1:2/2:1/5:1）使用相同 chart 近似。v1.1 補對應深度。
- **翻後 GTO 只有 flop SRP**：turn / river / 3BP / 4BP / 沒準備的 board 全走 heuristic。bot 在這些 spot 表現會明顯較弱。
- **沒有 isomorphism 映射**：玩家如果遇到「結構等價但花色不同」的 board（例如 As6d2c vs Ad6c2h），系統不會自動套用同一份資料，會直接走 heuristic。
- **混合策略 sample rate 是 client-side 隨機**：若兩個玩家在相同 spot 拿相同手，bot 不會給出穩定答案。

---

## 決策記錄（按時間順序）

1. **v1 範圍**：僅 HU，分期路線 v1-v6（使用者決定）
2. **翻後策略**：B+C 混合（簡化 GTO + 啟發式 fallback），不使用發牌作弊
3. **玩家翻後參與**：玩家自己決策全程（option 2）
4. **Postflop 按鍵**：A 方案（1/3 · 1/2 · 1x + All-in 獨立）
5. **隱藏按鍵**：XS / XL 系統自動偵測露出
6. **Preflop 按鍵**：Y 方案（單一固定尺度，沿用現有資料）
7. **v1.0 HU 範圍**：A 方案（純玩法，不含積分/排行榜/獎勵兌換）
8. **總籌碼**：B 方案（80BB）
9. **盲注升級**：v1.0 不做，v1.1 做
10. **AI 分析架構**：B 方案（GTO 紅標免費 + 按手收費 Claude 分析）
11. **PRO 福利**：解讀 1（賽中即時按鈕，僅 PRO，仍收費 3 點/手）
12. **UI 風格**：使用現有 `PokerFelt` + `HoleCards`
13. **入場費**：30 點/場，不新增每日任務
14. **非 GTO 決策處理**：完全放行 + 事後標紅 + 賽後揭曉答案
15. **非 GTO 懲罰**：方案 1（扣 2 點違規金/次，上限 10 點/場），僅翻前
16. **翻後資料顆粒度**：A 升級為「13 個代表性 board × 1:1 stack」（後來決定加碼覆蓋）
17. **資料管線**：TexasSolver CLI + 自製 converter
18. **翻前資料**：路徑 Y（手寫近似）——TexasSolver 不支援 preflop tree，路徑 X 卡關
19. **個性影響範圍**：只影響 fallback heuristic
20. **Action log 訂閱階層**：免費 1 場 / Basic 30 場 / PRO 1 年
