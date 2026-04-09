# 撲克 MBTI 測驗 — 設計規格

## 概述

將原本的「3 題 GTO 體驗」替換為 10 題撲克心理測驗（撲克 MBTI）。混合情境題與觀念題，完成後產出玩家風格類型 + 多維度雷達圖 + 個性化建議，並可分享結果卡片。註冊後結果存入 profile 用於個性化推薦。

## 移除項目

- `GuestTrainTab.tsx` — 移除，由 QuizScreen 取代
- `guestQuestions.ts` — 移除，由測驗題庫取代
- AuthPage 上的「不想註冊？先體驗 3 題 →」按鈕文案及邏輯

## 入口

- AuthPage 底部按鈕改為：「測測你的撲克 MBTI →」
- 點擊後 `appMode` 設為 `'guest'`（沿用現有 mode），渲染 QuizScreen

---

## 風格類型系統

2 維度交叉產生 4 種風格：**鬆緊度**（手牌選擇）× **主被動**（下注傾向）

| 風格 | 趣味名 | 經典術語 | 簡述 |
|------|--------|----------|------|
| 緊凶 | 🦈 鯊魚型 | TAG (Tight-Aggressive) | 選牌嚴格、出手凶猛，最接近 GTO 的打法 |
| 鬆凶 | 🦊 狐狸型 | LAG (Loose-Aggressive) | 參與多、攻擊性強，擅長製造壓力但容易失控 |
| 緊被動 | 🪨 岩石型 | Rock (Tight-Passive) | 只打好牌但不夠積極，容易被讀透 |
| 鬆被動 | 🐙 章魚型 | Calling Station (Loose-Passive) | 什麼都想看、很少加注，容易被剝削 |

### 風格判定邏輯

- **鬆緊度** = 手牌紀律 (Hand Discipline) 維度分數
  - ≥ 50 → 緊 (Tight)
  - < 50 → 鬆 (Loose)
- **主被動** = 攻擊性 (Aggression) 維度分數
  - ≥ 50 → 凶 (Aggressive)
  - < 50 → 被動 (Passive)

---

## 水平等級

根據 6 題情境題的 GTO 正確率判定，**不作為主視覺呈現**，收在「詳細分析」區塊：

| 等級 | 正確率 | 標籤 |
|------|--------|------|
| 新手 | 0-1 / 6 | 撲克新星 |
| 入門 | 2-3 / 6 | 潛力玩家 |
| 中級 | 4-5 / 6 | 策略好手 |
| 進階 | 6 / 6 | GTO 思維者 |

註：水平等級用正面命名，避免新手感到被嘲諷。

---

## 雷達圖維度（5 維度，0-100）

1. **攻擊性** (Aggression) — 下注/加注的傾向
2. **位置意識** (Position Awareness) — 是否根據位置調整策略
3. **手牌紀律** (Hand Discipline) — 手牌選擇的嚴格程度
4. **底池控制** (Pot Control) — 控制底池大小的能力
5. **抗壓性** (Tilt Resistance) — 逆境中的心態穩定度

---

## 題目設計（10 題）

### 情境題 × 6（計 GTO 正確率 + 風格傾向分數）

每題結構：
- 遊戲類型、位置、手牌、對手動作
- 3-4 個選項，每個選項帶有：
  - `isGTO: boolean` — 是否為 GTO 正確答案
  - `dimensions: { aggression, position, discipline, potControl, tiltResistance }` — 各維度加分

#### Q1：BTN 開局（RFI 決策）
- 情境：6-max 現金桌，你在 BTN，前面都棄牌，手牌 A♠ J♦
- 選項：
  - A. 棄牌 → discipline+15, aggression-10
  - B. 跟注大盲 → potControl+10
  - **C. 加注 2.5BB** → isGTO, aggression+10, position+10, discipline+5
  - D. 加注 5BB → aggression+15

#### Q2：面對加注（防守決策）
- 情境：6-max，你在 BB，CO 加注 3BB，手牌 8♠ 7♠
- 選項：
  - A. 棄牌 → discipline+15
  - **B. 跟注** → isGTO, potControl+10, discipline+5
  - C. 3-Bet 到 10BB → aggression+15
  - D. 全下 → aggression+20, tiltResistance-10

#### Q3：翻牌後（持續下注）
- 情境：你在 CO 開局加注，BB 跟注。翻牌 K♠ 7♦ 2♣，你手牌 A♠ Q♦
- 選項：
  - A. 過牌 → potControl+15
  - **B. 下注 1/3 底池** → isGTO, aggression+5, potControl+10
  - C. 下注 3/4 底池 → aggression+10
  - D. 全下 → aggression+20, tiltResistance-5

#### Q4：位置劣勢的手牌選擇
- 情境：6-max，你在 UTG，手牌 K♠ T♦
- 選項：
  - **A. 棄牌** → isGTO, discipline+15, position+10
  - B. 跟注（limp）→ potControl+5
  - C. 加注 2.5BB → aggression+10
  - D. 加注 4BB → aggression+15, discipline-5

