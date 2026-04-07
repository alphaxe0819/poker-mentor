import { supabase } from './supabase'

// ─── 環境變數 ─────────────────────────────────────────────────────────────────

const LS_STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID ?? ''

// Checkout 連結（在 Lemon Squeezy 後台建立產品後填入）
const LS_CHECKOUT_MONTHLY = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_MONTHLY ?? ''
const LS_CHECKOUT_YEARLY = import.meta.env.VITE_LEMONSQUEEZY_CHECKOUT_YEARLY ?? ''

// ─── 型別 ─────────────────────────────────────────────────────────────────────

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused' | 'past_due' | 'inactive'
export type PlanType = 'free' | 'pro_monthly' | 'pro_yearly'

export interface Subscription {
  id: string
  user_id: string
  ls_subscription_id: string | null
  ls_customer_id: string | null
  status: SubscriptionStatus
  plan: PlanType
  current_period_end: string | null
  cancel_at: string | null
  card_brand: string | null
  card_last_four: string | null
  update_payment_url: string | null
  customer_portal_url: string | null
  created_at: string
  updated_at: string
}

// ─── Checkout ─────────────────────────────────────────────────────────────────

/**
 * 開啟 Lemon Squeezy Checkout overlay
 * 利用 Lemon.js 的 LemonSqueezy.Url.Open() 或直接跳轉
 */
export function openCheckout(plan: 'monthly' | 'yearly', userId: string, userEmail: string) {
  const baseUrl = plan === 'monthly' ? LS_CHECKOUT_MONTHLY : LS_CHECKOUT_YEARLY

  if (!baseUrl) {
    console.error('Lemon Squeezy checkout URL not configured')
    return
  }

  // 帶入用戶資訊，讓 webhook 能對應到用戶
  const url = new URL(baseUrl)
  url.searchParams.set('checkout[custom][user_id]', userId)
  url.searchParams.set('checkout[email]', userEmail)
  url.searchParams.set('checkout[custom][store_id]', LS_STORE_ID)

  // 嘗試使用 Lemon.js overlay，若未載入則直接跳轉
  if (window.LemonSqueezy) {
    window.LemonSqueezy.Url.Open(url.toString())
  } else {
    window.open(url.toString(), '_blank')
  }
}

// ─── 訂閱狀態查詢 ──────────────────────────────────────────────────────────────

/**
 * 從 Supabase 取得用戶的訂閱記錄
 */
export async function getSubscription(userId: string): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !data) return null
  return data as Subscription
}

/**
 * 檢查訂閱是否有效（active 或已取消但仍在有效期內）
 */
export function isSubscriptionActive(sub: Subscription | null): boolean {
  if (!sub) return false
  if (sub.status === 'active') return true

  // 已取消但仍在有效期內
  if (sub.status === 'cancelled' && sub.current_period_end) {
    return new Date(sub.current_period_end) > new Date()
  }

  return false
}

/**
 * 取得訂閱顯示資訊
 */
export function getSubscriptionDisplayInfo(sub: Subscription | null): {
  label: string
  statusColor: string
  statusText: string
  renewDate: string | null
  canManage: boolean
} {
  if (!sub || sub.status === 'inactive') {
    return {
      label: '免費方案',
      statusColor: '#6b7280',
      statusText: '免費',
      renewDate: null,
      canManage: false,
    }
  }

  const planLabel = sub.plan === 'pro_yearly' ? 'Pro 年繳' : 'Pro 月繳'

  const renewDate = sub.current_period_end
    ? new Date(sub.current_period_end).toLocaleDateString('zh-TW')
    : null

  switch (sub.status) {
    case 'active':
      return {
        label: planLabel,
        statusColor: '#4ade80',
        statusText: '有效',
        renewDate,
        canManage: true,
      }
    case 'cancelled':
      return {
        label: planLabel,
        statusColor: '#fbbf24',
        statusText: renewDate ? `已取消（有效至 ${renewDate}）` : '已取消',
        renewDate,
        canManage: true,
      }
    case 'past_due':
      return {
        label: planLabel,
        statusColor: '#ef4444',
        statusText: '付款逾期',
        renewDate,
        canManage: true,
      }
    case 'paused':
      return {
        label: planLabel,
        statusColor: '#fbbf24',
        statusText: '已暫停',
        renewDate,
        canManage: true,
      }
    case 'expired':
      return {
        label: planLabel,
        statusColor: '#6b7280',
        statusText: '已過期',
        renewDate: null,
        canManage: false,
      }
    default:
      return {
        label: '免費方案',
        statusColor: '#6b7280',
        statusText: '免費',
        renewDate: null,
        canManage: false,
      }
  }
}

/**
 * 開啟 Lemon Squeezy Customer Portal（管理訂閱/取消/更新付款方式）
 */
export function openCustomerPortal(sub: Subscription) {
  if (sub.customer_portal_url) {
    window.open(sub.customer_portal_url, '_blank')
  }
}

// ─── Lemon.js 型別宣告 ───────────────────────────────────────────────────────

declare global {
  interface Window {
    LemonSqueezy?: {
      Url: {
        Open: (url: string) => void
      }
      Setup: (options: { eventHandler: (event: LemonSqueezyEvent) => void }) => void
      Refresh: () => void
    }
    createLemonSqueezy?: () => void
  }
}

export interface LemonSqueezyEvent {
  event: string
  data?: unknown
}

/**
 * 初始化 Lemon.js（在 App 啟動時呼叫）
 * 監聽 checkout 事件，完成後刷新用戶訂閱狀態
 */
export function initLemonSqueezy(onCheckoutSuccess?: () => void) {
  // 載入 Lemon.js script
  if (!document.querySelector('script[src*="lemon.js"]')) {
    const script = document.createElement('script')
    script.src = 'https://app.lemonsqueezy.com/js/lemon.js'
    script.defer = true
    script.onload = () => {
      if (window.createLemonSqueezy) {
        window.createLemonSqueezy()
      }
      setupEventHandler(onCheckoutSuccess)
    }
    document.head.appendChild(script)
  } else {
    setupEventHandler(onCheckoutSuccess)
  }
}

function setupEventHandler(onCheckoutSuccess?: () => void) {
  if (!window.LemonSqueezy) return

  window.LemonSqueezy.Setup({
    eventHandler: (event) => {
      // Checkout 完成事件
      if (event.event === 'Checkout.Success') {
        onCheckoutSuccess?.()
      }
    },
  })
}
