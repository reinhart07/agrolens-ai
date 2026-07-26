import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { ShoppingBag, Search, RefreshCw, Trash2, CheckCircle, XCircle } from 'lucide-react'

const GRADE_COLOR = {
  A: 'bg-agro-green/20 text-agro-green',
  B: 'bg-amber-500/20 text-amber-400',
  C: 'bg-red-500/20 text-red-400',
}

export default function AdminKomoditas() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('semua')

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await api.get('/komoditas/')
      setItems(res.data.komoditas || [])
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const handleDelete = async (id, nama) => {
    if (!confirm(`Hapus komoditas "${nama}"?`)) return
    try {
      await api.delete(`/komoditas/${id}`)
      fetchItems()
    } catch { alert('Gagal menghapus') }
  }

  const filtered = items.filter(k => {
    const matchSearch = k.nama?.toLowerCase().includes(search.toLowerCase()) ||
                        k.petani_name?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'semua' || k.grade === filter
    return matchSearch && matchFilter
  })

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">🌾 Kelola Komoditas</h1>
          <p className="text-gray-400">Monitor semua komoditas yang terdaftar di marketplace</p>
        </div>
        <button onClick={fetchItems} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-2 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: items.length, color: 'text-white' },
          { label: 'Grade A', value: items.filter(k => k.grade === 'A').length, color: 'text-agro-green' },
          { label: 'Grade B', value: items.filter(k => k.grade === 'B').length, color: 'text-amber-400' },
          { label: 'Aktif', value: items.filter(k => k.is_active).length, color: 'text-primary-400' },
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
        <input type="text" placeholder="Cari nama komoditas atau petani..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500" />
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['semua', 'A', 'B', 'C'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {f === 'semua' ? 'Semua' : `Grade ${f}`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-sm font-semibold text-white">{filtered.length} komoditas ditemukan</p>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <ShoppingBag className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-white font-semibold">Belum ada komoditas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Komoditas', 'Petani', 'Kategori', 'Harga', 'Stok', 'Grade', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(k => (
                  <tr key={k.id} className="border-b border-white/5 hover:bg-white/3">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          {k.foto_url
                            ? <img src={k.foto_url} alt={k.nama} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg">🌾</div>
                          }
                        </div>
                        <span className="text-sm font-semibold text-white">{k.nama}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{k.petani_name}</td>
                    <td className="px-5 py-4 text-xs text-gray-400">{k.kategori}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white">Rp {k.harga?.toLocaleString('id-ID')}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{k.stok} kg</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${GRADE_COLOR[k.grade] || GRADE_COLOR.A}`}>
                        Grade {k.grade}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {k.is_active
                        ? <span className="flex items-center gap-1 text-xs text-agro-green"><CheckCircle className="w-3 h-3" />Aktif</span>
                        : <span className="flex items-center gap-1 text-xs text-red-400"><XCircle className="w-3 h-3" />Nonaktif</span>
                      }
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(k.id, k.nama)} className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}