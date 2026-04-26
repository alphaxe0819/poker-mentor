---
name: PD Scraping Handover
description: 給新專案的完整交付文件 — pokerdinosaur.com 抓爬邏輯、資料格式、轉換 pipeline、Supabase 上傳；可整段 copy 給其他 Claude session 參考
type: project
created: 2026-04-26
---

> 本頁是 **pokerdinosaur 抓爬全套方案的 handover doc**。新專案 Claude session 讀完這份就能接手繼續抓 / 接 converter / 接 DB。
> 來源檔案位置在最末段「§7 關鍵檔案路徑」。

---

## §1 抓爬方式（兩種 mode 並存）

### Mode A：手動 Console 腳本（單頁 scrape）

**檔案**：`scripts/gto-pipeline/scrape-pokerdinosaur.js`（271 行 IIFE 自執行）

**用法**：
1. 瀏覽器打開 pokerdinosaur.com 任一 project 頁
2. F12 → Console 貼整段腳本 → Enter
3. 自動切換 depth → 每個 position tab → 抓 169 格 → 下載 JSON
4. 換 scenario / project 再跑一次

**核心 DOM 選擇器**（pokerdinosaur 用 CSS Modules，class 名有 hash 後綴，要連 hash 一起抓）：

```js
.RangeGrid_cell__jm9VR              // 169 格 cell
.ScenarioSelector_triggerLabel___Z42F  // 上方標籤（scenario / depth）
.ScenarioSelector_trigger__Ku4Sp       // 下拉觸發器
.ScenarioSelector_option__jEb4f        // 下拉選項
.TableList_positionTag__5_x5F          // position tabs
.TableList_selectedPosition__Ca0V4     // 當前 active position
.TableList_tagName__Wqg4N              // position 名稱（BTN/SB/BB/...）
```

**取色邏輯**（`getComputedStyle(cell).backgroundColor` 比對 RGB）：

```js
'rgb(76, 175, 80)':  'call_3b_or_4b'   // 綠
'rgb(255, 193, 7)':  'call_3b'          // 黃
'rgb(244, 67, 54)':  '4b_bluff'         // 紅
'rgb(3, 169, 244)':  'fold_vs_3b'       // 淺藍
'rgb(33, 150, 243)': 'fold_vs_3b'       // 藍變體
'rgb(103, 58, 183)': 'call_3b_vs_co_bu' // 紫
'rgb(63, 81, 181)':  'call_3b_vs_co_bu' // 靛
'rgb(0, 150, 136)':  'call'             // 青
'rgb(139, 195, 74)': 'raise'            // 淺綠
'rgb(255, 152, 0)':  'raise'            // 橘
'rgb(233, 30, 99)':  'jam'              // 桃紅
'rgb(156, 39, 176)': '3bet'             // 紫
'rgb(121, 85, 72)':  'limp'             // 棕
'rgb(32, 32, 32)' / 'rgba(0,0,0,0)':  'fold'
```

未知顏色不丟棄，存 `unknown_<rgb_digits>` 給人後續判讀。

### Mode B：Chrome DevTools MCP / Computer Use（自動化深爬）

**Hard rule**（用戶明定，未經允許不得更改 — 見 `memory/project_pokerdinosaur_scraping.md`）：

- 用 `javascript_tool` 注入 `<script>` 元素跑 async 函式（**不能直接 `await`**，要包進 IIFE）
- **「深度切換需用 Chrome `computer` tool 真實點擊」**（React 不接 JS 合成 click）
- position tab 切換可用 JS `.click()` 接受
- 完成信號：`document.body.getAttribute('data-batch-done')`（不要 polling console）
- PNG 用 Canvas API 渲染，`<a download>` 自動下載
- 結果存 `document.body.setAttribute('data-scraper-result', JSON.stringify(data))` 給外面 read

---

## §2 資料檔案格式

### `projects_all.json`（10 個 project 列表）

```json
[
  {
    "id": "uuid",
    "name": "Course",
    "actions": {...},
    "description": null,
    "created_at": "..."
  }
]
```

### `scenarios_all.json`（樹狀 scenario，有 parent-child）

```json
[
  {
    "id": "uuid",
    "project_id": "uuid",
    "parent_id": "uuid|null",
    "name": "10bb Push",
    "order": 0,
    "is_folder": true|false
  }
]
```

