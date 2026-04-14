import { useState } from 'react'
import PointsBadge from '../components/PointsBadge'
import { COURSES, type Course, type CourseCategory } from '../lib/courseData'
import { getCourseProgress, isCourseUnlocked, markCourseUnlocked } from '../lib/courseSync'
import CoursePlayScreen from '../components/CoursePlayScreen'

// 種子用戶體驗期：暫時 0 點（原值 10）
const ADVANCED_COST = 0

const DIFF_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  beginner:     { bg: '#052e16', text: '#4ade80', label: '入門' },
  intermediate: { bg: '#422006', text: '#fbbf24', label: '進階' },
  advanced:     { bg: '#450a0a', text: '#f87171', label: '高級' },
}

const CATEGORY_TABS: { key: CourseCategory; label: string; tag: string; tagColor: string }[] = [
  { key: 'beginner',  label: '入門課程', tag: '免費',                                                         tagColor: '#10b981' },
  { key: 'advanced',  label: '高階課程', tag: ADVANCED_COST === 0 ? '免費體驗' : `每堂 ${ADVANCED_COST} 點`,  tagColor: '#f59e0b' },
  { key: 'special',   label: '特別課程', tag: '敬請期待',                                                     tagColor: '#6b7280' },
]

interface CourseTabProps {
  points: number
  userId: string | null
  onPointsChanged?: () => void
  onNavigateToMissions?: () => void
}

export default function CourseTab({ points, userId, onPointsChanged, onNavigateToMissions }: CourseTabProps) {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null)
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('beginner')
  const [unlockTarget, setUnlockTarget] = useState<Course | null>(null)

  if (activeCourse) {
    return (
      <CoursePlayScreen
        course={activeCourse}
        onBack={() => { setActiveCourse(null) }}
      />
    )
  }

  const courses = COURSES.filter(c => c.category === activeCategory)

  const handleCourseClick = (course: Course, locked: boolean, needsUnlock: boolean) => {
    if (needsUnlock) {
      setUnlockTarget(course)
      return
    }
    if (locked) return
    setActiveCourse(course)
  }

  const handleUnlock = async () => {
    if (!unlockTarget) return
    if (!userId) return
    const { spendPoints } = await import('../lib/points')
    const result = await spendPoints(userId, ADVANCED_COST, 'course', `解鎖進階課程`)
    if (result.success) {
      markCourseUnlocked(unlockTarget.id)
      setUnlockTarget(null)
      onPointsChanged?.()
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">GTO 課程</h1>
        <PointsBadge points={points} onNavigateToMissions={onNavigateToMissions} />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2">
        {CATEGORY_TABS.map(cat => {
          const selected = activeCategory === cat.key
          return (
            <button key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl text-sm transition"
              style={{
                background: selected ? '#1a1a2e' : '#111',
                border: selected ? '1px solid #7c3aed' : '1px solid #222',
              }}>
              <span className={`font-bold text-xs ${selected ? 'text-white' : 'text-gray-500'}`}>
                {cat.label}
              </span>
              <span className="text-[10px] font-medium" style={{ color: cat.tagColor }}>
                {cat.tag}
              </span>
            </button>
          )
        })}
      </div>

      {/* Unlock confirm modal */}
      {unlockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }}>
          <div className="rounded-2xl p-6 w-full max-w-xs" style={{ background: '#111', border: '1px solid #222' }}>
            <div className="text-white font-bold text-base mb-2">解鎖課程</div>
            <div className="text-gray-400 text-sm mb-1">
              {ADVANCED_COST === 0 ? `免費體驗解鎖「${unlockTarget.title}」` : `花費 ${ADVANCED_COST} 點解鎖「${unlockTarget.title}」`}
            </div>
            <div className="text-gray-500 text-xs mb-5">目前擁有：⭐ {points} 點</div>
            {points >= ADVANCED_COST ? (
              <div className="flex gap-3">
                <button onClick={() => setUnlockTarget(null)}
                  className="flex-1 py-2.5 rounded-full text-sm"
                  style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                  取消
                </button>
                <button onClick={handleUnlock}
                  className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                  style={{ background: '#7c3aed' }}>
                  確認解鎖
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="text-center text-red-400 text-xs">點數不足，還需要 {ADVANCED_COST - points} 點</div>
                <button onClick={() => setUnlockTarget(null)}
                  className="w-full py-2.5 rounded-full text-sm"
                  style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
                  返回
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course List */}
      {activeCategory === 'special' ? (
        <div className="rounded-xl p-8 text-center" style={{ background: '#111', border: '1px solid #222' }}>
          <div className="text-3xl mb-3">🚧</div>
          <div className="text-white font-bold text-sm mb-2">敬請期待</div>
          <div className="text-gray-500 text-xs">特別課程正在準備中，敬請期待！</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {activeCategory === 'advanced' && (
            <div className="rounded-xl p-3 text-center" style={{ background: '#1a1a2e', border: '1px solid #2d2d4a' }}>
              <span className="text-gray-400 text-xs">
                {ADVANCED_COST === 0 ? '所有課程免費體驗中，點擊即可解鎖' : `每堂課需要 ⭐ ${ADVANCED_COST} 點解鎖，點擊課程即可解鎖`}
              </span>
            </div>
          )}
          {courses.map((course, idx) => {
            const diff = DIFF_COLORS[course.difficulty]
            const completed = getCourseProgress(course.id, course.questions.length)
            const total = course.questions.length
            const pct = Math.round((completed / total) * 100)

            // 高階課程：每堂需個別解鎖；入門課程：依序解鎖
            const needsUnlock = activeCategory === 'advanced' && !isCourseUnlocked(course.id)
            const prevCourse = idx > 0 ? courses[idx - 1] : null
            const prevDone = !prevCourse || getCourseProgress(prevCourse.id, prevCourse.questions.length) >= prevCourse.questions.length
            const locked = needsUnlock || (activeCategory === 'beginner' && !prevDone)

            return (
              <button
                key={course.id}
                onClick={() => handleCourseClick(course, locked, needsUnlock)}
                className="flex flex-col gap-2 p-4 rounded-xl text-left transition"
                style={{
                  background: needsUnlock ? '#111' : locked ? '#0a0a0a' : '#111',
                  border: needsUnlock ? '1px solid #2d2d4a' : locked ? '1px solid #1a1a1a' : '1px solid #222',
                  opacity: locked && !needsUnlock ? 0.5 : 1,
                  cursor: locked && !needsUnlock ? 'not-allowed' : 'pointer',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{locked ? '🔒' : course.icon}</span>
                  <span className={`text-sm font-bold flex-1 ${locked && !needsUnlock ? 'text-gray-600' : 'text-white'}`}>{course.title}</span>
                  {needsUnlock && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: '#422006', color: '#fbbf24' }}>
                      {ADVANCED_COST === 0 ? '免費' : `⭐ ${ADVANCED_COST} 點`}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: diff.bg, color: diff.text }}>
                    {diff.label}
                  </span>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed">{course.description}</p>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#222' }}>
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, background: completed === total ? '#10b981' : '#7c3aed' }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 whitespace-nowrap">{completed}/{total}</span>
                </div>

                <span className="text-[10px] text-gray-600">{course.gameType}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
