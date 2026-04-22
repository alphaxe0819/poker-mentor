---
name: Villain Profile 設計（答案組合表）
description: 對手特徵卡（villain profile）系統的三種輸入方式（問卷/數字比例/13×13 grid）+ 21 個 range grid + LLM prompt summarizer 的完整設計
type: project
---

# Villain Profile 設計 — 答案組合表

> **狀態**：v1 草案（2026-04-22）— 架構 + schema + 問卷骨架 + 數字比例範例完成；完整題目 + 所有 % 選項 + 完整 baseline mapping 待 v2 補完
> **用途**：villain profile 三種輸入方式（問卷 / 數字比例 / 13×13 grid 拉）的所有可能組合 → 對應 21 個 range grid 的 mapping
> **派工前必讀**：v2 補完前，前端執行者無法 implement 完整輸入邏輯

---

## 1. 整體架構

### 1.1 位置 grouping（4 group，用戶 2026-04-22 決議）

| Group | 簡稱 | 含 6max 位置 | 含 9max 額外位置 |
|---|---|---|---|
| 前位 | EP | UTG | UTG+1, UTG+2 |
| 中位 | MP | HJ | LJ, HJ |
| 後位 | LP | CO, BTN | 同 |
| 盲注位 | BL | SB, BB | 同 |

### 1.2 動作維度（6 種）

| 動作 | 含義 | 對應 preflop 路徑 |
|---|---|---|
| RAISE | open raise | 沒人 open → 主動加注 |
| 跟注 | call vs open | 前手 open → call |
| 3BET | face open → 3-bet | 前手 open → 3-bet |
| 跟3BET | open 後 face 3-bet → call **或** 中後位冷跟 3-bet | open → 3-bet → call ／ 別人 3-bet 別人 → flat |
| 4BET / ALLIN | open 後 face 3-bet → 4-bet 或 shove | open → 3-bet → 4-bet |
| 跟4BET / ALLIN | 3-bet 後 face 4-bet → call **或** 中後位冷跟 4-bet | open → 3-bet → 4-bet → call ／ 4-bet war 旁觀 → flat |

### 1.3 Grid 數量（方案 A，21 grid）

前位的「跟注 / 3BET / 跟4BET」邏輯上極邊緣或不存在（UTG 是第一個說話 face 不到別人 open；UTG+1/UTG+2 face UTG open 的 call/3-bet 算「前位內子位置」行為，極少做 4-bet war）

| 位置 | RAISE | 跟注 | 3BET | 跟3BET | 4BET | 跟4BET | 小計 |
|---|---|---|---|---|---|---|---|
| EP 前位 | ✓ | — | — | ✓ | ✓ | — | **3** |
| MP 中位 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** |
| LP 後位 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** |
| BL 盲注位 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **6** |
| **Total** | | | | | | | **21** |

> 替代方案備註：
> - 方案 B = 全 4×6 = 24 grid（含邏輯上不存在的灰格）
> - 方案 C = 3 group × 6 = 18 grid（盲注位合併到後位，精準度損失）
> - 用戶可隨時改方案，本 design 改前 3 個位置即可重組

---

## 2. 資料結構（localStorage shape）

### 2.1 Storage Key
```
exploit-coach-villains-v2
```
（v1 是現在的 villains 7 type，v2 是 range-based 新版本，**v1 直接刪光不 migration**）

### 2.2 JSON Shape
```typescript
interface VillainProfile {
  version: 'v2'
  id: string                    // uuid
  name: string                  // 用戶自訂對手名
  color: string                 // hex e.g. '#3b82f6'
  createdAt: string             // ISO
  updatedAt: string

  ranges: {
    [key in RangeKey]: RangeData  // 21 個 key
  }

  metadata: {
    createdMethod: 'questionnaire' | 'percent_select' | 'grid_manual'
    // 保留原始輸入，方便用戶之後切換編輯模式
    questionnaireAnswers?: number[]   // 例 [1, 2, 0, 3, ...] 對應每題的選項 index
    percentChoices?: { [key in RangeKey]: number }  // 例 { EP_RAISE: 12, ... }
  }
}

type RangeKey =
  | 'EP_RAISE' | 'EP_CALL_3BET' | 'EP_4BET'
  | 'MP_RAISE' | 'MP_CALL' | 'MP_3BET' | 'MP_CALL_3BET' | 'MP_4BET' | 'MP_CALL_4BET'
  | 'LP_RAISE' | 'LP_CALL' | 'LP_3BET' | 'LP_CALL_3BET' | 'LP_4BET' | 'LP_CALL_4BET'
  | 'BL_RAISE' | 'BL_CALL' | 'BL_3BET' | 'BL_CALL_3BET' | 'BL_4BET' | 'BL_CALL_4BET'

interface RangeData {
  totalPct: number              // 整體百分比 e.g. 12.5
  grid: number[]                // 169-element array, 0 or 1
                                // index 0 = 22, index 1 = 32, ..., index 168 = AA
                                // 順序見下方 HAND_INDEX_ORDER
}
```