> 上傳時要 BFS 按 parent depth 分層 insert，否則 FK 失敗（見 `upload-pd-data.js` 第 102-114 行）

### `action_id_map.json`（每個 project 的色號 → label/color 字典）

```json
{
  "<project_id>": {
    "actions": {
      "<action_id>": { "label": "3B Value / Jam < 35bb", "color": "rgb(...)" }
    }
  }
}
```

### `<ProjectName>_ranges.json`（**主資料檔**，每個 project 一份）

```json
{
  "project_id": "uuid",
  "project_name": "Course",
  "tables": [
    {
      "id": "uuid",
      "scenario_id": "uuid",
      "name": "BB VS MP",
      "order": 0,
      "grid": {
        "AA": "<action_id>",
        "AKs": { "<aid1>": 80, "<aid2>": 20 }
      },
      "action_ids": ["<aid>", ...]
    }
  ]
}
```

`grid` value 兩種型態：
- `string` = 純動作（指向 action_id_map 裡的 entry）
- `object` = mixed strategy，`{action_id: weight%}` 加總 100

`name` 是自由文字（要 parser 解析成 hero/villain/scenario/depth — 見 §3.2）

### 已抓到的 10 個 project（合計 16,750 tables）

| project | tables |
|---|---|
| Course（課程表格 S0） | 353 |
| Live_MTT_Ben_Adjusted | 1,149 |
| Tournament_Ben_Adjusted | 1,470 |
| Tournament_Chip_EV | 945 |
| Final_Two_Tables | 857 |
| Final_Table | 2,600 |
| Final_Table_Exploitative | 2,600 |
| Large_Field_ICM | 2,505 |
| Medium_Field_ICM | 2,230 |
| Small_Field_ICM | 2,041 |

---

## §3 轉換 Pipeline

### §3.1 `pd-to-range.mjs` — action_id → label → bucket

```
*_ranges.json + action_id_map.json
  → output/pd-ranges/<project>/<table>.json
```

每 hand 變成：

```js
{ action: "3B Value / Jam < 35bb", bucket: "raise", weight: 1.0, color: "rgb(...)" }
// 或混合策略：
{ mixed: [{action, bucket, weight, color}, ...], totalPct: 100 }
```

**label → bucket 規則**（prefix-based，case-insensitive，預先 normalize 多字片語）：

- `raise` bucket：`3B*` `4B*` `Raise*` `Openraise` `Minraise` `Jam` `Allin` `Push` `Shove` `Squeeze` `<n>x`（如 2.5x）
- `call` bucket：`Call` `Check` `Limp` `Defend` `Flat` `Broke`
- `fold` bucket：`Fold` 或空 label
- 預先 normalize：`All in` → `allin`、`Open Raise` → `openraise`、`Cold 4Bet` → `cold4bet`
- 純深度 token（"20bb"）跳過，不歸 bucket
- 解不出來進 `unknown` bucket，**不 silently drop**

### §3.2 `parse-pd-table-name.mjs` — 解析 table.name 自由文字

把 `"BB VS MP"`、`"10bb SB Push"`、`"Live MTT Ben Adjusted - Open Raise UTG"` 解析成：

```js
{
  raw, scenario, hero, villain, positions, depth_bb, format, modifiers, unknown, reason
}
```

**Position canonical**（9-max 含 alias）：

```
BTN  = btn / button / bu / dealer
SB   = sb / smallblind
BB   = bb / bigblind
CO   = co / cutoff
HJ   = hj / hijack
LJ   = lj / lojack
UTG+2 = utg+2 / utg2
UTG+1 = utg+1 / utg1
UTG  = utg / utg+0 / underthegun
MP   = mp / middle / mp1 / mp2 / mp3
EP   = ep / early
LP   = lp / late
```

> Alias lookup 要 longest-first 排序，避免 `utg+2` 被 `utg` 提前 match。

**Scenario prefix**：`open` / `flat` / `3bet` / `4bet` / `cold4bet` / `jam` / `limp` / `rejam` / `squeeze` / `multiway`

**Modifier tag**（不影響 scenario）：`live` `ben-adjusted` `icm` `final-table` `chip-ev` `exploitative` `bubble` `hu`

**Format 推論**：`hu` / `mtt` / `cash`（依 modifier + raw 文字）

