# Prompt Cache 省錢策略（exploit-coach）

> **狀態**：idea 階段，**未實裝**（2026-04-22 用戶討論時記錄）
> **觸發時機**：當 exploit-coach query 量達 1k+/月、或升級 Sonnet/Opus 模型時優先做

## 核心觀察

exploit-coach 的 system prompt **結構極度固定**（~2000 token），全玩家共用：

| 段落 | Token | 變動性 |
|---|---|---|
| 角色設定（GTO 教練 + 剝削專家） | ~500 | 固定 |
| 8 種 villain personality 描述 | ~300 | 固定 |
| TERMINOLOGY_RULES（5 高風險詞 + 21 保留 + 12 推薦 + 規則） | ~700 | 固定（改術語才動） |
| 分街輸出格式規範 | ~500 | 固定 |
| **Total** | **~2000** | **完全固定** |

→ 這 ~2000 token 每次玩家發訊息都重複付 input 錢 = 浪費。

## Anthropic Prompt Cache 機制（基準知識）

| 操作 | Haiku 4.5 | Sonnet 4.6 | 對基準 input 倍數 |
|---|---|---|---|
| 一般 input | $1 / 1M | $3 / 1M | 1× |
| Cache write 5min | $1.25 / 1M | $3.75 / 1M | 1.25× |
| Cache write 1h | $2 / 1M | $6 / 1M | 2× |
| **Cache read** | **$0.10 / 1M** | **$0.30 / 1M** | **0.1×** |

**規則**：
- Cache hit 會 reset TTL（5 分鐘版本：每次 read 都重新計時 5 分鐘）
- 必須從 prompt 開頭連續一段，中間 cache 不行
- 內容一字不能變，否則 miss
- Minimum cacheable size 約 1024 tokens（依模型）

## 三種策略對照（1k 玩家 × 10k query/月，Haiku，2000 token system）

| 策略 | 機制 | System prompt 月成本 |
|---|---|---|
| 完全沒 cache（現狀） | 每次付 input | NT$ 640 |
| 5min cache，靠用戶流量自然 hit | 部分 hit / 部分 miss | NT$ 200-400 |
| **5min cache + keep-warm cron** | **100% hit** | **NT$ 134**（cache + keep-warm） |
| 1h cache | TTL 長但 write 貴 | NT$ 150-250 |

→ **Keep-warm 比現狀省 80%，比裸 5min 省 30-50%。**

## Keep-Warm Cron 設計

### 原理
每 4 分鐘打一次 API call（用最少 messages）→ cache TTL 永不過期 → 真實玩家 100% cache hit。

### 成本（一個月）
- 每天 24h × 60min / 4 = 360 次 ping
- 每次 cache read（2000 token）≈ $0.0002
- 一天 $0.072 → 一個月 **$2.16 ≈ NT$ 70**

### 實作 sketch
```typescript
// 選項 A：Vercel Cron（推薦，免錢）
// vercel.json
{
  "crons": [{ "path": "/api/keep-warm-cache", "schedule": "*/4 * * * *" }]
}

// pages/api/keep-warm-cache.ts 或 app/api/keep-warm-cache/route.ts
export async function GET() {
  const r = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1,
    system: [{
      type: 'text',
      text: BASE_PROMPT + TERMINOLOGY_RULES,  // 同 exploit-coach 用的那段
      cache_control: { type: 'ephemeral' }
    }],
    messages: [{ role: 'user', content: 'ping' }]
  })
  return Response.json({ cache: r.usage })
}
```

### 風險 / 限制
- Anthropic best-effort，極少數情況 cache 仍可能被 evict
- Keep-warm cron 自身耗 token（已算進 NT$ 70/月）
- 改 system prompt 時 cache 立即 invalidate（術語表更新會強制 re-write 一次）
- 要把 BASE_PROMPT + TERMINOLOGY_RULES 抽成跨檔共用 module（exploit-coach + keep-warm 共用同一字串）

## 實裝順序（建議分兩 task）

### Task A：加 prompt cache（不含 keep-warm）
- exploit-coach `index.ts` 改用 `system: [{ text, cache_control }]` 格式
- 抽 `BASE_PROMPT + TERMINOLOGY_RULES` 成 const
- 驗證：API response.usage 看到 `cache_creation_input_tokens` 和 `cache_read_input_tokens`
- 規模 < 1k query/月就停在這
- ROI：自然流量下省 30-50%

### Task B：加 keep-warm cron
- Vercel cron 或 Supabase Edge Function scheduled
- 用同一段 BASE_PROMPT 確保 cache key 一致
- 監控 cache hit rate（response.usage 統計）
- ROI：再省 30-50%（疊加 Task A 後總共省 80%）

## 何時該執行這個 idea

| 條件 | 動作 |
|---|---|
| query < 1k/月 | 不做（NT$ 640 → NT$ 134 只省 NT$ 500，工程成本 ROI 不夠） |
| 1k-10k/月 | 做 Task A（cache），不一定要 keep-warm |
| > 10k/月 | Task A + Task B 都做 |
| 升 Sonnet 或 Opus | **優先做**（成本是 Haiku 的 3-5×，cache ROI 翻倍） |
| 多了其他 LLM 功能（leak detection, batch analysis 等） | 系統 prompt 共用越多，cache 越值得 |

## 跟 T-082 的關聯

T-082 內測 fork exploit-coach 時，可順手實裝 Task A（cache 化）：
- 原版 + GTOW 版兩邊都加 cache（公平對比）
- 內測量小 → cache hit rate 不一定高 → 但程式碼結構先弄好，production 上線就有效果
- 但**不強迫併進 T-082 scope**（會擴張派單範圍），分開 task 比較乾淨

## 連結
- [[supabase-edge-function-gotchas]] — Edge Function 部署規則
- [[poker-terminology-zh-tw]] — 術語表來源（cache 內容主體）
- 任務板：T-082（exploit-coach 內測 GTOW）
