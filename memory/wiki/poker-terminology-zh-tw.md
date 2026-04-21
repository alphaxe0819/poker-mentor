---
name: 繁中撲克術語對照表（台灣社群用法）
description: Claude Haiku 教練 Edge Function system prompt 術語校準的權威來源；避免英文直翻產出怪詞
type: reference
updated: 2026-04-20
---

# 繁中撲克術語對照表（台灣社群用法）

## 為何這份表存在

2026-04-20 實機測試 exploit-coach，Claude Haiku 回覆中出現「**QQ 容易被 AK、AA、KK 過度**」這種不通的中文 — 它把 poker 術語 `dominate` 直翻成「過度」，是 LLM 對專有詞缺乏繁中語境訓練的典型失誤。

這份表是 **Claude Haiku system prompt 的必帶 grounding**，也是未來新教練 Edge Function 的標準附錄。任何改 `buildSystemPrompt` 的人，直接引用此表即可。

**已知 LLM 高風險誤譯詞**（務必照表走，不要讓 Claude 自由發揮）：
- `dominate` → 壓制 / 被壓制（❌ 過度、支配、主導）
- `cooler` → 冤家牌（❌ 冰鎮、冷卻）
- `bluff catcher` → 抓詐唬牌（❌ 詐唬捕手、抓取者）
- `polarized` / `merged` → 極化範圍 / 合併範圍（❌ 融合、混合、偏振）

## 使用規則

1. 表中「推薦繁中」若有「保留英文」字樣，直接用英文縮寫（例：c-bet、GTO、BTN、3-bet、SRP、ICM），**不要硬翻**
2. 抽象戰術詞（dominate、cooler、bluff catcher、polarized、merged）**最容易翻錯**，務必用表中譯法
3. 表中沒收錄的術語，優先保留英文並在括號補一句白話解釋，不要硬造中文詞
4. 避免大陸用語（例：「蝨子」當 nit、「踢子」當 kicker）— 台灣社群不用

## 術語對照

| 英文 | 推薦繁中（台灣常用） | 禁止的錯譯 | 語境說明 |
|---|---|---|---|
| bet | 下注 | 賭 | 主動投入籌碼 |
| raise | 加注 | 提升 | 提高前人注碼 |
| re-raise | 再加注 | — | 對 raise 再加一次 |
| 3-bet | 保留英文或「三次下注」 | 三倍注、三注 | 對 open raise 的再加注 |
| 4-bet | 保留英文 | 四倍注 | 對 3-bet 的再加注 |
| c-bet | 保留英文或「持續下注」 | 連續下注 | 翻前 raiser 在 flop 延續攻勢 |
| squeeze | 擠壓 | 壓榨 | 已有 raise + caller 時再 3-bet |
| donk (bet) | 保留英文或「突擊下注」 | 蠢驢下注、笨下注 | OOP 跳過 raiser 搶先下注 |
| float | 纏打 | 漂浮、浮動 | IP 跟注準備後街偷底池 |
| check | 過牌 | 檢查、核對 | 不下注讓給下家 |
| call | 跟注 | 呼叫 | 平注前人下注 |
| fold | 棄牌 | 折疊、丟 | 放棄本手 |
| open (raise) | 開牌 / 開加注 | 開啟、打開 | 翻前第一個 raise |
| limp | limp 或「跛入」 | 跛行、瘸 | 翻前只補大盲不加注（保留英文更常見） |
| shove / jam | 全下 / all-in | 推、塞 | 把所有籌碼推進去 |
| all-in | 全下 / all-in | 全部、全進 | 同上 |
| check-raise | 過牌加注 / check-raise | — | 先過牌再加注，常見保留英文 |
| range | 範圍 | 區間、幅度 | 對手可能的手牌集合 |
| top pair | 頂對 | 上對 | 公牌最大張成對 |
| overpair | 超對 | 過對 | 手上對子大於公牌最大張 |
| set | 暗三條 / set | 組、套 | 口袋對 + 公牌同點 |
| trips | 明三條 / trips | — | 一張手牌 + 公牌兩張同點 |
| two pair | 兩對 | 雙對 | — |
| draw | 聽牌 | 抽、畫 | 還差一張組強牌 |
| gutshot | 卡順聽牌 / 中洞順 | 腸擊、內射 | 只差中間一張的順聽 |
| nut / nuts | 堅果 / nuts | 核果、螺帽 | 當下最大不可被超越的牌 |
| **bluff catcher** | **抓詐唬牌** | 詐唬捕手、抓取者 | 只能打贏對手詐唬範圍的中等牌 |
| value hand | 價值牌 | 有價值的手 | 想被弱牌跟注的強牌 |
| value bet | 價值下注 | — | 期待弱牌跟注的下注 |
| **bluff** | **詐唬**（或偷雞） | 虛張、唬弄 | 弱牌打強牌尺寸 |
| semi-bluff | 半詐唬 | 準詐唬 | 有聽牌兼詐唬 |
| **polarized** | **極化（範圍）** | 兩極、偏振 | 範圍只有超強+純詐唬 |
| **merged** | **合併範圍 / merged** | 融合、混合 | 範圍以中強牌為主、不含純詐唬 |
| trash | 垃圾牌 | — | 毫無牌力 |
| BTN / SB / BB / UTG / CO / HJ / LJ | 保留英文 | 按鈕/小盲/大盲雖可，但社群多半講英文縮寫 | 位置 |
| EP / MP / LP | 保留英文或「前位/中位/後位」 | — | 位置區段 |
| IP / OOP | 保留英文或「有位置/沒位置」 | 位內/位外 | 是否在後手動作 |
| equity | 底池權益 / equity | 公平、股權 | 長期贏池比例 |
| EV | 期望值 / EV | — | expected value |
| pot odds | 底池賠率 | 底池機率 | 跟注成本 vs 底池比 |
| implied odds | 隱含賠率 | 暗示賠率 | 含後街可贏籌碼的賠率 |
| outs | outs / 補牌 | 出路、出口 | 能補成強牌的張數 |
| SPR | SPR / 籌碼底池比 | — | stack-to-pot ratio，保留英文 |
| MDF | MDF / 最小防守頻率 | — | 保留英文 |
| GTO | GTO | 賽局最優（太長，社群講 GTO） | 保留英文 |
| exploit | 剝削 | 利用、開發 | 針對對手漏洞偏移 |
| **dominate** | **壓制 / 被壓制** | 過度、支配、主導 | kicker 較低的同張手被壓（AK 壓 AQ） |
| **cooler** | **冤家牌** | 冰鎮、冷卻 | 雙方都夠大卻必輸一方的牌局 |
| bad beat | 爆冷 / bad beat | 壞打、糟糕擊敗 | 大優勢被逆轉 |
| suckout | 逆轉 / 吸出 | 吸取、抽出 | 同上，對贏家視角 |
| fold equity | 棄牌率 | 折疊股 | 對手棄牌帶來的期望值 |
| blocker | 阻斷牌 / 阻擋牌 | 阻塞、封鎖 | 手上牌讓對手少組成某牌型 |
| unblocker | 反阻斷牌 / unblocker | — | 不阻到對手詐唬的牌 |
| pot | 底池 | 鍋、罐 | — |
| stack | 籌碼量 / stack | 堆、棧 | — |
| effective stack | 有效籌碼 | 實效棧 | 雙方較小的那疊 |
| SRP | SRP / 單加注底池 | — | 保留英文，single raised pot |
| 3BP / 4BP | 3BP / 4BP | — | 3-bet pot / 4-bet pot，保留 |
| deep / deep stack | 深碼 | 深棧 | 籌碼遠多於底池 |
| short stack | 短碼 | 短棧 | 籌碼很少 |
| big stack | 大碼 | 大棧 | 桌上籌碼領先 |
| nit | nit / 石頭 | 蝨子、挑剔者 | 極緊被動玩家，常保留英文 |
| TAG | TAG / 緊兇 | — | tight-aggressive，保留英文 |
| LAG | LAG / 鬆兇 | — | loose-aggressive，保留英文 |
| maniac | maniac / 瘋子 | 躁狂 | 極鬆極兇 |
| calling station | 跟注站 | 呼叫站 | 鬆被動、愛 call 不愛 fold |
| whale | 鯨魚 | — | 有錢弱玩家 |
| reg | reg / 常客 | 常規、規律 | regular 的縮寫 |
| fish | 魚 | — | 弱玩家 |
| ICM | ICM | 獨立籌碼模型（太長） | 保留英文 |
| bubble | 泡泡 / 泡沫期 | 氣泡 | 差一名進錢的階段 |
| ITM | ITM / 進錢 | 金錢內 | in the money |
| FT / final table | 決賽桌 / FT | 最終桌 | — |
| chip leader | 籌碼王 / CL | 晶片領導 | 桌上籌碼最多者 |
| tilt | 上頭 / tilt | 傾斜 | 情緒失控亂打 |
| hero call | 英雄跟注 | — | 憑讀牌用弱牌抓詐唬 |
| hero fold | 英雄棄牌 | — | 憑讀牌把強牌棄掉 |
| kicker | kicker / 踢腳 | 踢子（中國用法） | 配牌，同對比大小用 |

