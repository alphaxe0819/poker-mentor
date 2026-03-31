import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './pages/Splash'
import Auth from './pages/Auth'
import AppPage from './pages/App'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