### 2.3 Hand Index 順序（13×13 = 169）
```typescript
// 標準順序：先 pair 從低到高（22-AA）→ suited（按高牌大小）→ offsuit
// 13×13 grid 視覺：列 = 高牌（A→2 從上到下），欄 = 低牌（A→2 從左到右）
// pair 在對角線（AA 左上 → 22 右下），上三角 = suited，下三角 = offsuit
const HAND_INDEX_ORDER = [
  '22','32s','42s','52s','62s','72s','82s','92s','T2s','J2s','Q2s','K2s','A2s',
  '32o','33','43s','53s','63s','73s','83s','93s','T3s','J3s','Q3s','K3s','A3s',
  // ... (完整 169 個，v2 補完)
  // 'AA' 為 index 168
]
```

> v2 todo：完整 169 hand index array

### 2.4 Storage 大小估算
- 一個 villain：21 ranges × (1 totalPct + 169 grid bools) ≈ 3,580 bytes（純 JSON）
- 假設玩家最多存 20 個 villain：~70KB
- localStorage 上限通常 5MB → 可容納上千 villain，無壓力

---

## 3. 問卷模式（v1 草案，7 題）

### 3.1 設計原則
- **少題快**（5-8 題完成）
- **語義化選項**（不直接寫 % 數字，用人話描述）
- 推導出 21 個 grid 的「整體 %」+ 套用 baseline 填 grid

### 3.2 題目骨架

#### 題 1：對手在前位（UTG / UTG+1 / UTG+2）開多少手？
- A. 很緊（只 AA-77 / AKs / AKo）→ 推 EP_RAISE 8%
- B. 標準（加入 ATs+ / KQs / 中對）→ 推 EP_RAISE 12%
- C. 偏鬆（加入更多 suited connectors）→ 推 EP_RAISE 18%
- D. 很鬆（幾乎所有 broadway 都開）→ 推 EP_RAISE 25%

#### 題 2：對手在中位（LJ / HJ）開多少手？
- A. 很緊 → MP_RAISE 12%
- B. 標準 → MP_RAISE 16%
- C. 偏鬆 → MP_RAISE 22%
- D. 很鬆 → MP_RAISE 30%

#### 題 3：對手在後位（CO / BTN）開多少手？
- A. 很緊 → LP_RAISE 22%
- B. 標準 → LP_RAISE 32%
- C. 偏鬆 → LP_RAISE 42%
- D. 很鬆 → LP_RAISE 55%

#### 題 4：對手在盲注位（SB / BB vs 別人 limp 時）開多少手？
- A. 很緊 → BL_RAISE 15%
- B. 標準 → BL_RAISE 25%
- C. 偏鬆 → BL_RAISE 35%

#### 題 5：對手 3-bet 頻率（face 別人 open 時）？
- A. 幾乎不（只 AA-QQ / AKs）→ MP/LP/BL_3BET 3-4%
- B. 標準（含中對 4-bet bluff）→ 6-7%
- C. 經常 → 9-10%
- D. 很愛 → 13%+

#### 題 6：對手面對 3-bet 的反應？
- A. 多 fold（CALL_3BET 5%, 4BET 2%）
- B. 標準（CALL_3BET 8%, 4BET 4%）
- C. 多 call（CALL_3BET 14%, 4BET 4%）
- D. 多 4-bet（CALL_3BET 7%, 4BET 8%）

#### 題 7：對手面對 4-bet 的反應？
- A. 幾乎全 fold（CALL_4BET 1%）
- B. 標準（CALL_4BET 3%）
- C. 多 call / 多 5-bet（CALL_4BET 5%）

