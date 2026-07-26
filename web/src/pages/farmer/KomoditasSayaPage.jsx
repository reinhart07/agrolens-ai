import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { Plus, Edit2, Trash2, ShoppingBag, Search, RefreshCw, CheckCircle, Loader, Upload, ImageIcon, Crown, Lock } from 'lucide-react'

const KATEGORI = ['Sayuran','Buah','Pangan Pokok','Protein','Rempah','Lainnya']
const GRADE    = ['A','B','C']

function KomoditasModal({ item, onClose, onSave }) {
  const [form, setForm]           = useState(item || { nama:'',kategori:'Sayuran',harga:'',satuan:'kg',stok:'',deskripsi:'',lokasi:'',foto_url:'',grade:'A' })
  const [loading, setLoading]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [preview, setPreview]     = useState(item?.foto_url || '')
  const fileRef                   = useRef(null)

  const handleUploadFoto = async (file) => {
    if (!file || !file.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await api.post('/upload/foto', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setForm(prev => ({ ...prev, foto_url: res.data.url }))
      setPreview(res.data.url)
    } catch { setError('Gagal upload foto.') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (item?.id) { await api.put(`/komoditas/${item.id}`, { ...form, harga: parseFloat(form.harga), stok: parseFloat(form.stok) }) }
      else { await api.post('/komoditas/', { ...form, harga: parseFloat(form.harga), stok: parseFloat(form.stok) }) }
      onSave(); onClose()
    } catch (err) { setError(err.response?.data?.detail || 'Gagal menyimpan') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-agro-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="font-bold text-white">{item?.id ? 'Edit' : 'Tambah'} Komoditas</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Foto Komoditas</label>
            <div className="flex gap-3 items-start">
              <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
                {uploading ? <Loader className="w-6 h-6 text-agro-green animate-spin" /> : preview ? <img src={preview} alt="preview" className="w-full h-full object-cover" /> : <ImageIcon className="w-8 h-8 text-gray-600" />}
              </div>
              <div className="flex-1">
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50">
                  <Upload className="w-4 h-4" />{uploading ? 'Mengupload...' : 'Pilih Foto'}
                </button>
                <p className="text-xs text-gray-600 mt-1.5">JPG/PNG, maks 5MB</p>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleUploadFoto(e.target.files[0])} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Nama Komoditas *</label>
              <input type="text" required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} placeholder="Cabai Merah"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Kategori</label>
              <select value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green">
                {KATEGORI.map(k => <option key={k} value={k} className="bg-agro-dark">{k}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Grade</label>
              <select value={form.grade} onChange={e => setForm({...form, grade: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green">
                {GRADE.map(g => <option key={g} value={g} className="bg-agro-dark">Grade {g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Harga (Rp/kg) *</label>
              <input type="number" required value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} placeholder="45000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Stok (kg)</label>
              <input type="number" value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} placeholder="100"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Lokasi</label>
              <input type="text" value={form.lokasi} onChange={e => setForm({...form, lokasi: e.target.value})} placeholder="Makassar, Sulawesi Selatan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Deskripsi</label>
              <textarea rows={3} value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} placeholder="Deskripsi singkat..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green resize-none" />
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-xl">Batal</button>
            <button type="submit" disabled={loading || uploading} className="flex-1 bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {item?.id ? 'Update' : 'Tambahkan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function KomoditasSayaPage() {
  const navigate  = useNavigate()
  const [items, setItems]   = useState([])
  const [meta, setMeta]     = useState({ is_premium: false, limit: 4, can_add: true })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal]   = useState(null)
  const gradeColor = { A:'bg-agro-green/20 text-agro-green', B:'bg-amber-500/20 text-amber-400', C:'bg-red-500/20 text-red-400' }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await api.get('/komoditas/my')
      setItems(res.data.komoditas || [])
      setMeta({ is_premium: res.data.is_premium, limit: res.data.limit, can_add: res.data.can_add })
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const handleDelete = async (id, nama) => {
    if (!confirm(`Hapus "${nama}"?`)) return
    try { await api.delete(`/komoditas/${id}`); fetchItems() } catch { alert('Gagal menghapus') }
  }

  const filtered = items.filter(k => k.nama?.toLowerCase().includes(search.toLowerCase()))

  return (
    <FarmerLayout>
      {modal !== null && <KomoditasModal item={modal === 'add' ? null : modal} onClose={() => setModal(null)} onSave={fetchItems} />}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">🌾 Komoditas Saya</h1>
          <p className="text-gray-400">Kelola produk yang kamu jual di marketplace</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchItems} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-2 rounded-xl"><RefreshCw className="w-4 h-4" /></button>
          {meta.can_add
            ? <button onClick={() => setModal('add')} className="flex items-center gap-2 bg-agro-green hover:bg-agro-teal text-white font-bold px-4 py-2 rounded-xl"><Plus className="w-4 h-4" /> Tambah</button>
            : <button onClick={() => navigate('/farmer/premium')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl"><Crown className="w-4 h-4" /> Upgrade Premium</button>
          }
        </div>
      </div>

      {!meta.is_premium && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-white">{items.length}/{meta.limit} produk digunakan (Akun Gratis)</p>
              <p className="text-xs text-gray-400">Upgrade Premium untuk upload unlimited + tampil prioritas</p>
            </div>
          </div>
          <button onClick={() => navigate('/farmer/premium')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0">
            <Crown className="w-3.5 h-3.5" /> Upgrade Rp 29k/bln
          </button>
        </div>
      )}

      {meta.is_premium && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
          <Crown className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-white">✨ Akun Premium Aktif</p>
            <p className="text-xs text-gray-400">Produk kamu tampil prioritas di marketplace + upload unlimited</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{label:'Total',value:items.length,color:'text-white'},{label:'Aktif',value:items.filter(k=>k.is_active).length,color:'text-agro-green'},{label:'Grade A',value:items.filter(k=>k.grade==='A').length,color:'text-primary-400'}].map((s,i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{loading?'—':s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari komoditas..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green" />
      </div>

      {loading && <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse"/>)}</div>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold mb-1">Belum ada komoditas</p>
          {meta.can_add && <button onClick={() => setModal('add')} className="mt-4 bg-agro-green hover:bg-agro-teal text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2"><Plus className="w-4 h-4"/>Tambah Komoditas</button>}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(k => (
            <div key={k.id} className={`bg-white/5 border rounded-2xl overflow-hidden hover:bg-white/8 transition-all ${k.is_premium?'border-amber-500/30':'border-white/10'}`}>
              <div className="h-36 bg-agro-green/5 flex items-center justify-center relative overflow-hidden">
                {k.foto_url ? <img src={k.foto_url} alt={k.nama} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}}/> : <span className="text-5xl">🌾</span>}
                <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${gradeColor[k.grade]||gradeColor.A}`}>Grade {k.grade}</span>
                {k.is_premium && <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full"><Crown className="w-3 h-3"/>Premium</div>}
              </div>
              <div className="p-4">
                <p className="font-semibold text-white mb-1 truncate">{k.nama}</p>
                <p className="text-xs text-gray-500 mb-2">{k.kategori} · {k.lokasi||'—'}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-agro-green font-bold">Rp {k.harga?.toLocaleString('id-ID')}/kg</p>
                  <p className="text-xs text-gray-500">Stok: {k.stok} kg</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setModal(k)} className="flex-1 flex items-center justify-center gap-1.5 bg-primary-500/20 hover:bg-primary-500/30 border border-primary-500/20 text-primary-400 text-xs font-semibold py-2 rounded-xl"><Edit2 className="w-3 h-3"/>Edit</button>
                  <button onClick={() => handleDelete(k.id, k.nama)} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-3 py-2 rounded-xl"><Trash2 className="w-3 h-3"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </FarmerLayout>
  )
}