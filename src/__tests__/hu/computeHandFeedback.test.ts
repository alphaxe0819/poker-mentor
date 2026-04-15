import { describe, it, expect } from 'vitest'
import { computeHandFeedback } from '../../components/v2/HeadsUpMatchScreenV2'
import type { HandState } from '../../lib/hu/types'

const makeHand = (overrides: Partial<HandState> = {}): HandState => ({
  handNumber: 1,
  street: 'preflop',
  board: [],
  potBB: 2,
  toAct: 'btn',
  currentBetBB: 1,
  minRaiseBB: 2,
  actions: [],
  isComplete: true,
  hero: {
    position: 'btn',
    stackBB: 39,
    holeCards: [{ rank: 'A', suit: 's' }, { rank: 'K', suit: 's' }],
    committedBB: 1,
    streetCommitBB: 0.5,
    isAllIn: false,
    hasFolded: false,
  },
  villain: {
    position: 'bb',
    stackBB: 39,
    holeCards: [{ rank: '2', suit: 'c' }, { rank: '7', suit: 'd' }],
    committedBB: 1,
    streetCommitBB: 1,
    isAllIn: false,
    hasFolded: false,
  },
  ...overrides,
})

describe('computeHandFeedback', () => {
  it('tip contains canonical hand + position', () => {
    const hand = makeHand()
    const fb = computeHandFeedback(hand)
    expect(fb.tip).toBe('AKs · BTN')
  })

  it('all 4 streets are pending', () => {
    const fb = computeHandFeedback(makeHand())
    expect(fb.streets).toHaveLength(4)
    fb.streets.forEach(s => expect(s.state).toBe('pending'))
  })

  it('isCorrect is always true', () => {
    expect(computeHandFeedback(makeHand()).isCorrect).toBe(true)
  })

  it('shows preflop action label when present', () => {
    const hand = makeHand({
      actions: [{ kind: 'raise', amount: 2.5, actor: 'btn', street: 'preflop' }],
    })
    const fb = computeHandFeedback(hand)
    expect(fb.actions[0].label).toBe('Raise 2.5')
  })

  it('shows 未行動 when no preflop action', () => {
    const fb = computeHandFeedback(makeHand({ actions: [] }))
    expect(fb.actions[0].label).toBe('未行動')
  })

  it('actions has exactly one item at 100%', () => {
    const fb = computeHandFeedback(makeHand())
    expect(fb.actions).toHaveLength(1)
    expect(fb.actions[0].freq).toBe(100)
    expect(fb.actions[0].isYours).toBe(true)
  })
})
