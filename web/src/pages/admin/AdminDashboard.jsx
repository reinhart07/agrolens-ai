import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import {
  Users, ShoppingBag, Package, TrendingUp,
  ArrowRight, Activity, CheckCircle, XCircle, Leaf
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState(null)
  const [health, setHealth] = useState(null)
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, healthRes, usersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/health'),
          api.get('/admin/users'),
        ])
        setStats(statsRes.data)
        setHealth(healthRes.data)
        setUsers(usersRes.data.users?.slice(0, 5) || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const modelStatus = health?.models || {}
  const modelsLoaded = Object.values(modelStatus).filter(Boolean).length
  const totalModels  = Object.keys(modelStatus).length

  const ROLE_COLOR = {
    petani : 'bg-agro-green/20 text-agro-green',
    pembeli: 'bg-primary-500/20 text-primary-400',
    mitra  : 'bg-amber-500/20 text-amber-400',
    admin  : 'bg-purple-500/20 text-purple-400',
  }

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">⚙️</span>
          <h1 className="text-2xl font-extrabold text-white">Dashboard Admin</h1>
        </div>
        <p className="text-gray-400">Monitor sistem, user, dan transaksi AgroLens AI.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total User"
          value={loading ? '...' : stats?.total_users ?? '—'}
          sub={loading ? '' : `${stats?.total_petani ?? 0} petani · ${stats?.total_pembeli ?? 0} pembeli`}
          color="text-purple-400"
          bg="bg-purple-500/10"
        />
        <StatCard
          icon={ShoppingBag}
          label="Petani Terdaftar"
          value={loading ? '...' : stats?.total_petani ?? '—'}
          sub="Role petani"
          color="text-agro-green"
          bg="bg-agro-green/10"
        />
        <StatCard
          icon={Package}
          label="Pembeli"
          value={loading ? '...' : stats?.total_pembeli ?? '—'}
          sub="Role pembeli"
          color="text-primary-400"
          bg="bg-primary-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Mitra Keuangan"
          value={loading ? '...' : stats?.total_mitra ?? '—'}
          sub="Role mitra"
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">

        {/* Status Model ML */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-white">Status Model ML</h2>
              <p className="text-xs text-gray-500">{modelsLoaded}/{totalModels} model aktif</p>
            </div>
            <Activity className="w-5 h-5 text-gray-500" />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-10 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {[
                { key: 'price_xgb',  label: 'XGBoost — Prediksi Harga',   icon: '📈' },
                { key: 'price_lstm', label: 'LSTM — Prediksi Harga',       icon: '🔮' },
                { key: 'quality',    label: 'MobileNetV2 — Kualitas',      icon: '📷' },
                { key: 'credit',     label: 'RandomForest — Credit Score', icon: '💳' },
              ].map(m => {
                const active = modelStatus[m.key]
                return (
                  <div key={m.key} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{m.icon}</span>
                      <span className="text-xs text-gray-300">{m.label}</span>
                    </div>
                    {active
                      ? <CheckCircle className="w-4 h-4 text-agro-green flex-shrink-0" />
                      : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    }
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* User Terbaru */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-white">User Terbaru</h2>
              <p className="text-xs text-gray-500">5 user terakhir mendaftar</p>
            </div>
            <Link to="/admin/users" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              <Users className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p>Belum ada user terdaftar</p>
            </div>
          ) : (
            <div>
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{u.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-white/10 text-gray-400'}`}>
                      {u.role}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${u.is_active ? 'bg-agro-green' : 'bg-red-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { to: '/admin/users',     icon: '👥', label: 'Kelola User',      color: 'border-purple-500/20 hover:bg-purple-500/5' },
          { to: '/admin/komoditas', icon: '🌾', label: 'Kelola Komoditas', color: 'border-agro-green/20 hover:bg-agro-green/5' },
          { to: '/admin/pesanan',   icon: '📦', label: 'Monitor Pesanan',  color: 'border-primary-500/20 hover:bg-primary-500/5' },
          { to: '/admin/laporan',   icon: '📊', label: 'Export Laporan',   color: 'border-amber-500/20 hover:bg-amber-500/5' },
        ].map((item, i) => (
          <Link key={i} to={item.to}
            className={`flex items-center gap-3 p-4 bg-white/3 border ${item.color} rounded-xl transition-all duration-200 hover:-translate-y-0.5`}>
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-300">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Info Hackathon */}
      <div className="bg-gradient-to-r from-purple-600/20 to-agro-green/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="w-5 h-5 text-agro-green" />
          <p className="font-bold text-white">AgroLens AI — PIDI DIGDAYA X HACKATHON 2026</p>
        </div>
        <p className="text-gray-400 text-sm">Tim Sonic | Universitas Dipa Makassar | Bank Indonesia & OJK</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {['XGBoost MAPE 5.53%', 'LSTM R² 0.9623', 'MobileNetV2 97.83%', 'RandomForest AUC 0.9275'].map((m, i) => (
            <span key={i} className="text-xs bg-white/10 text-gray-300 px-3 py-1 rounded-full">{m}</span>
          ))}
        </div>
      </div>

    </AdminLayout>
  )
}