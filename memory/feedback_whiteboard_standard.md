---
name: 產品架構白板規格標準
description: 產品開發時需產出的 HTML 互動式白板規格 — 包含 Zone 分層、動態連線、手機 mockup、資料表等元素
type: feedback
---

產品架構圖一律使用 HTML 互動式白板格式（參考檔案：`docs/poker-goal-whiteboard.html`）。

**Why:** 用戶明確要求所有未來產品開發都要產出這個標準的架構圖，方便視覺化理解產品全貌與模塊關聯。

**How to apply:** 每次有新的產品功能規劃或架構變更時，產出或更新白板 HTML。

## 必備元素

| 元素 | 用途 | CSS class |
|---|---|---|
| Zone 標籤 | 分層區域標題（入口/核心/支撐/技術） | `.zone-label` + `white-space:nowrap` |
| 彩色便利貼 | 功能需求摘要 | `.sticky .s-orange/.s-yellow/.s-pink/.s-green/.s-purple/.s-blue` |
| 白色卡片 | 詳細功能列表 | `.card` |
| 手機 Mockup | UI 畫面展示 | `.phone > .ph-in` |
| 資料表格 | 比較/定價/規格 | `.dtable > table` |
| 高亮區塊 | 補充說明 | `.hl .hl-yellow/.hl-green/.hl-pink/.hl-purple` |
| 虛線群組框 | 獨立子系統邊界 | `.group-box.dashed` |
| 實線群組框 | 核心功能邊界 | `.group-box` |

## 連線規則（最重要）

- **連線用 JS 動態計算**，不用硬編碼 SVG 座標
- 每個可連接元素加 `id`，連線定義在 JS `connections` 陣列
- 連線屬性：`from, to, fromSide, toSide, color, label, dashed`
- 顏色語意：紅=主流程、藍=UI流、紫=AI/Prompt、綠=記憶/數據、橘=內容
- 虛線=金流/付費控制
- 每條連線帶箭頭 + 標籤說明關係
- Bezier 曲線自動根據 fromSide/toSide 方向算控制點

## 佈局原則

1. **先想邏輯流向再排版** — 不是排列，是關聯
2. 由上到下分層：入口 → 核心功能 → 支撐系統
3. 核心功能橫向左到右流動
4. 沒什麼連線的模塊（如技術架構）放角落，避免線被遮住
5. 付費/金流模塊放在靠近它所控制的功能附近
6. Zone 標籤一排不換行，確保上下不被圖或字遮住

## 互動功能

- 滑鼠拖拉平移 canvas
- 滾輪縮放（transform scale）
- 工具列：+/- 縮放、Reset、Fit All
- 初始 scale 約 0.45

## 注意事項

- 群組框大小要能容納所有子元素（包含最底部的內容）
- 手機 mockup 要在對應群組框內，不能超出
- 字不能被遮住，元素間留足間距
