// 體驗模式固定 3 題
export const GUEST_QUESTIONS = [
  {
    // 題 1：BTN RFI，強牌 AKs
    dbKey:      'tourn_9max_100bb_BTN_RFI',
    stackBB:    100,
    heroPos:    'BTN',
    raiserPos:  null as null,
    raiserAction: null as null,
    hand:       'AKs',
  },
  {
    // 題 2：CO vs UTG raise，中等牌 JTs
    dbKey:      'tourn_9max_100bb_CO_vs_EP_RFI',
    stackBB:    100,
    heroPos:    'CO',
    raiserPos:  'UTG' as string,
    raiserAction: 'raise' as const,
    hand:       'JTs',
  },
  {
    // 題 3：BB vs BTN raise，弱牌 72o
    dbKey:      'tourn_9max_100bb_BB_vs_BTN_RFI',
    stackBB:    100,
    heroPos:    'BB',
    raiserPos:  'BTN' as string,
    raiserAction: 'raise' as const,
    hand:       '72o',
  },
]
