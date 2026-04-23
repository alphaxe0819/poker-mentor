import { ALL_HANDS } from '../gto/helpers'
import { findBaselineRange, handScore, baselinePctFor } from './baseline'
import { RANGE_KEYS, parsePosition, parseAction, type RangeKey, type VillainProfile } from './types'
import { POSITION_LABEL, ACTION_LABEL } from './ranges'

interface TagResult {
  tag: string
  showDiff: boolean
}

function tagDiff(diff: number): TagResult {
  const abs = Math.abs(diff)
  if (abs < 2) return { tag: '標準', showDiff: false }
  if (diff > 0) {
    return { tag: diff >= 6 ? `鬆 +${diff}%` : `偏鬆 +${diff}%`, showDiff: false }
  }
  return { tag: diff <= -6 ? `緊 ${diff}%` : `偏緊 ${diff}%`, showDiff: false }
}

function diffHands(villainGrid: number[], baselineGrid: number[]): { extra: string[]; missing: string[] } {
  const extra: string[] = []
  const missing: string[] = []
  for (let i = 0; i < 169; i++) {
    if (villainGrid[i] === 1 && baselineGrid[i] === 0) extra.push(ALL_HANDS[i])
    else if (villainGrid[i] === 0 && baselineGrid[i] === 1) missing.push(ALL_HANDS[i])
  }
  extra.sort((a, b) => handScore(b) - handScore(a))
  missing.sort((a, b) => handScore(b) - handScore(a))
  return { extra: extra.slice(0, 3), missing: missing.slice(0, 3) }
}

function lineFor(rangeKey: RangeKey, profile: VillainProfile): string {
  const data = profile.ranges[rangeKey]
  const gtoPct = baselinePctFor(rangeKey)
  const baselineGrid = findBaselineRange(rangeKey, gtoPct)
  const diff = Math.round(data.totalPct - gtoPct)
  const { tag } = tagDiff(diff)

  const pos = POSITION_LABEL[parsePosition(rangeKey)]
  const act = ACTION_LABEL[parseAction(rangeKey)]

  let line = `- ${pos} ${act}: ${data.totalPct}%（GTO ${gtoPct}%, ${tag}`
  if (Math.abs(diff) >= 2) {
    const { extra, missing } = diffHands(data.grid, baselineGrid)
    if (diff > 0 && extra.length > 0) line += `, 多開 ${extra.join('/')}`
    if (diff < 0 && missing.length > 0) line += `, 少開 ${missing.join('/')}`
  }
  line += '）'
  return line
}

const BLOCKS: Array<{ title: string; keys: RangeKey[] }> = [
  { title: '翻前 open', keys: ['EP_RAISE', 'MP_RAISE', 'LP_RAISE', 'BL_RAISE'] },
  { title: '跟注（vs open）', keys: ['MP_CALL', 'LP_CALL', 'BL_CALL'] },
  { title: '3-bet（face open）', keys: ['MP_3BET', 'LP_3BET', 'BL_3BET'] },
  {
    title: '面對 3-bet',
    keys: [
      'EP_CALL_3BET', 'EP_4BET',
      'MP_CALL_3BET', 'MP_4BET',
      'LP_CALL_3BET', 'LP_4BET',
      'BL_CALL_3BET', 'BL_4BET',
    ],
  },
  { title: '面對 4-bet', keys: ['MP_CALL_4BET', 'LP_CALL_4BET', 'BL_CALL_4BET'] },
]

export function summarizeVillainProfile(profile: VillainProfile): string {
  const lines: string[] = []
  lines.push(`對手 ${profile.name} 的 villain profile（21 range summary）：`)
  for (const block of BLOCKS) {
    lines.push('')
    lines.push(`【${block.title}】`)
    for (const key of block.keys) {
      if (!profile.ranges[key]) continue
      lines.push(lineFor(key, profile))
    }
  }
  return lines.join('\n')
}

export function isValidProfile(p: unknown): p is VillainProfile {
  if (!p || typeof p !== 'object') return false
  const v = p as Partial<VillainProfile>
  if (v.version !== 'v2') return false
  if (!v.ranges) return false
  for (const k of RANGE_KEYS) {
    const r = v.ranges[k]
    if (!r || typeof r.totalPct !== 'number' || !Array.isArray(r.grid) || r.grid.length !== 169) return false
  }
  return true
}
