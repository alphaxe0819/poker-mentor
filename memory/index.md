# Poker Goal Knowledge Index

> 分級查詢入口。AI 先讀這個檔案，找到相關頁再讀具體內容。
> wiki/ 裡的頁面用 Obsidian `[[wikilink]]` 互相連結。

## Product

- [[product-vision-v2]] — 🔥 **2026-04-23 產品願景 v2 + MVP 規格（draft）**：一句話願景 / 核心閉環 / 砍淡化保留清單 / P0-P1-P2 功能 / 10 條非目標 / 商業模式 / 里程碑
- [[product-pivot-2026-04]] — 舊版產品路線圖（product-vision-v2 升級取代）
- [[partnership-strategy]] — 月榜代幣兌換賽事資格：台灣 WinWin、海外平台

## Development

- [[hu-simulator]] — HU 模擬器開發流程：smoke test、已知 bug、GTO 資料、V1/V2 架構
- [[ui-v2-rules]] — V2 UI 設計規則：牌面樣式、版面結構、HU 換手 UX
- [[database-architecture]] — DB 架構總覽（table 設計意圖 / 兩套 postflop schema 混亂說明 / 資料流圖 / 7 大已知問題 / migration 索引）
- [[database-schema-v2-spec]] — DB v2 規格書草案（B 方向重整，比照 GTO Wizard flat by path + jsonb hand frequencies；5 決策點待拍板）
- [[deployment-state]] — Supabase Edge Functions / DB Tables / RPC / Vercel 基礎設施狀態（執行面部署清單，設計說明見 database-architecture）
- [[supabase-edge-function-gotchas]] — Edge Function 部署坑：ES256 JWT 不被 runtime 支援、Secrets 跨 project 不自動帶、fetch 沒 response.ok check
- [[vercel-deployment-troubleshooting]] — Vercel webhook silent drop 繞過路徑 + CLI prebuilt+tgz 工作流 + Redeploy 行為糾正（不抓 git HEAD）
- [[poker-terminology-zh-tw]] — 繁中撲克術語對照表（台灣社群用法）：LLM 教練 system prompt 的術語 grounding，避免 `dominate`→「過度」類直翻
- [[gto-pipeline-conventions]] — solver 產出與手寫 GTO data 的檔名 / export 命名規範
- [[gto-pipeline-env-setup]] — `scripts/gto-pipeline/.env` + `node_modules` setup（setup-env.ps1 不涵蓋，service_role 要從 Dashboard 手貼）
- [[prompt-cache-strategy]] — exploit-coach 省 LLM 錢策略：5min cache + keep-warm cron 達到 ~100% cache hit，省 80% input 成本（idea 階段，量達 1k+/月或升模型時優先做）
- [[villain-profile-design]] — villain profile v2 系統設計（4 位置 group × 6 動作 = 21 range grid + 三種輸入方式 + LLM summarizer + MVP scope）
- [[exploit-coach-closed-loop-design]] — 🔥 **2026-04-23 閉環設計 approved**：3 入口殊途同歸 + 教練 chat 自動 refine + villain_profiles/villain_observations schema + Bayesian 加權演算法 + Extract pipeline + 更新歷史 UI
- [[gtow-api-reverse-eng]] — GTOW server-side 整合完整解法（對方 ai-poker-wizard 用「自生 keypair 註冊 server」繞 non-extractable；只有 token refresh 要簽，spot-solution 用 Bearer 即可）；T-086 補完 signing flow 後 T-082 可跑通
- [[gto-wizard-pricing-analysis]] — GTO Wizard 5-tier 月費/功能完整對照（2026-04-23 截圖）+ 「買資料 vs 自產」戰略選項評估（對 T-075/T-076/T-091 的採購替代方案）；尚未拍板

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
