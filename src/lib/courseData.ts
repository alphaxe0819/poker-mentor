export interface CourseQuestion {
  hand: string
  heroPos: string
  raiserPos: string | null
  raiserAction: 'raise' | 'limp' | 'allin' | null
  stackBB: number
  dbKey: string
  gameTypeKey: 'tourn_9max' | 'cash_6max' | 'cash_4max' | 'cash_hu'
}

export type CourseCategory = 'beginner' | 'advanced' | 'special'

export interface Course {
  id: string
  title: string
  description: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category: CourseCategory
  questions: CourseQuestion[]
  gameType: string
}

export const COURSES: Course[] = [
  {
    id: 'rfi-basics',
    title: '開池基礎',
    description: '學習在不同位置的開池加注策略，分辨哪些手牌該加注、哪些該棄牌。',
    icon: '🎯',
    difficulty: 'beginner',
    category: 'beginner',
    gameType: '錦標賽 9-max 100BB',
    questions: [
      { hand: 'AA',  heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'AKs', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: '72o', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'KTo', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'A9s', heroPos: 'HJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_HJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '85o', heroPos: 'HJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_HJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'QJs', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'JJ',  heroPos: 'LJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_LJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'T8s', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'K5o', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG_RFI', gameTypeKey: 'tourn_9max' },
    ],
  },
  {
    id: 'position-power',
    title: '位置的力量',
    description: '相同的手牌在不同位置該如何處理？學習位置對開池策略的影響。',
    icon: '📍',
    difficulty: 'beginner',
    category: 'beginner',
    gameType: '錦標賽 9-max 100BB',
    questions: [
      { hand: 'KTs', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'KTs', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'A9o', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'A9o', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '87s', heroPos: 'HJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_HJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '87s', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'QTo', heroPos: 'LJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_LJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'QTo', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'J9s', heroPos: 'UTG+1', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_UTG1_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'J9s', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_RFI', gameTypeKey: 'tourn_9max' },
    ],
  },
  {
    id: 'facing-raise',
    title: '面對加注',
    description: '當前位有人加注時，學習如何選擇 3-Bet、跟注或棄牌。',
    icon: '⚔️',
    difficulty: 'intermediate',
    category: 'beginner',
    gameType: '錦標賽 9-max 100BB',
    questions: [
      { hand: 'JJ',  heroPos: 'BB',  raiserPos: 'UTG', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_EP_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'AQs', heroPos: 'CO',  raiserPos: 'UTG', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_CO_vs_EP_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'KQo', heroPos: 'BTN', raiserPos: 'CO',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_vs_CO_RFI', gameTypeKey: 'tourn_9max' },
      { hand: '99',  heroPos: 'SB',  raiserPos: 'BTN', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_SB_vs_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'A5s', heroPos: 'BB',  raiserPos: 'BTN', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'T9s', heroPos: 'BB',  raiserPos: 'CO',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '76s', heroPos: 'BTN', raiserPos: 'HJ',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_vs_HJ_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'AJo', heroPos: 'HJ',  raiserPos: 'UTG', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_HJ_vs_UTG_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'KJs', heroPos: 'CO',  raiserPos: 'LJ',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_CO_vs_LJ_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '44',  heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_SB_RFI',  gameTypeKey: 'tourn_9max' },
    ],
  },
  {
    id: 'cash-6max',
    title: '現金局 6-max',
    description: '現金桌 6 人桌的開池策略，位置更少、範圍更寬。',
    icon: '💰',
    difficulty: 'intermediate',
    category: 'beginner',
    gameType: '現金局 6-max 100BB',
    questions: [
      { hand: 'AKo', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_UTG_open', gameTypeKey: 'cash_6max' },
      { hand: 'T9s', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_BTN_open', gameTypeKey: 'cash_6max' },
      { hand: 'Q8o', heroPos: 'HJ',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_HJ_open',  gameTypeKey: 'cash_6max' },
      { hand: 'A4s', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_CO_open',  gameTypeKey: 'cash_6max' },
      { hand: '55',  heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_UTG_open', gameTypeKey: 'cash_6max' },
      { hand: 'KJo', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_BTN_open', gameTypeKey: 'cash_6max' },
      { hand: 'J8s', heroPos: 'CO',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_CO_open',  gameTypeKey: 'cash_6max' },
      { hand: '97s', heroPos: 'SB',  raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_SB_open',  gameTypeKey: 'cash_6max' },
      { hand: 'A2o', heroPos: 'UTG', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_UTG_open', gameTypeKey: 'cash_6max' },
      { hand: '65s', heroPos: 'BTN', raiserPos: null, raiserAction: null, stackBB: 100, dbKey: 'cash_6max_100bb_BTN_open', gameTypeKey: 'cash_6max' },
    ],
  },
  {
    id: '3bet-strategy',
    title: '3-Bet 策略',
    description: '面對開池加注時，學習何時 3-Bet、何時跟注、何時棄牌。',
    icon: '🔥',
    difficulty: 'advanced',
    category: 'advanced',
    gameType: '錦標賽 / 現金局',
    questions: [
      { hand: 'AA',  heroPos: 'SB',  raiserPos: 'BTN', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_SB_vs_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'AKo', heroPos: 'BB',  raiserPos: 'CO',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'A5s', heroPos: 'SB',  raiserPos: 'CO',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_SB_vs_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '76s', heroPos: 'BB',  raiserPos: 'BTN', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'TT',  heroPos: 'CO',  raiserPos: 'UTG', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_CO_vs_EP_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'KQs', heroPos: 'BTN', raiserPos: 'HJ',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BTN_vs_HJ_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'ATo', heroPos: 'SB',  raiserPos: 'UTG', raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_SB_vs_EP_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: 'QJs', heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'raise', stackBB: 100, dbKey: 'tourn_9max_100bb_BB_vs_SB_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '88',  heroPos: 'SB',  raiserPos: 'LJ',  raiserAction: 'raise', stackBB: 100, dbKey: 'cash_6max_100bb_SB_vs_UTG',      gameTypeKey: 'cash_6max' },
      { hand: 'AJs', heroPos: 'BB',  raiserPos: 'CO',  raiserAction: 'raise', stackBB: 100, dbKey: 'cash_6max_100bb_BB_vs_CO',       gameTypeKey: 'cash_6max' },
    ],
  },
  {
    id: 'short-stack',
    title: '短碼策略',
    description: '15-25BB 的錦標賽短碼策略，包含推注和面對推注的決策。',
    icon: '⚡',
    difficulty: 'advanced',
    category: 'advanced',
    gameType: '錦標賽 9-max 15-25BB',
    questions: [
      { hand: 'A8s', heroPos: 'CO',  raiserPos: null,  raiserAction: null,    stackBB: 25,  dbKey: 'tourn_9max_25bb_CO_RFI',       gameTypeKey: 'tourn_9max' },
      { hand: 'KJo', heroPos: 'BTN', raiserPos: null,  raiserAction: null,    stackBB: 25,  dbKey: 'tourn_9max_25bb_BTN_RFI',      gameTypeKey: 'tourn_9max' },
      { hand: '66',  heroPos: 'HJ',  raiserPos: null,  raiserAction: null,    stackBB: 15,  dbKey: 'tourn_9max_15bb_HJ_RFI',       gameTypeKey: 'tourn_9max' },
      { hand: 'QTs', heroPos: 'CO',  raiserPos: null,  raiserAction: null,    stackBB: 15,  dbKey: 'tourn_9max_15bb_CO_RFI',       gameTypeKey: 'tourn_9max' },
      { hand: 'A3o', heroPos: 'BTN', raiserPos: null,  raiserAction: null,    stackBB: 15,  dbKey: 'tourn_9max_15bb_BTN_RFI',      gameTypeKey: 'tourn_9max' },
      { hand: 'K9s', heroPos: 'SB',  raiserPos: null,  raiserAction: null,    stackBB: 15,  dbKey: 'tourn_9max_15bb_SB_RFI',       gameTypeKey: 'tourn_9max' },
      { hand: 'JTs', heroPos: 'BB',  raiserPos: 'BTN', raiserAction: 'raise', stackBB: 25,  dbKey: 'tourn_9max_25bb_BB_vs_BTN_RFI', gameTypeKey: 'tourn_9max' },
      { hand: 'AQo', heroPos: 'BB',  raiserPos: 'CO',  raiserAction: 'raise', stackBB: 15,  dbKey: 'tourn_9max_15bb_BB_vs_CO_RFI',  gameTypeKey: 'tourn_9max' },
      { hand: '77',  heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'allin', stackBB: 15,  dbKey: 'tourn_9max_15bb_BB_vs_SB_allin', gameTypeKey: 'tourn_9max' },
      { hand: 'T9o', heroPos: 'SB',  raiserPos: null,  raiserAction: null,    stackBB: 25,  dbKey: 'tourn_9max_25bb_SB_RFI',       gameTypeKey: 'tourn_9max' },
    ],
  },
]
