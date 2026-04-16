---
name: V2 UI 設計規則
description: 第二代 UI 的撲克牌樣式、版面結構、互動規則，所有 V2 元件必須遵守
type: project
originSessionId: 0b281e46-7482-495b-8477-d6210a9c7892
---
## V2 撲克牌樣式（HoleCards + PokerFeltV2 社群牌）

**統一格式：數字在上方，花色符號只留一個在下方**

- Rank：頂部置中，font-black，normal size = 2.1rem / small = 1.5rem
- Suit symbol：底部置中，只有一個，normal = 1.05rem / small = 0.8rem
- 不要左上角 + 右下角兩個角落花色符號
- 四色牌背景：♠=灰 `#3a3d44` / ♥=紅 `#8b2232` / ♦=藍 `#1e5faa` / ♣=綠 `#1a7a3a`

**Why:** 2026-04-15 用戶要求統一中央社群牌（PokerFeltV2 boardCards）與英雄手牌（HoleCards）的視覺風格
**How to apply:** 所有 PokerCard 渲染一律用 flex-col + justify-between 布局

---

## V2 版面結構（HeadsUpMatchScreenV2 / TrainTabV2）

- 外層：`position: fixed; inset: 0; overflow: hidden`（不用 min-h-screen）
- 牌桌 felt：`flex-1 relative min-h-0`（確保 PokerFeltV2 獲得正確高度）
- Action bar：固定高度容器（68px spacer）防止版面跳動
- 手牌結果（勝/負/平）：felt 內部 absolute 浮動小 chip（`top: 62%`），**不要整條橫幅**，避免改變牌桌高度

---

## V2 HU 對決手牌結束 UX

- 手牌結束後在 action bar 區域顯示兩個按鈕：
  - 「👁 回饋 Ns」→ 開啟 FeedbackSheetV2（可選）
  - 「▶▶ 下一手」→ 直接換手，不需先開回饋
- 10 秒倒數仍存在（自動換手），但用戶可隨時點「▶▶ 下一手」跳過
- **Why:** 用戶不希望每次換手都強制看回饋，應該有直接跳過的方式

---

## PokerFeltV2 中央社群牌

- 尺寸：34×48px，padding 上下 4px
- Rank：19px font-black，置上
- Suit symbol：11px，置下，opacity 0.85
- gap: 4px between cards