## 未收錄？怎麼辦

1. 先搜此 wiki、再搜 [[hu-simulator]] / [[ui-v2-rules]] 的 poker 詞彙有沒有對應
2. 若還是沒有：直接保留英文 + 括號白話解釋，**不要**讓 Claude 自由翻
3. 累積到一批新詞後更新此表並 bump `updated` 日期

## 來源

交叉比對 8 個台灣撲克資源（2026-04-20 agent 收集）：
- [Taiwan Rounders 術語大全](https://www.taiwanrounders.com/post/poker_common_terms)
- [撲克領域中英對照](https://pokerdomain.com.tw/en/%E5%BE%B7%E5%B7%9E%E6%92%B2%E5%85%8B%E8%8B%B1%E6%96%87%E8%A1%93%E8%AA%9E%E4%B8%AD%E8%8B%B1%E6%96%87%E5%B0%8D%E7%85%A7/)
- [sixpoker666 術語懶人包](https://sixpoker666.com/blogs/%E6%96%B0%E6%89%8B%E7%9F%A5%E8%AD%98%E5%8D%80)
- [Andy Poker 術語站](https://www.andypoker.com/)
- [Monsterstack 新手術語](https://monsterstack.com.tw/blogs/newbie/holdem-glossary-for-beginners)
- [Taiwan Rounders GTO vs 剝削](https://www.taiwanrounders.com/post/gto_exploitative)
- [Andy Poker Polarized Range](https://www.andypoker.com/polarized-range-%E6%A5%B5%E5%8C%96%E7%AF%84%E5%9C%8D%E6%88%96%E6%A5%B5%E7%AB%AF%E7%AF%84%E5%9C%8D%E6%88%96%E6%A5%B5%E5%8C%96%E7%89%8C%E5%8A%9B%E7%AF%84%E5%9C%8D/)
- [Andy Poker Fold Equity](https://www.andypoker.com/fold-equity-%E6%A3%84%E7%89%8C%E7%8E%87/)

## 相關

- [[supabase-edge-function-gotchas]] — Edge Function 部署流程 + ES256 坑
- [[ui-v2-rules]] — UI 層級的繁中術語決策（例：POSITION_MAP 也是這個表的一部分）
