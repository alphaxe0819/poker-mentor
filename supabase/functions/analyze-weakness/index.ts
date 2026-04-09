// Supabase Edge Function: Anthropic API Proxy for weakness analysis
// 部署: supabase functions deploy analyze-weakness
// 設定 secret: supabase secrets set ANTHROPIC_API_KEY=your_key

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  overall: number
  total: number
  posList: { pos: string; accuracy: number; total: number }[]
  rfiAcc: number
  rfiTotal: number
  vsRaiseAcc: number
  vsRaiseTotal: number
  suitedAcc: number
  offsuitAcc: number
  pairAcc: number
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  // 驗證使用者身份
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '未授權' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response(JSON.stringify({ error: '驗證失敗' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // 解析請求
  let data: AnalysisRequest
  try {
    data = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: '無效的請求' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // 建構 prompt
  const posText = data.posList
    .map(p => `- ${p.pos}：${p.accuracy}%（${p.total} 題）`)
    .join('\n')

  const userPrompt = `【分析模組：翻前基礎策略】

以下是這位學生的近期答題數據：

整體正確率：${data.overall}%，共 ${data.total} 題

位置正確率（由低到高）：
${posText}

場景正確率：
- RFI：${data.rfiAcc}%（${data.rfiTotal} 題）
- vs Raise：${data.vsRaiseAcc}%（${data.vsRaiseTotal} 題）

手牌類型正確率：
- 同花：${data.suitedAcc}%
- 雜色：${data.offsuitAcc}%
- 對子：${data.pairAcc}%

請直接點出這位學生最需要改善的 3-5 個弱點。`

  // 呼叫 Anthropic API
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: `你是一位專業的德州撲克 GTO 教練。
用繁體中文，直接點出學生的弱點，口吻像教練在賽後檢討。
格式固定：列出 3-5 個弱點，每條一句話，直接說問題在哪。
開頭不要廢話，直接進入弱點清單。
不要給鼓勵或正面評價，只講需要改進的地方。

【分析模組】
目前啟用：翻前基礎策略
未來模組（停用中）：ICM 壓力場景、決賽桌單挑、短籌碼推疊策略`,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    const json = await response.json()
    const text = json.content?.[0]?.text ?? '分析失敗，請稍後再試。'

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return new Response(JSON.stringify({ error: '分析服務暫時不可用' }), {
      status: 502,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
