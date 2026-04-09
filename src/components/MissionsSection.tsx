import { useState, useEffect } from 'react'
import { getMissionStatus, claimMilestones, claimQuizReward, ensureReferralCode, MILESTONES, MILESTONE_REWARDS } from '../lib/missions'
import type { MissionStatus } from '../lib/missions'

interface Props {
  userId: string
  points: number
  onPointsChanged: () => void
}

export default function MissionsSection({ userId, points, onPointsChanged }: Props) {
  const [status, setStatus] = useState<MissionStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  useEffect(() => {
    getMissionStatus(userId).then(s => {
      setStatus(s)
      setLoading(false)
      // Ensure referral code exists
      if (!s.referralCode) {
        ensureReferralCode(userId).then(() => getMissionStatus(userId).then(setStatus))
      }
    })
  }, [userId])

  const handleClaimMilestones = async () => {
    if (claiming) return
    setClaiming(true)
    await claimMilestones(userId)
    onPointsChanged()
    const s = await getMissionStatus(userId)
    setStatus(s)
    setClaiming(false)
  }

  const handleClaimQuiz = async () => {
    if (claiming) return
    setClaiming(true)
    await claimQuizReward(userId)
    onPointsChanged()
    const s = await getMissionStatus(userId)
    setStatus(s)
    setClaiming(false)
  }

  const handleCopyReferral = () => {
    if (!status?.referralCode) return
    const url = `${window.location.origin}?ref=${status.referralCode}`
    navigator.clipboard.writeText(url).catch(() => {})
  }

  if (loading || !status) {
    return (
      <div className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-gray-600 text-sm">載入任務中...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header with points */}
      <div className="flex items-center justify-between">
        <div className="text-white font-bold text-sm">任務與獎勵</div>
        <div className="text-yellow-400 font-bold text-sm">⭐ {points} 點</div>
      </div>

      {/* Daily login */}
      <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white text-sm font-medium">每日登入</div>
            <div className="text-gray-500 text-xs">
              {status.loginToday ? '今日已簽到 ✓' : '今日未簽到'}
              {' · '}連續 {status.loginStreak} 天
            </div>
          </div>
          <div className="text-right">
            <div className="text-purple-400 text-xs font-medium">+5/天</div>
            <div className="text-gray-600 text-xs">7天 +50</div>
          </div>
        </div>
        {/* Streak progress */}
        <div className="flex gap-1 mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full"
              style={{
                background: i < (status.loginStreak % 7 || (status.loginStreak > 0 && status.loginStreak % 7 === 0 ? 7 : 0))
                  ? '#7c3aed' : '#222'
              }}
            />
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-white text-sm font-medium">練習里程碑</div>
          <div className="text-gray-500 text-xs">累計 {status.totalAnswered} 題</div>
        </div>
        <div className="flex flex-col gap-1.5">
          {MILESTONES.map(m => {
            const claimed = status.claimedMilestones.includes(m)
            const canClaim = status.unclaimedMilestones.includes(m)
            const progress = Math.min(status.totalAnswered / m, 1)
            return (
              <div key={m} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={claimed ? 'text-gray-600' : 'text-gray-400'}>{m} 題</span>
                    <span className={claimed ? 'text-gray-600' : canClaim ? 'text-green-400' : 'text-gray-600'}>
                      +{MILESTONE_REWARDS[m]}
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ background: '#222' }}>
                    <div className="h-1 rounded-full" style={{
                      width: `${progress * 100}%`,
                      background: claimed ? '#333' : canClaim ? '#4ade80' : '#7c3aed',
                    }} />
                  </div>
                </div>
                {claimed && <span className="text-gray-600 text-xs">✓</span>}
              </div>
            )
          })}
        </div>
        {status.unclaimedMilestones.length > 0 && (
          <button onClick={handleClaimMilestones} disabled={claiming}
            className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white transition"
            style={{ background: '#4ade80', opacity: claiming ? 0.6 : 1 }}>
            {claiming ? '領取中...' : '領取獎勵'}
          </button>
        )}
      </div>

      {/* Quiz reward */}
      {status.quizCompleted && !status.quizRewardClaimed && (
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">撲克 MBTI 完成</div>
              <div className="text-gray-500 text-xs">完成測驗獎勵</div>
            </div>
            <button onClick={handleClaimQuiz} disabled={claiming}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition"
              style={{ background: '#4ade80', opacity: claiming ? 0.6 : 1 }}>
              +20 領取
            </button>
          </div>
        </div>
      )}
      {status.quizCompleted && status.quizRewardClaimed && (
        <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">撲克 MBTI 完成</span>
            <span className="text-gray-600 text-xs">+20 已領取 ✓</span>
          </div>
        </div>
      )}

      {/* Referral */}
      <div className="rounded-xl p-3" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
        <div className="text-white text-sm font-medium mb-1">邀請好友</div>
        <div className="text-gray-500 text-xs mb-2">每邀請 1 位好友註冊 +100 點</div>
        {status.referralCode && (
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-300 truncate"
              style={{ background: '#0a0a0a', border: '1px solid #222' }}>
              {window.location.origin}?ref={status.referralCode}
            </div>
            <button onClick={handleCopyReferral}
              className="px-3 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: '#7c3aed' }}>
              複製
            </button>
          </div>
        )}
        {status.referralCount > 0 && (
          <div className="text-gray-500 text-xs mt-2">已邀請 {status.referralCount} 人</div>
        )}
      </div>
    </div>
  )
}
