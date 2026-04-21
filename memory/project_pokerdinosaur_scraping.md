---
name: pokerdinosaur scraping approach
description: 備份 pokerdinosaur.com 範圍圖的正確技術方案與進度，新對話開始時帶入
type: project
originSessionId: 19af3e64-a556-44bf-b07d-4af1df5c12b8
---
## 新對話啟動提示

繼續備份 pokerdinosaur.com 課程表格專案範圍圖。

已完成：Openraising (70), Flatting & 3Betting (108), Rejamming (33)，已整理到 C:\Users\User\Downloads\GTO\ 子資料夾。

Chrome 目前有一個 pokerdinosaur.com 的標籤（tabId 可能改變，先用 tabs_context 查詢）。

下一步抓的 scenario：Calling Rejams（課程表格專案）

## 正確抓圖方式（不可擅自更改）

- 用 `javascript_tool` 注入 `<script>` 元素執行 async 函數（不能直接用 await）
- 深度切換需用 Chrome `computer` tool 真實點擊（React 不接受 JS 合成點擊）
- 位置 tab 切換可用 JS `.click()`
- 完成信號：`document.body.getAttribute('data-batch-done')`
- PNG 用 Canvas API 渲染，透過 `<a>` 自動下載
- JSON 存到 `document.body.setAttribute('data-scraper-result', JSON.stringify(data))`

## Why
用戶明確要求此方案，未經允許不得更改技術實作方式。

## 目前進度（2026-04-21 T-013 audit）

| Scenario | 實際 PNG | 狀態 |
|---|---|---|
| Openraising | 63 PNG | ✅ GTO/Openraising/ |
| Flatting & 3Betting | 103 PNG | ✅ GTO/Flatting_3Betting/ |
| Rejamming | 33 PNG | ✅ GTO/Rejamming/ |
| Calling Rejams | 16 PNG | ✅ GTO/Calling_Rejams/ |
| HU | 20 PNG | ✅ GTO/HU/ |
| Squeezing | 25 PNG | ✅ GTO/Squeezing/ |
| Multiway | 56 PNG | ✅ GTO/Multiway/ |
| 4B / Cold Calling 3B | 26 PNG | ✅ GTO/4B_ColCalling/ |
| Defending | 11 PNG | ✅ GTO/Defending/ |
| **課程表格（Course project）** | **353 張** | **✅ 全部完成** |
| LiveMTT_Ben_Adjusted (現場錦標賽) | 1149 PNG | ✅ GTO/LiveMTT_Ben/（2026-04-21 確認完成，1149/1149） |

> S0.1 Openraising / S0.2 Flatting_3Betting 實測比最初記錄少 12 張，diff 詳見 [[scraping-audit-2026-04-21]]。

## 後續待爬 Projects（依 Workspace 順序）
1. ~~現場錦標賽 - Ben 調整版~~（✅ 2026-04-21 已完成，1149 張）
2. 錦標賽 - Ben 調整版 Tournament_Ben_Adjusted（1470 張）— **下一個目標**
3. 錦標賽 - 籌碼期望值 Tournament_Chip_EV（945 張）
4. 決賽桌系列：Final_Two_Tables（857）、Final_Table（2600）、Final_Table_Exploitative（2600）、Large/Medium/Small_Field_ICM（2505/2230/2041）— 合計 12833 張

## 整理規則
每個 scenario 完成後立即整理到 C:\Users\User\Downloads\GTO\{ScenarioName}\ 資料夾。
