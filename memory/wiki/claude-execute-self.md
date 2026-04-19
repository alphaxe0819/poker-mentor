---
name: 可自己執行的事自己做
description: 使用者希望 Claude 能直接執行的命令就自己跑，不要再讓使用者手動貼
type: feedback
originSessionId: d3b87052-06cb-422b-85dc-0b15e761a497
---
能自己完成的命令（PowerShell、bash、node scripts、git、檔案操作）直接執行，不要列給使用者請他們貼。

**Why:** 使用者明確說「你自己可以完成的事情不要再請我做」（2026-04-19）。原因包含 (1) 減少對話摩擦 (2) 使用者在別台電腦或忙別的 (3) 顯得我在偷懶或搞不清楚自己能做什麼。

**How to apply:**
- PowerShell / Bash 腳本：用 Bash 或 PowerShell tool 直接跑。長時間任務用 `run_in_background: true`。
- Node scripts：直接 `node xxx.js`。
- Git commits / pushes（在授權範圍內）：直接做。
- 只有以下情況要請使用者手動：
  - 需要 Supabase Dashboard SQL Editor（DDL 需要 service_role，我只有 anon key）
  - 需要 Supabase Edge Function editor 貼碼部署
  - 需要互動式授權（OAuth / 密碼）
  - 需要實體硬體操作
- 不確定能不能自己跑時，先試一次看看，不要預設交給使用者。
