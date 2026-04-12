// src/lib/hu/analyzeHand.ts
import { supabase } from '../supabase'

export interface AnalyzeHandParams {
  userId: string
  sessionId: string
  handIndex: number
  handData: {
    hero_position: string
    hero_cards: string
    villain_cards: string | null
    board: string | null
    action_sequence: unknown[]
    pot_total_bb: number
    hero_won: boolean
  }
}

export interface AnalyzeHandResult {
  analysis: string
  newBalance: number
}

/**
 * Call the analyze-hu-hand Edge Function.
 * The Edge Function charges 3 points, calls Claude Haiku, and returns
 * the analysis text. Throws on failure (network error, 402 insufficient
 * points, 500 server error, etc).
 */
export async function analyzeHand(params: AnalyzeHandParams): Promise<AnalyzeHandResult> {
  const { data, error } = await supabase.functions.invoke('analyze-hu-hand', {
    body: {
      user_id: params.userId,
      session_id: params.sessionId,
      hand_index: params.handIndex,
      hand_data: params.handData,
    },
  })
  if (error) throw new Error(`analyzeHand failed: ${error.message}`)
  if (data?.error) throw new Error(data.error)
  if (!data?.analysis) throw new Error('analyzeHand returned no analysis')
  return data as AnalyzeHandResult
}