#### Q5：面對 3-Bet
- 情境：你在 HJ 加注，BTN 3-Bet 到 9BB，手牌 T♠ T♦
- 選項：
  - A. 棄牌 → discipline+10, tiltResistance+5
  - **B. 跟注** → isGTO, potControl+10, discipline+5
  - C. 4-Bet 到 22BB → aggression+15
  - D. 全下 → aggression+20, tiltResistance-5

#### Q6：河牌決策
- 情境：底池 30BB，河牌出現第三張同花，對手下注 20BB，你有頂對但無同花
- 選項：
  - **A. 棄牌** → isGTO, discipline+15, potControl+10
  - B. 跟注 → potControl+5, tiltResistance+5
  - C. 加注到 50BB → aggression+20, tiltResistance-10
  - D. 全下 → aggression+25, tiltResistance-15

### 觀念/偏好題 × 4（純風格判斷，不計正確率）

#### Q7：手牌偏好
- 「你比較喜歡拿到哪種手牌？」
- 選項：
  - A. A♠ A♦ 一對大 Ace → discipline+15, potControl+5
  - B. 7♠ 6♠ 同花連張 → aggression+10, position+5
  - C. K♠ Q♦ 大高牌 → discipline+5, potControl+10
  - D. 什麼牌都能打，看情況 → aggression+5, discipline-10

#### Q8：逆境反應
- 「連輸 5 手牌後，你通常會？」
- 選項：
  - A. 收緊範圍，等好牌再出手 → discipline+15, tiltResistance+10
  - B. 維持原本策略不變 → tiltResistance+15
  - C. 放寬範圍，積極找機會反擊 → aggression+15, tiltResistance-5
  - D. 可能會有點衝動，想把輸的贏回來 → aggression+10, tiltResistance-15

#### Q9：位置觀念
- 「選桌位時，你最在意什麼？」
- 選項：
  - A. 我要坐在魚（弱玩家）的左邊 → position+20
  - B. 離莊家位越近越好 → position+15
  - C. 無所謂，牌好就會贏 → position-10, discipline+5
  - D. 我沒特別想過桌位的問題 → position-5

#### Q10：底池控制觀念
- 「拿到中等牌力（如中對子），你的策略傾向是？」
- 選項：
  - A. 小注控池，盡量便宜看到攤牌 → potControl+20
  - B. 看情況，對手弱就下注，強就過牌 → potControl+10, position+10
  - C. 積極下注，不讓對手免費看牌 → aggression+15
  - D. 通常直接棄牌，不想冒險 → discipline+15, tiltResistance+5

---

## 計分流程

1. 初始化 5 維度分數各為 50
2. 逐題根據選項加減分
3. 最終分數 clamp 到 0-100
4. 風格判定：discipline ≥ 50 → 緊，aggression ≥ 50 → 凶
5. 水平判定：6 題情境題中 isGTO 正確數

---

## UI 設計

### QuizScreen（測驗畫面）

- 全螢幕，不顯示 BottomNav
- 頂部：進度條 + 題號（1/10 ~ 10/10）
- 中間：
  - 情境題：牌桌視覺化（沿用 PokerFelt / HoleCards 元件）+ 情境描述 + 選項按鈕
  - 觀念題：問題文字 + 選項按鈕
- 選完一題自動滑到下一題（帶過渡動畫）
- 不顯示對錯回饋（這不是考試，是測驗）

### QuizResultScreen（結果頁面）

分為兩大區塊：

**主視覺區（首屏）：**
1. 風格 icon（大 emoji）+ 趣味名（大字）+ 經典術語（副標題灰字）
2. 2-3 句風格描述
3. 五維度雷達圖（SVG 繪製，不引入額外圖表庫）
4. 2-3 條個性化訓練建議

**詳細分析區（需向下滑動）：**
5. 水平等級（正面命名 + 進度條）
6. 各維度分數詳解

**底部固定：**
7. 「分享結果」按鈕 — 產生結果卡片圖片
8. 「註冊開始訓練 →」CTA 按鈕（主色、大按鈕）

### 分享卡片

- 使用 `html2canvas` 將結果主視覺區渲染為圖片
- 卡片內容：風格名稱 + 雷達圖 + App 名稱 Logo
- **不包含水平等級**（避免分享時的尷尬）
- 分享方式：
  - 支援 Web Share API（手機原生分享到 LINE/IG/FB 等）
  - Fallback：下載圖片按鈕

---

## 風格描述文案

### 🦈 鯊魚型 (TAG)
> 你是牌桌上的獵食者。選牌嚴格、出手果斷，總是在最好的時機給對手致命一擊。你的風格最接近 GTO 理論的核心思維——用紀律創造優勢，用攻擊性兌現利潤。

