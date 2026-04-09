# 點數系統重構 + AI 聊天教練 — 設計規格

## 概述

重構現有點數系統，加入任務獎勵機制，並新增 AI 聊天教練功能。點數目前只能透過任務獲取（購買功能預留給未來手機版 IAP）。AI 教練提供寫死的免費體驗教學，之後每則訊息消耗 5 點。

## 範圍劃分

這是一個大型功能，拆成 3 個可獨立實作的子專案：

1. **Sub-1：點數系統重構** — 重構 DB schema、改寫 points.ts、新增任務追蹤
2. **Sub-2：任務系統 UI + 邀請好友** — 任務頁面、每日登入追蹤、里程碑、referral
3. **Sub-3：AI 聊天教練** — 教練頁面、免費體驗教學、正式對話（Claude API）、點數扣除

本 spec 涵蓋全部 3 個子專案的設計。實作時按順序各自走 plan → implement 流程。

---

## Sub-1：點數系統重構

### 現況問題

目前 `points.ts` 以 localStorage 為主、Supabase 為輔，用 `Math.max` 合併。這在多裝置場景容易出錯，且沒有交易紀錄。

### 新架構

**Supabase 為唯一真實來源（Single Source of Truth）**，前端只做快取。

#### DB Schema

```sql
-- 點數餘額欄位（已存在於 profiles 表）
-- profiles.points (integer, default 0)

-- 點數交易紀錄
CREATE TABLE point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,          -- 正數=獲得, 負數=消費
  balance_after INTEGER NOT NULL,   -- 交易後餘額
  type TEXT NOT NULL,               -- 'daily_login' | 'login_streak' | 'milestone' | 'referral' | 'quiz' | 'ai_coach' | 'analysis' | 'admin'
  description TEXT NOT NULL,        -- 人類可讀描述，例如「每日登入 +5」
  reference_id TEXT,                -- 可選，關聯的 ID（例如 referral 的被邀請者 user_id）
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_point_transactions_user ON point_transactions(user_id, created_at DESC);

-- RLS
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions"
  ON point_transactions FOR SELECT USING (auth.uid() = user_id);
```

#### points.ts 重構

```typescript
// 移除 localStorage 主導邏輯
// 所有點數操作走 Supabase

export async function getPoints(userId: string): Promise<number>
export async function addPoints(userId: string, amount: number, type: string, description: string, referenceId?: string): Promise<number>
export async function spendPoints(userId: string, amount: number, type: string, description: string): Promise<{ success: boolean; balance: number }>
export async function getTransactionHistory(userId: string, limit?: number): Promise<PointTransaction[]>
```

**`spendPoints` 流程：**
1. 讀取當前餘額
2. 檢查 `balance >= amount`
3. 扣除並寫入 transaction
4. 返回成功/失敗 + 新餘額
5. 用 Supabase RPC 做原子操作避免 race condition

**原子扣點 RPC：**

```sql
CREATE OR REPLACE FUNCTION spend_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT
) RETURNS TABLE(success BOOLEAN, new_balance INTEGER) AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  -- Lock row
  SELECT points INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;

  IF v_balance < p_amount THEN
    RETURN QUERY SELECT false, v_balance;
    RETURN;
  END IF;

  -- Deduct
  UPDATE profiles SET points = points - p_amount WHERE id = p_user_id;
  v_balance := v_balance - p_amount;

  -- Record transaction
  INSERT INTO point_transactions (user_id, amount, balance_after, type, description)
  VALUES (p_user_id, -p_amount, v_balance, p_type, p_description);

  RETURN QUERY SELECT true, v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

類似地，`add_points` RPC 做原子加點。

---

## Sub-2：任務系統

### 任務類型

#### 1. 每日登入（Daily Login）

**規則：**
- 每天首次開啟 app 且已登入 → +5 點
- 連續登入 7 天 → 額外 +50 點（第 7 天發放，之後重新計算）
- 「一天」以 UTC+8 午夜為界

**DB 欄位（profiles 表新增）：**

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS last_login_date TEXT,       -- 'YYYY-MM-DD' (UTC+8)
  ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0;
```

**觸發時機：** `App.tsx` 的 `onAuthStateChange` 或 `initUser` 中，偵測到新的一天就執行。

#### 2. 練習里程碑（Milestones）

**里程碑表：**

| 累計答題數 | 獎勵 |
|-----------|------|
| 100 | +50 |
| 500 | +150 |
| 1000 | +300 |
| 5000 | +1000 |

**DB 欄位（profiles 表新增）：**

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS claimed_milestones INTEGER[] DEFAULT '{}';
```

`claimed_milestones` 存已領取的里程碑數字，例如 `{100, 500}`。

**判斷邏輯：** 用 `answer_records` 的 count 比對里程碑列表，過濾掉已領取的，有未領取的就顯示可領取。

#### 3. 邀請好友（Referral）

**流程：**
1. 每個用戶有唯一 referral code（註冊時自動生成，用 user_id 前 8 碼）
2. 分享連結格式：`https://app-url/?ref=XXXXXXXX`
3. 新用戶透過連結註冊 → `profiles.referred_by` 記錄邀請者 ID
4. 被邀請者完成註冊 → 邀請者獲得 +100 點

