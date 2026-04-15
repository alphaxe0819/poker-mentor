import { useState } from 'react'
import PokerFeltV2 from '../components/v2/PokerFeltV2'
import ActionHistoryBarTop from '../components/v2/ActionHistoryBarTop'
import type { HistoryItem } from '../components/v2/ActionHistoryBarTop'
import BetSizingBarV2 from '../components/v2/BetSizingBarV2'
import FeedbackSheetV2 from '../components/v2/FeedbackSheetV2'
import TrainTabV2 from '../tabs/TrainTabV2'

// Shared hero hand row (preserved from existing training mode)
function HeroRow({ cards, lbl }: { cards: Array<{ rank: string; suit: 's' | 'h' | 'd' | 'c' }>; lbl: string }) {
  const SUIT_BG: Record<string, string> = { s: '#3a3d44', h: '#8b2232', d: '#1e5faa', c: '#1a7a3a' }
  const SUIT_BORDER: Record<string, string> = { s: '#555860', h: '#b02e42', d: '#2a78d4', c: '#22994a' }
  const SUIT_SYMBOL: Record<string, string> = { s: '♠', h: '♥', d: '♦', c: '♣' }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center px-2.5 relative z-[5]"
      style={{ marginTop: -24, marginBottom: 4 }}>
      <div />
      <div className="flex flex-col items-center gap-[3px]">
        <div className="flex gap-1">
          {cards.map((c, i) => (
            <div key={i}
              className="relative flex items-center justify-center rounded"
              style={{
                width: 38, height: 54,
                background: SUIT_BG[c.suit], border: `1.5px solid ${SUIT_BORDER[c.suit]}`,
                boxShadow: '0 1px 3px rgba(0,0,0,.5)', color: '#fff',
              }}>
              <span className="absolute top-[2px] left-[4px] text-base font-bold" style={{ color: 'rgba(255,255,255,.95)' }}>
                {SUIT_SYMBOL[c.suit]}
              </span>
              <span className="text-[22px] font-black leading-none">{c.rank}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px]" style={{ color: '#8a92a0' }}>{lbl}</div>
      </div>
      <div />
    </div>
  )
}

export default function V2DemoPage() {
  const [scene, setScene] = useState<'a' | 'b' | 'c' | 'd'>('a')
  const [sheetExpanded, setSheetExpanded] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#0b0c0f', color: '#e6e8ec' }}>
      {/* Scene picker */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#1f232b' }}>
        <h1 className="text-sm font-bold">UI v2 Demo</h1>
        {(['a', 'b', 'c', 'd'] as const).map(s => (
          <button key={s} onClick={() => { setScene(s); setSheetExpanded(false) }}
            className="px-3 py-1 rounded-md text-xs font-bold"
            style={{
              background: scene === s ? '#2a1654' : '#151820',
              color: scene === s ? '#fff' : '#8a92a0',
              border: `1px solid ${scene === s ? '#7c3aed' : '#1f232b'}`,
            }}>
            Scene {s.toUpperCase()}
          </button>
        ))}
        <div className="ml-auto text-[11px]" style={{ color: '#8a92a0' }}>
          {scene === 'a' && '9-max 翻前決策（靜態）'}
          {scene === 'b' && '6-max 回饋 sheet（靜態）'}
          {scene === 'c' && 'HU 翻牌圈（靜態）'}
          {scene === 'd' && 'TrainTabV2（實際 engine）'}
        </div>
      </div>

      {/* Phone frame */}
      <div className="flex justify-center py-6 px-4">
        <div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: 390, height: 844,
            background: '#08090b',
            borderRadius: 36,
            border: '8px solid #1a1d22',
            boxShadow: '0 20px 60px rgba(0,0,0,.55)',
          }}>
          {scene === 'a' && <SceneA />}
          {scene === 'b' && <SceneB sheetExpanded={sheetExpanded} setSheetExpanded={setSheetExpanded} />}
          {scene === 'c' && <SceneC />}
          {scene === 'd' && <TrainTabV2 guestMode isPaid points={999} />}
        </div>
      </div>

      <div className="text-center pb-8 text-[11px]" style={{ color: '#565d6a' }}>
        Components: PokerFeltV2 · ActionHistoryBarTop · BetSizingBarV2 · FeedbackSheetV2
      </div>
    </div>
  )
}

// ================= SCENE A: 9-max preflop =================
function SceneA() {
  const items: HistoryItem[] = [
    { label: 'UTG', detail: 'R 2.5', kind: 'villain' },
    { label: 'UTG+1', detail: 'F', kind: 'folded' },
    { label: 'UTG+2', detail: 'F', kind: 'folded' },
    { label: 'LJ', detail: 'F', kind: 'folded' },
    { label: 'HJ', detail: 'F', kind: 'folded' },
    { label: 'CO', detail: 'F', kind: 'folded' },
    { label: 'BTN', detail: '?', kind: 'hero' },
  ]
  return (
    <>
      <ActionHistoryBarTop items={items} onBack={() => alert('back')} />
      <div className="flex-1 relative">
        <PokerFeltV2
          tableSize={9}
          heroPosition="BTN"
          potTotal={4}
          seatInfo={{
            BTN: { status: 'hero', bet: 0, stack: 100 },
            SB:  { status: 'waiting', bet: 0.5, stack: 99.5, hasCards: true },
            BB:  { status: 'waiting', bet: 1, stack: 99, hasCards: true },
            UTG: { status: 'raised', bet: 2.5, stack: 97.5, hasCards: true },
            'UTG+1': { status: 'folded', bet: 0, stack: 100 },
            'UTG+2': { status: 'folded', bet: 0, stack: 100 },
            LJ:  { status: 'folded', bet: 0, stack: 100 },
            HJ:  { status: 'folded', bet: 0, stack: 100 },
            CO:  { status: 'folded', bet: 0, stack: 100 },
          }}
        />
      </div>
      <HeroRow
        cards={[{ rank: 'A', suit: 's' }, { rank: 'K', suit: 'h' }]}
        lbl="AKo · 面對 UTG 2.5BB"
      />
      <BetSizingBarV2
        canFold canCheck={false} canCall callAmount={2.5}
        sizingOptions={[
          { label: '3B 2.5x', amount: 6.25, kind: 'raise' },
          { label: '3B 3x', amount: 7.5, kind: 'raise' },
          { label: '3B 4x', amount: 10, kind: 'raise' },
        ]}
        canAllIn={false}
        onAction={(a) => console.log('action:', a)}
      />
    </>
  )
}

