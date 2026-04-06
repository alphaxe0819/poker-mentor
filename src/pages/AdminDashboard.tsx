import { useState, useEffect, useMemo } from 'react'
import { adminSupabase } from '../lib/adminSupabase'

// ─── Types ───────────────────────────────────────────────────────
interface ProfileRow {
  id: string
  email: string
  name: string
  is_paid: boolean
  player_type: string
  points: number
  created_at: string
}

interface AnswerAgg {
  user_id: string
  total: number
  correct: number
}

interface DailyCount {
  date: string
  count: number
}

interface PositionCount {
  hero_pos: string
  count: number
}

interface ScenarioCount {
  scenario_type: string
  count: number
}

interface CourseAgg {
  course_id: string
  completed_count: number
  unlocked_count: number
  total_users: number
}

// ─── Helpers ─────────────────────────────────────────────────────
function todayUTC8(): string {
  const now = new Date()
  const utc8 = new Date(now.getTime() + 8 * 60 * 60 * 1000)
  return utc8.toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('zh-TW', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

const COURSE_NAMES: Record<string, string> = {
  'rfi-basics': '開池基礎',
  'position-power': '位置的力量',
  'facing-raise': '面對加注',
  'cash-6max': '現金局 6-max',
  '3bet-strategy': '3-Bet 策略',
  'short-stack': '短碼策略',
}

// ─── Admin Login ─────────────────────────────────────────────────
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER ?? 'admin'
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS ?? ''

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('admin_auth', '1')
      onLogin()
    } else {
      setError('帳號或密碼錯誤')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
      <form onSubmit={handleSubmit}
        className="w-full max-w-xs flex flex-col gap-4 p-6 rounded-2xl"
        style={{ background: '#111', border: '1px solid #222' }}>
        <h1 className="text-white font-bold text-lg text-center">🔒 管理後台</h1>
        <input
          type="text" placeholder="帳號" value={user}
          onChange={e => setUser(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
          style={{ background: '#1a1a1a', border: '1px solid #333', outline: 'none' }}
        />
        <input
          type="password" placeholder="密碼" value={pass}
          onChange={e => setPass(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white"
          style={{ background: '#1a1a1a', border: '1px solid #333', outline: 'none' }}
        />
        {error && <div className="text-red-400 text-xs text-center">{error}</div>}
        <button type="submit"
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: '#7c3aed' }}>
          登入
        </button>
        <button type="button" onClick={() => (window.location.pathname = '/')}
          className="text-xs text-gray-600 text-center">
          返回首頁
        </button>
      </form>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_auth') === '1')

  if (!adminSupabase || !ADMIN_PASS) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#fff' }}>
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: 16, padding: 32, maxWidth: 480, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, marginBottom: 12 }}>🔒 後台未設定</h1>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.6 }}>
            請在 <code style={{ background: '#222', padding: '2px 6px', borderRadius: 4 }}>.env</code> 中設定{' '}
            <code style={{ background: '#222', padding: '2px 6px', borderRadius: 4 }}>VITE_SUPABASE_SERVICE_KEY</code> 和{' '}
            <code style={{ background: '#222', padding: '2px 6px', borderRadius: 4 }}>VITE_ADMIN_PASS</code>
          </p>
        </div>
      </div>
    )
  }

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  const sb = adminSupabase

  // ── State ────────────────────────
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [answerAggs, setAnswerAggs] = useState<AnswerAgg[]>([])
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [todayAnswers, setTodayAnswers] = useState(0)
  const [yesterdayAnswers, setYesterdayAnswers] = useState(0)
  const [todayActiveUsers, setTodayActiveUsers] = useState(0)
  const [dailyNewUsers, setDailyNewUsers] = useState<DailyCount[]>([])
  const [positionCounts, setPositionCounts] = useState<PositionCount[]>([])
  const [scenarioCounts, setScenarioCounts] = useState<ScenarioCount[]>([])
  const [courseStats, setCourseStats] = useState<CourseAgg[]>([])
  const [lastActiveMap, setLastActiveMap] = useState<Record<string, string>>({})

  // UI
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'email' | 'name' | 'points' | 'total' | 'rate' | 'lastActive' | 'created'>('created')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // ── Data fetching ────────────────
  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)
    setError(null)
    try {
      const today = todayUTC8()
      const d = new Date(today)
      d.setDate(d.getDate() - 1)
      const yesterday = d.toISOString().slice(0, 10)
      const d7 = new Date(today)
      d7.setDate(d7.getDate() - 6)
      const sevenDaysAgo = d7.toISOString().slice(0, 10)

      // 1. Profiles
      const { data: profileData, error: profileErr } = await sb
        .from('profiles')
        .select('id, email, name, is_paid, player_type, points, created_at')
        .order('created_at', { ascending: false })

      if (profileErr) throw profileErr
      const pList = (profileData ?? []) as ProfileRow[]
      setProfiles(pList)

      // 2. Answer stats per user — use RPC or raw query
      //    Since we can't GROUP BY with supabase-js easily, we fetch all answer_records
      //    But that could be huge. Instead, let's use a trick: fetch counts with select head.
      //    Actually the simplest: just do a few aggregate queries.

      // Total answers
      const { count: totalAns } = await sb
        .from('answer_records')
        .select('*', { count: 'exact', head: true })
      setTotalAnswers(totalAns ?? 0)

      // Total correct
      const { count: totalCorr } = await sb
        .from('answer_records')
        .select('*', { count: 'exact', head: true })
        .eq('is_correct', true)
      setTotalCorrect(totalCorr ?? 0)

      // Today answers
      const { count: todayAns } = await sb
        .from('answer_records')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today + 'T00:00:00')
      setTodayAnswers(todayAns ?? 0)

      // Yesterday answers
      const { count: yestAns } = await sb
        .from('answer_records')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday + 'T00:00:00')
        .lt('created_at', today + 'T00:00:00')
      setYesterdayAnswers(yestAns ?? 0)

      // Today active users (distinct user_id)
      const { data: todayActiveData } = await sb
        .from('answer_records')
        .select('user_id')
        .gte('created_at', today + 'T00:00:00')
      const uniqueToday = new Set((todayActiveData ?? []).map((r: { user_id: string }) => r.user_id))
      setTodayActiveUsers(uniqueToday.size)

      // Per-user answer stats — fetch all answer_records (user_id, is_correct) to aggregate client-side
      const { data: allAnswers } = await sb
        .from('answer_records')
        .select('user_id, is_correct, created_at, hero_pos, scenario_type')

      const aggs: Record<string, { total: number; correct: number; lastActive: string }> = {}
      const posMap: Record<string, number> = {}
      const scenMap: Record<string, number> = {}

      for (const r of allAnswers ?? []) {
        if (!aggs[r.user_id]) aggs[r.user_id] = { total: 0, correct: 0, lastActive: '' }
        aggs[r.user_id].total++
        if (r.is_correct) aggs[r.user_id].correct++
        if (r.created_at > aggs[r.user_id].lastActive) aggs[r.user_id].lastActive = r.created_at

        if (r.hero_pos) posMap[r.hero_pos] = (posMap[r.hero_pos] ?? 0) + 1
        if (r.scenario_type) scenMap[r.scenario_type] = (scenMap[r.scenario_type] ?? 0) + 1
      }

      setAnswerAggs(
        Object.entries(aggs).map(([user_id, v]) => ({ user_id, total: v.total, correct: v.correct }))
      )
      setLastActiveMap(
        Object.fromEntries(Object.entries(aggs).map(([uid, v]) => [uid, v.lastActive]))
      )
      setPositionCounts(
        Object.entries(posMap)
          .map(([hero_pos, count]) => ({ hero_pos, count }))
          .sort((a, b) => b.count - a.count)
      )
      setScenarioCounts(
        Object.entries(scenMap)
          .map(([scenario_type, count]) => ({ scenario_type, count }))
          .sort((a, b) => b.count - a.count)
      )

      // Daily new users (last 7 days)
      const dailyCounts: DailyCount[] = []
      for (let i = 6; i >= 0; i--) {
        const dd = new Date(today)
        dd.setDate(dd.getDate() - i)
        const dateStr = dd.toISOString().slice(0, 10)
        const count = pList.filter(p => p.created_at?.slice(0, 10) === dateStr).length
        dailyCounts.push({ date: dateStr, count })
      }
      setDailyNewUsers(dailyCounts)

      // Course stats
      const { data: courseData } = await sb
        .from('course_progress')
        .select('course_id, completed, unlocked, user_id')

      const cMap: Record<string, { completed: number; unlocked: number; users: Set<string> }> = {}
      for (const r of courseData ?? []) {
        if (!cMap[r.course_id]) cMap[r.course_id] = { completed: 0, unlocked: 0, users: new Set() }
        cMap[r.course_id].users.add(r.user_id)
        if (r.completed) cMap[r.course_id].completed++
        if (r.unlocked) cMap[r.course_id].unlocked++
      }
      setCourseStats(
        Object.entries(cMap).map(([course_id, v]) => ({
          course_id,
          completed_count: v.completed,
          unlocked_count: v.unlocked,
          total_users: v.users.size,
        }))
      )
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  // ── Derived: user table ──────────
  const answerMap = useMemo(() => {
    const m: Record<string, AnswerAgg> = {}
    for (const a of answerAggs) m[a.user_id] = a
    return m
  }, [answerAggs])

  const filteredProfiles = useMemo(() => {
    let list = profiles
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => p.email?.toLowerCase().includes(q) || p.name?.toLowerCase().includes(q))
    }
    list = [...list].sort((a, b) => {
      let va: string | number = ''
      let vb: string | number = ''
      const aa = answerMap[a.id]
      const ab = answerMap[b.id]
      switch (sortKey) {
        case 'email': va = a.email ?? ''; vb = b.email ?? ''; break
        case 'name': va = a.name ?? ''; vb = b.name ?? ''; break
        case 'points': va = a.points ?? 0; vb = b.points ?? 0; break
        case 'total': va = aa?.total ?? 0; vb = ab?.total ?? 0; break
        case 'rate':
          va = aa?.total ? aa.correct / aa.total : 0
          vb = ab?.total ? ab.correct / ab.total : 0
          break
        case 'lastActive':
          va = lastActiveMap[a.id] ?? ''
          vb = lastActiveMap[b.id] ?? ''
          break
        case 'created': va = a.created_at ?? ''; vb = b.created_at ?? ''; break
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [profiles, search, sortKey, sortDir, answerMap, lastActiveMap])

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortArrow = (key: typeof sortKey) =>
    sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''

  // ── Render ───────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a', color: '#888' }}>
        載入管理後台中...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#0a0a0a', color: '#fff' }}>
        <p style={{ color: '#ef4444' }}>載入失敗：{error}</p>
        <button onClick={fetchAll} style={{ padding: '8px 20px', background: '#7c3aed', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
          重試
        </button>
      </div>
    )
  }

  const paidCount = profiles.filter(p => p.is_paid).length
  const correctRate = totalAnswers > 0 ? ((totalCorrect / totalAnswers) * 100).toFixed(1) : '0'
  const maxDailyNew = Math.max(...dailyNewUsers.map(d => d.count), 1)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '24px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>管理後台</h1>
            <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0' }}>GTO Poker Trainer Admin</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={fetchAll}
              style={{ padding: '6px 16px', background: '#222', border: '1px solid #333', borderRadius: 8, color: '#ccc', cursor: 'pointer', fontSize: 13 }}
            >
              重新整理
            </button>
            <button
              onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false) }}
              style={{ padding: '6px 16px', background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: 8, color: '#f87171', cursor: 'pointer', fontSize: 13 }}
            >
              登出
            </button>
            <button
              onClick={() => (window.location.pathname = '/')}
              style={{ padding: '6px 16px', background: '#222', border: '1px solid #333', borderRadius: 8, color: '#ccc', cursor: 'pointer', fontSize: 13 }}
            >
              返回主站
            </button>
          </div>
        </div>

        {/* ─── A. Summary Cards ──────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
          <SummaryCard label="總用戶數" value={profiles.length} />
          <SummaryCard label="付費用戶" value={paidCount} accent />
          <SummaryCard label="總作答數" value={totalAnswers} />
          <SummaryCard label="今日活躍用戶" value={todayActiveUsers} accent />
        </div>

        {/* ─── B. User Growth (7 days) ──────────── */}
        <Section title="新用戶趨勢（近 7 天）">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {dailyNewUsers.map(d => (
              <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, color: '#888', width: 80, textAlign: 'right', flexShrink: 0 }}>
                  {d.date.slice(5)}
                </span>
                <div style={{ flex: 1, position: 'relative', height: 22 }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${(d.count / maxDailyNew) * 100}%`,
                      minWidth: d.count > 0 ? 4 : 0,
                      background: 'linear-gradient(90deg, #7c3aed, #6d28d9)',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span style={{ fontSize: 13, color: '#ccc', width: 30, textAlign: 'right' }}>{d.count}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ─── C. Answer Stats ──────────────────── */}
        <Section title="作答統計">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
            <MiniCard label="總正確率" value={`${correctRate}%`} />
            <MiniCard label="今日作答" value={todayAnswers} sub={`昨日 ${yesterdayAnswers}`} />
            <MiniCard
              label="最常練習位置"
              value={positionCounts[0]?.hero_pos ?? '-'}
              sub={positionCounts.slice(0, 3).map(p => `${p.hero_pos}: ${p.count}`).join('  ')}
            />
            <MiniCard
              label="情境分佈"
              value=""
              sub={scenarioCounts.map(s => `${s.scenario_type}: ${s.count}`).join('  ')}
            />
          </div>
        </Section>

        {/* ─── D. User Table ────────────────────── */}
        <Section title={`用戶列表 (${filteredProfiles.length})`}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="搜尋 Email 或名稱..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                maxWidth: 360,
                padding: '8px 12px',
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  {([
                    ['email', 'Email'],
                    ['name', '名稱'],
                    ['points', '點數'],
                    ['total', '作答數'],
                    ['rate', '正確率'],
                    ['lastActive', '最後活躍'],
                    ['created', '註冊日'],
                  ] as [typeof sortKey, string][]).map(([key, label]) => (
                    <th
                      key={key}
                      onClick={() => toggleSort(key)}
                      style={{
                        padding: '8px 6px',
                        textAlign: 'left',
                        color: '#888',
                        fontWeight: 500,
                        cursor: 'pointer',
                        userSelect: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}{sortArrow(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map(p => {
                  const a = answerMap[p.id]
                  const rate = a && a.total > 0 ? ((a.correct / a.total) * 100).toFixed(1) + '%' : '-'
                  return (
                    <tr
                      key={p.id}
                      style={{ borderBottom: '1px solid #1a1a1a' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#1a1a1a')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '8px 6px', whiteSpace: 'nowrap' }}>
                        {p.email ?? '-'}
                      </td>
                      <td style={{ padding: '8px 6px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                        {p.name ?? '-'}
                        {p.is_paid && (
                          <span style={{
                            fontSize: 10,
                            padding: '1px 6px',
                            background: '#7c3aed',
                            borderRadius: 9999,
                            color: '#fff',
                            fontWeight: 600,
                          }}>PRO</span>
                        )}
                      </td>
                      <td style={{ padding: '8px 6px' }}>{p.points ?? 0}</td>
                      <td style={{ padding: '8px 6px' }}>{a?.total ?? 0}</td>
                      <td style={{ padding: '8px 6px' }}>{rate}</td>
                      <td style={{ padding: '8px 6px', color: '#888', whiteSpace: 'nowrap' }}>
                        {lastActiveMap[p.id] ? formatDate(lastActiveMap[p.id]) : '-'}
                      </td>
                      <td style={{ padding: '8px 6px', color: '#888', whiteSpace: 'nowrap' }}>
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  )
                })}
                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: '#666' }}>
                      沒有符合條件的用戶
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ─── E. Course Stats ──────────────────── */}
        <Section title="課程統計">
          {courseStats.length === 0 ? (
            <p style={{ color: '#666', fontSize: 13 }}>尚無課程資料</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              {courseStats.map(c => (
                <div
                  key={c.course_id}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #222',
                    borderRadius: 12,
                    padding: 16,
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                    {COURSE_NAMES[c.course_id] ?? c.course_id}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#aaa' }}>
                    <span>參與人數：<strong style={{ color: '#fff' }}>{c.total_users}</strong></span>
                    <span>已完成：<strong style={{ color: '#22c55e' }}>{c.completed_count}</strong></span>
                    <span>已解鎖：<strong style={{ color: '#7c3aed' }}>{c.unlocked_count}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '32px 0 16px', color: '#444', fontSize: 12 }}>
          GTO Poker Trainer — Admin Dashboard
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────

function SummaryCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #222',
      borderRadius: 12,
      padding: 20,
    }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent ? '#7c3aed' : '#fff' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  )
}

function MiniCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid #222', borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #222',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, margin: '0 0 16px' }}>{title}</h2>
      {children}
    </div>
  )
}
