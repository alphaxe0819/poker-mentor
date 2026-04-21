---
name: Supabase Edge Function 部署坑
description: Edge Function 的 JWT algorithm / Secrets / verify_jwt 踩坑集合與修法
type: reference
updated: 2026-04-20
---

# Supabase Edge Function 部署坑

2026-04-20 追 exploit-coach「登入已過期」→「抱歉，暫時無法回答」bug 撞出的平台級坑。

## 坑 1：ES256 JWT 在 Edge Function runtime 不支援

### 症狀
- 前端 fetch Edge Function 回 **401**
- 錯誤訊息（當 Edge Function 有兜底 UI 文字時）像是「登入已過期，請重新整理頁面」
- Supabase Dashboard → Edge Functions → Logs → **Invocations** tab 可看到 response header：
  ```
  sb_error_code: UNAUTHORIZED_UNSUPPORTED_TOKEN_ALGORITHM
  ```
- Edge Function 本身的 `console.log` 都沒印出來 — 代表 function code 根本沒跑到

### 根因
- Supabase 近期（2025 下半）推 **Asymmetric JWT Signing Keys (ES256 / RS256)** 取代 legacy HS256 shared secret
- 但 **Edge Function runtime gateway（如 `supabase-edge-runtime-1.73.8`）只支援 HS256 token 驗證**
- 當你的 project 啟用 ES256 → 用戶 access_token 用 ES256 簽 → runtime gateway 收到直接擋，function code 永遠不執行
- 官方 issue：[#42244](https://github.com/supabase/supabase/issues/42244)、[#42810](https://github.com/supabase/supabase/issues/42810)、[#41691](https://github.com/supabase/supabase/issues/41691)

### 診斷捷徑
在 iframe / client 端加 JWT payload decode log（見 `public/exploit-coach-mockup-v3.html:1568` 的 `[exploit-coach-401][first]`）：
```js
const parts = token.split('.');
const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
const padded = b64 + '='.repeat((4 - b64.length % 4) % 4);
const payload = JSON.parse(atob(padded));
// 看 payload header（parts[0]）或 response 的 sb_error_code
```
Token header base64 decode 開頭為 `{"alg":"ES256"` = `eyJhbGciOiJFUzI1NiIs...` → 已啟用 asymmetric。

### 修法（推薦）：關個別 Function 的 Verify JWT
**不要** rollback 整個 project 的 JWT algorithm，影響太大。

1. Supabase Dashboard → Edge Functions → 該 function → **Details / Settings** tab
2. 找 **「Verify JWT」** switch → **關掉**
3. 不用 redeploy，即時生效

前提：function 程式碼**自己**用 `supabase.auth.getUser()` 驗 token（見 `exploit-coach/index.ts:221`）。`auth.getUser()` 是打 Auth API `/auth/v1/user`，Auth API 原生支援 ES256，不會被 gateway 擋。

### 哪些 function 要關 verify_jwt
grep `auth.getUser(` 找出所有自驗 token 的 function，全部關：
- `supabase/functions/ai-coach/index.ts:63`
- `supabase/functions/analyze-weakness/index.ts:52`
- `supabase/functions/exploit-coach/index.ts:221`
- `supabase/functions/redeem-promo/index.ts:37`

**不要**對 webhook 類（`lemon-webhook`）關 — 它們用別的驗證機制（webhook signature），verify_jwt 關掉等於裸奔。

### 兩種環境都要處理
測試 project 踩到，**正式 project 若也啟用 ES256 會一樣壞**。正式機改動依 [[no-unauthorized-push]] 要用戶明確授權。

### 長期追蹤
Supabase 修好 runtime ES256 支援後，可以考慮把 verify_jwt 打開回來（安全性比較好：gateway 先擋不合法請求，省 function invocation）。但目前（2026-04-20）沒時程，先關著。

---

## 坑 2：新建 Supabase Project 的 Secrets 不會自動帶入

### 症狀
- 401 解決後 Edge Function 能跑，但 AI 回覆「抱歉，暫時無法回答」之類的兜底文字
- 對應 code：`answerText = json.content?.[0]?.text ?? '兜底文字'`
- Claude / Anthropic API 回傳 `{type: "error", error: {...}}` 而非 `{content: [...]}`

### 根因
測試 Supabase project (`btiqmckyjyswzrarmfxa`) 是另外建的，**Secrets 頁只有 Supabase 內建的 4 把**：
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

`ANTHROPIC_API_KEY` 沒帶過來 → Edge Function `Deno.env.get('ANTHROPIC_API_KEY') ?? ''` 拿空字串 → Anthropic 401

### 修法
Dashboard → Edge Functions → **Secrets** → Add secret：
- Name: `ANTHROPIC_API_KEY`
- Value: 正式 Supabase 同頁 secrets 展開複製，或去 https://console.anthropic.com/settings/keys 新增
- Save（即時生效，不用 redeploy）

### 開新 Supabase Project 時的 Secret checklist
依 Edge Function code 有 `Deno.env.get(...)` 的全部：
- [ ] `ANTHROPIC_API_KEY` — ai-coach / analyze-weakness / exploit-coach 都要
- [ ] `LEMONSQUEEZY_SIGNING_SECRET` — lemon-webhook
- [ ] 其他 function 視 code 決定

---

## 坑 3：Edge Function code 的 fetch 沒檢查 `response.ok`

### 症狀
Anthropic / 第三方 API 回 4xx/5xx 時，function 不 throw exception，靜默 fallback 到兜底文字。用戶看到「抱歉，暫時無法回答」但後端 log 無 error。

### 對應 code
`supabase/functions/exploit-coach/index.ts:274-277`：
```ts
const response = await fetch('https://api.anthropic.com/v1/messages', {...})
const json = await response.json()          // ← 即使 response.status=401 也 OK parse
answerText = json.content?.[0]?.text ?? '抱歉，暫時無法回答。'   // ← 吃掉 error
```

### 建議修法（未做，留作後續 TODO）
加 `response.ok` check + log error body：
```ts
const response = await fetch(...)
if (!response.ok) {
  const errBody = await response.text()
  console.error('Anthropic HTTP', response.status, errBody)
  return new Response(JSON.stringify({ error: `AI 服務錯誤 (${response.status})` }), {
    status: 502, ...
  })
}
const json = await response.json()
```

這樣以後踩 Secret missing 或 API 問題時，Supabase Logs 一眼能看到。

---

## 坑 4：batch-worker 需 service_role / solver_postflop_mtt 需 anon — RLS 設計不一致

### 症狀
- Pipeline script 某些能直接跑（用 anon key），某些 `Missing SUPABASE_SERVICE_KEY` exit 1
- 新電腦 setup 時搞不清楚要不要建 `scripts/gto-pipeline/.env`

### 根因：同一個 Supabase project 內，不同 table 的 RLS 設計不同

| Table | RLS 對 anon | RLS 對 authenticated | 誰用 | 用哪個 key |
|---|---|---|---|---|
| `solver_postflop_6max` | SELECT + INSERT + UPDATE | 同 | pipeline scripts / Edge Function | **anon 就夠** |
| `solver_postflop_mtt` | SELECT + INSERT + UPDATE（T-063 對齊 6max） | 同 | pipeline scripts / Edge Function | **anon 就夠** |
| `gto_postflop` | ❌ 無（拒絕） | SELECT only | batch-worker / front-end retrieval | **service_role**（pipeline 寫入）/ authenticated user session（前端讀） |
| `gto_batch_progress` | ❌ 無 | SELECT only | batch-worker（雙機協調） | **service_role**（pipeline 寫入） |

### 歷史脈絡
- `solver_postflop_*` 家族：T-011 / T-012 / T-063 時代，pipeline scripts 用 anon key 跑 upsert
  （`scripts/gto-pipeline/convert-to-db.mjs` / `test-retrieval.mjs` 都硬編 anon key），
  所以 RLS 對 anon 放行
- `gto_postflop` / `gto_batch_progress`：T-033 / T-042 時代，改用 `batch-worker.mjs`
  走 service_role bypass RLS（雙機 claim_gto_batch RPC 協調也仰賴 service_role），
  RLS 只對 authenticated 開 SELECT 當前端 retrieval 用

### 對「新電腦 setup」的影響
- 如果只要跑 `convert-to-db.mjs` / `test-retrieval.mjs`（solver_postflop_* 家族）→ **只需要** repo root 的 `.env`（Vite 那個沒用，scripts 硬編 anon 了）
- 如果要跑 `batch-worker.mjs` / `seed-batches.mjs`（gto_postflop 家族）→ **必須**額外建 `scripts/gto-pipeline/.env` 放 `SUPABASE_SERVICE_KEY`
- `setup-env.ps1` 目前只處理前者

### 要統一嗎？
- **短期**：保留現狀。兩個家族 table 的產出頻率不同（solver_postflop 慢慢補、gto_postflop marathon 跑），設計意圖不同
- **長期**：考慮 gto_postflop 也改走 anon（簡化 onboarding），但要重新設計 RLS 確保 anon 只能寫「已 claim 的 batch」（複雜度高）

詳細 setup 流程見 [[gto-pipeline-env-setup]]。

---

## 相關連結

- [JWT Signing Keys | Supabase Docs](https://supabase.com/docs/guides/auth/signing-keys)
- [Rotating Anon, Service, and JWT Secrets | Supabase Docs](https://supabase.com/docs/guides/troubleshooting/rotating-anon-service-and-jwt-secrets-1Jq6yd)
- Supabase Edge Runtime ES256 追蹤：Issue [#42244](https://github.com/supabase/supabase/issues/42244)、[#42810](https://github.com/supabase/supabase/issues/42810)、[#41691](https://github.com/supabase/supabase/issues/41691)
- [[deployment-state]] — Supabase / Edge Functions / Vercel 基礎設施現況
