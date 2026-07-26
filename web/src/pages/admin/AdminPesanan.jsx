import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { Package, Search, RefreshCw, CheckCircle, XCircle, Truck, Clock } from 'lucide-react'

const STATUS_CONFIG = {
  menunggu    : { label: 'Menunggu',      icon: Clock,       color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  dikonfirmasi: { label: 'Dikonfirmasi',  icon: CheckCircle, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  dikirim     : { label: 'Dikirim',       icon: Truck,       color: 'text-agro-green',  bg: 'bg-agro-green/10 border-agro-green/20' },
  selesai     : { label: 'Selesai',       icon: CheckCircle, color: 'text-agro-green',  bg: 'bg-agro-green/10 border-agro-green/20' },
  dibatalkan  : { label: 'Dibatalkan',    icon: XCircle,     color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
}

export default function AdminPesanan() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('semua')
  const [stats, setStats]     = useState({})

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders/admin/all')
      setOrders(res.data.orders || [])
      setStats(res.data.stats || {})
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status })
      fetchOrders()
    } catch { alert('Gagal update status') }
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'semua' || o.status === filter
    const matchSearch = o.komoditas?.toLowerCase().includes(search.toLowerCase()) ||
                        o.buyer_name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">📦 Monitor Pesanan</h1>
          <p className="text-gray-400">Pantau semua transaksi di marketplace AgroLens</p>
        </div>
        <button onClick={fetchOrders} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-2 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total',        value: orders.length,              color: 'text-white' },
          { label: 'Menunggu',     value: stats.menunggu || 0,        color: 'text-amber-400' },
          { label: 'Dikonfirmasi', value: stats.dikonfirmasi || 0,    color: 'text-primary-400' },
          { label: 'Dikirim',      value: stats.dikirim || 0,         color: 'text-agro-green' },
          { label: 'Selesai',      value: stats.selesai || 0,         color: 'text-agro-green' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{loading ? '—' : s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari komoditas atau nama pembeli..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['semua', 'menunggu', 'dikonfirmasi', 'dikirim', 'selesai', 'dibatalkan'].map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === tab ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const sc   = STATUS_CONFIG[order.status] || STATUS_CONFIG.menunggu
            const Icon = sc.icon
            return (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order #{order.id} · {order.created_at?.split(' ')[0]}</p>
                    <p className="font-semibold text-white text-lg">{order.komoditas}</p>
                    <p className="text-sm text-gray-400">Pembeli: <span className="text-white">{order.buyer_name}</span></p>
                    <p className="text-sm text-gray-400">{order.jumlah} kg × Rp {order.harga_per_kg?.toLocaleString('id-ID')}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.color}`}>
                    <Icon className="w-3 h-3" />{sc.label}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-extrabold text-white">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500">{order.metode_bayar}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {order.status === 'menunggu' && (
                      <>
                        <button onClick={() => updateStatus(order.id, 'dikonfirmasi')}
                          className="text-xs font-semibold px-3 py-2 bg-agro-green/20 hover:bg-agro-green/30 border border-agro-green/20 text-agro-green rounded-xl transition-all">
                          Konfirmasi
                        </button>
                        <button onClick={() => updateStatus(order.id, 'dibatalkan')}
                          className="text-xs font-semibold px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl transition-all">
                          Batalkan
                        </button>
                      </>
                    )}
                    {order.status === 'dikonfirmasi' && (
                      <button onClick={() => updateStatus(order.id, 'dikirim')}
                        className="text-xs font-semibold px-3 py-2 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/20 text-primary-400 rounded-xl transition-all">
                        Tandai Dikirim
                      </button>
                    )}
                    {order.status === 'dikirim' && (
                      <button onClick={() => updateStatus(order.id, 'selesai')}
                        className="text-xs font-semibold px-3 py-2 bg-agro-green/20 hover:bg-agro-green/30 border border-agro-green/20 text-agro-green rounded-xl transition-all">
                        Tandai Selesai
                      </button>
                    )}
                  </div>
                </div>
                {order.alamat_pengiriman && <p className="text-xs text-gray-600 mt-2">📍 {order.alamat_pengiriman}</p>}
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}