import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './queryClient'
import { useAuthStore } from './store/auth.store'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VerifyPage from './pages/VerifyPage'
import WardrobePage from './pages/WardrobePage'
import UploadPage from './pages/UploadPage'
import OutfitPage from './pages/OutfitPage'

function App() {
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === 'access_token' || event.key === 'refresh_token' || event.key === null) {
        useAuthStore.getState().loadFromStorage()
      }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/wardrobe" element={<ProtectedRoute><WardrobePage /></ProtectedRoute>} />
          <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
          <Route path="/outfit" element={<ProtectedRoute><OutfitPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
