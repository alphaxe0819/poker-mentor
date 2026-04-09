# Points System Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor points system to use Supabase as single source of truth with atomic operations, transaction history, and remove localStorage-first approach.

**Architecture:** Replace the current localStorage-first sync model with Supabase RPC functions (`add_points`, `spend_points`) for atomic operations. Frontend keeps a React state cache updated after each operation. Transaction log (`point_transactions`) records every change. Existing consumers (`TrainTab`, `CourseTab`, `AnalysisTab`, `ProfileTab`, `TrainSetupScreen`) are updated to use the new async API.

**Tech Stack:** Supabase (PostgreSQL RPC, RLS), React 19, TypeScript, Vitest

---

### Task 1: Create Supabase migration for point_transactions table and RPC functions

**Files:**
- Create: `supabase/migrations/20260409_points_refactor.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Point transaction history
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user
  ON point_transactions(user_id, created_at DESC);

-- RLS: users can read own transactions
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own transactions"
  ON point_transactions FOR SELECT USING (auth.uid() = user_id);

-- Atomic add points
CREATE OR REPLACE FUNCTION add_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT,
  p_reference_id TEXT DEFAULT NULL
) RETURNS TABLE(new_balance INTEGER) AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT points INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  v_balance := COALESCE(v_balance, 0) + p_amount;
  UPDATE profiles SET points = v_balance WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, balance_after, type, description, reference_id)
  VALUES (p_user_id, p_amount, v_balance, p_type, p_description, p_reference_id);
  RETURN QUERY SELECT v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic spend points
CREATE OR REPLACE FUNCTION spend_points(
  p_user_id UUID,
  p_amount INTEGER,
  p_type TEXT,
  p_description TEXT
) RETURNS TABLE(success BOOLEAN, new_balance INTEGER) AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT points INTO v_balance FROM profiles WHERE id = p_user_id FOR UPDATE;
  v_balance := COALESCE(v_balance, 0);
  IF v_balance < p_amount THEN
    RETURN QUERY SELECT false, v_balance;
    RETURN;
  END IF;
  v_balance := v_balance - p_amount;
  UPDATE profiles SET points = v_balance WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, balance_after, type, description)
  VALUES (p_user_id, -p_amount, v_balance, p_type, p_description);
  RETURN QUERY SELECT true, v_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

- [ ] **Step 2: Show SQL in chat for user to run in Supabase dashboard**

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add supabase/migrations/20260409_points_refactor.sql
git commit -m "chore: add migration for point_transactions table and atomic RPC functions"
```

---

### Task 2: Rewrite points.ts — Supabase as single source of truth

**Files:**
- Rewrite: `src/lib/points.ts`

The new API is fully async. Every function takes `userId` as the first parameter (no more implicit auth lookup per call).

- [ ] **Step 1: Rewrite `src/lib/points.ts`**

