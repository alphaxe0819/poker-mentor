# T-030 exploit-coach 5 bug 實機驗收

- **驗收版本**：v0.8.1-dev.39（script `assets/index.C5QDRci6.js`）
- **驗收日期**：2026-04-21
- **工具**：Claude_in_Chrome（tabId 209575093） + live dev URL
- **部署前提**：
  - `curl https://poker-goal-dev.vercel.app/` → HTTP 200
  - `curl .../exploit-coach-mockup-v3.html` 1738 行，grep 5 bug fix 全部命中對應行號
- **結論**：Bug 1 / 2 / 4 ✅ PASS（runtime + code）；Bug 3 ⚠ PARTIAL（code + DOM，真機鍵盤待補）；Bug 5 ⚠ PARTIAL（架構 fix 存在，但 parent 的 `supabase.auth.refreshSession()` handshake 未在 30s 內回覆 — 需 follow-up T-064）

---

## Bug 1｜Call 按鈕顯示金額 — ✅ PASS

- **Code ref**：`public/exploit-coach-mockup-v3.html:1249`
  ```
  bh += '<button class="ab ab-call" onclick="actDo(\'call\')">Call ' + fmtChip(owe) + '</button>';
  ```
- **Hint line ref**：line 1241-1242
  ```
  document.getElementById('s4-act-who').innerHTML = '...（跟注需補 ' + fmtChip(owe) + ' BB）'
  ```
- **Runtime 驗證**：
  - 走到 preflop s4，UTG 的行動
  - `.ab.ab-call` 按鈕文字 = **`Call 1`**（含金額）
  - 提示列 = **`UTG 的行動（跟注需補 1 BB）`**
  - All-in 按鈕 = **`All-in 100`**（也含金額）
- **Evidence**：截圖顯示 s4 action bar，Fold / Call 1 / Raise [2 BB] / All-in 100 四個按鈕

---

## Bug 2｜Turn all-in → s5 攤牌 — ✅ PASS

- **Code ref**：
  - `public/exploit-coach-mockup-v3.html:1217`（主按鈕文字）
    ```
    nb.textContent = anyAllIn ? 'All-in → 攤牌' : (streetIdx < 3 ? '下一條街 →' : '完成 →');
    ```
  - line 1354-1376（`streetNext()` 攤牌跳轉）
    ```
    var anyAllIn = actives.some(function(p){ return (engState.stacks[p] || 0) <= 0; });
    if (anyAllIn) { discussAt = streetIdx; go('s5'); renderConfirm(); return; }
    ```
- **Runtime 驗證**：
  - preflop：BTN raise 2, BB call
  - flop：BB check, BTN check
  - turn：**BB all-in 99** → BB stack=0；**BTN call 98** → BTN stack=0
  - 本街 round done，`#s4-next-btn` 文字變 **`All-in → 攤牌`** ✅
  - 點該按鈕 → active screen 切到 `s5`，**沒有河牌 picker 彈出** ✅
  - `discussAt = 2`（Turn），`s5-street` 顯示「轉牌」 ✅

---

## Bug 3｜Raise 輸入框不擠畫面 — ⚠ PARTIAL（CSS / viewport / inputmode 自動化 pass；真機軟鍵盤視覺補驗）

- **Code ref**：`public/exploit-coach-mockup-v3.html:1262`
  ```
  <input class="size-inp" type="text" inputmode="decimal" pattern="[0-9]*\.?[0-9]*" value="..." id="act-size"
         onclick="event.stopPropagation()"
         onfocus="var el=this;setTimeout(function(){el.scrollIntoView({block:'center',behavior:'smooth'});},300)">
  ```
- **Runtime 驗證（可自動化部分）**：
  - viewport meta = `width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no` ✅
  - `inputmode="decimal"` 屬性存在 → iOS Safari 應跳數字鍵盤 ✅
  - CSS `.size-inp:focus { border-color:#3b82f6; }` 存在 ✅
  - `scrollIntoView({block:'center',behavior:'smooth'})` 在 onfocus 300ms 後觸發 ✅
- **未涵蓋（headless 限制）**：
  - 實機 iOS Safari / Android Chrome 軟鍵盤彈起時 input 框實際位置是否被蓋
  - **待用戶真機補**：iPhone Safari + Android Chrome 各測一次

---

## Bug 4｜S5b 對手手牌流程 + AI prompt 帶牌 — ✅ PASS

- **Code ref**：
  - `public/exploit-coach-mockup-v3.html:320-343`（S5b screen + villainHandChoice 按鈕）
  - line 1517-1518（buildCoachContext 帶 `villain_hand`）
    ```
    var vhc = villainCards.filter(function(c){return c}).map(function(c){return c.r+c.s}).join('');
    if (villainHandKnown && vhc.length === 4) ctx.villain_hand = vhc;
    ```
  - line 1730-1735（`#card-picker` DOM parent 是 body，T-050 Bug 1 fix）
