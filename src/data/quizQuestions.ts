// ── Types ──────────────────────────────────────────────

export interface DimensionScores {
  aggression: number
  position: number
  discipline: number
  potControl: number
  tiltResistance: number
}

export interface QuizOption {
  label: string
  isGTO?: boolean
  dims: Partial<DimensionScores>
}

export interface QuizQuestion {
  type: 'scenario' | 'preference'
  prompt: string
  hand?: string
  heroPos?: string
  options: QuizOption[]
}

export type StyleType = 'shark' | 'fox' | 'rock' | 'octopus'
export type LevelType = 'beginner' | 'novice' | 'intermediate' | 'advanced'

export interface QuizResult {
  style: StyleType
  level: LevelType
  dimensions: DimensionScores
  gtoCorrect: number
  completedAt: string
}

// ── Style metadata ─────────────────────────────────────

export const STYLE_META: Record<StyleType, {
  emoji: string
  name: string
  tag: string
  description: string
  tips: string[]
}> = {
  shark: {
    emoji: '🦈',
    name: '鯊魚型',
    tag: 'TAG (Tight-Aggressive)',
    description: '你是牌桌上的獵食者。選牌嚴格、出手果斷，總是在最好的時機給對手致命一擊。你的風格最接近 GTO 理論的核心思維——用紀律創造優勢，用攻擊性兌現利潤。',
    tips: [
      '繼續保持你的紀律性，這是最大的優勢',
      '可以適當增加一些詐唬頻率，讓對手更難讀你',
      '學習在有利位置適度放寬範圍',
    ],
  },
  fox: {
    emoji: '🦊',
    name: '狐狸型',
    tag: 'LAG (Loose-Aggressive)',
    description: '你是牌桌上最難對付的類型。參與度高、攻擊性強，善於在各種情境中製造壓力。你的創造力和膽識讓對手難以預測你的下一步行動。',
    tips: [
      '你的攻擊性是雙刃劍，注意在不利位置收緊範圍',
      '加強對手牌範圍的判讀，讓攻擊更精準',
      '學習適時踩煞車，不是每個底池都需要爭奪',
    ],
  },
  rock: {
    emoji: '🪨',
    name: '岩石型',
    tag: 'Rock (Tight-Passive)',
    description: '你是牌桌上的堡壘。耐心等待好機會，不輕易冒險。你的穩定性讓你很少犯大錯，但對手也容易讀透你的策略——當你下注時，大家都知道你有好牌。',
    tips: [
      '嘗試在有利位置增加攻擊頻率',
      '加入適當的詐唬，讓對手無法輕易棄牌面對你的下注',
      '學習利用位置優勢，不只依賴手牌強度',
    ],
  },
  octopus: {
    emoji: '🐙',
    name: '章魚型',
    tag: 'Calling Station (Loose-Passive)',
    description: '你是牌桌上的探險家。好奇心旺盛，喜歡看到更多的牌，享受撲克帶來的刺激感。你的存在讓牌桌更有趣，而你需要的是把這份熱情轉化為更有策略的打法。',
    tips: [
      '學習在翻前收緊手牌範圍，品質重於數量',
      '把「跟注」的習慣轉換為「加注或棄牌」的思維',
      '從位置概念開始學起，位置是免費的優勢',
    ],
  },
}

export const LEVEL_META: Record<LevelType, { label: string }> = {
  beginner:     { label: '撲克新星' },
  novice:       { label: '潛力玩家' },
  intermediate: { label: '策略好手' },
  advanced:     { label: 'GTO 思維者' },
}