```typescript
import { supabase } from './supabase'

// ── Types ──────────────────────────────────────────────

export interface PointTransaction {
  id: string
  amount: number
  balance_after: number
  type: string
  description: string
  reference_id: string | null
  created_at: string
}

// ── Queries ────────────────────────────────────────────

/** Get current point balance from Supabase */
export async function getPoints(userId: string): Promise<number> {
  const { data } = await supabase
    .from('profiles')
    .select('points')
    .eq('id', userId)
    .single()
  return data?.points ?? 0
}

/** Get recent transaction history */
export async function getTransactionHistory(
  userId: string,
  limit = 20
): Promise<PointTransaction[]> {
  const { data } = await supabase
    .from('point_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data ?? []) as PointTransaction[]
}

// ── Mutations (atomic via RPC) ─────────────────────────

/** Add points atomically. Returns new balance. */
export async function addPoints(
  userId: string,
  amount: number,
  type: string,
  description: string,
  referenceId?: string
): Promise<number> {
  const { data, error } = await supabase.rpc('add_points', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
    p_reference_id: referenceId ?? null,
  })
  if (error) throw new Error(`addPoints failed: ${error.message}`)
  return data?.[0]?.new_balance ?? 0
}

/** Spend points atomically. Returns success and new balance. */
export async function spendPoints(
  userId: string,
  amount: number,
  type: string,
  description: string
): Promise<{ success: boolean; balance: number }> {
  const { data, error } = await supabase.rpc('spend_points', {
    p_user_id: userId,
    p_amount: amount,
    p_type: type,
    p_description: description,
  })
  if (error) throw new Error(`spendPoints failed: ${error.message}`)
  const row = data?.[0]
  return { success: row?.success ?? false, balance: row?.new_balance ?? 0 }
}

// ── Migration helper ───────────────────────────────────

/**
 * One-time migration: move localStorage points to Supabase.
 * Called on login. After migration, clears localStorage.
 */
export async function migrateLocalPoints(userId: string): Promise<number> {
  const LEGACY_KEY = 'gto_user_points'
  const raw = localStorage.getItem(LEGACY_KEY)
  const localPoints = raw ? parseInt(raw, 10) || 0 : 0

  if (localPoints > 0) {
    const serverPoints = await getPoints(userId)
    if (localPoints > serverPoints) {
      const diff = localPoints - serverPoints
      await addPoints(userId, diff, 'admin', `從本地遷移 ${diff} 點`)
    }
  }

  localStorage.removeItem(LEGACY_KEY)
  return getPoints(userId)
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/lib/points.ts
git commit -m "feat: rewrite points.ts with Supabase as SSOT and atomic RPC"
```

---

### Task 3: Add points state to App.tsx and pass down to consumers

**Files:**
- Modify: `src/pages/App.tsx`

Currently each tab calls `getPoints()` from localStorage directly. After refactor, App.tsx holds the points state and passes it down. Tabs call a shared `refreshPoints()` to update after mutations.

- [ ] **Step 1: In App.tsx, add points state and helper**

Add after existing state declarations (around line 50):

```typescript
const [points, setPoints] = useState(0)

const refreshPoints = useCallback(async () => {
  if (!user) return
  const p = await import('../lib/points').then(m => m.getPoints(user.id))
  setPoints(p)
}, [user])
```

- [ ] **Step 2: Replace `loadPointsFromSupabase()` in `initUser`**

In the `initUser` function, replace `loadPointsFromSupabase()` with `migrateLocalPoints` + state update. Change the `Promise.all` block:

```typescript
async function initUser(userId: string) {
  const [_, __, done] = await Promise.all([
    import('../lib/points').then(m => m.migrateLocalPoints(userId)).then(p => setPoints(p)),
    loadCourseProgressFromSupabase(),
    loadOnboardingFromSupabase(userId),
  ])
  return done
}
```

Remove the `loadPointsFromSupabase` import since it no longer exists.

- [ ] **Step 3: Pass points and refreshPoints to tabs that need them**

Update the TrainTab, CourseTab, AnalysisTab, ProfileTab, TrainSetupScreen renderings to receive `points` and `refreshPoints` as props instead of calling `getPoints()` / `addPoints()` / `spendPoints()` directly. This is wired up in subsequent tasks.

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/pages/App.tsx
git commit -m "feat: add points state to App.tsx, migrate from localStorage on login"
```

---

### Task 4: Update TrainTab to use new points API

**Files:**
- Modify: `src/tabs/TrainTab.tsx`

TrainTab currently calls `addPoints(1)` synchronously on correct answer. Change to async call with userId.

- [ ] **Step 1: Read TrainTab.tsx and find all `addPoints` calls**

There are 3 calls (around lines 558, 594, 636), all in the pattern:
```typescript
setCorrect(c => c + 1); setStreak(s => s + 1); addPoints(1)
```

- [ ] **Step 2: Update import and calls**

Replace the import:
```typescript
// Old: import { addPoints } from '../lib/points'
// Remove this import
```

Add `userId` and `onPointsChanged` to the component's props interface and use them:

```typescript
// In the Props interface, add:
userId: string | null
onPointsChanged?: () => void

