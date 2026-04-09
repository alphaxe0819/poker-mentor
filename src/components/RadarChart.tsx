import { memo } from 'react'
import type { DimensionScores } from '../data/quizQuestions'

interface Props {
  dimensions: DimensionScores
  size?: number
}

const LABELS: { key: keyof DimensionScores; label: string }[] = [
  { key: 'aggression',     label: '攻擊性' },
  { key: 'position',       label: '位置意識' },
  { key: 'discipline',     label: '手牌紀律' },
  { key: 'potControl',     label: '底池控制' },
  { key: 'tiltResistance', label: '抗壓性' },
]

function polarToXY(cx: number, cy: number, angle: number, radius: number): [number, number] {
  const rad = ((angle - 90) * Math.PI) / 180
  return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)]
}

function RadarChart({ dimensions, size = 220 }: Props) {
  const cx = size / 2
  const cy = size / 2
  const maxR = size / 2 - 30
  const angleStep = 360 / LABELS.length

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0]

  const dataPoints = LABELS.map((item, i) => {
    const value = dimensions[item.key] / 100
    const angle = i * angleStep
    return polarToXY(cx, cy, angle, maxR * value)
  })
  const dataPath = dataPoints.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map(r => {
        const pts = LABELS.map((_, i) => polarToXY(cx, cy, i * angleStep, maxR * r))
        const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ') + ' Z'
        return <path key={r} d={path} fill="none" stroke="#333" strokeWidth={1} />
      })}

      {LABELS.map((_, i) => {
        const [x, y] = polarToXY(cx, cy, i * angleStep, maxR)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#333" strokeWidth={1} />
      })}

      <path d={dataPath} fill="rgba(124, 58, 237, 0.25)" stroke="#7c3aed" strokeWidth={2} />

      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill="#7c3aed" />
      ))}

      {LABELS.map((item, i) => {
        const [x, y] = polarToXY(cx, cy, i * angleStep, maxR + 20)
        return (
          <text key={item.key} x={x} y={y}
            textAnchor="middle" dominantBaseline="middle"
            fill="#999" fontSize={11} fontFamily="sans-serif">
            {item.label}
          </text>
        )
      })}
    </svg>
  )
}

export default memo(RadarChart)
