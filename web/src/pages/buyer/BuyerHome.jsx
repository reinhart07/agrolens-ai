import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BuyerLayout from '../../components/layout/BuyerLayout'
import api from '../../services/api'
import {
  ShoppingCart, Package, Star, ArrowRight,
  MapPin, Leaf, Search, Heart, TrendingDown
} from 'lucide-react'

function KomoditasCard({ item, wishlist, onToggleWishlist }) {
  const navigate = useNavigate()
  const gradeColor = {
    A: 'bg-agro-green/20 text-agro-green',
    B: 'bg-amber-500/20 text-amber-400',
    C: 'bg-red-500/20 text-red-400',
  }
  const isWishlisted = wishlist.some(w => w.id === item.id)

  const handleBeli = () => {
    navigate('/buyer/checkout', {
      state: {
        produk: {
          id       : item.id,
          nama     : item.nama,
          harga    : item.harga,
          satuan   : item.satuan || 'kg',
          petani   : item.petani_name,
          petani_id: item.petani_id,
          foto_url : item.foto_url,
        }
      }
    })
  }

  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-40 overflow-hidden bg-agro-green/5">
        {item.foto_url ? (
          <img src={item.foto_url} alt={item.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🌾</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-agro-dark/60 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor[item.grade] || gradeColor.A}`}>
          Grade {item.grade}
        </span>
        {/* Tombol Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(item) }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-black/40 text-white hover:bg-red-500/80'
          }`}>
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-1 truncate">{item.nama}</h3>
        <div className="flex items-center gap-1 text-xs mb-1">
          <Leaf className="w-3 h-3 text-agro-green" />
          <span className="text-agro-green truncate">{item.petani_name}</span>
        </div>
        {item.lokasi && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
            <MapPin className="w-3 h-3" /> {item.lokasi}
          </div>
        )}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-extrabold text-white">Rp {item.harga?.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500">/{item.satuan || 'kg'}</p>
          </div>
          <p className="text-xs text-gray-500">Stok: {item.stok} kg</p>
        </div>
        <button onClick={handleBeli}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 rounded-xl transition-all">
          <ShoppingCart className="w-4 h-4" /> Beli Sekarang
        </button>
      </div>
    </div>
  )
}

export default function BuyerHome() {
  const { user }                = useAuth()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders]     = useState([])

  // Load komoditas dari database
  useEffect(() => {
    api.get('/komoditas/').then(res => {
      setItems(res.data.komoditas || [])
    }).catch(() => setItems([])).finally(() => setLoading(false))

    // Load orders
    api.get('/orders/my').then(res => {
      setOrders(res.data.orders || [])
    }).catch(() => {})

    // Load wishlist dari localStorage
    const saved = localStorage.getItem('agrolens_wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  const handleToggleWishlist = (item) => {
    const exists = wishlist.some(w => w.id === item.id)
    const updated = exists
      ? wishlist.filter(w => w.id !== item.id)
      : [...wishlist, item]
    setWishlist(updated)
    localStorage.setItem('agrolens_wishlist', JSON.stringify(updated))
  }

  const filtered = items.filter(k =>
    k.nama?.toLowerCase().includes(search.toLowerCase()) ||
    k.petani_name?.toLowerCase().includes(search.toLowerCase())
  )

  const activeOrders = orders.filter(o => ['menunggu','dikonfirmasi','dikirim'].includes(o.status))

  return (
    <BuyerLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🛒</span>
          <h1 className="text-2xl font-extrabold text-white">
            Selamat datang, {user?.name?.split(' ')[0]}!
          </h1>
        </div>
        <p className="text-gray-400">Temukan produk segar langsung dari petani Indonesia.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: ShoppingCart, label: 'Total Pesanan',  value: orders.length,        sub: 'Semua transaksi',  color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { icon: Package,      label: 'Pesanan Aktif',  value: activeOrders.length,  sub: 'Sedang diproses',  color: 'text-agro-green',  bg: 'bg-agro-green/10' },
          { icon: Heart,        label: 'Wishlist',        value: wishlist.length,      sub: 'Produk disimpan',  color: 'text-red-400',     bg: 'bg-red-500/10' },
          { icon: TrendingDown, label: 'Produk Tersedia', value: items.length,         sub: 'Dari petani',      color: 'text-amber-400',   bg: 'bg-amber-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-white mb-1">{s.value}</p>
            <p className="text-sm text-gray-300">{s.label}</p>
            <p className="text-xs text-gray-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari komoditas atau petani..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500" />
      </div>

      {/* Grid header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-white">
          Komoditas Tersedia
          <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} produk)</span>
        </h2>
        <Link to="/buyer/browse" className="text-xs text-primary-400 hover:underline flex items-center gap-1">
          Lihat semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🌾</p>
          <p className="text-white font-semibold mb-1">
            {items.length === 0 ? 'Belum ada komoditas terdaftar' : 'Tidak ditemukan'}
          </p>
          <p className="text-gray-400 text-sm">
            {items.length === 0 ? 'Petani belum upload produk' : 'Coba kata kunci lain'}
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => (
            <KomoditasCard key={item.id} item={item}
              wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="mt-8 bg-gradient-to-r from-primary-600/30 to-agro-green/20 border border-primary-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-agro-green text-xs font-semibold mb-1">🌾 Langsung dari Petani</p>
          <h3 className="text-white font-extrabold text-lg mb-1">Harga Lebih Murah, Produk Lebih Segar</h3>
          <p className="text-gray-400 text-sm">Tanpa perantara — hemat hingga 30% dibanding harga pasar</p>
        </div>
        <Link to="/buyer/browse"
          className="flex-shrink-0 bg-agro-green hover:bg-agro-teal text-white font-bold px-6 py-3 rounded-xl transition-all">
          Belanja Sekarang
        </Link>
      </div>
    </BuyerLayout>
  )
}