**DB 欄位：**

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
```

**referral_code 生成：** 註冊時用 `id.slice(0, 8)`，如果衝突就用 `id.slice(0, 10)`。

**點數發放時機：** 被邀請者完成 Onboarding 後（確認是真實用戶），觸發邀請者 +100。

#### 4. 撲克 MBTI 完成獎勵

**規則：** 完成測驗並註冊 → +20 點（一次性）

**判斷：** `profiles.quiz_style IS NOT NULL` 且 `point_transactions` 中無 type='quiz' 的記錄 → 可領取。

**觸發時機：** quiz result sync 到 profile 後自動發放。

### 任務 UI

**入口：** Profile 頁新增「任務與獎勵」區塊（不新增 tab，避免 BottomNav 擁擠）。

**畫面：**
- 頂部顯示當前點數餘額
- 每日登入：顯示今日是否已簽到、連續天數、距離 7 天獎勵的進度
- 里程碑：進度條 + 已領取/未領取/進行中狀態
- 邀請好友：顯示 referral code + 複製/分享按鈕 + 已邀請人數
- 已完成任務灰色顯示

---

## Sub-3：AI 聊天教練

### 頁面入口

在 BottomNav 新增第 6 個 tab：「教練」（或替換現有 5 tab 中的一個，視 UI 空間決定）。

**替代方案：** 如果不想動 BottomNav，可以放在 TrainTab 或 Profile 頁面內作為入口按鈕跳轉到全螢幕教練畫面。

### 免費體驗教學（寫死，不耗 token）

**觸發條件：** `profiles.coach_onboarding_done = false`（新增欄位）

**教學流程（4 輪模擬對話）：**

1. **教練開場：**
   > 👋 歡迎！我是你的 AI 撲克教練。
   > 你可以跟我討論任何手牌的打法，我會用 GTO 的角度幫你分析。
   > 來試試看，選一個你想問的問題：

2. **用戶選擇預設問題（3 個選項按鈕）：**
   - 「BTN 拿到 AQo 被 3-bet，該怎麼辦？」
   - 「翻牌有同花 draw，要不要 check-raise？」
   - 「短籌碼 15BB，什麼範圍該推全下？」

3. **教練回覆（根據選擇顯示對應的寫死回答）：**
   - 每個回答約 150-200 字，包含具體策略建議
   - 格式：情境分析 → GTO 建議 → 常見錯誤提醒

4. **教練結語：**
   > 這就是我能幫你的方式！不只手牌分析，你也可以問我：
   > • 特定位置的開局範圍
   > • 面對不同對手類型的調整
   > • 下注尺寸的選擇邏輯
   >
   > 正式使用每則訊息消耗 5 點。你目前有 {points} 點。

5. 標記 `coach_onboarding_done = true`

### 正式對話

**UI 結構：**
- 類似聊天介面，上方對話歷史，下方輸入框
- 每則訊息旁顯示「-5 點」標記
- 輸入框上方顯示當前點數餘額
- 點數不足時輸入框 disabled，顯示「點數不足，完成任務獲取更多點數」

**訊息發送流程：**
1. 用戶輸入訊息
2. 前端呼叫 `spendPoints(userId, 5, 'ai_coach', 'AI 教練對話')`
3. 扣點成功 → 呼叫 Supabase Edge Function `ai-coach`
4. Edge Function 帶上對話歷史，呼叫 Claude API
5. 回傳教練回覆，顯示在聊天中
6. 扣點失敗（餘額不足）→ 顯示點數不足提示

**Edge Function（ai-coach）：**

```typescript
// 輸入：messages（對話歷史，最近 10 則）+ user_id
// System prompt：你是 GTO 撲克教練，用繁體中文回答...
// Model：claude-haiku-4-5（成本最低，回應快）
// Max tokens：500（控制成本）
```

**對話歷史：**
- 存 localStorage（key: `coach_messages`）
- 只保留最近 20 則（10 輪來回）
- 發送給 API 時只帶最近 10 則作為 context
- 新增「清除對話」按鈕

**不做雲端同步** — 對話歷史只在當前裝置，換裝置不保留。

### DB 欄位新增

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS coach_onboarding_done BOOLEAN DEFAULT false;
```

### 成本估算

- Claude Haiku：input ~$0.80/M tokens, output ~$4/M tokens
- 每則用戶訊息 + 10 則 context ≈ 2000 input tokens + 300 output tokens
- 每則成本 ≈ $0.003（約 0.1 台幣）
- 5 點/則，假設未來 100 點 = $2，則每則收入 $0.10，毛利率 97%
- 純靠任務賺點的用戶：免費成本需控制，但 Haiku 成本極低

---

## 點數經濟平衡

### 獲取速度估算（純任務）

**日常穩定來源：**
- 每日登入：+5/天 = +35/週
- 連續 7 天額外：+50/週
- 合計：~85 點/週

**一次性來源：**
- 撲克 MBTI：+20
- 里程碑 100 題：+50
- 里程碑 500 題：+150
- 邀請 1 位好友：+100

**消費速度：**
- AI 教練 1 則：5 點 → 每週可問 17 則（每天 ~2-3 則）
- AI 分析 1 次：50 點 → 每週不到 2 次

**結論：** 純靠任務的免費用戶每天能問 AI 教練 2-3 個問題，足夠體驗但不會無限使用。重度用戶需要等未來儲值功能上線。

---

## 不在此次範圍

- 點數購買/儲值（預留給未來手機版 IAP）
- 點數過期機制
- AI 教練的語音輸入/輸出
- 對話雲端同步
- 教練頁面的手牌輸入器（先用純文字描述）
- 排行榜
