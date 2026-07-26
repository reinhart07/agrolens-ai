// MitraPetani.jsx
import { useState, useEffect } from 'react'
import MitraLayout from '../../components/layout/MitraLayout'
import api from '../../services/api'
import { Users, Search, MapPin } from 'lucide-react'

export function MitraPetani() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    api.get('/komoditas/').then(res => {
      const unique = {}
      ;(res.data.komoditas || []).forEach(k => {
        if (!unique[k.petani_id]) unique[k.petani_id] = { id: k.petani_id, name: k.petani_name, lokasi: k.lokasi, komoditas: [] }
        unique[k.petani_id].komoditas.push(k.nama)
      })
      setItems(Object.values(unique))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()))

  return (
    <MitraLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">👥 Data Petani</h1>
        <p className="text-gray-400">Daftar petani terdaftar di platform AgroLens AI</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari nama petani..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-amber-500" />
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold">Belum ada data petani</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-amber-400">{p.name?.[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.lokasi || '—'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Komoditas</p>
                <p className="text-sm text-white">{p.komoditas.length} produk</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </MitraLayout>
  )
}

export default MitraPetani