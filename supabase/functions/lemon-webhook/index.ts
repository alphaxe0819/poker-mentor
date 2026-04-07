// Supabase Edge Function: 處理 Lemon Squeezy Webhook
// 部署: supabase functions deploy lemon-webhook
// 設定 secret: supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=your_secret

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const WEBHOOK_SECRET = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

// ─── 簽名驗證 ─────────────────────────────────────────────────────────────────

async function verifySignature(rawBody: string, signature: string): Promise<boolean> {
  if (!WEBHOOK_SECRET || !signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(WEBHOOK_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody))
  const hexSig = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return hexSig === signature
}

// ─── 型別 ─────────────────────────────────────────────────────────────────────

interface LemonWebhookPayload {
  meta: {
    event_name: string
    custom_data?: {
      user_id?: string
    }
  }
  data: {
    id: string
    attributes: {
      store_id: number
      customer_id: number
      product_id: number
      variant_id: number
      status: string
      user_email: string
      renews_at: string | null
      ends_at: string | null
      trial_ends_at: string | null
      current_period_end: string | null  // 部分事件可能有
      card_brand: string | null
      card_last_four: string | null
      urls: {
        update_payment_method: string
        customer_portal: string
      }
    }
  }
}

// ─── 主處理 ───────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  // 只接受 POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''

  // 驗證簽名
  const valid = await verifySignature(rawBody, signature)
  if (!valid) {
    console.error('Invalid webhook signature')
    return new Response('Invalid signature', { status: 401 })
  }

  let payload: LemonWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const eventName = payload.meta.event_name
  const userId = payload.meta.custom_data?.user_id
  const attrs = payload.data.attributes
  const lsSubId = String(payload.data.id)

  console.log(`[lemon-webhook] event=${eventName}, ls_sub=${lsSubId}, user=${userId}`)

  if (!userId) {
    // 嘗試用 email 查找用戶
    console.error('No user_id in custom_data, cannot process')
    return new Response('Missing user_id', { status: 400 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  // 判斷方案類型（根據 variant_id 或直接用 renews_at 推斷）
  // 這裡簡化：有 renews_at 且間隔 > 60 天就是年繳
  let plan: string = 'pro_monthly'
  if (attrs.renews_at) {
    const now = new Date()
    const renewDate = new Date(attrs.renews_at)
    const diffDays = (renewDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays > 60) plan = 'pro_yearly'
  }

  // 訂閱狀態映射
  const statusMap: Record<string, string> = {
    'active': 'active',
    'cancelled': 'cancelled',
    'expired': 'expired',
    'paused': 'paused',
    'past_due': 'past_due',
    'unpaid': 'past_due',
    'on_trial': 'active',
  }
  const mappedStatus = statusMap[attrs.status] ?? 'inactive'

  // 計算 current_period_end
  const periodEnd = attrs.renews_at || attrs.ends_at || null

  // ─── 依事件類型處理 ──────────────────────────────────────────────────────

  const subscriptionEvents = [
    'subscription_created',
    'subscription_updated',
    'subscription_resumed',
    'subscription_unpaused',
  ]

  const deactivateEvents = [
    'subscription_expired',
    'subscription_cancelled',
    'subscription_paused',
  ]

  if (subscriptionEvents.includes(eventName)) {
    // 建立或更新訂閱記錄
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        ls_subscription_id: lsSubId,
        ls_customer_id: String(attrs.customer_id),
        ls_variant_id: String(attrs.variant_id),
        ls_product_id: String(attrs.product_id),
        status: mappedStatus,
        plan,
        current_period_start: new Date().toISOString(),
        current_period_end: periodEnd,
        trial_ends_at: attrs.trial_ends_at,
        card_brand: attrs.card_brand,
        card_last_four: attrs.card_last_four,
        update_payment_url: attrs.urls?.update_payment_method ?? null,
        customer_portal_url: attrs.urls?.customer_portal ?? null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (subError) {
      console.error('Failed to upsert subscription:', subError)
      return new Response('DB error', { status: 500 })
    }

    // 同步更新 profiles.is_paid
    const isPaid = mappedStatus === 'active'
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_paid: isPaid })
      .eq('id', userId)

    if (profileError) {
      console.error('Failed to update profile is_paid:', profileError)
    }

    console.log(`[lemon-webhook] ✓ subscription ${mappedStatus}, is_paid=${isPaid}`)
  }

  if (deactivateEvents.includes(eventName)) {
    // 更新訂閱狀態
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({
        status: mappedStatus,
        cancel_at: attrs.ends_at,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (subError) {
      console.error('Failed to update subscription:', subError)
      return new Response('DB error', { status: 500 })
    }

    // cancelled 但仍在有效期 → 不立刻關閉 is_paid
    // expired → 關閉 is_paid
    if (eventName === 'subscription_expired') {
      await supabase
        .from('profiles')
        .update({ is_paid: false })
        .eq('id', userId)
      console.log(`[lemon-webhook] ✓ subscription expired, is_paid=false`)
    } else {
      console.log(`[lemon-webhook] ✓ subscription ${mappedStatus}, is_paid unchanged (still in period)`)
    }
  }

  if (eventName === 'subscription_payment_success') {
    // 續費成功 → 確保 is_paid = true
    await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: periodEnd,
        card_brand: attrs.card_brand,
        card_last_four: attrs.card_last_four,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    await supabase
      .from('profiles')
      .update({ is_paid: true })
      .eq('id', userId)

    console.log(`[lemon-webhook] ✓ payment success, is_paid=true`)
  }

  if (eventName === 'subscription_payment_failed') {
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    console.log(`[lemon-webhook] ⚠ payment failed, status=past_due`)
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
