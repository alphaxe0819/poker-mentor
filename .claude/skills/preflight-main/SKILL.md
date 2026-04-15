---
name: preflight-main
description: push 到 main 前的完整檢查。依序跑 tsc 編譯檢查、確認 dev 已測試、版號已遞增、CHANGELOG/dev-log 已更新，列出 dev 領先 main 的 commits，全通過後請用戶明確授權才 merge + push。對應 CLAUDE.md「推送到正式機前的必做事項」。
---

# Preflight Main

使用者輸入 `/preflight-main` 時執行此流程。這是 push 到 main 前的守門員。

## 執行步驟（依序）

### 1. 環境確認
- `git branch --show-current` 取得當前分支
- 若在 `feature/*` → 中止，告知「請先 merge 到 dev 並驗證」
- 記下當前分支，流程結束要切回

### 2. 工作區乾淨
- `git status --porcelain` 必須為空
- 有未 commit 改動 → 中止，列出改動檔案

### 3. 切到 dev + 拉最新
- `git checkout dev && git pull origin dev`

### 4. TypeScript 編譯檢查
- `npx tsc -b --noEmit`
- exit code 非 0 → 中止，列出錯誤，要求先修

### 5. 版號檢查
- 讀 `src/version.ts`
- 版號不能是 `-dev.N` 後綴（正式版應移除）
- 版號必須比 main 上的新（用 `git show main:src/version.ts` 對比）

### 6. CHANGELOG 檢查
- 讀 `CHANGELOG.md` 最上方條目
- 必須包含當前版號
- 必須有非空的改動描述

### 7. dev-log 檢查
- 讀 `memory/dev-log.md` 最上方條目
- 必須包含當前版號

### 8. 列出待部署 commits
- `git log main..dev --oneline`
- 讓用戶看到這次會上什麼

### 9. 測試環境驗證確認
- 詢問用戶：「dev 環境 https://poker-goal-dev.vercel.app/ 是否已實際測試通過？」
- 等用戶回覆「是」/「確認」才繼續

### 10. 最終授權
- 以清單格式回報所有檢查結果（✅ / ❌）
- 列出：當前版號、CHANGELOG 最新條目摘要、待部署 commits 數量
- 問用戶：「全部通過，確認執行 `git checkout main && git merge dev && git push origin main` 嗎？」
- **等用戶明確回覆「是」/「確認」/「push」才執行**

### 11. 執行 + 驗證
用戶授權後：
- `git checkout main && git merge dev && git push origin main`
- 切回步驟 1 記下的原始分支
- 依 CLAUDE.md「推送後的必做驗證」流程跑 TS check + WebFetch 驗證
- 回報版本連結

## 任何步驟失敗 → 中止

不要嘗試「順便修好」。回報問題，讓用戶決定。