// ── Questions ──────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。你在 BTN，UTG 棄牌、HJ 棄牌、CO 棄牌，輪到你行動。',
    hand: 'AJo',
    heroPos: 'BTN',
    options: [
      { label: '棄牌', dims: { discipline: 15, aggression: -10 } },
      { label: '跟注大盲', dims: { potControl: 10 } },
      { label: '加注到 2.5BB', isGTO: true, dims: { aggression: 10, position: 10, discipline: 5 } },
      { label: '加注到 5BB', dims: { aggression: 15 } },
    ],
  },
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。CO 加注到 3BB，BTN 棄牌、SB 棄牌，你在 BB。',
    hand: '87s',
    heroPos: 'BB',
    options: [
      { label: '棄牌', dims: { discipline: 15 } },
      { label: '跟注', isGTO: true, dims: { potControl: 10, discipline: 5 } },
      { label: '3-Bet 到 10BB', dims: { aggression: 15 } },
      { label: '全下 100BB', dims: { aggression: 20, tiltResistance: -10 } },
    ],
  },
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。翻前你在 CO 加注到 2.5BB，只有 BB 跟注。底池 5.5BB。\n翻牌：K♠ 7♦ 2♣（彩虹面），BB 過牌，輪到你。',
    hand: 'AQo',
    heroPos: 'CO',
    options: [
      { label: '過牌', dims: { potControl: 15 } },
      { label: '下注 1/3 底池（約 2BB）', isGTO: true, dims: { aggression: 5, potControl: 10 } },
      { label: '下注 3/4 底池（約 4BB）', dims: { aggression: 10 } },
      { label: '全下', dims: { aggression: 20, tiltResistance: -5 } },
    ],
  },
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。你在 UTG（最早位置），後面還有 5 位玩家等待行動。',
    hand: 'KTo',
    heroPos: 'UTG',
    options: [
      { label: '棄牌', isGTO: true, dims: { discipline: 15, position: 10 } },
      { label: '跟注大盲（limp）', dims: { potControl: 5 } },
      { label: '加注到 2.5BB', dims: { aggression: 10 } },
      { label: '加注到 4BB', dims: { aggression: 15, discipline: -5 } },
    ],
  },
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。你在 HJ 加注到 2.5BB，CO 和 SB 棄牌，BTN 3-Bet 到 9BB，BB 棄牌，輪回到你。',
    hand: 'TTs',
    heroPos: 'HJ',
    options: [
      { label: '棄牌', dims: { discipline: 10, tiltResistance: 5 } },
      { label: '跟注', isGTO: true, dims: { potControl: 10, discipline: 5 } },
      { label: '4-Bet 到 22BB', dims: { aggression: 15 } },
      { label: '全下 100BB', dims: { aggression: 20, tiltResistance: -5 } },
    ],
  },
  {
    type: 'scenario',
    prompt: '6-max 現金桌，100BB 深籌。翻前你在 BTN 加注，BB 跟注。\n翻牌 A♠ 8♦ 3♣ → 雙方過牌。轉牌 5♠ → 雙方過牌。\n河牌 J♠（第三張黑桃），BB 下注 20BB（底池約 30BB）。你沒有黑桃。',
    hand: 'AKo',
    heroPos: 'BTN',
    options: [
      { label: '棄牌', isGTO: true, dims: { discipline: 15, potControl: 10 } },
      { label: '跟注', dims: { potControl: 5, tiltResistance: 5 } },
      { label: '加注到 50BB', dims: { aggression: 20, tiltResistance: -10 } },
      { label: '全下', dims: { aggression: 25, tiltResistance: -15 } },
    ],
  },
  {
    type: 'preference',
    prompt: '你比較喜歡拿到哪種手牌？',
    options: [
      { label: 'A♠ A♦ 一對大 Ace', dims: { discipline: 15, potControl: 5 } },
      { label: '7♠ 6♠ 同花連張', dims: { aggression: 10, position: 5 } },
      { label: 'K♠ Q♦ 大高牌', dims: { discipline: 5, potControl: 10 } },
      { label: '什麼牌都能打，看情況', dims: { aggression: 5, discipline: -10 } },
    ],
  },
  {
    type: 'preference',
    prompt: '連輸 5 手牌後，你通常會？',
    options: [
      { label: '收緊範圍，等好牌再出手', dims: { discipline: 15, tiltResistance: 10 } },
      { label: '維持原本策略不變', dims: { tiltResistance: 15 } },
      { label: '放寬範圍，積極找機會反擊', dims: { aggression: 15, tiltResistance: -5 } },
      { label: '可能會有點衝動，想把輸的贏回來', dims: { aggression: 10, tiltResistance: -15 } },
    ],
  },
  {
    type: 'preference',
    prompt: '選桌位時，你最在意什麼？',
    options: [
      { label: '我要坐在魚（弱玩家）的左邊', dims: { position: 20 } },
      { label: '離莊家位越近越好', dims: { position: 15 } },
      { label: '無所謂，牌好就會贏', dims: { position: -10, discipline: 5 } },
      { label: '我沒特別想過桌位的問題', dims: { position: -5 } },
    ],
  },
  {
    type: 'preference',
    prompt: '拿到中等牌力（如中對子），你的策略傾向是？',
    options: [
      { label: '小注控池，盡量便宜看到攤牌', dims: { potControl: 20 } },
      { label: '看情況，對手弱就下注，強就過牌', dims: { potControl: 10, position: 10 } },
      { label: '積極下注，不讓對手免費看牌', dims: { aggression: 15 } },
      { label: '通常直接棄牌，不想冒險', dims: { discipline: 15, tiltResistance: 5 } },
    ],
  },
]

// ── Scoring ────────────────────────────────────────────

const INITIAL_SCORE = 50

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

export function computeQuizResult(answers: number[]): QuizResult {
  const dims: DimensionScores = {
    aggression: INITIAL_SCORE,
    position: INITIAL_SCORE,
    discipline: INITIAL_SCORE,
    potControl: INITIAL_SCORE,
    tiltResistance: INITIAL_SCORE,
  }

  let gtoCorrect = 0

  answers.forEach((chosenIdx, qIdx) => {
    const q = QUIZ_QUESTIONS[qIdx]
    const opt = q.options[chosenIdx]
    if (!opt) return

    for (const [key, val] of Object.entries(opt.dims)) {
      dims[key as keyof DimensionScores] += val
    }

    if (q.type === 'scenario' && opt.isGTO) {
      gtoCorrect++
    }
  })

  for (const key of Object.keys(dims) as (keyof DimensionScores)[]) {
    dims[key] = clamp(dims[key], 0, 100)
  }

  const tight = dims.discipline >= 50
  const aggressive = dims.aggression >= 50
  let style: StyleType
  if (tight && aggressive) style = 'shark'
  else if (!tight && aggressive) style = 'fox'
  else if (tight && !aggressive) style = 'rock'
  else style = 'octopus'

  let level: LevelType
  if (gtoCorrect <= 1) level = 'beginner'
  else if (gtoCorrect <= 3) level = 'novice'
  else if (gtoCorrect <= 5) level = 'intermediate'
  else level = 'advanced'

  return {
    style,
    level,
    dimensions: dims,
    gtoCorrect,
    completedAt: new Date().toISOString(),
  }
}

export function saveQuizResultLocal(result: QuizResult): void {
  localStorage.setItem('poker-mbti-result', JSON.stringify(result))
}

export function loadQuizResultLocal(): QuizResult | null {
  const raw = localStorage.getItem('poker-mbti-result')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function clearQuizResultLocal(): void {
  localStorage.removeItem('poker-mbti-result')
}
