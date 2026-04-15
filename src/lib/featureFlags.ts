export const FEATURE_FLAGS = {
  UI_V2: localStorage.getItem('feature.ui_v2') === 'true',
} as const

export function setFeatureFlag(key: keyof typeof FEATURE_FLAGS, value: boolean) {
  localStorage.setItem(`feature.${key.toLowerCase()}`, String(value))
  location.reload()
}
