import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

/** True when the env vars are placeholders → run in Demo/localStorage mode */
export const isDemoMode =
  !supabaseUrl ||
  supabaseUrl.includes('YOUR_PROJECT') ||
  !supabaseAnonKey ||
  supabaseAnonKey.includes('YOUR_')

export const supabase = isDemoMode
  ? null
  : createClient(supabaseUrl, supabaseAnonKey)

// ─── Database helpers ────────────────────────────────────────────────────────

export type Tables = {
  profiles: {
    id: string
    email: string
    name: string
    is_coach: boolean
    created_at: string
  }
  coach_codes: {
    code: string
    used_by: string | null
    used_at: string | null
    created_at: string
  }
  training_records: {
    id: string
    user_id: string
    position: string
    hand: string
    action_taken: string
    correct_action: string
    is_correct: boolean
    stack_bb: number
    coach_id: string | null
    created_at: string
  }
}