### 3.3 推導邏輯
```
給定 (q1, q2, q3, q4, q5, q6, q7) 答案組合：
→ EP_RAISE.totalPct = q1_choice → 對應 %
→ MP_RAISE.totalPct = q2_choice → %
→ LP_RAISE.totalPct = q3_choice → %
→ BL_RAISE.totalPct = q4_choice → %
→ MP_3BET.totalPct = LP_3BET.totalPct = BL_3BET.totalPct = q5_choice → %
→ EP_CALL_3BET.totalPct = MP_CALL_3BET.totalPct = LP_CALL_3BET.totalPct = BL_CALL_3BET.totalPct = q6_choice → call %
→ EP_4BET.totalPct = MP_4BET.totalPct = LP_4BET.totalPct = BL_4BET.totalPct = q6_choice → 4bet %
→ MP_CALL.totalPct = LP_CALL.totalPct = BL_CALL.totalPct = q3 加 q5 推（call vs raise 受對手鬆緊和 3-bet 頻率影響）
→ MP_CALL_4BET.totalPct = LP_CALL_4BET.totalPct = BL_CALL_4BET.totalPct = q7 → %

題數總組合：4 × 4 × 4 × 3 × 4 × 4 × 3 = **2304 種組合**

但每種組合 → 純 deterministic 推 21 個 totalPct → 套 baseline 填 grid，**不用 lookup table**
```

### 3.4 題數選項與工作量
- v1 設計：7 題，每題 3-4 選項
- 完成時間：1-2 分鐘（比現有 5 題長一點點）
- v2 todo：題目用語打磨、選項 % 微調、特殊組合處理（例：超緊前位 + 超鬆後位 = 標準 nit）

---

## 4. 數字比例模式（v1 草案）

### 4.1 設計原則
- **逐 grid 給離散選擇題**（不自由輸入 %，用戶從幾個選項挑）
- 21 個 grid 各自一題 → 用戶選 21 次
- 每題 6-8 個 % 離散選項（合理範圍內）
- 選完 → 套 baseline 填 grid

### 4.2 各 grid 的 % 選項範例（範圍依位置調整）

#### EP_RAISE（前位 open）
選項：5% / 8% / 12% / 16% / 20% / 25% / 30%

#### MP_RAISE（中位 open）
選項：8% / 12% / 16% / 20% / 25% / 30% / 35%

#### LP_RAISE（後位 open）
選項：18% / 25% / 32% / 40% / 48% / 55% / 65%

#### BL_RAISE（盲注位 open / vs limp）
選項：10% / 15% / 22% / 30% / 40% / 50%

#### MP_CALL / LP_CALL / BL_CALL（跟注 vs open）
選項：3% / 6% / 10% / 14% / 18% / 22% / 28%

#### MP_3BET / LP_3BET / BL_3BET（face open 後 3-bet）
選項：2% / 4% / 6% / 8% / 10% / 13% / 16%

#### *_CALL_3BET（open 後 face 3-bet 的 call ／ 冷跟 3-bet）
選項：3% / 6% / 9% / 12% / 16% / 20%

#### *_4BET / ALLIN（open 後 face 3-bet 的 4-bet）
選項：1% / 2% / 4% / 6% / 8% / 12%

#### *_CALL_4BET / ALLIN（3-bet 後 face 4-bet 的 call）
選項：1% / 2% / 4% / 6% / 9%

> v2 todo：每個 grid 的選項 % 區間打磨、選項數量統一（建議全 6 選項對稱整齊）

### 4.3 推導邏輯
```
給定 21 個 grid 的選擇題答案 → 21 個 totalPct → 套 baseline 填 grid
（與問卷模式相同的 baseline 套用流程）
```

---

## 5. 13×13 Grid 拉模式（v1 草案）

### 5.1 設計原則
- **純 0/1**（用戶 2026-04-22 決議）
- 點選 / 拖拉切換 hand 狀態
- 每個位置切換顯示 6 個 grid（透過 tab）
- 載入模板（從 baseline 預填）

### 5.2 UI 元素
```
[位置 tab] EP | MP | LP | BL
[動作 tab] RAISE | 跟注 | 3BET | 跟3BET | 4BET | 跟4BET

13×13 grid（標準 hand matrix，AA 左上、22 右下）：
- 點：toggle 狀態（0 ↔ 1）
- 拖拉：批次切換
- 右上角顯示「目前 X% / 169 hands」

工具列：
- [清空] 全 0
- [載入模板] → 選 baseline（GTO 12% open / GTO 18% open / ...）
- [從 % 反推] → 給 % 套對應 baseline
- [複製到其他 grid] → e.g. EP_RAISE 套到 MP_RAISE
```

### 5.3 模板載入按鈕對應的 baseline
v1 phase：用手寫 26 個 baseline ranges（`gtoData_cash_6max_100bb.ts`）
v1.5 phase：升級到 pokerdinosaur 16,750 個 ranges（更多 stack / spot 涵蓋）

---

## 6. Baseline 套用邏輯

