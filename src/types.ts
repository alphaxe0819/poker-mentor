export interface HandData {
  action: 'raise' | 'call' | 'fold'
  mixed?: { raise: number; call: number; fold: number }
}

export type RangeMap = Record<string, HandData>
