// src/lib/hu/sessionStorage.ts
import { supabase } from '../supabase'
import type { MatchState, HandState, MatchConfig } from './types'
import { formatCard, formatBoard } from './cards'

export interface StoredSessionId { id: string }

/** Create a new tournament session row, returns the new session ID */
export async function createSession(
  userId: string,
  config: MatchConfig,
  entryCost: number
): Promise<StoredSessionId> {
  const { data, error } = await supabase
    .from('tournament_sessions')
    .insert({
      user_id: userId,
      scenario: 'hu',
      stack_ratio: config.stackRatio,
      entry_cost: entryCost,
      start_stack_bb: Math.round(config.totalStackBB / 2),
    })
    .select('id')
    .single()
  if (error) throw new Error(`createSession failed: ${error.message}`)
  return { id: data.id as string }
}

/** Append one hand record to an active session */
export async function logHand(
  sessionId: string,
  hand: HandState,
  heroStackBefore: number,
  heroStackAfter: number,
  heroWon: boolean,
  gtoFlags: Array<{ street: string; actor: string; pass: boolean }>
): Promise<void> {
  const bothShown = hand.isComplete && !hand.hero.hasFolded && !hand.villain.hasFolded

  const { error } = await supabase
    .from('tournament_hands')
    .insert({
      session_id: sessionId,
      hand_number: hand.handNumber,
      hero_position: hand.hero.position,
      hero_cards: hand.hero.holeCards.map(formatCard).join(''),
      villain_cards: bothShown ? hand.villain.holeCards.map(formatCard).join('') : null,
      board: hand.board.length > 0 ? formatBoard(hand.board) : null,
      action_sequence: hand.actions,
      pot_total_bb: Math.round(hand.potBB),
      hero_stack_before: heroStackBefore,
      hero_stack_after: heroStackAfter,
      hero_won: heroWon,
      gto_flags: gtoFlags,
    })
  if (error) throw new Error(`logHand failed: ${error.message}`)
}

/** Mark session as ended with final result + stats */
export async function finalizeSession(
  sessionId: string,
  match: MatchState
): Promise<void> {
  const resultLabel =
    match.result === 'player_won' ? 'win'
    : match.result === 'player_lost' ? 'lose'
    : 'abandoned'

  const { error } = await supabase
    .from('tournament_sessions')
    .update({
      result: resultLabel,
      total_hands: match.handHistory.length,
      violation_points: match.violationPoints,
      analysis_points: match.analysisPointsSpent,
      ended_at: new Date().toISOString(),
    })
    .eq('id', sessionId)
  if (error) throw new Error(`finalizeSession failed: ${error.message}`)
}

/** Trigger retention cleanup for the user (called after session insert) */
export async function runRetentionCleanup(userId: string): Promise<void> {
  const { error } = await supabase.rpc('cleanup_tournament_sessions', { p_user_id: userId })
  if (error) console.warn('Retention cleanup failed (non-fatal):', error.message)
}

/** Fetch session list for a user (most recent first) */
export async function fetchSessions(userId: string, limit = 30) {
  const { data, error } = await supabase
    .from('tournament_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(`fetchSessions failed: ${error.message}`)
  return data
}

/** Fetch all hands for a session in order */
export async function fetchHands(sessionId: string) {
  const { data, error } = await supabase
    .from('tournament_hands')
    .select('*')
    .eq('session_id', sessionId)
    .order('hand_number', { ascending: true })
  if (error) throw new Error(`fetchHands failed: ${error.message}`)
  return data
}
