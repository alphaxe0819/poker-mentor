
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './pages/App'
import ErrorBoundary from './components/ErrorBoundary'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
)
