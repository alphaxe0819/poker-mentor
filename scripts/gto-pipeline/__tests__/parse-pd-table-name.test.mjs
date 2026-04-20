/**
 * Tests for parse-pd-table-name.mjs
 *
 * Coverage:
 * - 3 task-spec example names (BB VS MP / 10bb SB Push / Live MTT Ben Adjusted - Open Raise UTG)
 * - All scenario keywords (open / 3bet / 4bet / squeeze / flat / jam / rejam / limp / multiway)
 * - All position aliases (UTG family / MP / LJ / HJ / CO / BTN / SB / BB)
 * - Depth detection (10bb / 25BB / 100bb)
 * - Modifier tags (live / icm / final-table / ben / chip-ev)
 * - Unknown bucket: empty / gibberish / depth-only
 */

import { describe, it, expect } from 'vitest'
import { parseTableName, summarizeParsing } from '../parse-pd-table-name.mjs'

describe('parseTableName — task spec examples', () => {
  it('"BB VS MP" → flat scenario, hero=BB, villain=MP', () => {
    const r = parseTableName('BB VS MP')
    expect(r.unknown).toBe(false)
    expect(r.scenario).toBe('flat')
    expect(r.hero).toBe('BB')
    expect(r.villain).toBe('MP')
    expect(r.positions).toEqual(['BB', 'MP'])
  })

  it('"10bb SB Push" → jam scenario, hero=SB, depth=10', () => {
    const r = parseTableName('10bb SB Push')
    expect(r.unknown).toBe(false)
    expect(r.scenario).toBe('jam')
    expect(r.hero).toBe('SB')
    expect(r.depth_bb).toBe(10)
  })

  it('"Live MTT Ben Adjusted - Open Raise UTG" → open scenario, hero=UTG, mtt+live+ben modifiers', () => {
    const r = parseTableName('Live MTT Ben Adjusted - Open Raise UTG')
    expect(r.unknown).toBe(false)
    expect(r.scenario).toBe('open')
    expect(r.hero).toBe('UTG')
    expect(r.format).toBe('mtt')
    expect(r.modifiers).toContain('live')
    expect(r.modifiers).toContain('ben-adjusted')
  })
})

describe('parseTableName — scenarios', () => {
  it.each([
    ['UTG Open',                     'open'],
    ['CO Openraise',                 'open'],
    ['BTN RFI',                      'open'],
    ['BB 3bet vs UTG',               '3bet'],
    ['BB 3-bet CO',                  '3bet'],
    ['BTN 4bet vs SB',               '4bet'],
    ['CO Squeeze vs UTG+1',          'squeeze'],
    ['SB Jam',                       'jam'],
    ['SB Push',                      'jam'],
    ['SB Shove',                     'jam'],
    ['SB All in',                    'jam'],
    ['BB Allin',                     'jam'],
    ['BTN Rejam vs CO',              'rejam'],
    ['SB Limp',                      'limp'],
    ['BB Defend vs BTN',             'flat'],
    ['BTN Flat vs UTG',              'flat'],
    ['CO Cold4bet vs UTG',           'cold4bet'],
    ['BB Multiway vs CO + BTN',      'multiway'],
  ])('"%s" → scenario=%s', (raw, scenario) => {
    const r = parseTableName(raw)
    expect(r.unknown).toBe(false)
    expect(r.scenario).toBe(scenario)
  })
})

describe('parseTableName — positions', () => {
  it.each([
    ['UTG Open',     'UTG'],
    ['UTG+1 Open',   'UTG+1'],
    ['UTG+2 Open',   'UTG+2'],
    ['LJ Open',      'LJ'],
    ['HJ Open',      'HJ'],
    ['CO Open',      'CO'],
    ['BTN Open',     'BTN'],
    ['BU Open',      'BTN'],     // BU alias
    ['Button Open',  'BTN'],     // Button alias
    ['Cutoff Open',  'CO'],
    ['Hijack Open',  'HJ'],
    ['MP Open',      'MP'],
    ['MP1 Open',     'MP1'],
    ['SB Push',      'SB'],
    ['BB 3bet UTG',  'BB'],
    ['EP Open',      'EP'],
  ])('"%s" → hero=%s', (raw, hero) => {
    const r = parseTableName(raw)
    expect(r.hero).toBe(hero)
  })
})