### 6.1 函式介面
```typescript
function findBaselineRange(
  position: 'EP' | 'MP' | 'LP' | 'BL',
  action: 'RAISE' | 'CALL' | '3BET' | 'CALL_3BET' | '4BET' | 'CALL_4BET',
  targetPct: number
): number[]  // 169-element grid (0 or 1)
```

### 6.2 實作策略（v1 phase）
```
1. 從手寫 baseline 找最接近 (position, action, targetPct) 的 range
   - 例：position='EP', action='RAISE', targetPct=15
   - 先找 'cash_6max_100bb_UTG_open'（這是 ~12%）
   - 不夠寬 → 套 'cash_6max_100bb_HJ_open'（~17%）的 hands subset
2. 把 hand list 轉成 169-element grid（0 or 1）
3. 回傳
```

### 6.3 v1.5 升級（pokerdinosaur 16,750）
```
1. Index pd ranges by (position, action, total_pct, stack_bb)
2. 給定 query → 找最接近的 baseline
3. 涵蓋 10bb-100bb 各種 stack depth 的 baseline
```

---

## 7. LLM Prompt Summarizer

### 7.1 不可能塞 21 × 169 = 3,549 個值進 prompt（token 爆炸）

### 7.2 Summarizer 輸出格式
```
對手 villain profile（共 21 個 range，重點 summary）：

【翻前 open】
- 前位 (UTG): 18%（GTO 標準 12%，**偏鬆 +6%**，多開 KQo / A9s / 76s）
- 中位 (HJ): 22%（GTO 17%，偏鬆 +5%）
- 後位 (BTN): 35%（GTO 49%，**偏緊 -14%**，少開 J5s / T6s 邊緣）
- 盲注 (SB): 25%（GTO 30%，標準）

【3-bet（face open）】
- 中位 3-bet: 4%（GTO 8%，偏緊 -4%，幾乎只有 AA-QQ + AKs）
- 後位 3-bet: 6%（GTO 11%，偏緊 -5%）
- 盲注 3-bet: 8%（GTO 12%，偏緊 -4%）

【面對 3-bet】
- 跟 3-bet: 14%（GTO 9%，**偏鬆 +5%**，對 3-bet 不太怕）
- 4-bet: 4%（標準）

【面對 4-bet】
- 跟 4-bet: 1%（GTO 3%，幾乎不跟 → 4-bet 幾乎都是 fold-or-shove polarized 範圍）

【整體玩家畫像】
偏緊保守的 reg 風格：前位偏鬆但後位反而偏緊（不愛偷盲），3-bet 緊但跟 3-bet 鬆（被動防守）。
**剝削策略**：
- 後位多偷盲（他棄 BB 多）
- 對他 3-bet 用更多 4-bet bluff（他幾乎不跟 4-bet）
- 不要對他開 J5s 之類邊緣手（他後位緊打不到他範圍弱端）
```

### 7.3 Summarizer 邏輯
```typescript
function summarizeVillainProfile(profile: VillainProfile, gtoBaseline: GtoBaseline): string {
  const lines: string[] = []
  for (const key of RANGE_KEYS) {
    const v = profile.ranges[key]
    const gto = gtoBaseline[key].totalPct
    const diff = v.totalPct - gto
    const tag = Math.abs(diff) < 2 ? '標準' : diff > 0 ? `偏鬆 +${diff}%` : `偏緊 ${diff}%`
    // 找 villain grid 與 GTO grid 的 hand diff（多/少哪些代表手）
    const extraHands = findHandsIn(v.grid).not_in(gtoBaseline[key].grid).slice(0, 5)
    const missingHands = findHandsIn(gtoBaseline[key].grid).not_in(v.grid).slice(0, 5)
    lines.push(`- ${displayName(key)}: ${v.totalPct}%（GTO ${gto}%, ${tag}, 多開 ${extraHands.join('/')}, 少開 ${missingHands.join('/')}）`)
  }
  // 加整體玩家畫像（用 LLM 一段或寫死規則）
  return lines.join('\n')
}
```

### 7.4 Token 預估
- 21 行 × ~80 token/行 = ~1,680 token
- 加整體畫像 ~200 token
- **Total ~1,900 token** 可接受（cache 化後便宜）

---

## 8. 後端 prompt 改動

### 8.1 替換現有的 villain_type 段
舊（line 279-287 of `exploit-coach/index.ts`）：
```typescript
if (ctx?.villain_type) {
  const label = ctx.villain_label || VILLAIN_LABELS[ctx.villain_type] || ctx.villain_type
  parts.push(`\n【本輪場景】對手類型：${label}`)
}
```

