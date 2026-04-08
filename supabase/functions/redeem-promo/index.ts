// Supabase Edge Function: 兌換序號
// 部署: supabase functions deploy redeem-promo

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// 有效序號列表（新增序號只需加到這裡）
const VALID_CODES = ['POKERGOAL2026']

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. 驗證用戶 JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '未登入' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: '驗證失敗' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. 解析並驗證序號
    const { code } = await req.json()
    const normalizedCode = (code ?? '').toString().trim().toUpperCase()

    if (!VALID_CODES.includes(normalizedCode)) {
      return new Response(JSON.stringify({ error: '無效的序號' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. 檢查是否已兌換過
    const { data: existing } = await supabaseAuth
      .from('promo_redemptions')
      .select('id')
      .eq('user_id', user.id)
      .eq('code', normalizedCode)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ error: '此序號已使用過' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 4. 計算到期時間
    let expiresAt: Date

    const { data: sub } = await supabaseAuth
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .single()

    const hasActiveSub = sub && (
      sub.status === 'active' ||
      (sub.status === 'cancelled' && sub.current_period_end && new Date(sub.current_period_end) > new Date())
    )

    if (hasActiveSub && sub.current_period_end) {
      // 有效訂閱：從訂閱到期日 +30 天
      expiresAt = new Date(sub.current_period_end)
      expiresAt.setDate(expiresAt.getDate() + 30)
    } else {
      // 無有效訂閱：從現在 +30 天
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)
    }

    // 5. 寫入兌換記錄
    const { error: insertError } = await supabaseAuth
      .from('promo_redemptions')
      .insert({
        user_id: user.id,
        code: normalizedCode,
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      return new Response(JSON.stringify({ error: '兌換失敗，請稍後再試' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 6. 更新 profiles.promo_expires_at（取較晚的到期時間）
    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('promo_expires_at')
      .eq('id', user.id)
      .single()

    const currentExpiry = profile?.promo_expires_at ? new Date(profile.promo_expires_at) : null
    const shouldUpdate = !currentExpiry || expiresAt > currentExpiry

    if (shouldUpdate) {
      await supabaseAuth
        .from('profiles')
        .update({ promo_expires_at: expiresAt.toISOString() })
        .eq('id', user.id)
    }

    // 7. 回傳成功
    return new Response(JSON.stringify({
      success: true,
      expires_at: expiresAt.toISOString(),
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: '伺服器錯誤' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
