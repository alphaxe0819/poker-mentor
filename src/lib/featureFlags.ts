// UI_V2 resolution order (first match wins):
// 1. URL query param ?ui=v2 | ?ui=v1 — overrides everything
// 2. localStorage feature.ui_v2 = 'true' | 'false' — persistent per device
// 3. Domain default: staging (poker-goal-dev.vercel.app) defaults to V2, everything else V1
function resolveUIV2(): boolean {
  try {
    const urlParam = new URLSearchParams(location.search).get('ui')
    if (urlParam === 'v2') return true
    if (urlParam === 'v1') return false
    const stored = localStorage.getItem('feature.ui_v2')
    if (stored === 'true') return true
    if (stored === 'false') return false
    // domain default
    return location.hostname.includes('poker-goal-dev')
  } catch {
    return false
  }
}

export const FEATURE_FLAGS = {
  UI_V2: resolveUIV2(),
} as const

export function setFeatureFlag(key: keyof typeof FEATURE_FLAGS, value: boolean) {
  localStorage.setItem(`feature.${key.toLowerCase()}`, String(value))
  location.reload()
}
