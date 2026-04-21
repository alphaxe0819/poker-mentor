# Second Brain Wiki System Design

> 日期：2026-04-17
> 狀態：approved
> 靈感來源：Karpathy second brain 概念 + 傅立人教程

## 概述

建立雙 Vault 知識管理系統，融合 Karpathy 的 AI 維護知識庫概念到我們的開發工作流：

1. **個人知識庫**（獨立 Obsidian Vault）— 文章、想法、覆盤、撲克理論、商業觀察
2. **Poker Goal 專案記憶升級**（現有 `memory/` 重構為 Obsidian Vault）— 雙向連結、分級查詢、健檢
3. **四個共用 Claude Code Skill** — wiki-ingest、wiki-healthcheck、compound、rescue-bookmarks
4. **CLAUDE.md 整合** — 每個 session 自動帶知識背景，分級查詢省 token

## 架構：方案 A — 雙 Vault + 共用 Skill

兩個獨立 Obsidian Vault，各自 git 管理，共用一套 Claude Code skill。Claude 透過讀兩邊的 `index.md` 實現跨 vault 查詢。

```
C:\Users\User\Desktop\
├── second-brain\              ← 個人 Obsidian Vault（獨立 git repo）
│   ├── raw\
│   ├── wiki\
│   ├── index.md
│   ├── log.md
│   └── CLAUDE.md
│
└── gto-poker-trainer\         ← 專案 repo
    └── memory\                ← 專案 Obsidian Vault（子目錄）
        ├── wiki\
        ├── raw\
        ├── index.md
        ├── log.md
        ├── dev-log.md
        └── reference_architecture.md
```

---

## Section 1：個人知識庫結構

### 目錄

```
second-brain/
├── raw/                          ← 原始素材（一篇一檔）
│   ├── 2026-04-17-karpathy-second-brain.md
│   ├── 2026-04-17-tweet-elonmusk-xxx.md
│   └── ...
├── wiki/                         ← AI 整理後的知識頁
│   ├── concepts/                 ← 概念
│   ├── people/                   ← 人物
│   ├── tools/                    ← 工具
│   ├── methods/                  ← 方法論
│   ├── insights/                 ← 自己的想法 / 覆盤 / 判斷
│   └── poker/                    ← 撲克理論 / 牌局覆盤 / 策略
├── index.md                      ← 全目錄（分級查詢入口）
├── log.md                        ← 操作記錄
└── CLAUDE.md                     ← vault 的 AI 維護規則
```

### 檔案格式（wiki 頁面）

```markdown
---
title: Second Brain
aliases: [第二大腦, personal knowledge base]
tags: [concept, knowledge-management]
created: 2026-04-17
updated: 2026-04-17
sources: [raw/2026-04-17-karpathy-second-brain.md]
---

# Second Brain

（概念的一段式摘要）

## 核心要點
- ...

## 相關連結
- [[Karpathy]] — 提出者
- [[Claude Code]] — 維護工具
- [[Obsidian]] — 前端介面
```

### 命名規則

- `raw/`：`YYYY-MM-DD-來源-簡短標題.md`
- `wiki/`：概念名小寫 kebab-case（`second-brain.md`）
- 雙向連結用 Obsidian 格式 `[[page-name]]`

### index.md 格式

```markdown
# Knowledge Index

## Concepts
- [[second-brain]] — 用 AI 維護的個人知識庫，知識複利系統
- [[compound-skill]] — 對話結束時自動提取副產品回寫 wiki

## People
- [[karpathy]] — OpenAI 創始團隊，前 Tesla AI 總監

## Tools
- [[claude-code]] — Anthropic CLI，用於維護 wiki
...
```

AI 查詢時先讀 `index.md`（一行一頁帶摘要），找到相關頁再 Read 具體內容。

---

## Section 2：Poker Goal 記憶系統升級

### 升級後結構

```
gto-poker-trainer/memory/
├── wiki/                          ← 專案知識頁（從現有 memory 檔遷移）
│   ├── product-pivot-2026-04.md
│   ├── hu-simulator.md
│   ├── ui-v2-rules.md
│   ├── deployment-state.md
│   ├── partnership-strategy.md
│   ├── seat-order.md
│   ├── exploit-engine.md
│   └── ...
├── raw/                           ← 開發決策原始記錄
├── index.md                       ← 取代 MEMORY.md
├── log.md                         ← wiki 操作記錄
├── dev-log.md                     ← 保留不動（commit 記錄）
├── reference_architecture.md      ← 保留不動（架構總覽）
└── .obsidian/                     ← Obsidian 設定（git 追蹤）
```

