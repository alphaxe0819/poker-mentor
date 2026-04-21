---
name: startup
description: 新 session 開工 SOP。自動讀 dev-log、MEMORY、架構總覽，回報目前狀態，詢問角色分工。每個新 session 的第一件事就是執行這個流程，不要等用戶指示。
autoTrigger: session_start
---

# 開工 SOP

每個新 session 開始時，**第一則回覆就自動執行此流程**。不要問「要跑嗎？」、不要等用戶說話。

## 執行步驟（依序）

### 1. Git 同步確認
- 確認 SessionStart hook 是否已自動 `git fetch` + `git pull`（看 system-reminder）
- 若沒有自動拉取，執行 `git pull` 確保最新

### 2. 讀開發記錄
- 讀 `memory/dev-log.md`（了解最近做了什麼、在哪台電腦、未完成事項）

### 3. 讀專案知識庫索引
- 讀 `memory/index.md`（專案知識庫分級查詢入口）
- 若需要某個具體主題的細節，再從 index 找到對應 wiki 頁面讀取

### 4. 讀架構總覽
- 讀 `memory/reference_architecture.md`（在 git repo 裡，兩台電腦皆同步）
- 理解專案目錄結構、技術棧、資料流、關鍵檔案位置
- **這一步確保你在動手前知道整個系統怎麼運作**

### 5. 回報狀態（簡潔格式）

```
📍 分支: feature/xxx
📦 版本: v0.8.1-dev.3
🔄 最近: （從 dev-log 摘要 2-3 條最近改動）
⏳ 未完成: （若有）
```

### 6. 詢問角色
- 問用戶：「這個 Tab 負責哪個角色？(UI / Frontend / Backend / 自由)」
- **例外**：若工作目錄是 worktree 子目錄（POKERNEW-ui-v2、POKERNEW-hu-sim 等），跳過此步驟
- 得到回答後，只能修改該角色範圍內的檔案（範圍定義見 CLAUDE.md「多 Tab 平行開發角色分工」）

### 7. 問要做什麼
- 「今天要做什麼？」

## 注意事項

- 步驟 2-4 可以**平行讀取**（三個 Read 同時發出），加快速度
- 回報要**簡潔**，不要把整個 dev-log 貼出來
- 如果 dev-log 或 index.md 有提到未完成的工作，主動提醒
- **禁止跳過步驟 4（讀架構）**— 這是這個 skill 存在的核心原因
- 查詢知識時用**分級查詢**：先讀 index.md 找相關頁，再讀 `memory/wiki/` 的具體頁面
- 收工時提醒用戶跑 `/compound`（提取對話副產品到 wiki）