// Replace each `addPoints(1)` call with:
if (userId) {
  import('../lib/points').then(m => m.addPoints(userId, 1, 'training', '答題正確 +1')).then(() => onPointsChanged?.())
}
```

- [ ] **Step 3: Update App.tsx to pass userId and onPointsChanged to TrainTab**

In App.tsx where TrainTab is rendered, add:
```typescript
onPointsChanged={refreshPoints}
```

(`userId` is already passed as `userId={user?.id ?? null}`)

- [ ] **Step 4: Verify TypeScript compiles and test**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/tabs/TrainTab.tsx src/pages/App.tsx
git commit -m "feat: update TrainTab to use async addPoints with transaction log"
```

---

### Task 5: Update CourseTab to use new points API

**Files:**
- Modify: `src/tabs/CourseTab.tsx`

CourseTab uses `getPoints()` and `spendPoints(ADVANCED_COST)` for unlocking advanced courses.

- [ ] **Step 1: Read CourseTab.tsx to understand current usage**

Currently:
```typescript
import { getPoints, spendPoints } from '../lib/points'
const [points, setPoints] = useState(getPoints)
// ...
if (spendPoints(ADVANCED_COST)) { ... setPoints(getPoints()) }
```

- [ ] **Step 2: Update to receive points as prop and use async spendPoints**

Add to Props interface:
```typescript
points: number
userId: string | null
onPointsChanged?: () => void
```

Remove the local `points` state and the `getPoints` / `spendPoints` imports. Change the unlock handler to:

```typescript
const handleUnlock = async (courseId: string) => {
  if (!userId) return
  const { spendPoints } = await import('../lib/points')
  const result = await spendPoints(userId, ADVANCED_COST, 'course', `解鎖課程 ${courseId}`)
  if (result.success) {
    // unlock course logic
    onPointsChanged?.()
  }
}
```

- [ ] **Step 3: Update App.tsx to pass props to CourseTab**

```typescript
{tab === 'course' && <CourseTab points={points} userId={user?.id ?? null} onPointsChanged={refreshPoints} />}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/tabs/CourseTab.tsx src/pages/App.tsx
git commit -m "feat: update CourseTab to use async spendPoints"
```

---

### Task 6: Update AnalysisTab to use new points API

**Files:**
- Modify: `src/tabs/AnalysisTab.tsx`

AnalysisTab uses `getPoints()` and `spendPoints(ANALYSIS_COST)` for AI analysis.

- [ ] **Step 1: Read AnalysisTab.tsx to understand current usage**

Currently:
```typescript
import { getPoints, spendPoints } from '../lib/points'
const [points, setPoints] = useState(getPoints)
// ...
spendPoints(ANALYSIS_COST)
setPoints(getPoints())
```

- [ ] **Step 2: Update to receive points as prop and use async spendPoints**

Add to Props interface:
```typescript
points: number
onPointsChanged?: () => void
```

Remove local `points` state. Replace `spendPoints(ANALYSIS_COST)` with:

```typescript
if (userId) {
  const { spendPoints } = await import('../lib/points')
  const result = await spendPoints(userId, ANALYSIS_COST, 'analysis', 'AI 弱點分析')
  if (!result.success) { /* show insufficient points */ return }
  onPointsChanged?.()
}
```

- [ ] **Step 3: Update App.tsx to pass props to AnalysisTab**

```typescript
{tab === 'analysis' && <AnalysisTab userId={user?.id ?? null} isPaid={...} points={points} onPointsChanged={refreshPoints} />}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/tabs/AnalysisTab.tsx src/pages/App.tsx
git commit -m "feat: update AnalysisTab to use async spendPoints"
```

---

### Task 7: Update ProfileTab and TrainSetupScreen to use points prop

**Files:**
- Modify: `src/tabs/ProfileTab.tsx`
- Modify: `src/tabs/TrainSetupScreen.tsx`

Both use `getPoints()` for display only.

- [ ] **Step 1: Update ProfileTab**

Replace `import { getPoints } from '../lib/points'` → remove import. Add `points: number` to Props. Replace `getPoints()` call with `points` prop.

- [ ] **Step 2: Update TrainSetupScreen**

Replace `import { getPoints } from '../lib/points'` → remove import. Add `points: number` to Props. Replace `getPoints()` call with `points` prop.

- [ ] **Step 3: Update App.tsx to pass points to both**

