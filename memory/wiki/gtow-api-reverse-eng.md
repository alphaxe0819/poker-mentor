---
name: GTO Wizard API 反向工程完整理解（含 server-side 整合解法）
description: 2026-04-22 T-082 路線研究結果 — GTOW 用 ECDSA P-256 簽名但只在 token refresh，spot-solution 用 Bearer 即可；對方 ai-poker-wizard 用「自生 keypair 註冊 server」繞 non-extractable；含 T-086 補完 signing flow 後 server-side 整合可行
type: project
---

# GTO Wizard API 反向工程完整理解

> **狀態**：T-082 路線**可行**（2026-04-22 確認）— 缺 ECDSA signing + token refresh flow，由 T-086 補
> **歷程**：
> - 2026-04-22 執行者反爬分析說「ECDSA non-extractable → server-side 不可行」 → 大腦差點廢 T-082
> - 用戶質疑「別人能做為什麼我們不能」 → 大腦認真看 ai-poker-wizard 完整 code → 發現對方有解法 → T-082 救得回
> **用途**：未來大腦 / 執行者實作 T-086 之前**必讀**，避免重複研究 + 避免重複犯前面的錯

---

## 結論（一句話）

**GTOW server-side 整合可行**。對方用「**自生 ECDSA keypair → 註冊給 server**」繞過原本瀏覽器 keypair non-extractable 的限制；只有 `/v1/token/refresh/` endpoint 要簽名，spot-solution 等 data endpoint 用 Bearer + origin 即可。

---

## 對方 ai-poker-wizard 完整流程（Telegram bot）

### 1. Chrome Extension（`chrome-extension/background.js`）
```javascript
// 點擊 extension 圖示 → 抓 localStorage.user_refresh → 複製到剪貼簿 → 引導用戶貼 Telegram /settoken
const token = localStorage.getItem("user_refresh")
navigator.clipboard.writeText("/settoken " + token)
```
**Extension 完全沒做 API 攔截或簽名** — 純粹是 token 搬運工。

### 2. Server (Python)

#### `scripts/gto_signing.py`
- 用 Python `cryptography` library 實作 ECDSA P-256 簽名
- `generate_keypair_jwk()` — 生 keypair（JWK 格式存 `.tokens.json`）
- `sign_refresh_request(method, path, body, ...)`：
  - 構造 pipe-delimited payload：`method|path|timestamp|body|origin|user-agent|app-uid|build-version`
  - 用 private key 簽 → raw 64 bytes (r||s) → base64
  - 組 `google-anal-id` header：`signature.publicKey.timestamp.version.headersBase64`
- `_sync_server_time()` — lazy fetch GTOW server time 確保 timestamp 同步

#### `scripts/gto_token.py`
- `_refresh_access(refresh_token)`:
  1. 呼叫 `sign_refresh_request()` 拿 signed headers
  2. POST `{API_BASE}/v1/token/refresh/` 帶 headers + `{refresh: refresh_token}`
  3. 解析 response 拿 `access_token`
- Token cache 兩層：global session + per-user
- 從 JWT exp 解過期時間

#### `scripts/gto_api.py`
- 用 `access_token` 呼叫 spot-solution / next-actions
- **只用 `Authorization: Bearer <access_token>` + `Origin: https://app.gtowizard.com`**
- 沒有 ECDSA 簽名（spot-solution 不需要）

### 3. 整體 flow
```
用戶 Chrome 登入 GTOW
  → Chrome extension 抓 localStorage.user_refresh
  → 用戶貼到 Telegram /settoken eyJ...
  → server 存 refresh_token

server 第一次跑 (or refresh keypair)
  → generate_keypair_jwk() 生 ECDSA P-256 keypair
  → sign_refresh_request() 構造 google-anal-id header
  → POST /v1/token/refresh/ 帶 refresh_token + signed header
  → server 接受新 keypair（client-generated keypair 註冊機制）
  → 回 access_token

之後查 spot-solution
  → 用 access_token + origin 呼叫 spot-solution
  → server 回 GTO 答案

access_token 過期
  → 用同一把 keypair 重 sign refresh request
  → POST /v1/token/refresh/ 拿新 access_token
```

---

## 執行者初次反爬分析的對與錯

| 執行者結論 | 真實情況 |
|---|---|
| ✅ GTOW 用 ECDSA P-256 簽名 | 對 |
| ✅ 原本瀏覽器 keypair non-extractable（IndexedDB `gw_request_signing_v1`） | 對 — 但對方不抓這把，自己生新的 |
| ❌ Server-side 拿不到 key 也簽不了 → 路線廢 | **錯** — 對方自生 keypair + 註冊 server |
| ❌ T-082 根本性無法運作 | **錯** — T-082 既有 code 缺 signing flow，但路線可行 |
| ✅ 抓 Bearer 直接打 server-side | **對於 spot-solution 部分對** — Bearer 夠；refresh 才要簽 |

