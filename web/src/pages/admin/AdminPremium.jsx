import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { Crown, RefreshCw, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

const PLAN_LABEL = {
  bulanan : '1 Bulan — Rp 29.000',
  '3bulan': '3 Bulan — Rp 79.000',
  tahunan : '1 Tahun — Rp 279.000',
}

export default function AdminPremium() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('pending')
  const [preview, setPreview]   = useState(null)
  const [processing, setProcessing] = useState(null)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await api.get('/premium/requests')
      setRequests(res.data.requests || [])
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchRequests() }, [])

  const handleApprove = async (id, nama) => {
    if (!confirm(`Setujui premium untuk ${nama}?`)) return
    setProcessing(id)
    try {
      await api.post(`/premium/approve/${id}`, { catatan: 'Bukti pembayaran valid. Premium diaktifkan.' })
      fetchRequests()
    } catch (err) { alert(err.response?.data?.detail || 'Gagal approve') }
    finally { setProcessing(null) }
  }

  const handleReject = async (id, nama) => {
    const catatan = prompt(`Alasan penolakan untuk ${nama}:`) || 'Bukti pembayaran tidak valid'
    setProcessing(id)
    try {
      await api.post(`/premium/reject/${id}`, { catatan })
      fetchRequests()
    } catch (err) { alert(err.response?.data?.detail || 'Gagal reject') }
    finally { setProcessing(null) }
  }

  const filtered = requests.filter(r => filter === 'semua' || r.status === filter)

  const stats = {
    pending : requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }

  return (
    <AdminLayout>
      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreview(null)}>
          <div className="relative bg-white rounded-2xl p-4 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">✕</button>
            <p className="text-center text-sm font-bold text-gray-700 mb-3">Bukti Pembayaran</p>
            <img src={preview} alt="Bukti" className="w-full rounded-xl object-contain" />
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">👑 Kelola Premium</h1>
          <p className="text-gray-400">Verifikasi request upgrade premium dari petani</p>
        </div>
        <button onClick={fetchRequests} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 p-2 rounded-xl">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:'Menunggu', value: stats.pending,  color:'text-amber-400',  bg:'bg-amber-500/10',  icon: Clock },
          { label:'Disetujui',value: stats.approved, color:'text-agro-green', bg:'bg-agro-green/10', icon: CheckCircle },
          { label:'Ditolak',  value: stats.rejected, color:'text-red-400',    bg:'bg-red-500/10',    icon: XCircle },
        ].map((s,i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-extrabold ${s.color}`}>{loading ? '—' : s.value}</p>
            <p className="text-xs text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {['pending','approved','rejected','semua'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === f ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {f === 'pending' ? '⏳ Menunggu' : f === 'approved' ? '✅ Disetujui' : f === 'rejected' ? '❌ Ditolak' : 'Semua'}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-28 bg-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Crown className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold">Tidak ada request premium</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => (
            <div key={req.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">#{req.id} · {req.created_at?.split(' ')[0]}</p>
                  <p className="font-semibold text-white text-lg">{req.user_name}</p>
                  <p className="text-sm text-amber-400">{PLAN_LABEL[req.plan] || req.plan}</p>
                  {req.catatan && <p className="text-xs text-gray-500 mt-1">Catatan: {req.catatan}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    req.status === 'pending'  ? 'bg-amber-500/20 text-amber-400' :
                    req.status === 'approved' ? 'bg-agro-green/20 text-agro-green' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {req.status === 'pending' ? '⏳ Menunggu' : req.status === 'approved' ? '✅ Disetujui' : '❌ Ditolak'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                {req.bukti_url && (
                  <button onClick={() => setPreview(req.bukti_url)}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                    <Eye className="w-3 h-3" /> Lihat Bukti
                  </button>
                )}
                {req.status === 'pending' && (
                  <>
                    <button onClick={() => handleApprove(req.id, req.user_name)}
                      disabled={processing === req.id}
                      className="flex items-center gap-1.5 bg-agro-green/20 hover:bg-agro-green/30 border border-agro-green/20 text-agro-green text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                      {processing === req.id ? '...' : <><CheckCircle className="w-3 h-3" /> ACC</>}
                    </button>
                    <button onClick={() => handleReject(req.id, req.user_name)}
                      disabled={processing === req.id}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-2 rounded-xl transition-all disabled:opacity-50">
                      {processing === req.id ? '...' : <><XCircle className="w-3 h-3" /> Tolak</>}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}