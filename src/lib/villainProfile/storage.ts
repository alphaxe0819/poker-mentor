import type { VillainProfile } from './types'

export const LS_KEY_V2 = 'exploit-coach-villains-v2'
export const LS_KEY_V1 = 'exploit-coach-villains-v1'

export function loadVillainsV2(): VillainProfile[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LS_KEY_V2)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveVillainsV2(list: VillainProfile[]): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(LS_KEY_V2, JSON.stringify(list))
}

export function appendVillainV2(v: VillainProfile): VillainProfile[] {
  const list = loadVillainsV2()
  list.push(v)
  saveVillainsV2(list)
  return list
}

export function clearLegacyV1(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(LS_KEY_V1)
}

export function newVillainId(): string {
  return `v2-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
