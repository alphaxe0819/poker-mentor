# Promo Code Redemption System Design

## Overview

Add a promo code input feature to the membership system. A single fixed promo code allows each account to redeem once for a 30-day Pro trial experience.

## Database Changes

### 1. `profiles` table — new column

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `promo_expires_at` | `timestamptz` | `null` | When the promo trial expires |

### 2. New table: `promo_redemptions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default `gen_random_uuid()` | |
| `user_id` | `uuid` | FK → `auth.users(id)` | Who redeemed |
| `code` | `text` | NOT NULL | Which code was redeemed |
| `redeemed_at` | `timestamptz` | default `now()` | When redeemed |
| `expires_at` | `timestamptz` | NOT NULL | When the trial expires |

- UNIQUE constraint on `(user_id, code)` — each user can redeem each code once
- RLS: users can read own redemptions; inserts via service_role only (Edge Function)

## Paid Status Logic Change

**Current:** `is_paid === true`

**New:** `is_paid === true || (promo_expires_at !== null && promo_expires_at > now())`

Extract as helper: `isUserPaid(profile)` → returns boolean.

### Affected locations

- `isDailyLimitReached()` in `src/lib/auth.ts`
- `getAnalysisUsage()` in `src/lib/auth.ts`
- All feature gating checks that read `is_paid`
- ProfileTab subscription display
- UpgradePage display logic

## Edge Function: `redeem-promo`

**Location:** `supabase/functions/redeem-promo/index.ts`

**Valid codes:** Hardcoded list, initially: `["POKERGOAL2026"]`

**Request:** `POST { code: string }` (user identified via Supabase auth JWT)

**Logic:**

1. Validate JWT → extract `user_id`
2. Normalize code (uppercase, trim)
3. Check code is in valid codes list → if not: `{ error: "無效的序號" }`
4. Check `promo_redemptions` for existing `(user_id, code)` → if exists: `{ error: "此序號已使用過" }`
5. Determine `expires_at`:
   - Query `subscriptions` for active subscription with `current_period_end > now()`
   - If active subscription exists: `expires_at = current_period_end + 30 days`
   - If no active subscription: `expires_at = now() + 30 days`
6. Insert into `promo_redemptions`
7. Update `profiles.promo_expires_at` to `expires_at` (only if new value is later than existing)
8. Return `{ success: true, expires_at }`

**Auth:** Uses service_role key for DB writes. Validates user JWT for identity.

## Frontend

### Shared Component: `PromoCodeInput`

**Location:** `src/components/PromoCodeInput.tsx`

Inline block (not a modal) containing:
- Text input + "兌換" button on the same row
- Below: result message (success with expiry date / error message)
- Loading state on button during API call
- After successful redemption: input hidden, show "Pro 體驗有效至 YYYY/MM/DD"

**States:**
- Default: input + button visible
- Loading: button disabled with spinner
- Success: hide input, show success message with expiry date
- Error: show error message below input, input remains for retry
- Already redeemed: show "已兌換，有效至 YYYY/MM/DD" (check on mount)

### ProfileTab integration

Add `PromoCodeInput` block in the profile section, below existing user info.

### UpgradePage integration

Add `PromoCodeInput` block below the pricing cards, with a label like "已有序號？"

## What Does NOT Change

- Lemon Squeezy webhook logic — untouched
- `subscriptions` table — untouched
- Existing payment/checkout flow — untouched
- `coach_codes` table — remains unused

## Security

- Code validation and redemption happen server-side only (Edge Function)
- No valid codes exposed to frontend
- Rate limiting: Supabase Edge Function default rate limits apply
- RLS prevents users from reading other users' redemptions
