// supabase/functions/analyze-hu-hand/index.ts
// Deploy via: Supabase Dashboard → Edge Functions → New Function
// Name: analyze-hu-hand
// Required env: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//
// Charges 3 points per call via spend_points RPC, then calls Claude
// Haiku to analyze a single HU poker hand. Saves the analysis text to
// tournament_hands.ai_analysis for replay without re-charging.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const ANALYSIS_COST = 3  // points per hand analysis

interface Body {
  user_id: string
  session_id: string
  hand_index: number  // 0-based index in handHistory; hand_number = hand_index + 1
  hand_data: {
    hero_position: string       // 'btn' | 'bb'
    hero_cards: string          // 'AsKh'
    villain_cards: string | null
    board: string | null
    action_sequence: unknown[]
    pot_total_bb: number
    hero_won: boolean
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body: Body = await req.json()
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Charge points atomically via existing spend_points RPC
    const { data: spendResult, error: spendError } = await supabase.rpc('spend_points', {
      p_user_id: body.user_id,
      p_amount: ANALYSIS_COST,
      p_type: 'hu_analysis',
      p_description: `HU 手分析 #${body.hand_index + 1}`,
    })
    if (spendError) throw new Error(`spend_points failed: ${spendError.message}`)
    const spendRow = Array.isArray(spendResult) ? spendResult[0] : spendResult
    if (!spendRow?.success) {
      return new Response(JSON.stringify({ error: 'Insufficient points' }), {
        status: 402,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Call Claude Haiku
    const prompt = buildPrompt(body.hand_data)
    const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!claudeResp.ok) {
      const errText = await claudeResp.text()
      throw new Error(`Claude API error ${claudeResp.status}: ${errText}`)
    }
    const claudeData = await claudeResp.json()
    const analysisText: string = claudeData.content?.[0]?.text ?? '(分析失敗)'

    // 3. Save analysis to tournament_hands.ai_analysis for replay
    await supabase
      .from('tournament_hands')
      .update({ ai_analysis: analysisText })
      .eq('session_id', body.session_id)
      .eq('hand_number', body.hand_index + 1)

    return new Response(JSON.stringify({
      analysis: analysisText,
      newBalance: spendRow.new_balance,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function buildPrompt(h: Body['hand_data']): string {
  return `你是 HU 撲克教練。請用繁體中文分析這手牌（80 字以內），重點：玩家決策對錯 + 改善建議。

情境：HU 對決，40BB
位置：${h.hero_position.toUpperCase()}
玩家手牌：${h.hero_cards}
${h.villain_cards ? `對手手牌：${h.villain_cards}` : '對手棄牌'}
${h.board ? `公共牌：${h.board}` : ''}
動作序列：${JSON.stringify(h.action_sequence)}
底池：${h.pot_total_bb} BB
結果：${h.hero_won ? '玩家贏' : '玩家輸'}

請給出簡潔、可執行的建議。`
}
