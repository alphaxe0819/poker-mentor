import * as DBS from './gto/gtoData_index'

// ── DB 選擇 ───────────────────────────────────────────────────────────────────

function getDB(stackBB: number) {
  if (stackBB >= 88) return DBS.DB_TOURN_100BB
  if (stackBB >= 58) return DBS.DB_TOURN_75BB
  if (stackBB >= 33) return DBS.DB_TOURN_40BB
  if (stackBB >= 20) return DBS.DB_TOURN_25BB
  return DBS.DB_TOURN_15BB
}

function getCanonicalBB(stackBB: number): number {
  if (stackBB >= 88) return 100
  if (stackBB >= 58) return 75
  if (stackBB >= 33) return 40
  if (stackBB >= 20) return 25
  return 15
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

export function getValidScenarios(stackBB: number): ValidScenario[] {
  if (stackBB >= 88) return VALID_SCENARIOS_100BB
  if (stackBB >= 58) return VALID_SCENARIOS_75BB
  if (stackBB >= 33) return VALID_SCENARIOS_40BB
  if (stackBB >= 20) return VALID_SCENARIOS_25BB
  return VALID_SCENARIOS_15BB
}

// ── 根據 dbKey 直接查 range ───────────────────────────────────────────────────

export function getRangeByKey(stackBB: number, dbKey: string): Record<string, string> {
  const db = getDB(stackBB) as Record<string, Record<string, string>>
  return db[dbKey] ?? {}
}

export function getActionByKey(stackBB: number, dbKey: string, hand: string): string {
  const range = getRangeByKey(stackBB, dbKey)
  return parseAction(range[hand])
}

export function getTopActionsByKey(stackBB: number, dbKey: string, hand: string): { action: string; freq: number }[] {
  const range = getRangeByKey(stackBB, dbKey)
  const val   = range[hand]
  if (!val) return [{ action: 'f', freq: 100 }]

  if (val.startsWith('mr:') && !val.includes('_')) {
    const pct = parseInt(val.split(':')[1])
    return [{ action: 'r', freq: pct }, { action: 'f', freq: 100 - pct }]
  }
  if (val.includes('_3b')) {
    const pct = parseInt(val.split(':')[1])
    return [{ action: '3b', freq: pct }, { action: 'f', freq: 100 - pct }]
  }
  if (val.includes('_4b')) {
    const pct = parseInt(val.split(':')[1])
    return [{ action: '4b', freq: pct }, { action: 'f', freq: 100 - pct }]
  }

  const primary = parseAction(val)
  const secondMap: Record<string, string> = { r: 'f', c: 'f', '3b': 'c', '4b': 'c', allin: 'f', f: 'r' }
  return [
    { action: primary,                   freq: 100 },
    { action: secondMap[primary] ?? 'f', freq: 0   },
  ]
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
  const scenarios = getValidScenarios(stackBB)
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
  const scenarios = getValidScenarios(stackBB)
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
  const scenarios = getValidScenarios(stackBB)
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
  gameTypeKey: string,
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
