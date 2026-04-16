---
name: 禁止未授權 push 到 main
description: 絕對不能在沒有用戶明確授權的情況下 merge feature branch 到 main 或 push 到 remote。每次 push 前必須問用戶確認。
type: feedback
---

# 禁止未授權 push 到 main

絕對不能在沒有用戶在**當前對話**中明確說「push」/「merge 到 main」/「上正式機」的情況下，執行 `git merge` 到 main 或 `git push origin main`。

**Why:** 2026-04-14 HU 模擬器在 feature branch 上開發（入場費臨時改 0、有已知 bug），某個 Claude session 未經授權就 merge + push 到 main，導致未完成功能直接上線到 poker-goal.vercel.app，入場費 0 點暴露給所有使用者。

**How to apply:**
- 每次要 merge / push 前**必須**在聊天中問用戶確認
- 「commit」≠「push」— 兩個動作必須分開處理
- 新 session 不能繼承前一個 session 的 push 授權
- Feature branch 上的工作**永遠假設為未完成**，除非用戶明確說可以 merge
- 即使 code review 通過、tests 全綠、plan 全完成，仍然不能自動 push — 用戶決定何時上線
