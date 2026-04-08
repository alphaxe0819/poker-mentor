# Promo Code Redemption Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a promo code input feature that grants each account a one-time 30-day Pro trial, with inline input UI in both ProfileTab and UpgradePage.

**Architecture:** New `promo_redemptions` table + `promo_expires_at` column on `profiles`. A new `redeem-promo` Edge Function handles validation and redemption server-side. Frontend adds a shared `PromoCodeInput` component embedded inline in ProfileTab and UpgradePage. The `isUserPaid()` helper centralizes paid status checks: `is_paid || promo_expires_at > now()`.

**Tech Stack:** Supabase (Postgres + Edge Functions/Deno), React 19, TypeScript

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260408_promo_redemptions.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- =============================================
-- 序號兌換系統 — promo_redemptions 表 + profiles 新增欄位
-- 貼到 Supabase SQL Editor 執行
-- =============================================

-- 1. profiles 新增 promo 到期欄位
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS promo_expires_at timestamptz;

-- 2. 序號兌換記錄表
CREATE TABLE IF NOT EXISTS promo_redemptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  code text NOT NULL,
  redeemed_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  UNIQUE (user_id, code)
);

-- 3. RLS
ALTER TABLE promo_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own promo_redemptions"
  ON promo_redemptions FOR SELECT USING (auth.uid() = user_id);

-- 4. 索引
CREATE INDEX IF NOT EXISTS idx_promo_redemptions_user_id ON promo_redemptions(user_id);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/20260408_promo_redemptions.sql
git commit -m "feat: add promo_redemptions table and promo_expires_at column"
```

---

### Task 2: Update UserProfile Type and isUserPaid Helper

**Files:**
- Modify: `src/lib/auth.ts:3-11` (UserProfile interface)
- Modify: `src/lib/auth.ts:34-40` (isDailyLimitReached)

- [ ] **Step 1: Write failing tests for isUserPaid**

Add to `src/__tests__/auth.test.ts`:

```typescript
import { isDailyLimitReached, isUserPaid, type UserProfile } from '../lib/auth'

// Update makeProfile to include promo_expires_at:
function makeProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: 'test-user',
    email: 'test@example.com',
    name: 'Test',
    is_paid: false,
    player_type: 'tournament',
    daily_plays_date: null,
    daily_plays_count: 0,
    promo_expires_at: null,
    ...overrides,
  }
}

