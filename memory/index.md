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

## Feedback & Rules

- [[no-unauthorized-push]] — 絕對禁止未授權 merge/push 到 main（2026-04-14 事件教訓）
- [[whiteboard-standard]] — 產品架構圖 HTML 白板規格：Zone 分層、動態連線
- [[auto-open-html]] — 更新 docs/*.html 後直接用瀏覽器打開
- [[deploy-scope]] — 產品改動需測試機驗證；開發流程改動只需 push 同步
- [[auto-memory-path]] — auto-memory 和 git repo memory/ 可能是同一目錄，禁止在 auto-memory 路徑下 rm -rf
