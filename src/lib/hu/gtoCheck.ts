// src/lib/hu/gtoCheck.ts
// Detect preflop non-GTO decisions by the player.
//
// A "violation" is when the player makes an action that the GTO chart
// assigns 0% frequency to in the current scenario. Mixed-strategy codes
// (mr:N, mix_3b:N) allow both listed actions, so either choice is valid.
//
// Only preflop violations are tracked (per spec §非 GTO 決策處理) — postflop
// is intentionally unchecked because the data coverage is incomplete.

import type { HandState, Position } from './types'
import { handToCanonical } from './handToCanonical'
import { getGTOAction } from '../gto/getGTOAction'

/**
 * Map player action kind to whether it is compatible with the GTO recommendation.
 * getGTOAction returns normalised action codes: 'r','c','f','3b','4b','allin','mixed','mixed_3b'.
 */
function playerActionMatchesGTO(
  playerKind: string,
  gtoAction: string
): boolean {
  // Mixed strategies: both listed outcomes are valid
  if (gtoAction === 'mixed') {
    // mr:N = N% raise / 100-N% fold — either is fine
    return playerKind === 'raise' || playerKind === 'fold' || playerKind === 'allin'
  }
  if (gtoAction === 'mixed_3b') {
    // mix_3b:N = N% 3bet / 100-N% call — either is fine
    return playerKind === 'raise' || playerKind === 'call' || playerKind === 'allin'
  }

  // Single-action GTO recommendation
  if (gtoAction === 'r' || gtoAction === '3b' || gtoAction === '4b') {
    return playerKind === 'raise' || playerKind === 'allin'
  }
  if (gtoAction === 'c') return playerKind === 'call'
  if (gtoAction === 'f') return playerKind === 'fold'
  if (gtoAction === 'allin') return playerKind === 'allin' || playerKind === 'raise'

  // Unrecognised code → GTO effectively says fold (hand not in range)
  return playerKind === 'fold'
}

/**
 * Determine the preflop scenario name from the action history, mirroring
 * the logic in botAI.ts `preflopScenarioFromActions`. Kept as a local copy
 * to avoid circular imports.
 */
function preflopScenarioFromActions(hand: HandState, actorPos: Position): string {
  const preflop = hand.actions.filter(a => a.street === 'preflop')
  const raises = preflop.filter(a => a.kind === 'raise' || a.kind === 'bet').length

  if (actorPos === 'btn') {
    if (raises === 0) return 'RFI'
    if (raises === 1) return 'vs_BB_3bet'
    if (raises === 2) return 'vs_BB_5bet'
  } else {
    if (raises === 1) return 'vs_SB_open'
    if (raises === 2) return 'vs_SB_4bet'
  }
  return 'RFI'
}

/**
 * Check whether the player's intended preflop action is a GTO violation.
 * Returns true if the action is NOT allowed by the current GTO range.
 *
 * @param hand       Current hand state (must still be in preflop)
 * @param actorPos   The player's position (btn or bb)
 * @param actionKind The player's chosen action: 'fold'|'check'|'call'|'raise'|'bet'|'allin'
 */
export function isPreflopViolation(
  hand: HandState,
  actorPos: Position,
  actionKind: string
): boolean {
  if (hand.street !== 'preflop') return false

  const player = actorPos === hand.hero.position ? hand.hero : hand.villain
  const handClass = handToCanonical(player.holeCards)
  const scenario = preflopScenarioFromActions(hand, actorPos)

  // Effective stack for GTO lookup (mirrors botAI.ts logic)
  const stackBB = player.stackBB + player.streetCommitBB
  const positionLabel = actorPos === 'btn' ? 'SB' : 'BB'

  const result = getGTOAction(handClass, 'tournament', 'hu', stackBB, positionLabel, scenario)

  // Preflop: treat 'check' as 'fold' for violation purposes
  // (BB checking a limp is rare and we treat as no-violation since fold and check
  // are both non-aggressive responses to no open — this edge case is safe to skip)
  const effectiveKind = actionKind === 'check' ? 'fold' : actionKind

  return !playerActionMatchesGTO(effectiveKind, result.action)
}