**VS pattern**：`X VS Y` → hero=X, villain=Y（pd 慣例：左邊是被描述 range 的 hero）

**Heuristic fallback**：
- 沒 VS 但有 position → hero = 第一個 position
- 有 positions 但無 scenario verb → 若有 VS 模式則推論 `flat`，否則 unknown

**Unknown 機制**：parser 永不 throw，解不出來塞 `unknown=true, reason=...`，CLI 報統計給人 review。Course 353 tables 中 58.1% (205) auto-parseable。

### §3.3 `build-mtt-ranges.mjs` — 產 MTT 範圍 lib

讀 `Course_ranges.json` + `output/pd-ranges/Course/*.json`，輸出 `mtt_9max_ranges.mjs`：

```js
export const COURSE_RANGES = {
  "open_btn_50bb": {
    hero: "BTN", villain: null, scenario: "open", depth_bb: 50,
    covered_sids: 3, hand_count: 27, raw_name: "Open Raise BTN",
    range: "AA,KK,QQ,...,A2s,K2s,..."   // TexasSolver 逗號格式
  }
}
```

slug 規則：`<scenario>_<hero>_vs_<villain>_<depth>bb`（碰撞加 `_v2/_v3`）

hand 排序：pairs first（AA→22）→ suited（高→低）→ offsuit（高→低）

---

## §4 Supabase 上傳（`scripts/upload-pd-data.js`）

3 個 table：

- `pd_projects` — `projects_all.json` upsert
- `pd_scenarios` — BFS 分層 insert（parent FK 順序，避免 FK fail）
- `pd_tables` — 掃 Downloads `*_ranges.json` 全 upsert，每 chunk 500 row

PostgREST + `Prefer: resolution=merge-duplicates` 做 upsert。

需要：`SUPABASE_URL` + `ANON_KEY`（測試環境）

---

## §5 抓爬硬規則（用戶明定，未經允許不得更改）

> 來源 `memory/project_pokerdinosaur_scraping.md`

- 完成信號用 DOM attribute 接，不要 polling console
- 切深度（depth）必須 computer tool 真實點擊 — React 拒絕 JS 合成事件
- Position tab 可用 JS click（React 接受）
- 每個 scenario 完成後立即整理到 `Downloads/GTO/<ScenarioName>/`

---

## §6 待爬 Project（依 Workspace 順序）

1. ✅ Live_MTT_Ben_Adjusted（1,149 完成）
2. ⏭ Tournament_Ben_Adjusted（1,470）— 下一個目標
3. Tournament_Chip_EV（945）
4. Final 系列：Final_Two_Tables（857）、Final_Table（2,600）、Final_Table_Exploitative（2,600）、Large/Medium/Small_Field_ICM（2,505/2,230/2,041）— 合計 12,833 張

> JSON 端 10 個 project 已全到位（16,750 tables 等於完整 superset），PNG 圖檔 S2-S4 共 13,248 張待爬。

---

## §7 關鍵檔案路徑（新專案直接 copy）

```
scripts/gto-pipeline/scrape-pokerdinosaur.js   # Mode A 腳本
scripts/gto-pipeline/pd-to-range.mjs           # action_id → bucket converter
scripts/gto-pipeline/parse-pd-table-name.mjs   # table.name parser（含 CLI 報告）
scripts/gto-pipeline/build-mtt-ranges.mjs      # 產 MTT lib 的 builder
scripts/gto-pipeline/mtt_9max_ranges.mjs       # 產出範例（110 entries）
scripts/upload-pd-data.js                      # Supabase 上傳
memory/project_pokerdinosaur_scraping.md       # 用戶硬規則 + 進度
memory/wiki/scraping-audit-2026-04-21.md       # 10 project / 16,750 tables 盤點
memory/wiki/range-collection-roadmap.md        # S0-S4 路線圖
memory/wiki/pd-mtt-scenario-coverage-2026-04-21.md  # MTT 涵蓋率分析
```

---

## 相關連結

- [[range-collection-roadmap]] — 範圍收集總進度
- [[project_pokerdinosaur_scraping]] — 用戶硬規則 + 抓爬進度
- [[scraping-audit-2026-04-21]] — 10 project / 16,750 tables 盤點
- [[pd-mtt-scenario-coverage-2026-04-21]] — MTT 涵蓋率分析