- **Runtime 驗證（完整路徑）**：
  1. 從 s5 點「開始分析」→ `goAskVillain()` → active screen = `s5b` ✅
  2. 畫面顯示「你知道對手的手牌嗎？」+ `👁 我知道` / `❓ 不知道` 兩按鈕 ✅
  3. 點「我知道」→ `#s5b-pick` display: none → block ✅
  4. `#vill-slots` 渲染 2 個空卡槽，onclick = `openVillPicker(0/1)` ✅
  5. 點卡槽 0 → `#card-picker`：
     - `parentElement = BODY` ✅（T-050 fix 確認 picker 搬出 #s3）
     - `class = 'picker show'` ✅
     - `getBoundingClientRect = {top:316, left:50, w:380, h:163}`（實際浮出可見） ✅
  6. 選 Q♦ / 9♠ → `villainCards = ['Q♦', '9♠']`，slots 顯示 `Q♦ 9♠`，preview = `Q♦ 9♠`，「✨ 開始分析」按鈕顯示 ✅
  7. 點「開始分析」→ `startAI()` → active screen = `s6`，fetch 發到 `https://btiqmckyjyswzrarmfxa.supabase.co/functions/v1/exploit-coach`
  8. 攔截到 request body：
     ```
     {"context":{"hero_pos":"BTN","villain_hand":"Q♦9♠","villain_hand_known":true,
      "flop":"K♣8♥3♦","villain_type":"calling_station",
      "scenario_slug":"6max_100bb_srp_btn_open_bb_call","pot_type":"srp"}}
     ```
     **`villain_hand: "Q♦9♠"` 正確帶到 Edge Function** ✅
  9. AI 回應引用 Q♦9♠：「**...老張（跟注站型）在 BB，手牌 Q♦9♠...**」✅

---

## Bug 5｜Token refresh 久待不過期 — ⚠ PARTIAL（架構 fix 存在；parent handshake 測試不穩，需 follow-up）

- **Code ref**：
  - `public/exploit-coach-mockup-v3.html:1479-1496`（`askParentRefresh()`：iframe → parent postMessage，3s timeout）
  - line 1499-1509（`getFreshAccessToken()`：先本地 → 過期則問 parent）
  - line 1567-1602（callCoach 401 → askParentRefresh → 重試）
  - `src/tabs/ExploitCoachTab.tsx:23-59`（parent listener：origin check / contentWindow capture / supabase.auth.refreshSession）
- **Runtime 驗證（部分 pass）**：
  - ✅ 架構 fix 都已部署（grep `請 parent refresh` 確認 line 1502；grep `askParentRefresh` 確認）
  - ✅ iframe → parent postMessage 到達：console 看到 `[parent-refresh] got request {origin: ..., expected: ...}`，origin 相符
  - ⚠ parent → iframe reply **未觀察到**：測試 30s 內沒有 `[parent-refresh] replied` log，iframe 端 3s timeout 後也沒收到 `supabase-token-refreshed` 訊息
  - 現場 token 仍新鮮（expires 2026-04-21 04:05:45 UTC，測試時 ~03:25 UTC，尚有 40 min）→ 正常使用流程**不會觸發 401 → 不會經過此 refresh path**，所以實測時未必看到問題
  - 但如果用戶真的掛 40+ min 後回來 → 401 → askParentRefresh → parent 若同樣 hang → iframe 3s timeout → token=null → 最終 `登入已過期` 提示
- **推測成因**（未深挖）：
  - parent 的 `supabase.auth.refreshSession()` promise 可能在 token 仍新鮮時不回傳
  - 或 rotating refresh_token 有 race，兩個請求互鎖
  - 或 React StrictMode 的雙掛載導致 listener 殘影（觀察到 7 條 `[parent-env]` 但只有 1 條 `got request`）
- **建議 follow-up**（→ T-064）：
  - 真機掛 40+ min 後回來發問，看實際 401 → refresh path 是否通
  - parent 加 fallback：若 `await supabase.auth.refreshSession()` 在 2s 內沒回 → 改用 `supabase.auth.getSession()` 或直接 read localStorage
  - 或加 race timeout（`Promise.race([refreshSession(), timeout(2500)])`）避免 hang

---

## 未完成項（需用戶真機）

- [ ] **Bug 3**：iPhone Safari / Android Chrome 實機點 raise input → 確認數字鍵盤 + 不擠畫面
- [ ] **Bug 5**：掛 tab 不動 40+ min 讓 token 過期 → 回來發問 → 看是否走 refresh 成功 / 跑出「登入已過期」

---

## Evidence（截圖）

本次驗收用 `mcp__Claude_in_Chrome__computer.screenshot` + `javascript_tool` state dump 作為證據，詳見 Claude session log。關鍵截圖：

- Bug 1：s4 action bar 顯示 `Call 1` / `All-in 100`
- Bug 4：s5b picker 浮出 + Q♦ 9♠ 填入 + AI 回應引用 villain hand

---

## 附記

- Bug 1/2/4 runtime 通過時，hero hand 顯示為 `undefined`（測試期間我用 JS 直接注入 `heroCards = ['As','Ks']` 字串而非 `{r,s}` 物件造成 cosmetic 錯 — **非 bug，是測試方法副作用**，真實使用 openPicker 流程 heroCards 會是 `{r:'A',s:'♠'}` 物件）