建議：
- 繼續保持你的紀律性，這是最大的優勢
- 可以適當增加一些詐唬頻率，讓對手更難讀你
- 學習在有利位置適度放寬範圍

### 🦊 狐狸型 (LAG)
> 你是牌桌上最難對付的類型。參與度高、攻擊性強，善於在各種情境中製造壓力。你的創造力和膽識讓對手難以預測你的下一步行動。

建議：
- 你的攻擊性是雙刃劍，注意在不利位置收緊範圍
- 加強對手牌範圍的判讀，讓攻擊更精準
- 學習適時踩煞車，不是每個底池都需要爭奪

### 🪨 岩石型 (Rock)
> 你是牌桌上的堡壘。耐心等待好機會，不輕易冒險。你的穩定性讓你很少犯大錯，但對手也容易讀透你的策略——當你下注時，大家都知道你有好牌。

建議：
- 嘗試在有利位置增加攻擊頻率
- 加入適當的詐唬，讓對手無法輕易棄牌面對你的下注
- 學習利用位置優勢，不只依賴手牌強度

### 🐙 章魚型 (Calling Station)
> 你是牌桌上的探險家。好奇心旺盛，喜歡看到更多的牌，享受撲克帶來的刺激感。你的存在讓牌桌更有趣，而你需要的是把這份熱情轉化為更有策略的打法。

建議：
- 學習在翻前收緊手牌範圍，品質重於數量
- 把「跟注」的習慣轉換為「加注或棄牌」的思維
- 從位置概念開始學起，位置是免費的優勢

---

## 資料模型

### localStorage（未註冊時暫存）

```typescript
interface QuizResult {
  style: 'shark' | 'fox' | 'rock' | 'octopus'
  level: 'beginner' | 'novice' | 'intermediate' | 'advanced'
  dimensions: {
    aggression: number
    position: number
    discipline: number
    potControl: number
    tiltResistance: number
  }
  gtoCorrect: number  // 0-6
  completedAt: string  // ISO timestamp
}
```

Key: `poker-mbti-result`

### DB 欄位新增（profiles 表）

```sql
ALTER TABLE profiles
  ADD COLUMN quiz_style TEXT,
  ADD COLUMN quiz_level TEXT,
  ADD COLUMN quiz_dimensions JSONB;
```

- `quiz_style`: `'shark' | 'fox' | 'rock' | 'octopus'`
- `quiz_level`: `'beginner' | 'novice' | 'intermediate' | 'advanced'`
- `quiz_dimensions`: `{ aggression, position, discipline, potControl, tiltResistance }`

### 註冊銜接流程

1. 用戶完成測驗 → 結果存 localStorage
2. 用戶點擊「註冊開始訓練」→ 跳轉 AuthPage (register mode)
3. 註冊成功 → `onAuthStateChange` 觸發
4. App.tsx 檢查 localStorage 有無 `poker-mbti-result`
5. 有 → 寫入 profiles 表，清除 localStorage
6. 進入 Onboarding 流程
7. Onboarding 最後一步：根據 quiz_style + quiz_level 推薦課程

### 個性化推薦邏輯

| 風格 | 水平 | 推薦 |
|------|------|------|
| 任何 | 新手/入門 | 推薦 RFI 基礎課程 |
| 岩石/章魚 | 中級 | 推薦 Position Power 課程 |
| 狐狸/章魚 | 中級 | 推薦 Facing Raises 課程 |
| 鯊魚 | 中級/進階 | 推薦直接開始訓練 |
| 任何 | 進階 | 推薦直接開始訓練 |

---

## 新增檔案

- `src/data/quizQuestions.ts` — 10 題測驗題庫 + 計分邏輯
- `src/components/QuizScreen.tsx` — 測驗畫面（取代 GuestTrainTab）
- `src/components/QuizResultScreen.tsx` — 結果頁面
- `src/components/RadarChart.tsx` — SVG 雷達圖元件
- `src/components/ShareCard.tsx` — 分享卡片產生元件

## 修改檔案

- `src/pages/AuthPage.tsx` — 按鈕文案改為「測測你的撲克 MBTI →」
- `src/pages/App.tsx` — `appMode: 'guest'` 時渲染 QuizScreen 而非 GuestTrainTab
- `src/lib/auth.ts` — UserProfile interface 新增 quiz 欄位
- `src/components/OnboardingScreen.tsx` — 最後一步加入個性化推薦

## 刪除檔案

- `src/tabs/GuestTrainTab.tsx`
- `src/data/guestQuestions.ts`

## 新增依賴

- `html2canvas` — 結果卡片圖片產生

---

## 不在此次範圍

- 測驗題目的 A/B testing 或隨機化
- 多語系支援（目前僅繁體中文）
- 測驗結果的後台統計分析
- 重新測驗功能（註冊後）