ProfileTab and TrainSetupScreen need to receive `points={points}`.

For ProfileTab:
```typescript
{tab === 'profile' && <ProfileTab points={points} onPromoRedeemed={...} />}
```

For TrainSetupScreen (rendered inside TrainTab — this prop needs to be threaded through TrainTab).

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/tabs/ProfileTab.tsx src/tabs/TrainSetupScreen.tsx src/pages/App.tsx
git commit -m "feat: update ProfileTab and TrainSetupScreen to use points prop"
```

---

### Task 8: Update tests

**Files:**
- Rewrite: `src/__tests__/points.test.ts`

The old tests mock localStorage. New tests mock Supabase RPC calls.

- [ ] **Step 1: Rewrite test file**

```typescript
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRpc = vi.fn()
const mockFrom = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    rpc: mockRpc,
    from: mockFrom,
  },
}))

import { getPoints, addPoints, spendPoints, migrateLocalPoints } from '../lib/points'

describe('points system (Supabase SSOT)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('getPoints fetches from Supabase', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 42 } }),
        }),
      }),
    })
    const result = await getPoints('user-1')
    expect(result).toBe(42)
  })

  it('getPoints returns 0 when no profile', async () => {
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null }),
        }),
      }),
    })
    const result = await getPoints('user-1')
    expect(result).toBe(0)
  })

  it('addPoints calls RPC and returns new balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ new_balance: 55 }], error: null })
    const result = await addPoints('user-1', 10, 'training', '答題正確 +1')
    expect(mockRpc).toHaveBeenCalledWith('add_points', {
      p_user_id: 'user-1',
      p_amount: 10,
      p_type: 'training',
      p_description: '答題正確 +1',
      p_reference_id: null,
    })
    expect(result).toBe(55)
  })

  it('spendPoints returns success when sufficient balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ success: true, new_balance: 20 }], error: null })
    const result = await spendPoints('user-1', 30, 'analysis', 'AI 弱點分析')
    expect(result).toEqual({ success: true, balance: 20 })
  })

  it('spendPoints returns failure when insufficient balance', async () => {
    mockRpc.mockResolvedValue({ data: [{ success: false, new_balance: 10 }], error: null })
    const result = await spendPoints('user-1', 50, 'analysis', 'AI 弱點分析')
    expect(result).toEqual({ success: false, balance: 10 })
  })

  it('migrateLocalPoints moves localStorage points to Supabase', async () => {
    localStorage.setItem('gto_user_points', '100')
    // getPoints returns 30 from server
    mockFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { points: 30 } }),
        }),
      }),
    })
    // addPoints RPC
    mockRpc.mockResolvedValue({ data: [{ new_balance: 100 }], error: null })

    await migrateLocalPoints('user-1')

    // Should have called addPoints with diff (100 - 30 = 70)
    expect(mockRpc).toHaveBeenCalledWith('add_points', expect.objectContaining({
      p_amount: 70,
      p_type: 'admin',
    }))
    // localStorage should be cleared
    expect(localStorage.getItem('gto_user_points')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npm test
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add src/__tests__/points.test.ts
git commit -m "test: rewrite points tests for Supabase SSOT"
```

---

### Task 9: Clean up — remove dead code and verify full build

**Files:**
- Modify: `src/pages/App.tsx` (remove `loadPointsFromSupabase` import if not done)

- [ ] **Step 1: Grep for any remaining old points imports**

```bash
grep -r "loadPointsFromSupabase\|POINTS_KEY\|syncPointsToSupabase\|sendBeacon" src/ --include="*.ts" --include="*.tsx"
```

Expected: No results (all old code removed).

- [ ] **Step 2: Full TypeScript check**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npx tsc --noEmit
```

- [ ] **Step 3: Run tests**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npm test
```

Expected: All tests pass.

- [ ] **Step 4: Build**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer && npm run build
```

Expected: Build succeeds.

- [ ] **Step 5: Commit any remaining cleanup**

```bash
cd /c/Users/User/Desktop/gto-poker-trainer
git add -A
git commit -m "chore: clean up old localStorage points code"
```
