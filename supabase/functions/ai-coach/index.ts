// Supabase Edge Function: AI Poker Coach (Claude Haiku)
// 部署: supabase functions deploy ai-coach
// 需要 secret: ANTHROPIC_API_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CoachRequest {
  messages: Message[]
}

const SYSTEM_PROMPT = `你是一位專業且友善的德州撲克 GTO 教練。用繁體中文回答。

你的職責：
- 分析用戶描述的手牌情境，給出 GTO 角度的建議
- 解釋特定位置的開局範圍
- 討論面對不同對手類型的調整策略
- 解釋下注尺寸的選擇邏輯
- 解答翻前和翻後的策略問題

回答風格：
- 簡潔有力，每次回覆控制在 150 字以內
- 先給結論，再解釋原因
- 用具體的例子說明
- 如果用戶的描述不夠完整，主動追問關鍵資訊（位置、籌碼深度、對手動作）
- 口吻像朋友在聊天，但內容要專業`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS })
  }

  // Auth
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

  // Parse request
  let data: CoachRequest
  try {
    data = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: '無效的請求' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Limit context to last 10 messages
  const messages = data.messages.slice(-10)

  // Call Anthropic API
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
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    const json = await response.json()
    const text = json.content?.[0]?.text ?? '抱歉，我暫時無法回答。請稍後再試。'

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Anthropic API error:', err)
    return new Response(JSON.stringify({ error: '教練服務暫時不可用' }), {
      status: 502,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }
})
