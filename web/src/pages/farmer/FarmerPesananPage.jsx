import { useState, useEffect } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { Package, CheckCircle, XCircle, Truck, Clock, RefreshCw, Search } from 'lucide-react'

const STATUS_CONFIG = {
  menunggu    : { label: 'Menunggu',      icon: Clock,       color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20' },
  dikonfirmasi: { label: 'Dikonfirmasi',  icon: CheckCircle, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  dikirim     : { label: 'Dikirim',       icon: Truck,       color: 'text-agro-green',  bg: 'bg-agro-green/10 border-agro-green/20' },
  selesai     : { label: 'Selesai',       icon: CheckCircle, color: 'text-agro-green',  bg: 'bg-agro-green/10 border-agro-green/20' },
  dibatalkan  : { label: 'Dibatalkan',    icon: XCircle,     color: 'text-red-400',     bg: 'bg-red-500/10 border-red-500/20' },
}

export default function FarmerPesananPage() {
  const [orders, setOrders]   = useState([])
  const [filter, setFilter]   = useState('semua')
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders/farmer')
      setOrders(res.data.orders || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status })
      fetchOrders()
    } catch (err) {
      alert('Gagal update status')
    }
  }

  const tabs = ['semua', 'menunggu', 'dikonfirmasi', 'dikirim', 'selesai', 'dibatalkan']

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'semua' || o.status === filter
    const matchSearch = o.komoditas?.toLowerCase().includes(search.toLowerCase()) ||
                        o.buyer_name?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  // Stats
  const stats = {
    menunggu    : orders.filter(o => o.status === 'menunggu').length,
    dikonfirmasi: orders.filter(o => o.status === 'dikonfirmasi').length,
    dikirim     : orders.filter(o => o.status === 'dikirim').length,
    selesai     : orders.filter(o => o.status === 'selesai').length,
  }

  return (
    <FarmerLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">📦 Kelola Pesanan</h1>
          <p className="text-gray-400">Monitor dan konfirmasi pesanan dari pembeli</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Menunggu',     value: stats.menunggu,     color: 'text-amber-400',   bg: 'bg-amber-500/10' },
          { label: 'Dikonfirmasi', value: stats.dikonfirmasi, color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { label: 'Dikirim',      value: stats.dikirim,      color: 'text-agro-green',  bg: 'bg-agro-green/10' },
          { label: 'Selesai',      value: stats.selesai,      color: 'text-white',       bg: 'bg-white/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{loading ? '—' : s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari komoditas atau nama pembeli..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === tab ? 'bg-agro-green text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold mb-1">Belum ada pesanan</p>
          <p className="text-gray-400 text-sm">Pesanan dari pembeli akan muncul di sini</p>
        </div>
      )}

      {/* Orders */}
      {!loading && filtered.map((order) => {
        const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.menunggu
        const Icon = statusCfg.icon
        return (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order #{order.id} · {order.created_at?.split(' ')[0]}</p>
                <p className="font-semibold text-white text-lg">{order.komoditas}</p>
                <p className="text-sm text-gray-400">
                  Pembeli: <span className="text-white">{order.buyer_name}</span>
                </p>
                <p className="text-sm text-gray-400">
                  {order.jumlah} kg × Rp {order.harga_per_kg?.toLocaleString('id-ID')}
                </p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}>
                <Icon className="w-3 h-3" />
                {statusCfg.label}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="font-extrabold text-white">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">{order.metode_bayar}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap justify-end">
                {order.status === 'menunggu' && (
                  <>
                    <button onClick={() => updateStatus(order.id, 'dikonfirmasi')}
                      className="flex items-center gap-1.5 bg-agro-green/20 hover:bg-agro-green/30 border border-agro-green/20 text-agro-green text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                      <CheckCircle className="w-3 h-3" /> Konfirmasi
                    </button>
                    <button onClick={() => updateStatus(order.id, 'dibatalkan')}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                      <XCircle className="w-3 h-3" /> Tolak
                    </button>
                  </>
                )}
                {order.status === 'dikonfirmasi' && (
                  <button onClick={() => updateStatus(order.id, 'dikirim')}
                    className="flex items-center gap-1.5 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/20 text-primary-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                    <Truck className="w-3 h-3" /> Tandai Dikirim
                  </button>
                )}
                {order.status === 'dikirim' && (
                  <button onClick={() => updateStatus(order.id, 'selesai')}
                    className="flex items-center gap-1.5 bg-agro-green/20 hover:bg-agro-green/30 border border-agro-green/20 text-agro-green text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                    <CheckCircle className="w-3 h-3" /> Selesai
                  </button>
                )}
              </div>
            </div>

            {order.alamat_pengiriman && (
              <p className="text-xs text-gray-600 mt-2">📍 {order.alamat_pengiriman}</p>
            )}
            {order.catatan && (
              <p className="text-xs text-gray-500 mt-1">💬 {order.catatan}</p>
            )}
          </div>
        )
      })}
    </FarmerLayout>
  )
}