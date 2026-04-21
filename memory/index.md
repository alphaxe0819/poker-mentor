# Poker Goal Knowledge Index

> 分級查詢入口。AI 先讀這個檔案，找到相關頁再讀具體內容。
> wiki/ 裡的頁面用 Obsidian `[[wikilink]]` 互相連結。

## Product

- [[product-pivot-2026-04]] — 董事長會議後的產品方向：牌譜分析+對手剝削+AI教練、大華人市場、Phase 0-3 路線圖
- [[partnership-strategy]] — 月榜代幣兌換賽事資格：台灣 WinWin、海外平台

## Development

- [[hu-simulator]] — HU 模擬器開發流程：smoke test、已知 bug、GTO 資料、V1/V2 架構
- [[ui-v2-rules]] — V2 UI 設計規則：牌面樣式、版面結構、HU 換手 UX
- [[deployment-state]] — Supabase Edge Functions / DB Tables / RPC / Vercel 基礎設施狀態
- [[supabase-edge-function-gotchas]] — Edge Function 部署坑：ES256 JWT 不被 runtime 支援、Secrets 跨 project 不自動帶、fetch 沒 response.ok check
- [[vercel-deployment-troubleshooting]] — Vercel webhook silent drop 繞過路徑 + CLI prebuilt+tgz 工作流 + Redeploy 行為糾正（不抓 git HEAD）
- [[poker-terminology-zh-tw]] — 繁中撲克術語對照表（台灣社群用法）：LLM 教練 system prompt 的術語 grounding，避免 `dominate`→「過度」類直翻
- [[gto-pipeline-conventions]] — solver 產出與手寫 GTO data 的檔名 / export 命名規範
- [[gto-pipeline-env-setup]] — `scripts/gto-pipeline/.env` + `node_modules` setup（setup-env.ps1 不涵蓋，service_role 要從 Dashboard 手貼）

## Feedback & Rules

- [[task-board]] — 中央大腦看板（Queue / In Progress / Done），兩台共工任務分派入口
- [[two-machine-workflow]] — 兩台電腦共工 SOP：SessionStart auto-stash/pull、角色偏好、衝突解法
- [[no-unauthorized-push]] — 絕對禁止未授權 merge/push 到 main（2026-04-14 事件教訓）
- [[whiteboard-standard]] — 產品架構圖 HTML 白板規格：Zone 分層、動態連線
- [[auto-open-html]] — 更新 docs/*.html 後直接用瀏覽器打開
- [[deploy-scope]] — 產品改動需測試機驗證；開發流程改動只需 push 同步
- [[auto-memory-path]] — auto-memory 和 git repo memory/ 可能是同一目錄，禁止在 auto-memory 路徑下 rm -rf
- [[claude-execute-self]] — 能自己跑的命令（PowerShell/bash/node/git）直接執行，不要列給使用者貼

## Scraping

- [[range-collection-roadmap]] — 範圍收集總進度表：scraping / converter / solver 三線分批 + 跨機器協作指引
- [[project_pokerdinosaur_scraping]] — pokerdinosaur.com 備份進度、正確技術方案、待爬 project 清單（未經允許不得更改方案）
- [[scraping-audit-2026-04-21]] — T-013 scraping 現況盤點：10 個 JSON 全到位、S1 LiveMTT_Ben 已完成、S0 微小 diff
