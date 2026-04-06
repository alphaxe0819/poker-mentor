import * as DBS from './gto/gtoData_index'

// ── DB 選擇 ───────────────────────────────────────────────────────────────────

export type GameTypeKey = 'tourn_9max' | 'cash_6max' | 'cash_4max' | 'cash_hu'

function getDB(stackBB: number, gameTypeKey: GameTypeKey = 'tourn_9max') {
  if (gameTypeKey === 'cash_6max') return DBS.DB_CASH_6MAX_100BB
  if (gameTypeKey === 'cash_4max') return DBS.DB_CASH_4MAX_100BB
  if (gameTypeKey === 'cash_hu')   return DBS.DB_CASH_HU_100BB
  // tournament
  if (stackBB >= 88) return DBS.DB_TOURN_100BB
  if (stackBB >= 58) return DBS.DB_TOURN_75BB
  if (stackBB >= 33) return DBS.DB_TOURN_40BB
  if (stackBB >= 20) return DBS.DB_TOURN_25BB
  return DBS.DB_TOURN_15BB
}

// ── 有效場景表 ────────────────────────────────────────────────────────────────
// 每個深度明確列出有資料的 (heroPos, raiserPos) 組合
// raiserPos = null 表示 RFI 場景

export interface ValidScenario {
  heroPos: string
  raiserPos: string | null
  raiserAction: 'raise' | 'limp' | 'allin' | null
  dbKey: string
}

