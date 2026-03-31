import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import TrainTab from '../tabs/TrainTab'
import QuizTab from '../tabs/QuizTab'
import CoachListTab from '../tabs/CoachListTab'
import StatsTab from '../tabs/StatsTab'
import ProfileTab from '../tabs/ProfileTab'
import { VERSION } from '../version'

type Tab = 'train' | 'quiz' | 'coach' | 'stats' | 'profile'

export default function App() {
  const [tab, setTab] = useState<Tab>('train')

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'train'   && <TrainTab />}
        {tab === 'quiz'    && <QuizTab />}
        {tab === 'coach'   && <CoachListTab />}
        {tab === 'stats'   && <StatsTab />}
        {tab === 'profile' && <ProfileTab />}
      </div>
      <div className="fixed bottom-16 right-3 text-gray-600 text-[10px] pointer-events-none">
        {VERSION}
      </div>
      <BottomNav current={tab} onChange={setTab} />
    </div>
  )
}
