import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, ShoppingCart, Package, MapPin,
  MessageCircle, Bell, LogOut, Menu, Leaf,
  ChevronRight, User, Heart, FileText
} from 'lucide-react'

const navItems = [
  { to: '/buyer/home',      icon: LayoutDashboard, label: 'Beranda' },
  { to: '/buyer/browse',    icon: ShoppingCart,    label: 'Browse Komoditas' },
  { to: '/buyer/pesanan',   icon: Package,         label: 'Pesanan Saya' },
  { to: '/buyer/wishlist',  icon: Heart,           label: 'Wishlist' },
  { to: '/buyer/maps',      icon: MapPin,          label: 'Peta Petani' },
  { to: '/buyer/chatbot',   icon: MessageCircle,   label: 'Chatbot AI' },
  { to: '/buyer/invoice',   icon: FileText,        label: 'Invoice & Struk' },
]

export default function BuyerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-agro-dark flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-agro-dark border-r border-white/10 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-white leading-none">AgroLens AI</p>
            <p className="text-xs text-primary-400">Dashboard Pembeli</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon   = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            )
          })}
        </nav>

        {/* User + Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-agro-dark/90 backdrop-blur border-b border-white/10 px-4 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <button className="relative text-gray-400 hover:text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full border-2 border-agro-dark" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-400" />
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">{user?.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}