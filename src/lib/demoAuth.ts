/**
 * Demo mode authentication system backed by localStorage.
 * Used when Supabase env vars are placeholders (YOUR_PROJECT_URL).
 */

import type { Profile } from '../types'

const STORAGE_KEYS = {
  USER: 'gto_demo_user',
  USERS_DB: 'gto_demo_users_db',
} as const

const DEMO_COACH_CODES = ['COACH-DEMO1', 'COACH-ALPHA', 'COACH-BETA']

// ─── Built-in test accounts (hardcoded, no localStorage needed) ─────────────

const BUILTIN_ACCOUNTS: Record<string, { name: string; pw: string; is_coach: boolean }> = {
  'student@demo.com': { name: '測試學員', pw: 'demo1234', is_coach: false },
  'coach@demo.com':   { name: '測試教練', pw: 'demo1234', is_coach: true  },
  'master@demo.com':  { name: '測試教練', pw: 'coach1234', is_coach: true },
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface StoredUser extends Profile {
  password: string
}

type UsersDB = Record<string, StoredUser>

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDB(): UsersDB {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS_DB) ?? '{}')
  } catch {
    return {}
  }
}

function saveDB(db: UsersDB) {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(db))
}

function makeProfile(email: string, name: string, is_coach = false): Profile {
  return {
    id: `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    email,
    name,
    is_coach,
    created_at: new Date().toISOString(),
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const demoAuth = {
  /** Register a new demo user */
  async register(
    email: string,
    password: string,
    name: string,
    coachCode?: string
  ): Promise<{ profile: Profile; error?: string }> {
    const db = getDB()
    const key = email.toLowerCase()

    if (BUILTIN_ACCOUNTS[key] || db[key]) {
      return { profile: {} as Profile, error: '此 Email 已被使用' }
    }

    const is_coach = coachCode
      ? DEMO_COACH_CODES.includes(coachCode.toUpperCase())
      : false

    if (coachCode && !is_coach) {
      return { profile: {} as Profile, error: '無效的教練代碼' }
    }

    const profile = makeProfile(email, name, is_coach)
    db[key] = { ...profile, password }
    saveDB(db)
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))

    return { profile }
  },

  /** Login — check built-in accounts first, then localStorage */
  async login(
    email: string,
    password: string
  ): Promise<{ profile: Profile; error?: string }> {
    const key = email.toLowerCase()

    // 1) Built-in accounts: always available, no localStorage needed
    const builtin = BUILTIN_ACCOUNTS[key]
    if (builtin) {
      if (builtin.pw !== password) {
        return { profile: {} as Profile, error: '密碼錯誤' }
      }
      const profile = makeProfile(key, builtin.name, builtin.is_coach)
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
      return { profile }
    }

    // 2) Fall back to localStorage for user-registered accounts
    const db = getDB()
    const stored = db[key]

    if (!stored) {
      return { profile: {} as Profile, error: '找不到此帳號' }
    }
    if (stored.password !== password) {
      return { profile: {} as Profile, error: '密碼錯誤' }
    }

    const profile: Profile = {
      id: stored.id,
      email: stored.email,
      name: stored.name,
      is_coach: stored.is_coach,
      created_at: stored.created_at,
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile))
    return { profile }
  },

  /** Logout */
  async logout() {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  /** Get current session */
  getCurrentUser(): Profile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER)
      return raw ? (JSON.parse(raw) as Profile) : null
    } catch {
      return null
    }
  },

  /** Update profile name */
  async updateName(
    userId: string,
    name: string
  ): Promise<{ error?: string }> {
    const db = getDB()
    const entry = Object.values(db).find(u => u.id === userId)
    if (!entry) return { error: '找不到使用者' }
    entry.name = name
    db[entry.email.toLowerCase()] = entry

    // update current session
    const current = demoAuth.getCurrentUser()
    if (current && current.id === userId) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify({ ...current, name }))
    }
    saveDB(db)
    return {}
  },

  /** Apply a coach code to an existing account */
  async applyCoachCode(
    userId: string,
    code: string
  ): Promise<{ error?: string }> {
    if (!DEMO_COACH_CODES.includes(code.toUpperCase())) {
      return { error: '無效的教練代碼' }
    }
    const db = getDB()
    const entry = Object.values(db).find(u => u.id === userId)
    if (!entry) return { error: '找不到使用者' }
    entry.is_coach = true
    db[entry.email.toLowerCase()] = entry

    const current = demoAuth.getCurrentUser()
    if (current && current.id === userId) {
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({ ...current, is_coach: true })
      )
    }
    saveDB(db)
    return {}
  },
}

export { DEMO_COACH_CODES, BUILTIN_ACCOUNTS }
