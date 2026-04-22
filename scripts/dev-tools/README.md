# Dev Tools

本目錄放**開發期手動工具**，刻意與專案主 `package.json` 獨立（不污染 prod 依賴）。

---

## `grab-gtow-token.mjs` — 抓 GTO Wizard Bearer token

### 為什麼存在

T-082（exploit-coach 內測版）的 retrieval 從我們自家 DB 換成 **GTO Wizard API**，Edge Function 需要 `GTO_WIZARD_TOKEN`（Bearer JWT）。

手動從 DevTools → Network → 找 `api.gtowizard.com` 請求 → 複製 `Authorization` header 的流程太痛苦，容易出錯。此 script 用 **Playwright CDP** 連到你現有的 Chrome，被動監聽 `api.gtowizard.com` 請求並印出 token。

---

### Prerequisites

- Node.js 18+（已內建於本機）
- 裝過本目錄依賴（**只要做一次**）：
  ```
  cd scripts/dev-tools
  npm install
  ```

---

### 使用步驟

**Step 1 — 關掉所有 Chrome 視窗**

務必關乾淨（右下角 tray 也要退出），否則 `--remote-debugging-port` 會被既有 session 吃掉。

**Step 2 — 用 remote debugging 模式啟動 Chrome**

Windows（cmd 或 PowerShell）：

```
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-gtow"
```

Mac：

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-gtow"
```

Linux：

```
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-gtow
```

**為什麼用獨立 `--user-data-dir`？**  
避免污染平常用的 Chrome profile（登入狀態、extensions、history 都不混）。這個路徑會在首次啟動時自動建立。

**Step 3 — 在這個 Chrome 視窗登入 gtowizard.com**

登入後打開**任一個 spot 頁面**（任何會打 API 的頁都行，例如 `Solutions → Cash → 6-max` 然後選一個場景）。API call 一觸發，token 就能被攔到。

**Step 4 — 跑 script**

```
cd scripts/dev-tools
node grab-gtow-token.mjs
```

或加 `--save` 順便寫到本地檔案：

```
node grab-gtow-token.mjs --save
```

成功會看到：

```
🔌 Connecting to Chrome CDP at http://localhost:9222 ...
✅ Connected. Watching for api.gtowizard.com requests ...

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（完整 token，stdout）

✅ Token captured from: https://api.gtowizard.com/api/v1/...
   Length: 412 chars
   Preview: eyJhbGciOiJIUzI1NiIsInR5c...aB12xYz9
```

**Step 5 — 貼到 Supabase**

把 stdout 印出的 token 整段複製，貼到：

- Supabase Dashboard（測試環境 `btiqmckyjyswzrarmfxa`）
- Edge Functions → `exploit-coach-gtow` → Secrets
- 新增 / 更新 `GTO_WIZARD_TOKEN` = `<token>`

**Step 6 — 重新部署 Edge Function + 驗 dev URL**

部署後打開 `https://poker-goal-dev.vercel.app/exploit-coach-gtow-test.html` 問個問題，不該再看到「GTO_WIZARD_TOKEN secret missing」錯誤。

---

### Troubleshooting

**`Cannot connect to Chrome at http://localhost:9222`**

- 沒關乾淨 Chrome，或 port 被佔。工作管理員確認沒有 `chrome.exe` 殘留，重開。
- 啟動參數裡 `--remote-debugging-port=9222` 有沒有正確打。

**Script 跑了 30 秒 timeout，沒攔到 token**

- Chrome 裡沒打開 gtowizard.com，或還沒登入。
- 登入了但沒打開 spot 頁 → 網站不會主動 call API。隨便點一個 spot。

**Token 貼到 Supabase 後還是 401**

- Token 可能過期了（JWT 通常幾小時到幾天）。重跑 script 抓新的。
- 確認沒有貼到 `Bearer ` 這個 prefix（script 已經幫你脫掉，stdout 是純 token）。

---

### Scope / 紀律

- ✅ **只抓 token**，不批次撈 GTOW solver 資料（尊重 GTO Wizard ToS）。
- ✅ Token 只在 stdout / 本機檔案，**不送任何遠端**。
- ✅ `.gtow-token.local.txt` 和 `node_modules/` 已 gitignored。
- ❌ 不寫進 main `package.json`（刻意隔離）。
- ❌ 不自動設 Supabase Secret（需要 service role key，風險太大；手動貼）。
- ❌ 不自動 refresh token（過期時直接重跑即可）。