const VALID_SCENARIOS_100BB: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_UTG_RFI'   },
  { heroPos: 'UTG+1', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_UTG1_RFI'  },
  { heroPos: 'UTG+2', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_UTG2_RFI'  },
  { heroPos: 'LJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_LJ_RFI'    },
  { heroPos: 'HJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_HJ_RFI'    },
  { heroPos: 'CO',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_CO_RFI'    },
  { heroPos: 'BTN',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_BTN_RFI'   },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_100bb_SB_RFI'    },
  // vs RFI
  { heroPos: 'UTG+1', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_UTG1_vs_UTG_RFI' },
  { heroPos: 'UTG+2', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_UTG2_vs_EP_RFI'  },
  { heroPos: 'UTG+2', raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_UTG2_vs_EP_RFI'  },
  { heroPos: 'LJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_LJ_vs_EP_RFI'    },
  { heroPos: 'LJ',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_LJ_vs_EP_RFI'    },
  { heroPos: 'LJ',    raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_LJ_vs_UTG2_RFI'  },
  { heroPos: 'HJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_HJ_vs_UTG_RFI'   },
  { heroPos: 'HJ',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_HJ_vs_UTG1_RFI'  },
  { heroPos: 'HJ',    raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_HJ_vs_UTG2_RFI'  },
  { heroPos: 'HJ',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_HJ_vs_LJ_RFI'    },
  { heroPos: 'CO',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_CO_vs_EP_RFI'    },
  { heroPos: 'CO',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_CO_vs_EP_RFI'    },
  { heroPos: 'CO',    raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_CO_vs_UTG2_RFI'  },
  { heroPos: 'CO',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_CO_vs_LJ_RFI'    },
  { heroPos: 'CO',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_CO_vs_HJ_RFI'    },
  { heroPos: 'BTN',   raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_UTG_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_UTG1_RFI' },
  { heroPos: 'BTN',   raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_UTG2_RFI' },
  { heroPos: 'BTN',   raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_LJ_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_HJ_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BTN_vs_CO_RFI'   },
  { heroPos: 'SB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_EP_RFI'    },
  { heroPos: 'SB',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_EP_RFI'    },
  { heroPos: 'SB',    raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_UTG2_RFI'  },
  { heroPos: 'SB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_LJ_RFI'    },
  { heroPos: 'SB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_HJ_RFI'    },
  { heroPos: 'SB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_CO_RFI'    },
  { heroPos: 'SB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_SB_vs_BTN_RFI'   },
  { heroPos: 'BB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_EP_RFI'    },
  { heroPos: 'BB',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_EP_RFI'    },
  { heroPos: 'BB',    raiserPos: 'UTG+2', raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_UTG2_RFI'  },
  { heroPos: 'BB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_LJ_RFI'    },
  { heroPos: 'BB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_HJ_RFI'    },
  { heroPos: 'BB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_CO_RFI'    },
  { heroPos: 'BB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_BTN_RFI'   },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'raise', dbKey: 'tourn_9max_100bb_BB_vs_SB_RFI'    },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'limp',  dbKey: 'tourn_9max_100bb_SB_limp_vs_BB_raise'   },
]

const VALID_SCENARIOS_75BB: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_UTG_RFI'  },
  { heroPos: 'UTG+1', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_UTG1_RFI' },
  { heroPos: 'UTG+2', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_UTG2_RFI' },
  { heroPos: 'LJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_LJ_RFI'   },
  { heroPos: 'HJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_HJ_RFI'   },
  { heroPos: 'CO',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_CO_RFI'   },
  { heroPos: 'BTN',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_BTN_RFI'  },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_75bb_SB_RFI'   },
  // vs RFI
  { heroPos: 'UTG+1', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_EP_vs_UTG_RFI'    },
  { heroPos: 'UTG+2', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_EP_vs_UTG_RFI'    },
  { heroPos: 'LJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_HJ_vs_LJ_RFI'     },
  { heroPos: 'CO',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_CO_vs_UTG_RFI'    },
  { heroPos: 'CO',    raiserPos: 'UTG+1', raiserAction: 'raise', dbKey: 'tourn_9max_75bb_CO_vs_UTG_RFI'    },
  { heroPos: 'CO',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'CO',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BTN_vs_UTG_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BTN_vs_CO_RFI'    },
  { heroPos: 'SB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_SB_vs_UTG_RFI'    },
  { heroPos: 'SB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_SB_vs_CO_RFI'     },
  { heroPos: 'SB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_SB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_UTG_RFI'    },
  { heroPos: 'BB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_CO_RFI'     },
  { heroPos: 'BB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'raise', dbKey: 'tourn_9max_75bb_BB_vs_SB_RFI'     },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'limp',  dbKey: 'tourn_9max_75bb_BB_vs_SB_limp'    },
]

const VALID_SCENARIOS_40BB: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_UTG_RFI'  },
  { heroPos: 'UTG+1', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_UTG1_RFI' },
  { heroPos: 'UTG+2', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_UTG2_RFI' },
  { heroPos: 'LJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_LJ_RFI'   },
  { heroPos: 'HJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_HJ_RFI'   },
  { heroPos: 'CO',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_CO_RFI'   },
  { heroPos: 'BTN',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_BTN_RFI'  },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_SB_RFI'   },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_40bb_SB_BvB'   },
  // vs RFI
  { heroPos: 'UTG+1', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_EP_vs_UTG_RFI'  },
  { heroPos: 'UTG+2', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_EP_vs_UTG_RFI'  },
  { heroPos: 'LJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_MP_vs_UTG_RFI'  },
  { heroPos: 'HJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_MP_vs_UTG_RFI'  },
  { heroPos: 'HJ',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_HJ_vs_LJ_RFI'   },
  { heroPos: 'CO',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_CO_vs_UTG_RFI'  },
  { heroPos: 'CO',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_CO_vs_MP_RFI'   },
  { heroPos: 'CO',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_CO_vs_MP_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BTN_vs_UTG_RFI' },
  { heroPos: 'BTN',   raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BTN_vs_MP_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BTN_vs_MP_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BTN_vs_CO_RFI'  },
  { heroPos: 'SB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_SB_vs_UTG_RFI'  },
  { heroPos: 'SB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_SB_vs_MP_RFI'   },
  { heroPos: 'SB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_SB_vs_MP_RFI'   },
  { heroPos: 'SB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_SB_vs_CO_RFI'   },
  { heroPos: 'SB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_SB_vs_BTN_RFI'  },
  { heroPos: 'BB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_UTG_RFI'  },
  { heroPos: 'BB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_MP_RFI'   },
  { heroPos: 'BB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_MP_RFI'   },
  { heroPos: 'BB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_CO_RFI'   },
  { heroPos: 'BB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_BTN_RFI'  },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'raise', dbKey: 'tourn_9max_40bb_BB_vs_SB_raise' },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'limp',  dbKey: 'tourn_9max_40bb_BB_vs_SB_limp'  },
]

const VALID_SCENARIOS_25BB: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_UTG_RFI'  },
  { heroPos: 'UTG+1', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_UTG1_RFI' },
  { heroPos: 'UTG+2', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_UTG2_RFI' },
  { heroPos: 'LJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_LJ_RFI'   },
  { heroPos: 'HJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_HJ_RFI'   },
  { heroPos: 'CO',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_CO_RFI'   },
  { heroPos: 'BTN',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_BTN_RFI'  },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_25bb_SB_RFI'   },
  // vs RFI
  { heroPos: 'UTG+1', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_EP_vs_UTG_RFI'    },
  { heroPos: 'UTG+2', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_EP_vs_UTG_RFI'    },
  { heroPos: 'LJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_HJ_vs_LJ_RFI'     },
  { heroPos: 'CO',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_CO_vs_UTG_RFI'    },
  { heroPos: 'CO',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'CO',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BTN_vs_UTG_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BTN_vs_CO_RFI'    },
  { heroPos: 'SB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_SB_vs_UTG_RFI'    },
  { heroPos: 'SB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_SB_vs_CO_RFI'     },
  { heroPos: 'SB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_SB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_UTG_RFI'    },
  { heroPos: 'BB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_CO_RFI'     },
  { heroPos: 'BB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'raise', dbKey: 'tourn_9max_25bb_BB_vs_SB_RFI'     },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'limp',  dbKey: 'tourn_9max_25bb_BB_vs_SB_limp'    },
]

const VALID_SCENARIOS_15BB: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_UTG_RFI'  },
  { heroPos: 'UTG+1', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_UTG1_RFI' },
  { heroPos: 'UTG+2', raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_UTG2_RFI' },
  { heroPos: 'LJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_LJ_RFI'   },
  { heroPos: 'HJ',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_HJ_RFI'   },
  { heroPos: 'CO',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_CO_RFI'   },
  { heroPos: 'BTN',   raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_BTN_RFI'  },
  { heroPos: 'SB',    raiserPos: null, raiserAction: null,    dbKey: 'tourn_9max_15bb_SB_RFI'   },
  // vs RFI
  { heroPos: 'UTG+1', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_EP_vs_UTG_RFI'    },
  { heroPos: 'UTG+2', raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_EP_vs_UTG_RFI'    },
  { heroPos: 'LJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_LJ_HJ_vs_UTG_RFI' },
  { heroPos: 'HJ',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_HJ_vs_LJ_RFI'     },
  { heroPos: 'CO',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_CO_vs_UTG_RFI'    },
  { heroPos: 'CO',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'CO',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_CO_vs_LJ_HJ_RFI'  },
  { heroPos: 'BTN',   raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BTN_vs_UTG_RFI'   },
  { heroPos: 'BTN',   raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BTN_vs_LJ_HJ_RFI' },
  { heroPos: 'BTN',   raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BTN_vs_CO_RFI'    },
  { heroPos: 'SB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_SB_vs_UTG_RFI'    },
  { heroPos: 'SB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_SB_vs_LJ_HJ_RFI'  },
  { heroPos: 'SB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_SB_vs_CO_RFI'     },
  { heroPos: 'SB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_SB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'UTG',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BB_vs_UTG_RFI'    },
  { heroPos: 'BB',    raiserPos: 'LJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'HJ',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BB_vs_LJ_HJ_RFI'  },
  { heroPos: 'BB',    raiserPos: 'CO',    raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BB_vs_CO_RFI'     },
  { heroPos: 'BB',    raiserPos: 'BTN',   raiserAction: 'raise', dbKey: 'tourn_9max_15bb_BB_vs_BTN_RFI'    },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'limp',  dbKey: 'tourn_9max_15bb_BB_vs_SB_limp'    },
  { heroPos: 'BB',    raiserPos: 'SB',    raiserAction: 'allin', dbKey: 'tourn_9max_15bb_BB_vs_SB_allin'   },
]

// ── 現金局場景表 ──────────────────────────────────────────────────────────────

const VALID_SCENARIOS_CASH_6MAX: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG', raiserPos: null, raiserAction: null,    dbKey: 'cash_6max_100bb_UTG_open' },
  { heroPos: 'HJ',  raiserPos: null, raiserAction: null,    dbKey: 'cash_6max_100bb_HJ_open'  },
  { heroPos: 'CO',  raiserPos: null, raiserAction: null,    dbKey: 'cash_6max_100bb_CO_open'  },
  { heroPos: 'BTN', raiserPos: null, raiserAction: null,    dbKey: 'cash_6max_100bb_BTN_open' },
  { heroPos: 'SB',  raiserPos: null, raiserAction: null,    dbKey: 'cash_6max_100bb_SB_open'  },
  // vs RFI
  { heroPos: 'HJ',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_6max_100bb_HJ_vs_UTG'  },
  { heroPos: 'CO',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_6max_100bb_CO_vs_UTG'  },
  { heroPos: 'CO',  raiserPos: 'HJ',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_CO_vs_HJ'  },
  { heroPos: 'BTN', raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_6max_100bb_BTN_vs_UTG' },
  { heroPos: 'BTN', raiserPos: 'HJ',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_BTN_vs_HJ' },
  { heroPos: 'BTN', raiserPos: 'CO',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_BTN_vs_CO' },
  { heroPos: 'SB',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_6max_100bb_SB_vs_UTG'  },
  { heroPos: 'SB',  raiserPos: 'HJ',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_SB_vs_HJ'  },
  { heroPos: 'SB',  raiserPos: 'CO',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_SB_vs_CO'  },
  { heroPos: 'SB',  raiserPos: 'BTN', raiserAction: 'raise', dbKey: 'cash_6max_100bb_SB_vs_BTN' },
  { heroPos: 'BB',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_6max_100bb_BB_vs_UTG'  },
  { heroPos: 'BB',  raiserPos: 'HJ',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_BB_vs_HJ'  },
  { heroPos: 'BB',  raiserPos: 'CO',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_BB_vs_CO'  },
  { heroPos: 'BB',  raiserPos: 'BTN', raiserAction: 'raise', dbKey: 'cash_6max_100bb_BB_vs_BTN' },
  { heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'raise', dbKey: 'cash_6max_100bb_BB_vs_SB'  },
]

const VALID_SCENARIOS_CASH_4MAX: ValidScenario[] = [
  // RFI
  { heroPos: 'UTG', raiserPos: null, raiserAction: null,    dbKey: 'cash_4max_100bb_UTG_open' },
  { heroPos: 'BTN', raiserPos: null, raiserAction: null,    dbKey: 'cash_4max_100bb_BTN_open' },
  { heroPos: 'SB',  raiserPos: null, raiserAction: null,    dbKey: 'cash_4max_100bb_SB_open'  },
  // vs RFI
  { heroPos: 'BTN', raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_4max_100bb_BTN_vs_UTG' },
  { heroPos: 'SB',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_4max_100bb_SB_vs_UTG'  },
  { heroPos: 'SB',  raiserPos: 'BTN', raiserAction: 'raise', dbKey: 'cash_4max_100bb_SB_vs_BTN'  },
  { heroPos: 'BB',  raiserPos: 'UTG', raiserAction: 'raise', dbKey: 'cash_4max_100bb_BB_vs_UTG'  },
  { heroPos: 'BB',  raiserPos: 'BTN', raiserAction: 'raise', dbKey: 'cash_4max_100bb_BB_vs_BTN'  },
  { heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'raise', dbKey: 'cash_4max_100bb_BB_vs_SB'   },
]

const VALID_SCENARIOS_CASH_HU: ValidScenario[] = [
  // RFI
  { heroPos: 'SB',  raiserPos: null,  raiserAction: null,    dbKey: 'cash_hu_100bb_SB_open'    },
  // vs RFI
  { heroPos: 'BB',  raiserPos: 'SB',  raiserAction: 'raise', dbKey: 'cash_hu_100bb_BB_vs_open' },
]

export function getValidScenarios(stackBB: number, gameTypeKey: GameTypeKey = 'tourn_9max'): ValidScenario[] {
  if (gameTypeKey === 'cash_6max') return VALID_SCENARIOS_CASH_6MAX
  if (gameTypeKey === 'cash_4max') return VALID_SCENARIOS_CASH_4MAX
  if (gameTypeKey === 'cash_hu')   return VALID_SCENARIOS_CASH_HU
  // tournament
  if (stackBB >= 88) return VALID_SCENARIOS_100BB
  if (stackBB >= 58) return VALID_SCENARIOS_75BB
  if (stackBB >= 33) return VALID_SCENARIOS_40BB
  if (stackBB >= 20) return VALID_SCENARIOS_25BB
  return VALID_SCENARIOS_15BB
}

// ── 根據 dbKey 直接查 range ───────────────────────────────────────────────────

export function getRangeByKey(stackBB: number, dbKey: string, gameTypeKey?: GameTypeKey): Record<string, string> {
  // 從 dbKey 自動判斷 gameType
  const gtKey = gameTypeKey
    ?? (dbKey.startsWith('cash_6max') ? 'cash_6max'
      : dbKey.startsWith('cash_4max') ? 'cash_4max'
      : dbKey.startsWith('cash_hu')   ? 'cash_hu'
      : 'tourn_9max')
  const db = getDB(stackBB, gtKey) as Record<string, Record<string, string>>
  return db[dbKey] ?? {}
}

// BB vs SB Limp 時，fold 等於 check（BB 已下盲注，不需棄牌）
function isBBvsSBLimp(dbKey: string): boolean {
  return dbKey.includes('SB_limp')
}

export function getActionByKey(stackBB: number, dbKey: string, hand: string): string {
  const range = getRangeByKey(stackBB, dbKey)
  let action = parseAction(range[hand])
  if (isBBvsSBLimp(dbKey) && action === 'f') action = 'c'
  // 正規化：vs_raise 場景 r → 3b，vs_3bet 場景 r → 4b
  if (action === 'r') {
    if (dbKey.includes('_vs_3bet')) action = '4b'
    else if (dbKey.includes('_vs_') && !dbKey.includes('_open')) action = '3b'
  }
  return action
}

export function getTopActionsByKey(stackBB: number, dbKey: string, hand: string): { action: string; freq: number }[] {
  const range = getRangeByKey(stackBB, dbKey)
  const val   = range[hand]
  const limp = isBBvsSBLimp(dbKey)
  // BB vs SB limp: fold → check（BB 已下盲注，不需棄牌）
  const f = limp ? 'c' : 'f'

  // 根據場景正規化 raise 動作名稱：
  // vs_raise 場景中 r → 3b，vs_3bet 場景中 r → 4b
  const isVs3bet = dbKey.includes('_vs_3bet')
  const isVsRaise = !isVs3bet && dbKey.includes('_vs_') && !dbKey.includes('_open')
  const normalizeRaise = (a: string) => {
    if (a === 'r' && isVsRaise) return '3b'
    if (a === 'r' && isVs3bet) return '4b'
    return a
  }

  if (!val) return [{ action: f, freq: 100 }]

  if (val.startsWith('mr:') && !val.includes('_')) {
    const pct = parseInt(val.split(':')[1])
    const actions = [{ action: normalizeRaise('r'), freq: pct }, { action: f, freq: 100 - pct }]
    return actions.sort((a, b) => b.freq - a.freq)
  }
  if (val.includes('_3b')) {
    const pct = parseInt(val.split(':')[1])
    const actions = [{ action: '3b', freq: pct }, { action: f, freq: 100 - pct }]
    return actions.sort((a, b) => b.freq - a.freq)
  }
  if (val.includes('_4b')) {
    const pct = parseInt(val.split(':')[1])
    const actions = [{ action: '4b', freq: pct }, { action: f, freq: 100 - pct }]
    return actions.sort((a, b) => b.freq - a.freq)
  }

  const primary = parseAction(val)
  const mappedPrimary = limp && primary === 'f' ? 'c' : normalizeRaise(primary)
  const secondMap: Record<string, string> = { r: f, c: f, '3b': 'c', '4b': 'c', allin: f, f: 'r' }
  return [
    { action: mappedPrimary,                       freq: 100 },
    { action: secondMap[mappedPrimary] ?? f, freq: 0   },
  ]
}

// ── isActionValid（頻率 > 0% 即視為正確）────────────────────────────────────

export function isActionValid(stackBB: number, dbKey: string, hand: string, action: string): boolean {
  const topActions = getTopActionsByKey(stackBB, dbKey, hand)
  // 面對加注時 r 等同 3b；面對 3-bet 時 3b 等同 4b
  const equiv = (a: string, b: string) =>
    a === b || (a === 'r' && b === '3b') || (a === '3b' && b === 'r')
           || (a === '3b' && b === '4b') || (a === '4b' && b === '3b')
  const match = topActions.find(a => equiv(a.action, action))
  return match !== undefined && match.freq > 0
}

// ── parseAction ───────────────────────────────────────────────────────────────

function parseAction(val: string | undefined): string {
  if (!val) return 'f'
  if (['r','c','3b','4b','allin','f'].includes(val)) return val
  if (val.startsWith('mr:') && !val.includes('_')) return 'r'
  if (val.includes('_3b')) return '3b'
  if (val.includes('_4b')) return '4b'
  return 'f'
}

// ── 舊版相容函數（保留給其他元件使用）────────────────────────────────────────

export function getGTOAction(
  gameTypeKey: string,
  stackBB: number,
  position: string,
  hand: string,
  scenario: string = 'open',
  raiserPos?: string,
): string {
  // 從有效場景表裡找對應的 key
  const gtKey = (gameTypeKey || 'tourn_9max') as GameTypeKey
  const scenarios = getValidScenarios(stackBB, gtKey)
  const match = scenarios.find(s =>
    s.heroPos === position &&
    (scenario === 'open' ? s.raiserPos === null : s.raiserPos === raiserPos)
  )
  if (!match) return 'f'
  return getActionByKey(stackBB, match.dbKey, hand)
}

export function getTopActions(
  gameTypeKey: string,
  stackBB: number,
  position: string,
  hand: string,
  scenario: string = 'open',
  raiserPos?: string,
): { action: string; freq: number }[] {
  const gtKey = (gameTypeKey || 'tourn_9max') as GameTypeKey
  const scenarios = getValidScenarios(stackBB, gtKey)
  const match = scenarios.find(s =>
    s.heroPos === position &&
    (scenario === 'open' ? s.raiserPos === null : s.raiserPos === raiserPos)
  )
  if (!match) return [{ action: 'f', freq: 100 }]
  return getTopActionsByKey(stackBB, match.dbKey, hand)
}

export function getRangeForPosition(
  gameTypeKey: string,
  stackBB: number,
  position: string,
  scenario: string = 'open',
  raiserPos?: string,
  raiserAction?: string | null,
): Record<string, string> {
  const gtKey = (gameTypeKey || 'tourn_9max') as GameTypeKey
  const scenarios = getValidScenarios(stackBB, gtKey)
  const match = scenarios.find(s => {
    if (s.heroPos !== position) return false
    if (scenario === 'open') return s.raiserPos === null
    if (s.raiserPos !== raiserPos) return false
    // 有 raiserAction 時要精確匹配（區分 limp 和 raise）
    if (raiserAction && s.raiserAction) return s.raiserAction === raiserAction
    return true
  })
  if (!match) return {}
  return getRangeByKey(stackBB, match.dbKey)
}

// ── Step 2 GTO ────────────────────────────────────────────────────────────────

export function getStep2GTOFromDB(
  _gameTypeKey: string,
  stackBB: number,
  heroPos: string,
  villainPos: string,
  villainResp: string,
  hand: string,
): string {
  if (stackBB < 88) return getStep2GTOFallback(villainResp, hand)

  const db = DBS.DB_TOURN_100BB as Record<string, Record<string, string>>
  if (villainResp === '3bet') {
    const early  = ['UTG', 'UTG+1', 'UTG1', 'UTG+2', 'UTG2']
    const late   = ['BTN']
    const blinds = ['SB', 'BB']
    const suffix =
      early.includes(villainPos)  ? 'early'  :
      late.includes(villainPos)   ? 'late'   :
      blinds.includes(villainPos) ? 'blinds' :
      villainPos === 'LJ'         ? 'btn'    :
      villainPos === 'HJ'         ? 'co'     :
      villainPos === 'CO'         ? 'btn_sb' : 'late'
    const posMap: Record<string, string> = {
      'UTG': 'UTG', 'UTG+1': 'UTG1', 'UTG+2': 'UTG2',
      'LJ': 'LJ', 'HJ': 'HJ', 'CO': 'CO', 'BTN': 'BTN', 'SB': 'SB', 'BB': 'BB'
    }
    const key = `tourn_9max_100bb_${posMap[heroPos] ?? heroPos}_vs_3bet_${suffix}`
    const range = db[key]
    if (range) return parseAction(range[hand])
  }
  return getStep2GTOFallback(villainResp, hand)
}

function getStep2GTOFallback(villainResp: string, hand: string): string {
  const premium = new Set(['AA','KK','QQ','JJ','AKs','AKo'])
  const strong  = new Set(['TT','99','AQs','AQo','AJs','KQs'])
  if (villainResp === '3bet') {
    if (premium.has(hand)) return '4b'
    if (strong.has(hand))  return 'c'
    return 'f'
  }
  if (villainResp === '4bet') { if (premium.has(hand)) return 'allin'; return 'f' }
  if (villainResp === 'allin') { if (premium.has(hand)) return 'c'; return 'f' }
  return 'f'
}

// ── Action Labels ──────────────────────────────────────────────────────────────

export const ACTION_LABELS: Record<string, string> = {
  f: 'Fold（棄牌）', c: 'Call（跟注）', r: 'Raise（加注）',
  '3b': '3-Bet', '4b': '4-Bet', allin: 'All-in（全下）', limp: 'Limp（平跟）',
}

export function getActionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action
}