// Add new describe block after existing tests:
describe('isUserPaid', () => {
  it('returns true for is_paid user', () => {
    const profile = makeProfile({ is_paid: true })
    expect(isUserPaid(profile)).toBe(true)
  })

  it('returns false for free user with no promo', () => {
    const profile = makeProfile()
    expect(isUserPaid(profile)).toBe(false)
  })

  it('returns true for free user with active promo', () => {
    const future = new Date(Date.now() + 86400000).toISOString()
    const profile = makeProfile({ promo_expires_at: future })
    expect(isUserPaid(profile)).toBe(true)
  })

  it('returns false for free user with expired promo', () => {
    const past = new Date(Date.now() - 86400000).toISOString()
    const profile = makeProfile({ promo_expires_at: past })
    expect(isUserPaid(profile)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/__tests__/auth.test.ts`
Expected: FAIL — `isUserPaid` is not exported

- [ ] **Step 3: Update UserProfile and add isUserPaid**

In `src/lib/auth.ts`, update the `UserProfile` interface (lines 3-11):

```typescript
export interface UserProfile {
  id: string
  email: string
  name: string
  is_paid: boolean
  player_type: 'tournament' | 'cash'
  daily_plays_date: string | null
  daily_plays_count: number
  promo_expires_at: string | null
}
```

Add `isUserPaid` helper after the interface (after line 11):

```typescript
/** 判斷用戶是否為付費狀態（訂閱 或 序號體驗有效） */
export function isUserPaid(profile: UserProfile): boolean {
  if (profile.is_paid) return true
  if (profile.promo_expires_at && new Date(profile.promo_expires_at) > new Date()) return true
  return false
}
```

Update `isDailyLimitReached` (line 36) to use the new helper:

```typescript
export function isDailyLimitReached(profile: UserProfile): boolean {
  if (isUserPaid(profile)) return false
  const today = getLocalDateString()
  if (profile.daily_plays_date !== today) return false
  return profile.daily_plays_count >= 1
}
```

- [ ] **Step 4: Update existing tests to include promo_expires_at in makeProfile**

The existing `makeProfile` in `src/__tests__/auth.test.ts` needs `promo_expires_at: null` added (see Step 1 — the whole file should use the updated version).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/__tests__/auth.test.ts`
Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/auth.ts src/__tests__/auth.test.ts
git commit -m "feat: add isUserPaid helper with promo_expires_at support"
```

---

### Task 3: Update All is_paid References to Use isUserPaid

**Files:**
- Modify: `src/pages/App.tsx:136` — `currentProfile.is_paid` → `isUserPaid(currentProfile)`
- Modify: `src/pages/App.tsx:221,242,243` — `profile?.is_paid` → pass profile and use `isUserPaid`
- Modify: `src/pages/App.tsx:227,232` — same pattern
- Modify: `src/tabs/TrainTab.tsx:257-263` — `isPaid` prop still works, but caller passes `isUserPaid(profile)`
- Modify: `src/pages/AdminDashboard.tsx:380,534` — keep `is_paid` (admin reads raw DB field, not promo status)

- [ ] **Step 1: Update App.tsx**

In `src/pages/App.tsx`, add import:

```typescript
import { getProfile, isDailyLimitReached, isUserPaid } from '../lib/auth'
```

Replace all `profile?.is_paid ?? false` with `isUserPaid(profile)` where it's used for feature gating. There are these locations:

Line 136: `if (currentProfile.is_paid) return true` → `if (isUserPaid(currentProfile)) return true`

Line 221: `isPaid={profile?.is_paid ?? false}` → `isPaid={profile ? isUserPaid(profile) : false}`

Line 227: `if (currentProfile && !currentProfile.is_paid)` → `if (currentProfile && !isUserPaid(currentProfile))`

Line 232: `if (!latestProfile || latestProfile.is_paid) return` → `if (!latestProfile || isUserPaid(latestProfile)) return`

Line 242: `isPaid={profile?.is_paid ?? false}` → `isPaid={profile ? isUserPaid(profile) : false}`

Line 243: `isPaid={profile?.is_paid ?? false}` → `isPaid={profile ? isUserPaid(profile) : false}`

- [ ] **Step 2: Run build to verify no type errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 4: Commit**

```bash
git add src/pages/App.tsx
git commit -m "feat: replace is_paid checks with isUserPaid for promo support"
```

---

### Task 4: Create redeem-promo Edge Function

**Files:**
- Create: `supabase/functions/redeem-promo/index.ts`

- [ ] **Step 1: Create the Edge Function**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add supabase/functions/redeem-promo/index.ts
git commit -m "feat: add redeem-promo edge function"
```

---

### Task 5: Create Promo Redemption Client Library

**Files:**
- Create: `src/lib/promo.ts`

- [ ] **Step 1: Create the promo client lib**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/promo.ts
git commit -m "feat: add promo code client library"
```

---

### Task 6: Create PromoCodeInput Component

**Files:**
- Create: `src/components/PromoCodeInput.tsx`

- [ ] **Step 1: Create the inline promo input component**

```tsx
import { useState, useEffect } from 'react'
import { redeemPromoCode, getPromoRedemption } from '../lib/promo'

interface Props {
  /** 兌換成功後回呼（用於刷新 profile） */
  onRedeemed?: () => void
}

export default function PromoCodeInput({ onRedeemed }: Props) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [alreadyRedeemed, setAlreadyRedeemed] = useState<string | null>(null) // expires_at

  // 檢查是否已兌換過 POKERGOAL2026
  useEffect(() => {
    getPromoRedemption('POKERGOAL2026').then(({ redeemed, expires_at }) => {
      if (redeemed && expires_at) {
        setAlreadyRedeemed(expires_at)
      }
    })
  }, [])

  const handleRedeem = async () => {
    const trimmed = code.trim()
    if (!trimmed) return

    setLoading(true)
    setResult(null)

    const res = await redeemPromoCode(trimmed)

    if (res.success && res.expires_at) {
      const dateStr = new Date(res.expires_at).toLocaleDateString('zh-TW')
      setResult({ type: 'success', message: `兌換成功！Pro 體驗有效至 ${dateStr}` })
      setAlreadyRedeemed(res.expires_at)
      onRedeemed?.()
    } else {
      setResult({ type: 'error', message: res.error ?? '兌換失敗' })
    }

    setLoading(false)
  }

  // 已兌換過：顯示狀態
  if (alreadyRedeemed) {
    const dateStr = new Date(alreadyRedeemed).toLocaleDateString('zh-TW')
    const isActive = new Date(alreadyRedeemed) > new Date()
    return (
      <div className="rounded-2xl p-4 flex flex-col gap-1"
           style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-400 text-xs">序號體驗</div>
        <div className={`text-sm font-medium ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
          {isActive ? `Pro 體驗有效至 ${dateStr}` : `Pro 體驗已於 ${dateStr} 到期`}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-3"
         style={{ background: '#111', border: '1px solid #1a1a1a' }}>
      <div className="text-gray-400 text-xs">輸入序號</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
          placeholder="請輸入序號"
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
          style={{ background: '#0a0a0a', border: '1px solid #222' }}
        />
        <button
          onClick={handleRedeem}
          disabled={loading || !code.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition active:scale-[0.97] disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          {loading ? '兌換中...' : '兌換'}
        </button>
      </div>
      {result && (
        <div className={`text-xs ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {result.message}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PromoCodeInput.tsx
git commit -m "feat: add PromoCodeInput inline component"
```

---

### Task 7: Integrate PromoCodeInput into ProfileTab and UpgradePage

**Files:**
- Modify: `src/tabs/ProfileTab.tsx:120-130` (add PromoCodeInput before 積分 section)
- Modify: `src/pages/UpgradePage.tsx:89-98` (add PromoCodeInput before CTA section)

- [ ] **Step 1: Add PromoCodeInput to ProfileTab**

In `src/tabs/ProfileTab.tsx`, add import at top:

```typescript
import PromoCodeInput from '../components/PromoCodeInput'
```

Add the component between the 用戶資訊 block (ends at line 77) and the 積分 block (starts at line 120). Insert after line 118 (end of commented-out subscription section), before line 120:

```tsx
          {/* 序號兌換 */}
          <PromoCodeInput onRedeemed={() => window.location.reload()} />
```

- [ ] **Step 2: Add PromoCodeInput to UpgradePage**

In `src/pages/UpgradePage.tsx`, add import at top:

```typescript
import PromoCodeInput from '../components/PromoCodeInput'
```

Add props for onRedeemed callback. Update the Props interface:

```typescript
interface Props {
  onBack: () => void
  userId: string
  userEmail: string
  onRedeemed?: () => void
}
```

Update the function signature:

```typescript
export default function UpgradePage({ onBack, userId, userEmail, onRedeemed }: Props) {
```

Insert the PromoCodeInput between the Pro features list (line 89) and the CTA section (line 92). After the closing `</div>` of the features list (line 89), add:

```tsx
      {/* 序號兌換 */}
      <div className="w-full max-w-sm">
        <PromoCodeInput onRedeemed={onRedeemed} />
      </div>
```

- [ ] **Step 3: Pass onRedeemed from App.tsx to UpgradePage**

In `src/pages/App.tsx`, find where `<UpgradePage` is rendered and add the `onRedeemed` prop. The handler should refresh the profile:

```tsx
<UpgradePage
  onBack={() => setShowUpgrade(false)}
  userId={user.id}
  userEmail={user.email ?? ''}
  onRedeemed={async () => {
    const p = await getProfile()
    setProfile(p)
    setShowUpgrade(false)
  }}
/>
```

- [ ] **Step 4: Run build to verify no errors**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 6: Commit**

```bash
git add src/tabs/ProfileTab.tsx src/pages/UpgradePage.tsx src/pages/App.tsx
git commit -m "feat: integrate PromoCodeInput into ProfileTab and UpgradePage"
```

---

### Task 8: Build Verification and Manual Testing Checklist

- [ ] **Step 1: Run full build**

Run: `npx vite build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run all tests**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 3: Manual testing checklist (after deploying migration + edge function)**

1. 執行 SQL migration（在 Supabase SQL Editor 貼入 `20260408_promo_redemptions.sql`）
2. 部署 Edge Function: `supabase functions deploy redeem-promo`
3. 開啟 app → ProfileTab → 看到序號輸入區塊
4. 輸入錯誤序號 → 顯示「無效的序號」
5. 輸入 `POKERGOAL2026` → 顯示「兌換成功！Pro 體驗有效至 ...」
6. 重新整理 → 序號區塊顯示「Pro 體驗有效至 ...」
7. 再次輸入同序號 → 顯示「此序號已使用過」
8. 確認免費限制解除（可無限練習）
9. UpgradePage → 同樣看到序號輸入區塊且功能正常

- [ ] **Step 4: Final commit (if any fixes needed)**
