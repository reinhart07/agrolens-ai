import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage         from './pages/LandingPage'
import LoginPage           from './pages/auth/LoginPage'
import RegisterPage        from './pages/auth/RegisterPage'
import FarmerDashboard     from './pages/farmer/FarmerDashboard'
import PrediksiHargaPage   from './pages/farmer/PrediksiHargaPage'
import CreditScorePage     from './pages/farmer/CreditScorePage'
import ChatbotPage         from './pages/farmer/ChatbotPage'
import PetaPage            from './pages/farmer/PetaPage'
import DeteksiKualitasPage from './pages/farmer/DeteksiKualitasPage'
import LaporanPage         from './pages/farmer/LaporanPage'
import FarmerPesananPage   from './pages/farmer/FarmerPesananPage'
import KomoditasSayaPage   from './pages/farmer/KomoditasSayaPage'
import ProfilPage          from './pages/farmer/ProfilPage'
import PremiumPage         from './pages/farmer/PremiumPage'
import BuyerHome           from './pages/buyer/BuyerHome'
import BrowsePage          from './pages/buyer/BrowsePage'
import BuyerPesanan        from './pages/buyer/BuyerPesanan'
import CheckoutPage        from './pages/buyer/CheckoutPage'
import WishlistPage        from './pages/buyer/WishlistPage'
import BuyerMapsPage       from './pages/buyer/BuyerMapsPage'
import BuyerChatbotPage    from './pages/buyer/BuyerChatbotPage'
import InvoicePage         from './pages/buyer/InvoicePage'
import AdminDashboard      from './pages/admin/AdminDashboard'
import AdminUsers          from './pages/admin/AdminUsers'
import AdminKomoditas      from './pages/admin/AdminKomoditas'
import AdminPesanan        from './pages/admin/AdminPesanan'
import AdminHarga          from './pages/admin/AdminHarga'
import AdminKredit         from './pages/admin/AdminKredit'
import AdminLaporan        from './pages/admin/AdminLaporan'
import AdminSettings       from './pages/admin/AdminSettings'
import MitraDashboard      from './pages/mitra/MitraDashboard'
import MitraPetani         from './pages/mitra/MitraPetani'
import MitraHarga          from './pages/mitra/MitraHarga'
import MitraKredit         from './pages/mitra/MitraKredit'
import MitraLaporan        from './pages/mitra/MitraLaporan'
import MitraSettings       from './pages/mitra/MitraSettings'
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
      <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── FARMER ── */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['petani','admin']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/harga"     element={<ProtectedRoute allowedRoles={['petani','admin']}><PrediksiHargaPage /></ProtectedRoute>} />
      <Route path="/farmer/kredit"    element={<ProtectedRoute allowedRoles={['petani','admin']}><CreditScorePage /></ProtectedRoute>} />
      <Route path="/farmer/chatbot"   element={<ProtectedRoute allowedRoles={['petani','admin']}><ChatbotPage /></ProtectedRoute>} />
      <Route path="/farmer/maps"      element={<ProtectedRoute allowedRoles={['petani','admin']}><PetaPage /></ProtectedRoute>} />
      <Route path="/farmer/kualitas"  element={<ProtectedRoute allowedRoles={['petani','admin']}><DeteksiKualitasPage /></ProtectedRoute>} />
      <Route path="/farmer/laporan"   element={<ProtectedRoute allowedRoles={['petani','admin']}><LaporanPage /></ProtectedRoute>} />
      <Route path="/farmer/pesanan"   element={<ProtectedRoute allowedRoles={['petani','admin']}><FarmerPesananPage /></ProtectedRoute>} />
      <Route path="/farmer/komoditas" element={<ProtectedRoute allowedRoles={['petani','admin']}><KomoditasSayaPage /></ProtectedRoute>} />
      <Route path="/farmer/profil"    element={<ProtectedRoute allowedRoles={['petani','admin']}><ProfilPage /></ProtectedRoute>} />
      <Route path="/farmer/premium"   element={<ProtectedRoute allowedRoles={['petani','admin']}><PremiumPage /></ProtectedRoute>} />
      <Route path="/farmer/*"         element={<Navigate to="/farmer/dashboard" replace />} />

      {/* ── BUYER ── */}
      <Route path="/buyer/home"     element={<ProtectedRoute allowedRoles={['pembeli','admin']}><BuyerHome /></ProtectedRoute>} />
      <Route path="/buyer/browse"   element={<ProtectedRoute allowedRoles={['pembeli','admin']}><BrowsePage /></ProtectedRoute>} />
      <Route path="/buyer/pesanan"  element={<ProtectedRoute allowedRoles={['pembeli','admin']}><BuyerPesanan /></ProtectedRoute>} />
      <Route path="/buyer/checkout" element={<ProtectedRoute allowedRoles={['pembeli','admin']}><CheckoutPage /></ProtectedRoute>} />
      <Route path="/buyer/wishlist" element={<ProtectedRoute allowedRoles={['pembeli','admin']}><WishlistPage /></ProtectedRoute>} />
      <Route path="/buyer/maps"     element={<ProtectedRoute allowedRoles={['pembeli','admin']}><BuyerMapsPage /></ProtectedRoute>} />
      <Route path="/buyer/chatbot"  element={<ProtectedRoute allowedRoles={['pembeli','admin']}><BuyerChatbotPage /></ProtectedRoute>} />
      <Route path="/buyer/invoice"  element={<ProtectedRoute allowedRoles={['pembeli','admin']}><InvoicePage /></ProtectedRoute>} />
      <Route path="/buyer/*"        element={<Navigate to="/buyer/home" replace />} />

      {/* ── ADMIN ── */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users"     element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/komoditas" element={<ProtectedRoute allowedRoles={['admin']}><AdminKomoditas /></ProtectedRoute>} />
      <Route path="/admin/pesanan"   element={<ProtectedRoute allowedRoles={['admin']}><AdminPesanan /></ProtectedRoute>} />
      <Route path="/admin/harga"     element={<ProtectedRoute allowedRoles={['admin']}><AdminHarga /></ProtectedRoute>} />
      <Route path="/admin/kredit"    element={<ProtectedRoute allowedRoles={['admin']}><AdminKredit /></ProtectedRoute>} />
      <Route path="/admin/laporan"   element={<ProtectedRoute allowedRoles={['admin']}><AdminLaporan /></ProtectedRoute>} />
      <Route path="/admin/settings"  element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/*"         element={<Navigate to="/admin/dashboard" replace />} />

      {/* ── MITRA KEUANGAN ── */}
      <Route path="/mitra/dashboard" element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraDashboard /></ProtectedRoute>} />
      <Route path="/mitra/petani"    element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraPetani /></ProtectedRoute>} />
      <Route path="/mitra/harga"     element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraHarga /></ProtectedRoute>} />
      <Route path="/mitra/kredit"    element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraKredit /></ProtectedRoute>} />
      <Route path="/mitra/laporan"   element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraLaporan /></ProtectedRoute>} />
      <Route path="/mitra/settings"  element={<ProtectedRoute allowedRoles={['mitra','admin']}><MitraSettings /></ProtectedRoute>} />
      <Route path="/mitra/*"         element={<Navigate to="/mitra/dashboard" replace />} />

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