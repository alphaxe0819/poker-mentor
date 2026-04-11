// src/lib/hu/types.ts

// ── Cards ────────────────────────────────────────
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'
export type Suit = 'c' | 'd' | 'h' | 's'

export interface Card {
  rank: Rank
  suit: Suit
}

export type Deck = Card[]

// ── Game state ───────────────────────────────────
export type Street = 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'
export type Position = 'btn' | 'bb'  // HU: BTN/SB vs BB

export type ActionKind =
  | 'fold' | 'check' | 'call'
  | 'bet' | 'raise' | 'allin'

export interface Action {
  kind: ActionKind
  /** Total chips put into pot for bet/raise/call/allin (in BB) */
  amount?: number
  /** Who took this action */
  actor: Position
  /** Which street */
  street: Street
}

export interface PlayerState {
  position: Position
  stackBB: number
  holeCards: [Card, Card]
  /** Total chips committed to current pot this hand */
  committedBB: number
  /** Current street commitment (for pot odds calc) */
  streetCommitBB: number
  isAllIn: boolean
  hasFolded: boolean
}

export interface HandState {
  handNumber: number
  street: Street
  board: Card[]                  // 0/3/4/5 cards
  potBB: number
  hero: PlayerState
  villain: PlayerState
  /** Whose turn to act */
  toAct: Position
  /** Current bet to match this street */
  currentBetBB: number
  /** Current min raise amount this street */
  minRaiseBB: number
  /** Action history this hand */
  actions: Action[]
  /** True when hand is over (showdown / fold) */
  isComplete: boolean
}

export type StackRatio = '1:5' | '1:2' | '1:1' | '2:1' | '5:1'

export interface MatchConfig {
  totalStackBB: number  // 80 for v1.0
  stackRatio: StackRatio
  /** Which side does the player take */
  playerSide: 'short' | 'big' | 'equal'
  sbBB: number  // 0.5
  bbBB: number  // 1
}

export interface MatchState {
  config: MatchConfig
  /** All hands played in this match */
  handHistory: HandState[]
  /** Current hand in progress */
  currentHand: HandState | null
  /** Cumulative stacks for both seats */
  playerStackBB: number
  botStackBB: number
  /** Match-level result (after one player busts) */
  result: 'in_progress' | 'player_won' | 'player_lost'
  /** Total points spent on AI analysis during match */
  analysisPointsSpent: number
  /** Total violation points charged */
  violationPoints: number
}
