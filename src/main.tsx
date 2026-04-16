
import ReactDOM from 'react-dom/client'
import { lazy, Suspense } from 'react'
import * as Sentry from '@sentry/react'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

// Demo/exploit routes bypass App.tsx to avoid Supabase-init coupling in dev without .env
const V2DemoPage = lazy(() => import('./pages/V2DemoPage'))
const ExploitLabPage = lazy(() => import('./pages/ExploitLabPage'))
const App = lazy(() => import('./pages/App'))

// Sentry 初始化 — 設定 DSN 後即可啟用
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

const isDemo = window.location.pathname === '/v2-demo'
const isExploit = window.location.pathname === '/exploit'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <Suspense fallback={<div />}>
      {isExploit ? <ExploitLabPage /> : isDemo ? <V2DemoPage /> : <App />}
    </Suspense>
  </ErrorBoundary>
)