// ================= SCENE B: 6-max feedback sheet =================
function SceneB({ sheetExpanded, setSheetExpanded }: { sheetExpanded: boolean; setSheetExpanded: (v: boolean) => void }) {
  const items: HistoryItem[] = [
    { label: 'UTG', detail: 'R 2.5', kind: 'villain' },
    { label: 'HJ', detail: 'F', kind: 'folded' },
    { label: 'CO', detail: 'F', kind: 'folded' },
    { label: 'BTN', detail: 'Call', kind: 'hero' },
    { label: 'BB', detail: 'Call', kind: 'neutral' },
    { label: 'Flop', detail: 'K♣7♠2♠', kind: 'neutral' },
  ]
  return (
    <>
      <ActionHistoryBarTop items={items} onBack={() => alert('back')} />
      <div className="flex-1 relative">
        <PokerFeltV2
          tableSize={6}
          heroPosition="BTN"
          potTotal={8}
          boardCards={[
            { rank: 'K', suit: 'c' }, { rank: '7', suit: 's' }, { rank: '2', suit: 's' },
          ]}
          seatInfo={{
            BTN: { status: 'hero', bet: 0, stack: 97.5 },
            SB:  { status: 'folded', bet: 0, stack: 99.5 },
            BB:  { status: 'active', bet: 0, stack: 97.5, hasCards: true },
            UTG: { status: 'folded', bet: 0, stack: 97.5 },
            HJ:  { status: 'folded', bet: 0, stack: 100 },
            CO:  { status: 'folded', bet: 0, stack: 100 },
          }}
        />
        <FeedbackSheetV2
          isCorrect={false}
          tip="AKo · BTN vs UTG 高頻 3-bet"
          actions={[
            { label: '3-Bet to 7.5', freq: 68, color: '#ef4444', evText: 'EV +3.2' },
            { label: 'Call', freq: 32, color: '#10b981', evText: 'EV +1.4', isYours: true },
          ]}
          streets={[
            { street: 'preflop', state: 'err' },
            { street: 'flop', state: 'pending' },
            { street: 'turn', state: 'pending' },
            { street: 'river', state: 'pending' },
          ]}
          explanation={'AKo 在 BTN vs UTG 加注的情境是高價值牌，在 SRP（single raised pot）即便被 call 也能頻繁靠強 top pair + 好 kicker 贏下底池。\nCall 會錯過壓縮範圍的價值：3-Bet 後 UTG 需面對更窄的 continue range，你拿到主動權 + 更好的翻牌圈底池幾何。\n僅建議在特別深籌（150BB+）或 UTG 是極 tight 玩家時降頻 call。'}
          explanationTitle="為什麼應該 3-Bet？"
          expanded={sheetExpanded}
          onToggleExpand={() => setSheetExpanded(!sheetExpanded)}
          onViewRange={() => alert('view range')}
          onNext={() => alert('next')}
          onAskAI={() => alert('ask AI')}
        />
      </div>
    </>
  )
}

// ================= SCENE C: HU flop =================
function SceneC() {
  const items: HistoryItem[] = [
    { label: 'BTN', detail: 'R 2.5', kind: 'villain' },
    { label: 'BB', detail: 'Call', kind: 'hero' },
    { label: 'Flop', detail: 'Q♥9♦4♣', kind: 'neutral' },
    { label: 'BTN', detail: 'Bet 5', kind: 'villain' },
    { label: 'BB', detail: '?', kind: 'hero' },
  ]
  return (
    <>
      <ActionHistoryBarTop items={items} onBack={() => alert('back')} />
      <div className="flex-1 relative">
        <PokerFeltV2
          tableSize={2}
          heroPosition="BB"
          potTotal={10}
          boardCards={[
            { rank: 'Q', suit: 'h' }, { rank: '9', suit: 'd' }, { rank: '4', suit: 'c' },
          ]}
          seatInfo={{
            BB:  { status: 'hero', bet: 5, stack: 35 },
            BTN: { status: 'raised', bet: 5, stack: 35, hasCards: true },
          }}
        />
      </div>
      <HeroRow
        cards={[{ rank: 'J', suit: 'c' }, { rank: 'T', suit: 'h' }]}
        lbl="開放 + 內順 · 8 outs"
      />
      <BetSizingBarV2
        canFold canCheck={false} canCall callAmount={5}
        sizingOptions={[
          { label: 'RAISE 2x', amount: 10, kind: 'raise' },
          { label: 'RAISE 2.5x', amount: 12.5, kind: 'raise' },
        ]}
        canAllIn allInAmount={35}
        onAction={(a) => console.log('action:', a)}
      />
    </>
  )
}