### 遷移對照表

| 現有檔案 | 遷移到 | 動作 |
|---|---|---|
| `MEMORY.md`（auto-memory） | 瘦身成 pointer | 內容遷入 `memory/index.md` |
| `project_product_pivot_2026_04_14.md` | `memory/wiki/product-pivot-2026-04.md` | 重命名 + 加 wiki links |
| `dev_workflow_hu_simulator.md` | `memory/wiki/hu-simulator.md` | 重命名 + 加 wiki links |
| `project_ui_v2_rules.md` | `memory/wiki/ui-v2-rules.md` | 重命名 + 加 wiki links |
| `deployment_state.md` | `memory/wiki/deployment-state.md` | 重命名 + 加 wiki links |
| `partnership_strategy.md` | `memory/wiki/partnership-strategy.md` | 重命名 + 加 wiki links |
| `feedback_whiteboard_standard.md` | `memory/wiki/whiteboard-standard.md` | 重命名 + 加 wiki links |
| `feedback_no_unauthorized_push.md` | `memory/wiki/no-unauthorized-push.md` | 重命名 + 加 wiki links |
| `feedback_auto_open_html.md` | `memory/wiki/auto-open-html.md` | 重命名 + 加 wiki links |
| `dev-log.md` | 不動 | 保留 |
| `reference_architecture.md` | 不動 | 保留 |

### 遷移時同步操作

- 每個檔案內文掃描，把提到的其他概念加上 `[[wiki link]]`
- Frontmatter 補齊 `aliases`、`tags`、`sources`
- 建 `memory/index.md`（從 MEMORY.md 內容生成）
- 建 `memory/log.md`（第一筆：遷移記錄）

### dev-log.md vs log.md 分工

| | dev-log.md | log.md |
|---|---|---|
| 記什麼 | 每次 commit 的程式碼改動 | wiki 頁面的增刪改 |
| 誰寫 | commit 時自動 | wiki skill 自動 |
| 用途 | 跨電腦知道「寫了什麼 code」 | 跨電腦知道「知識庫動了什麼」 |

### auto-memory 處理

MEMORY.md（`.claude/projects/.../memory/`）瘦身成 pointer：

```markdown
# Memory Pointer

專案知識庫：讀 memory/index.md（在 git repo 裡）
個人知識庫：讀 C:\Users\User\Desktop\second-brain\index.md

不要在這個目錄寫新記憶，寫到上面兩個地方。
```

---

## Section 3：四個共用 Skill

安裝位置：`~/.claude/commands/`（user 層級，所有專案可用）

### Skill 1：`/wiki-ingest`（錄入）

**觸發**：`/wiki-ingest <URL 或文字>`

**流程**：
1. 抓內容（URL → Chrome MCP 或 WebFetch；文字 → 直接用）
2. 存原始素材到 `raw/YYYY-MM-DD-來源-標題.md`
3. 通讀全文，提取概念、人物、工具、方法
4. 每個提取項：wiki 頁已存在 → 追加 + 新 source；不存在 → 建新頁
5. 所有新/更新頁面加 `[[雙向連結]]`
6. 更新 `index.md`
7. 寫一筆到 `log.md`

**Vault 偵測**：
- 工作目錄含 `second-brain` → 個人 vault
- 工作目錄含 `gto-poker-trainer` → 專案 vault
- 可用 `--vault=personal` 或 `--vault=project` 指定

### Skill 2：`/wiki-healthcheck`（健檢）

**觸發**：`/wiki-healthcheck` 或定時排程

**掃描四類問題**：

| 類型 | 偵測方式 | 修復方式 |
|---|---|---|
| 孤兒頁面 | 無 incoming `[[link]]` | 找最相關頁補連結 |
| 缺頁 | `[[連結]]` 指向不存在的檔 | 建 stub 頁或移除失效連結 |
| 矛盾 | 兩頁對同一概念描述衝突 | 標記差異，問用戶處理 |
| 過時 | 新 raw 素材推翻舊頁面 | 標記建議更新 |

**輸出**：健檢報告 + 建議修復。低風險自動修，高風險等確認。