describe('parseTableName — depth detection', () => {
  it.each([
    ['10bb SB Push', 10],
    ['25BB BB Defend', 25],
    ['100bb CO Open', 100],
    ['10 bb SB Jam', 10],     // space variant
    ['BTN Open',   null],     // no depth
  ])('"%s" → depth_bb=%s', (raw, depth) => {
    expect(parseTableName(raw).depth_bb).toBe(depth)
  })
})

describe('parseTableName — modifiers + format inference', () => {
  it('"ICM Final Table - SB Jam" → mtt, icm + final-table modifiers', () => {
    const r = parseTableName('ICM Final Table - SB Jam')
    expect(r.format).toBe('mtt')
    expect(r.modifiers).toContain('icm')
    expect(r.modifiers).toContain('final-table')
    expect(r.scenario).toBe('jam')
  })

  it('"Tournament Chip EV - BTN Open" → mtt, chip-ev modifier', () => {
    const r = parseTableName('Tournament Chip EV - BTN Open')
    expect(r.format).toBe('mtt')
    expect(r.modifiers).toContain('chip-ev')
  })

  it('"6max Cash 100bb - CO Open" → format=cash, depth=100', () => {
    const r = parseTableName('6max Cash 100bb - CO Open')
    expect(r.format).toBe('cash')
    expect(r.depth_bb).toBe(100)
  })

  it('"HU 40bb BTN Open" → format=hu', () => {
    const r = parseTableName('HU 40bb BTN Open')
    expect(r.format).toBe('hu')
    expect(r.depth_bb).toBe(40)
  })
})

describe('parseTableName — unknown bucket (must NOT silently pass)', () => {
  it('empty string → unknown', () => {
    const r = parseTableName('')
    expect(r.unknown).toBe(true)
    expect(r.reason).toBeTruthy()
  })

  it('null → unknown', () => {
    const r = parseTableName(null)
    expect(r.unknown).toBe(true)
  })

  it('whitespace-only → unknown', () => {
    const r = parseTableName('   ')
    expect(r.unknown).toBe(true)
  })

  it('pure depth string "20bb" → unknown (no scenario, no position)', () => {
    const r = parseTableName('20bb')
    expect(r.unknown).toBe(true)
    expect(r.depth_bb).toBe(20)
  })

  it('gibberish → unknown', () => {
    const r = parseTableName('asdf qwerty')
    expect(r.unknown).toBe(true)
    expect(r.reason).toContain('no scenario or position')
  })

  it('positions present but no scenario verb (and no VS) → unknown with helpful reason', () => {
    const r = parseTableName('UTG BTN')
    expect(r.unknown).toBe(true)
    expect(r.reason).toContain('UTG')
  })
})

describe('parseTableName — villain extraction after "vs"', () => {
  it('"BB VS MP" → hero=BB, villain=MP (regular VS pattern)', () => {
    const r = parseTableName('BB VS MP')
    expect(r.hero).toBe('BB')
    expect(r.villain).toBe('MP')
  })

  it('"BB 3bet vs CO" → hero=BB, villain=CO (verb between hero and vs)', () => {
    const r = parseTableName('BB 3bet vs CO')
    expect(r.hero).toBe('BB')
    expect(r.villain).toBe('CO')
    expect(r.scenario).toBe('3bet')
  })

  it('"CO Squeeze vs UTG+1" → hero=CO, villain=UTG+1', () => {
    const r = parseTableName('CO Squeeze vs UTG+1')
    expect(r.hero).toBe('CO')
    expect(r.villain).toBe('UTG+1')
    expect(r.scenario).toBe('squeeze')
  })

  it('"BB Defend vs BTN 25bb" → hero=BB, villain=BTN, depth=25', () => {
    const r = parseTableName('BB Defend vs BTN 25bb')
    expect(r.hero).toBe('BB')
    expect(r.villain).toBe('BTN')
    expect(r.depth_bb).toBe(25)
  })
})

describe('summarizeParsing — aggregate report', () => {
  it('counts ok / unknown and groups by scenario', () => {
    const list = [
      parseTableName('UTG Open'),
      parseTableName('BTN Open'),
      parseTableName('SB Jam'),
      parseTableName('BB 3bet vs CO'),
      parseTableName('asdf'),               // unknown
      parseTableName(''),                   // unknown
    ]
    const sum = summarizeParsing(list)
    expect(sum.total).toBe(6)
    expect(sum.ok).toBe(4)
    expect(sum.unknown).toBe(2)
    expect(sum.byScenario.open).toBe(2)
    expect(sum.byScenario.jam).toBe(1)
    expect(sum.byScenario['3bet']).toBe(1)
    expect(sum.sampleUnknown.length).toBe(2)
  })
})
