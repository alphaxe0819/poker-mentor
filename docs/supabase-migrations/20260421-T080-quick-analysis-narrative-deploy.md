# T-080: exploit-coach narrative mode 部署指南（測試 Supabase）

**目標**：把 `supabase/functions/exploit-coach/index.ts` 整檔更新部署到測試 Supabase，啟用 narrative（快速分析）模式。

## 前置

- 測試 Supabase project ref：`btiqmckyjyswzrarmfxa`
- 沒動 DB schema / migration — 單純 Edge Function 替換，可隨時 rollback
- 體驗期 `NARRATIVE_COST = 0`，不需新增 Secrets（不呼 `spend_points`）

## 部署步驟（用戶手動）

1. 登入測試 Supabase Dashboard（`btiqmckyjyswzrarmfxa`）
2. 左側 Edge Functions → `exploit-coach` → Via Editor
3. **全選刪掉**現有 index.ts 內容
4. 複製本 repo 的 `supabase/functions/exploit-coach/index.ts` 整檔 → 貼回 editor
5. 按 **Deploy**（右上角）
6. Deploy 成功後 Logs 應看到 `Function deployed`（沒有 TS 錯誤）

## 實機驗收（poker-goal-dev.vercel.app）

1. 打開 `https://poker-goal-dev.vercel.app`，登入（用測試帳號）
2. 進 Exploit Lab 入口 → S1 首頁
3. 點 **🚀 快速分析**（紫色漸層按鈕，在「建立新對手」下方）
4. 貼以下範例敘述：

   ```
   50/100 NL 9max，我 BTN 拿 A♠2♣，open 2.5BB，BB call。
   Flop 3♠4♦5♥（乾板），BB check，我 c-bet 33% pot，BB call。
   Turn 2♥，BB 突然 donk 75% pot，我 call。
   River K♠ BB 繼續 shove all-in，我該怎麼辦？
   ```

5. 點 **✨ 開始分析**，等 AI 回應（narrative 模式 max_tokens=1200，可能比平常慢 3-5 秒）

## 驗收條件

- ✅ **流程**：進 s6 聊天介面顯示用戶敘述氣泡 + AI 回覆氣泡（不經過 s2/s3/s4/s5a/s5）
- ✅ **結構**：AI 回覆依 **翻前 / 翻牌 / 轉牌 / 河牌** 分段，每段含「🎯 結論 / 📊 GTO 基準 / 🎭 對手調整 / 🔑 關鍵判斷」
- ✅ **收尾**：最後有「⚡ 整手關鍵」段落
- ✅ **繁中術語**：用「持續下注」「底池權益」「抓詐唬牌」等（沒有裸 c-bet / equity）
- ✅ **追問**：點 AI 回覆下方 chip（換對手類型看看 / 關鍵 EV 判斷 / 壓榨更多價值）→ AI 保留 narrative 上下文回答
- ✅ **不退化**：AI 沒說「請提供更多資訊」就停下來 — 應先給初步分析，再指出缺什麼

## 失敗診斷

- **502 教練服務暫時不可用** → Supabase Edge Functions Logs 看是否缺 `ANTHROPIC_API_KEY` Secret
- **AI 回應是結構化 4 街但沒「🎯 / 📊 / 🎭 / 🔑」emoji** → prompt 沒載到，確認 deploy 成功且 `buildNarrativeSystemPrompt` 在檔內
- **AI 每次都退化成「需要更多資訊」** → 調整 prompt 把「第一步：理解敘述」段落加強「寬鬆解讀」原則
- **繁中術語跑出「c-bet」「equity」混用** → 敘述模式也共用 `TERMINOLOGY_RULES`，應不會發生；若發生檢查 deploy 是否成功

## Rollback

若需回退：上一版（v0.8.4 ship 版）在 `git log` 可找到；把該版 `supabase/functions/exploit-coach/index.ts` 貼回 editor → Deploy 即可。narrative 只是多一個 `mode` 分支，回退不影響 structured 流程。

---

驗收通過 → 回報「✅ T-080 narrative 部署 + 驗收 pass」供大腦結案。
