import { describe, it, expect, beforeAll } from 'vitest'
import { createMatch, dealNewHand, applyAction, resolveHand } from '../../lib/hu/engine'
import { decideBotAction, preloadBotData } from '../../lib/hu/botAI'
import type { MatchConfig } from '../../lib/hu/types'

describe('HU engine + bot AI integration', () => {
  beforeAll(async () => {
    await preloadBotData()
  })

  const config: MatchConfig = {
    totalStackBB: 80, stackRatio: '1:1', playerSide: 'equal', sbBB: 0.5, bbBB: 1,
  }

  it('plays a full hand without crashing (bot vs bot)', () => {
    let m = createMatch(config)
    m = dealNewHand(m)

    let safetyCounter = 0
    while (m.currentHand && !m.currentHand.isComplete && safetyCounter < 100) {
      const action = decideBotAction(m.currentHand, config, 'standard')
      m = applyAction(m, action)
      safetyCounter++
    }

    expect(safetyCounter).toBeLessThan(100)  // didn't loop infinitely
    expect(m.currentHand).not.toBeNull()
    expect(m.currentHand!.isComplete).toBe(true)
  })

  it('plays multiple hands until one player busts', () => {
    // Small total stack so it busts within reasonable hands
    let m = createMatch({ ...config, totalStackBB: 10 })
    let outerSafety = 0

    while (m.result === 'in_progress' && outerSafety < 200) {
      m = dealNewHand(m)
      let innerSafety = 0
      while (m.currentHand && !m.currentHand.isComplete && innerSafety < 100) {
        const a = decideBotAction(m.currentHand, config, 'standard')
        m = applyAction(m, a)
        innerSafety++
      }
      m = resolveHand(m)
      outerSafety++
    }
    expect(['player_won', 'player_lost']).toContain(m.result)
    expect(outerSafety).toBeLessThan(200)
  })

  it('hand history grows as hands are played', () => {
    let m = createMatch({ ...config, totalStackBB: 10 })
    m = dealNewHand(m)
    while (m.currentHand && !m.currentHand.isComplete) {
      const a = decideBotAction(m.currentHand, config, 'standard')
      m = applyAction(m, a)
    }
    m = resolveHand(m)
    expect(m.handHistory).toHaveLength(1)
  })

  it('different personalities all complete hands without errors', () => {
    for (const personality of ['standard', 'rock', 'aggressive'] as const) {
      let m = createMatch(config)
      m = dealNewHand(m)
      let safety = 0
      while (m.currentHand && !m.currentHand.isComplete && safety < 100) {
        const a = decideBotAction(m.currentHand, config, personality)
        m = applyAction(m, a)
        safety++
      }
      expect(m.currentHand!.isComplete).toBe(true)
    }
  })
})
