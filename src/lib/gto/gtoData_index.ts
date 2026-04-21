// ⚠️ TEST DATA — scenarios.mjs placeholder range（或手寫 preflop range）產物。正式版改由 pokerdinosaur 匯入，見 src/lib/gto/prod/...（T-074 降級 2026-04-21）
// Dynamic import loaders with cache for code splitting
// Preload the needed DB before training starts; getDBSync returns cached data synchronously

type DBModule = Record<string, Record<string, string>>

const cache = new Map<string, DBModule>()

async function load(key: string, loader: () => Promise<any>): Promise<DBModule> {
  const cached = cache.get(key)
  if (cached) return cached
  const mod = await loader()
  // Handle both default exports and named exports
  const db: DBModule = mod.default
    ?? mod.DB_CASH_6MAX_100BB
    ?? mod.DB_CASH_4MAX_100BB
    ?? mod.DB_CASH_HU_100BB
    ?? mod.DB_TOURN_HU_40BB
    ?? mod
  cache.set(key, db)
  return db
}

// Sync getter — returns cached DB or undefined
export function getDBSync(key: string): DBModule | undefined {
  return cache.get(key)
}

// Async preloader — call before training starts
export async function preloadDB(gameTypeKey: string, stackBB: number): Promise<void> {
  const key = resolveKey(gameTypeKey, stackBB)
  if (cache.has(key)) return
  await loadByKey(key)
}

function resolveKey(gameTypeKey: string, stackBB: number): string {
  if (gameTypeKey === 'cash_6max') return 'c6'
  if (gameTypeKey === 'cash_4max') return 'c4'
  if (gameTypeKey === 'cash_hu')   return 'chu'
  if (gameTypeKey === 'tourn_hu')  return 'thu40'  // v1.0 only has 40BB
  if (stackBB >= 88) return 't100'
  if (stackBB >= 58) return 't75'
  if (stackBB >= 33) return 't40'
  if (stackBB >= 20) return 't25'
  return 't15'
}

function loadByKey(key: string): Promise<DBModule> {
  switch (key) {
    case 't100': return load(key, () => import('./gtoData_tourn_9max_100bb'))
    case 't75':  return load(key, () => import('./gtoData_tourn_9max_75bb'))
    case 't40':  return load(key, () => import('./gtoData_tourn_9max_40bb'))
    case 't25':  return load(key, () => import('./gtoData_tourn_9max_25bb'))
    case 't15':  return load(key, () => import('./gtoData_tourn_9max_15bb'))
    case 'c6':   return load(key, () => import('./gtoData_cash_6max_100bb'))
    case 'c4':   return load(key, () => import('./gtoData_cash_4max_100bb'))
    case 'chu':  return load(key, () => import('./gtoData_cash_hu_100bb'))
    case 'thu40': return load(key, () => import('./gtoData_tourn_hu_40bb'))
    default:     return load('t100', () => import('./gtoData_tourn_9max_100bb'))
  }
}

// Re-export for backwards compatibility — these resolve from cache
export function getDBByGameType(stackBB: number, gameTypeKey: string): DBModule | undefined {
  const key = resolveKey(gameTypeKey, stackBB)
  return cache.get(key)
}
