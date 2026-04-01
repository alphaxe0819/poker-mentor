export interface SeatDisplayInfo {
  status: 'hero' | 'raised' | 'posted' | 'folded' | 'waiting' | 'active'
  bet: number
  stack?: number
}
