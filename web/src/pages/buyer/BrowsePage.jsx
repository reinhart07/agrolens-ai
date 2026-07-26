import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BuyerLayout from '../../components/layout/BuyerLayout'
import api from '../../services/api'
import { ShoppingCart, Search, MapPin, Leaf } from 'lucide-react'

const KATEGORI = ['Semua', 'Sayuran', 'Buah', 'Pangan Pokok', 'Protein', 'Rempah']

const GRADE_COLOR = {
  A: 'bg-agro-green/20 text-agro-green',
  B: 'bg-amber-500/20 text-amber-400',
  C: 'bg-red-500/20 text-red-400',
}

function KomoditasCard({ item, onBeli }) {
  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/8 hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-agro-green/5">
        {item.foto_url ? (
          <img src={item.foto_url} alt={item.nama}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.target.style.display='none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🌾</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-agro-dark/60 to-transparent" />
        <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full ${GRADE_COLOR[item.grade] || GRADE_COLOR.A}`}>
          Grade {item.grade}
        </span>
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
        <button onClick={() => onBeli(item)}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 rounded-xl transition-all">
          <ShoppingCart className="w-4 h-4" /> Beli Sekarang
        </button>
      </div>
    </div>
  )
}

export default function BrowsePage() {
  const navigate  = useNavigate()
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [sortBy, setSortBy]     = useState('terbaru')

  useEffect(() => {
    api.get('/komoditas/').then(res => {
      setItems(res.data.komoditas || [])
    }).catch(() => setItems([])).finally(() => setLoading(false))
  }, [])

  const handleBeli = (item) => {
    navigate('/buyer/checkout', {
      state: {
        produk: {
          id        : item.id,
          nama      : item.nama,
          harga     : item.harga,
          satuan    : item.satuan || 'kg',
          petani    : item.petani_name,
          petani_id : item.petani_id,   // ← penting untuk fetch profil petani
          foto_url  : item.foto_url,
        }
      }
    })
  }

  const filtered = items
    .filter(k => {
      const matchSearch = k.nama?.toLowerCase().includes(search.toLowerCase()) ||
                          k.petani_name?.toLowerCase().includes(search.toLowerCase())
      const matchKat    = kategori === 'Semua' || k.kategori === kategori
      return matchSearch && matchKat && k.stok > 0
    })
    .sort((a, b) => {
      if (sortBy === 'harga_asc')  return a.harga - b.harga
      if (sortBy === 'harga_desc') return b.harga - a.harga
      return new Date(b.created_at) - new Date(a.created_at)
    })

  return (
    <BuyerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">🛒 Browse Komoditas</h1>
        <p className="text-gray-400">Temukan produk segar langsung dari petani</p>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Cari komoditas atau petani..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500" />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-500">
          <option value="terbaru"    className="bg-agro-dark">Terbaru</option>
          <option value="harga_asc"  className="bg-agro-dark">Harga Terendah</option>
          <option value="harga_desc" className="bg-agro-dark">Harga Tertinggi</option>
        </select>
      </div>

      {/* Kategori */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {KATEGORI.map(k => (
          <button key={k} onClick={() => setKategori(k)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              kategori === k ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {k}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{loading ? '...' : `${filtered.length} produk ditemukan`}</p>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1,2,3,4].map(i => <div key={i} className="h-72 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-semibold mb-1">Tidak ada komoditas ditemukan</p>
          <p className="text-gray-400 text-sm">Coba kata kunci lain atau kategori berbeda</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(item => (
            <KomoditasCard key={item.id} item={item} onBeli={handleBeli} />
          ))}
        </div>
      )}
    </BuyerLayout>
  )
}