新：
```typescript
if (ctx?.villain_profile) {
  const summary = summarizeVillainProfile(ctx.villain_profile, GTO_BASELINE)
  parts.push(`\n【對手特徵詳細】\n${summary}`)
}
```

### 8.2 Edge Function context 接收的新 field
```typescript
interface CoachContext {
  // ... 現有 fields ...
  // 新增（取代 villain_type / villain_label / villain_leaks）：
  villain_profile?: VillainProfile  // 整包 21 ranges
}
```

---

## 8.5 MVP 範圍（用戶 2026-04-22 決議：先派最小 MVP）

### 8.5.1 MVP 包含
- ✅ 21 grid schema + localStorage（v2）
- ✅ **數字比例輸入模式**（21 grid 各一題選擇題，最快跑通端到端）
- ✅ baseline 用手寫 26 個 ranges（`gtoData_cash_6max_100bb.ts`）
- ✅ Range summarizer v1（每 range 一行：「位置 動作: X% (GTO Y%, 偏鬆/緊)」）
- ✅ Edge Function 改用 `villain_profile` field 取代 `villain_type`
- ✅ 整合到 exploit-coach 既有流程（玩家建好 villain → 進 chat → AI 看到 21 range summary）
- ✅ 舊 villain（v1 7 type）直接刪光，前端清 localStorage `exploit-coach-villains-v1`

### 8.5.2 MVP 不做（留 phase 2+）
- ❌ 問卷模式升級（v1 7 題粗略版繼續用、或暫時 disable）
- ❌ 13×13 grid 拉模式（最複雜的 UI，30+ hr 工作量）
- ❌ pokerdinosaur 16,750 baseline 升級（v1.5 phase 再做）
- ❌ 9 個典型 villain template 預設庫
- ❌ 跨裝置同步（Supabase）
- ❌ 對話中動態更新 villain 特徵
- ❌ 「整體玩家畫像」段（summarizer 先給結構化 21 行，畫像 phase 2 加）

### 8.5.3 MVP 工作量估算
| 模組 | 工時 |
|---|---|
| Schema + types + localStorage | 2 hr |
| 數字比例選擇題 UI（21 grid 各一題） | 6-8 hr |
| baseline 套用函式（26 ranges → grid 填充） | 4 hr |
| LLM summarizer v1 | 3-4 hr |
| Edge Function 改 prompt + 接收 villain_profile | 2 hr |
| 整合到 exploit-coach 既有流程 | 4-6 hr |
| 舊 villain 清除 + 前端 list 改顯示新版 | 1-2 hr |
| 實機驗證 + bug fix | 4 hr |
| **Total MVP** | **26-32 hr**（3-4 工作天） |

### 8.5.4 MVP 完成後可立即驗證的事
- 玩家用「數字比例」建立一個對手 → 21 grid 全填好
- 進 chat 問 AI → AI 回答看得到「對手後位 35% open（偏緊 -14%）」這種具體 grounding
- 可以對比「v1 villain_type='lag' 的回答」vs 「v2 villain_profile 21 range 的回答」品質差異

---

## 9. 「答案組合表」完整化計畫（v2 todo）

v1 是骨架，v2 要補：
- [ ] 7 題問卷的完整題目用語（測試讓非技術用戶看懂）
- [ ] 每題每選項對應的精準 % 數字（依 baseline 反推）
- [ ] 21 個 grid 各自的選擇題完整 % 選項清單
- [ ] 完整 169 hand index array（HAND_INDEX_ORDER）
- [ ] baseline 套用函式偽碼 → 真實 implementation
- [ ] LLM summarizer 整體畫像段的規則設計
- [ ] 9 個典型 villain template（LAG / TAG / nit / fish 等）的完整 21 range 定義
- [ ] Edge case 處理（用戶選了不可能組合，例如前位 30% open + 後位 5% open）

---

## 10. 連結

- [[task-board]] — 派工總入口（T-082 暫無關，本系統是新 task）
- [[gto-pipeline-conventions]] — GTO 資料命名規範
- [[range-collection-roadmap]] — pokerdinosaur 16,750 ranges 進度
- [[scraping-audit-2026-04-21]] — pd ranges audit
- [[poker-terminology-zh-tw]] — 繁中術語表
- `src/lib/gto/gtoData_cash_6max_100bb.ts` — 26 個手寫 baseline ranges
- `scripts/gto-pipeline/output/pd-ranges/` — 188 個已轉 pd ranges（剩 16,562 待 unpack）
