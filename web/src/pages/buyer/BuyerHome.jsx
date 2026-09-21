import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BuyerLayout from '../../components/layout/BuyerLayout'
import { komoditasAPI } from '../../services/api'
import {
  ShoppingCart, Package, TrendingDown, Star,
  ArrowRight, MapPin, Leaf, Search, Heart
} from 'lucide-react'

function KomoditasCard({ item, inWishlist, onAddWishlist, onRemoveWishlist }) {
  const navigate = useNavigate()
  const gradeColor = item.grade === 'A' ? 'bg-agro-green/20 text-agro-green' : 'bg-amber-500/20 text-amber-400'

  const handleBeli = () => {
    navigate('/buyer/checkout', { state: { produk: item } })
  }

  const toggleWishlist = (e) => {
    e.stopPropagation()
    if (inWishlist) {
      onRemoveWishlist(item.id)
    } else {
      onAddWishlist(item)
    }
  }

  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-40 overflow-hidden">
        <img src={item.foto_url || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300'}
          alt={item.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-agro-dark/60 to-transparent" />
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor}`}>
          Grade {item.grade}
        </span>
        <button onClick={toggleWishlist}
          className="absolute top-3 left-3 w-8 h-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all">
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-1 truncate">{item.nama}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
          <MapPin className="w-3 h-3" /> {item.lokasi}
        </div>
        <div className="flex items-center gap-1 text-xs mb-3">
          <Leaf className="w-3 h-3 text-agro-green" />
          <span className="text-agro-green truncate">{item.petani_name}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-extrabold text-white">Rp {item.harga?.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-500">/{item.satuan || 'kg'}</p>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-amber-400 font-semibold">{item.rating || 4.5}</span>
          </div>
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
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [komoditas, setKomoditas] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)

  // Load komoditas dari API
  useEffect(() => {
    const loadKomoditas = async () => {
      try {
        const res = await komoditasAPI.list()
        setKomoditas(res.data.komoditas || [])
      } catch (error) {
        console.error('Error loading komoditas:', error)
      } finally {
        setLoading(false)
      }
    }
    loadKomoditas()
  }, [])

  // Load wishlist dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agrolens_wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  const addToWishlist = (item) => {
    const updated = [...wishlist, item]
    setWishlist(updated)
    localStorage.setItem('agrolens_wishlist', JSON.stringify(updated))
  }

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(w => w.id !== id)
    setWishlist(updated)
    localStorage.setItem('agrolens_wishlist', JSON.stringify(updated))
  }

  const isInWishlist = (id) => wishlist.some(w => w.id === id)

  const filtered = komoditas.filter(k =>
    k.nama.toLowerCase().includes(search.toLowerCase()) ||
    k.petani_name.toLowerCase().includes(search.toLowerCase()) ||
    (k.lokasi && k.lokasi.toLowerCase().includes(search.toLowerCase()))
  )

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
          { icon: ShoppingCart, label: 'Total Pesanan',  value: '0', sub: 'Belum ada pesanan', color: 'text-primary-400', bg: 'bg-primary-500/10' },
          { icon: Package,      label: 'Pesanan Aktif',  value: '0', sub: 'Sedang diproses',   color: 'text-agro-green',  bg: 'bg-agro-green/10' },
          { icon: TrendingDown, label: 'Hemat vs Pasar', value: 'Rp 0', sub: 'Selisih harga',  color: 'text-amber-400',   bg: 'bg-amber-500/10' },
          { icon: Star,         label: 'Review',         value: '0', sub: 'Total review',       color: 'text-purple-400',  bg: 'bg-purple-500/10' },
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
        <input type="text" placeholder="Cari komoditas, petani, atau lokasi..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500" />
      </div>

      {/* Grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-white">
          Komoditas Tersedia
          <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} produk)</span>
        </h2>
        <Link to="/buyer/browse" className="text-xs text-primary-400 hover:underline flex items-center gap-1">
          Lihat semua <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Memuat komoditas...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => (
            <KomoditasCard 
              key={item.id} 
              item={item}
              inWishlist={isInWishlist(item.id)}
              onAddWishlist={addToWishlist}
              onRemoveWishlist={removeFromWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-semibold mb-1">Tidak ditemukan</p>
          <p className="text-gray-400 text-sm">Coba kata kunci lain</p>
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
          className="flex-shrink-0 bg-agro-green hover:bg-agro-teal text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105">
          Belanja Sekarang
        </Link>
      </div>
    </BuyerLayout>
  )
}