**根因**：執行者只研究了「怎麼抓 GTOW 原本的 keypair」，沒研究「server-side 怎麼自己生 keypair 註冊」。看到 non-extractable 就斷言不行，沒交叉驗證對方專案完整解法。

**大腦失職**：第一次看到執行者結論直接接受，沒去看對方 ai-poker-wizard `scripts/gto_signing.py` 等核心檔案，差點廢掉可行路線。用戶質疑「別人能做為什麼我們不能」才回頭認真看。

---

## T-086 我們要實作的（Deno / Edge Function 版）

### 為什麼是 Deno
- Supabase Edge Function 跑在 Deno runtime
- Deno 原生支援 Web Crypto API（`crypto.subtle.generateKey` / `sign`）
- 不能用 Python `cryptography` library，要用 Web Crypto API 重寫

### 核心差異 vs 對方 Python 版
- **ECDSA signature format**：Web Crypto API 預設輸出 raw 64 bytes (r||s)，跟對方 Python `cryptography.hazmat.primitives.asymmetric.ec` 的 `sign()` 預設輸出 DER 格式不同
- 需要驗證：GTOW server 接受的是 raw 還是 DER？看對方 `_sign_raw_b64()` 命名 → 「raw_b64」← 暗示是 raw 格式
- 如果對方用 DER 但實際送 raw 也成功 → server 兩種都接受
- 如果對方用 DER 必須轉 → 我們也要轉（從 Web Crypto raw 轉 DER 簡單，asn1 encode 就好）

### 實作清單（T-086 scope）
1. Deno 版 `gto_signing.ts`
2. Refresh token flow
3. Token cache（Supabase 或 Edge Function in-memory）
4. 整合進 `exploit-coach-gtow/index.ts`
5. test-gtow-flow.mjs 端到端驗證

詳見 task-board T-086 完整 scope。

---

## 對戰略的含意

### T-082 救回 → T-046 priority 不變
之前推斷「T-082 廢 = T-046 重要性上升」現在不適用：
- T-082 救回 → 可以做「自家 vs GTOW」對比驗證
- T-046（own solver marathon）+ pokerdinosaur 16k 仍是長期 own data 護城河
- 兩條路並行（內測用 GTOW 驗品質、長期用 own data 累護城河）

### Maintenance 風險
- GTOW 隨時可能改簽名邏輯（payload 順序 / header 名 / 版本欄位 / endpoint）
- 一旦 GTOW 改 → 我們的 T-086 code 壞 → 要回頭看對方 ai-poker-wizard 怎麼跟進
- 這是 GTOW 整合**永遠不能完全 own**，會跟著對方 maintenance 跑

### ToS 灰色
- 對方 ai-poker-wizard 用 user 自己的 token 操作（每個 user 綁自己 GTOW 帳號）
- 我們 T-082 內測用「團隊一個 token」服務多個內測者 → 嚴格說違反 GTOW ToS（「token sharing」）
- 內測 OK，**但永遠不上正式機**（會被 GTOW 偵測到）

---

## 給未來大腦：如果要再接 GTOW

1. **先讀這頁**
2. 確認 GTOW 沒改架構：抓 ai-poker-wizard repo `scripts/gto_signing.py` 的最新 commit，跟 wiki 記錄的對比
3. 確認對方 Telegram bot `t.me/ai_poker_wizard_bot` 還能 work（公開驗證點）
4. 如果架構沒變 → 照 T-086 scope 做
5. 如果架構變了 → 看對方怎麼跟進 → 重新設計 signing flow

**不要跳過第 2 步**（前車之鑑：執行者沒驗證對方解法就斷言不行）。

---

## 連結

- T-082 task-board entry（Blocked 待 T-086）
- T-086 task-board entry（救 T-082）
- T-084 task-board entry（token grabber，已 merge，可 reuse）
- 對方專案：[a00012025/ai-poker-wizard](https://github.com/a00012025/ai-poker-wizard)
  - 關鍵檔案：`scripts/gto_signing.py` / `scripts/gto_token.py` / `scripts/gto_api.py` / `chrome-extension/background.js`
- [[range-collection-roadmap]] — 平行路線：own data + pokerdinosaur 16k（不依賴 GTOW）
- [[villain-profile-design]] — villain v2 用自家 baseline，無 GTOW 依賴
