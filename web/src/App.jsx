import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/auth/LoginPage'
import RegisterPage     from './pages/auth/RegisterPage'
import FarmerDashboard  from './pages/farmer/FarmerDashboard'
import PrediksiHargaPage from './pages/farmer/PrediksiHargaPage'
import CreditScorePage  from './pages/farmer/CreditScorePage'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

function ProtectedRoute({ children, allowedRoles }) {
  const { isLoggedIn, user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen bg-agro-dark flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
    </div>
  )
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />

      {/* Auth */}
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={
        <ProtectedRoute allowedRoles={['petani', 'admin']}>
          <FarmerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/farmer/harga" element={
        <ProtectedRoute allowedRoles={['petani', 'admin']}>
          <PrediksiHargaPage />
        </ProtectedRoute>
      } />
      <Route path="/farmer/kredit" element={
        <ProtectedRoute allowedRoles={['petani', 'admin']}>
          <CreditScorePage />
        </ProtectedRoute>
      } />

      {/* Placeholder routes */}
      <Route path="/farmer/*" element={
        <ProtectedRoute allowedRoles={['petani', 'admin']}>
          <div className="min-h-screen bg-agro-dark flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-4xl mb-4">🚧</p>
              <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
              <p className="text-gray-400">Halaman sedang dalam pengembangan</p>
            </div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/buyer/*" element={
        <ProtectedRoute allowedRoles={['pembeli', 'admin']}>
          <div className="min-h-screen bg-agro-dark flex items-center justify-center text-white">
            <div className="text-center"><p className="text-4xl mb-4">🛒</p>
              <h1 className="text-2xl font-bold mb-2">Dashboard Pembeli</h1>
              <p className="text-gray-400">Coming soon...</p></div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <div className="min-h-screen bg-agro-dark flex items-center justify-center text-white">
            <div className="text-center"><p className="text-4xl mb-4">⚙️</p>
              <h1 className="text-2xl font-bold mb-2">Dashboard Admin</h1>
              <p className="text-gray-400">Coming soon...</p></div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="/partner/*" element={
        <ProtectedRoute allowedRoles={['mitra', 'admin']}>
          <div className="min-h-screen bg-agro-dark flex items-center justify-center text-white">
            <div className="text-center"><p className="text-4xl mb-4">🏦</p>
              <h1 className="text-2xl font-bold mb-2">Dashboard Mitra</h1>
              <p className="text-gray-400">Coming soon...</p></div>
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen font-sans">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App