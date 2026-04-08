import { supabase } from './supabase'

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/redeem-promo`

export interface RedeemResult {
  success: boolean
  expires_at?: string
  error?: string
}

/** 呼叫 Edge Function 兌換序號 */
export async function redeemPromoCode(code: string): Promise<RedeemResult> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { success: false, error: '請先登入' }

  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ code }),
  })

  const data = await res.json()

  if (!res.ok) {
    return { success: false, error: data.error ?? '兌換失敗' }
  }

  return { success: true, expires_at: data.expires_at }
}

/** 查詢當前用戶對某序號的兌換狀態 */
export async function getPromoRedemption(code: string): Promise<{ redeemed: boolean; expires_at: string | null }> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { redeemed: false, expires_at: null }

  const { data } = await supabase
    .from('promo_redemptions')
    .select('expires_at')
    .eq('user_id', user.id)
    .eq('code', code)
    .single()

  if (!data) return { redeemed: false, expires_at: null }
  return { redeemed: true, expires_at: data.expires_at }
}
