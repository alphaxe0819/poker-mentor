import { Component, type ReactNode } from 'react'
import * as Sentry from '@sentry/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6"
             style={{ background: '#0a0a0a' }}>
          <div className="text-4xl">⚠️</div>
          <div className="text-white font-bold text-lg">發生錯誤</div>
          <div className="text-gray-500 text-sm text-center max-w-xs">
            {this.state.error?.message ?? '未知錯誤'}
          </div>
          <div className="flex gap-3 mt-2">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
              style={{ background: '#7c3aed' }}>
              重試
            </button>
            <button
              onClick={() => {
                localStorage.clear()
                sessionStorage.clear()
                window.location.reload()
              }}
              className="px-5 py-2.5 rounded-full text-sm"
              style={{ background: '#1a1a1a', border: '1px solid #333', color: '#aaa' }}>
              重新載入
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
