// ─── Auth & User ────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  email: string
  name: string
  is_coach: boolean
  created_at: string
}

export type AuthMode = 'login' | 'register' | 'otp'

// ─── GTO / Range ─────────────────────────────────────────────────────────────

export type GameType = 'cash' | 'tournament'
export type TableType = '6max' | '9max' | '4max' | 'hu'

export type Action = 'raise' | 'call' | 'fold'

export interface MixedFreq {
  raise: number  // 0-100
  call: number
  fold: number
}

/** Each hand combo stores either a single action or mixed frequencies */
export interface HandData {
  action: Action
  mixed?: MixedFreq
  ev?: number
}

/** Key: e.g. "AKs", "72o", "AA" */
export type RangeMap = Record<string, HandData>

export interface Scenario {
  id: string
  name: string
  position: Position
  coachSource: string
  description?: string
  range?: RangeMap
  gameType?: GameType
  tableType?: TableType
  gtoScenario?: string
}

export type Position = 'UTG' | 'UTG+1' | 'UTG+2' | 'LJ' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB'

export type Street = 'preflop' | 'flop' | 'turn' | 'river'  // postflop reserved

// ─── Coach ────────────────────────────────────────────────────────────────────

export interface CoachSource {
  id: string
  name: string
  description: string
  avatar?: string
  isDemo?: boolean
}

// ─── Training Session ────────────────────────────────────────────────────────

export interface TrainSession {
  scenarioId: string
  hand: string       // e.g. "AKs"
  userAction: Action
  correctAction: Action
  isCorrect: boolean
  timestamp: number
  score?: number     // 0, 0.5, or 1 for multi-step scoring
}

export interface SessionStats {
  total: number
  correct: number
  accuracy: number
  byPosition: Partial<Record<Position, { total: number; correct: number }>>
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export type TabId = 'train' | 'coaches' | 'stats' | 'quiz' | 'editor' | 'profile'

// ─── Supabase ─────────────────────────────────────────────────────────────────

export interface CoachCodeRow {
  code: string
  used_by: string | null
  used_at: string | null
  created_at: string
}