### Skill 3：`/compound`（收工整理）

**觸發**：對話結束前 `/compound`

**提取三類副產品**：

| 類型 | 例子 | 寫入位置 |
|---|---|---|
| 決策 / 設定變更 | 改了 CLAUDE.md、部署設定 | 專案 wiki 對應頁 |
| 踩坑 / 教訓 | API 地雷、寫法 bug | 相關概念頁 + log |
| 新知 / 洞察 | 新工具、新方法 | 個人 wiki insights/ |

**流程**：
1. 回顧對話，列出候選副產品
2. 分類到對應 vault
3. 更新或新建 wiki 頁 + 雙向連結
4. 更新 index.md、log.md
5. 輸出摘要

### Skill 4：`/rescue-bookmarks`（快速收藏）

**觸發**：`/rescue-bookmarks <URL 或截圖路徑>`

**抓取優先順序**：
1. X/Twitter → Chrome MCP（本地登入狀態）
2. 一般文章 → WebFetch
3. 截圖 → Read（圖片辨識）

**分析維度**（可在 vault CLAUDE.md 自訂）：
- 市場機會 / 知識潛力 / 個人成長 / AI 應用 / 撲克策略

**流程**：
1. 抓內容
2. 多維度分析 → 結構化摘要
3. 存入 `raw/`
4. 問用戶是否拆解進 wiki → 是 → 呼叫 `/wiki-ingest`

---

## Section 4：CLAUDE.md 整合

### User-level CLAUDE.md

在 `~/.claude/CLAUDE.md` 加入：

```markdown
## 個人知識庫
- 路徑：C:\Users\User\Desktop\second-brain\
- 索引：C:\Users\User\Desktop\second-brain\index.md
- 需要了解我的背景時，先讀 index.md 找相關頁再讀具體內容
- 分級查詢，不要整份讀
```

### Project-level CLAUDE.md 開工 SOP 改動

```
舊：
  2. 讀 memory/dev-log.md
  3. 讀 MEMORY.md
  4. 讀 memory/reference_architecture.md

新：
  2. 讀 memory/dev-log.md（不變）
  3. 讀 memory/index.md（取代 MEMORY.md，分級查詢入口）
  4. 讀 memory/reference_architecture.md（不變）
  5. 若任務需要個人背景 → 讀個人 wiki index.md
```

### 分級查詢規則（寫進 CLAUDE.md）

```markdown
## 知識庫查詢規則
1. 先讀 index.md（一行一頁 + 摘要）
2. 找與當前任務相關的頁面（通常 1-5 頁）
3. 只 Read 相關頁的具體內容
4. 不要一次讀完所有 wiki 頁面
5. 跨 vault：專案 wiki 找不到 → 讀個人 wiki index.md
```

### 跨 Vault 查詢流程

```
用戶問問題
  → 讀專案 wiki index.md
    → 找到相關頁 → Read → 回答
    → 找不到 → 讀個人 wiki index.md
      → 找到 → Read → 回答
      → 都找不到 → 自身知識或搜網路
```

---

## Section 5：Obsidian 設定 + 排程

### Obsidian 設定

- 只開內建 Graph View，不裝第三方外掛
- 連結格式：`[[wikilinks]]`（預設）
- `.obsidian/` 目錄 git 追蹤，兩台電腦同步
- Obsidian 只負責瀏覽 + 圖譜，維護全靠 Claude Code skill

### Healthcheck 排程

每週一 09:00 自動執行 `/wiki-healthcheck`：
- 掃兩個 vault
- 低風險自動修（孤兒連結、缺頁 stub）
- 高風險列出等確認（矛盾、過時）

### 日常工作流

```
開工：
  SOP 讀 index.md → 分級查詢相關頁 → 開始工作

工作中：
  /rescue-bookmarks <URL>  → 存 raw + 分析
  /wiki-ingest <內容>      → 拆解建頁

收工前：
  /compound                → 提取對話副產品 → 寫回 wiki
  git commit + push        → wiki 改動跟著推

每週一：
  healthcheck 自動跑       → 報告 + 修復
```

---

## 不在本次範圍

- Obsidian Publish（線上發布）
- 多人協作 wiki
- 手機端 Obsidian 同步（之後可加 iCloud/Git）
- wiki 搜尋 UI（目前靠 Claude 分級查詢 + Obsidian 內建搜尋）
