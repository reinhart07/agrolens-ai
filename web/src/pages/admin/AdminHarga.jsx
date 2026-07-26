// AdminHarga.jsx — Monitoring Harga
import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { TrendingUp, TrendingDown, Search, Loader } from 'lucide-react'

const KOMODITAS = ['Cabai Merah','Cabai Rawit','Bawang Merah','Beras','Beras Medium','Beras Premium','Jagung','Kedelai','Telur Ayam']

export function AdminHarga() {
  const now = new Date()
  const [form, setForm] = useState({ komoditas:'Cabai Merah', harga:25000, bulan: now.getMonth()+1, tahun:2024 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await api.post('/predict/harga', {
        komoditas: form.komoditas, harga_sekarang: parseFloat(form.harga),
        bulan: parseInt(form.bulan), tahun: parseInt(form.tahun),
      })
      setResult(res.data)
    } catch (err) { setError(err.response?.data?.detail || 'Gagal prediksi') }
    finally { setLoading(false) }
  }

  const HARGA_REF = [
    { nama:'Cabai Merah',  harga:25000, trend:'naik',  persen:5.2  },
    { nama:'Bawang Merah', harga:18000, trend:'turun', persen:2.1  },
    { nama:'Tomat',        harga:8000,  trend:'naik',  persen:12.5 },
    { nama:'Beras',        harga:6500,  trend:'stabil',persen:0.3  },
    { nama:'Jagung',       harga:4500,  trend:'turun', persen:1.5  },
    { nama:'Telur Ayam',   harga:28000, trend:'naik',  persen:3.8  },
  ]

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📈 Monitoring Harga</h1>
        <p className="text-gray-400">Monitor harga komoditas dan jalankan prediksi AI</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Harga Referensi */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">📊 Harga Referensi Badan Pangan</h2>
          <div className="space-y-3">
            {HARGA_REF.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                <span className="text-sm text-gray-300">{h.nama}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">Rp {h.harga.toLocaleString('id-ID')}/kg</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${
                    h.trend==='naik'?'text-agro-green':h.trend==='turun'?'text-red-400':'text-gray-400'}`}>
                    {h.trend==='naik'?<TrendingUp className="w-3 h-3"/>:h.trend==='turun'?<TrendingDown className="w-3 h-3"/>:'—'}
                    {h.persen}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3 text-center">Sumber: Badan Pangan Nasional 2019–2024</p>
        </div>

        {/* Prediksi */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">🤖 Prediksi AI — XGBoost</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Komoditas</label>
              <select value={form.komoditas} onChange={e => setForm({...form, komoditas: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                {KOMODITAS.map(k => <option key={k} value={k} className="bg-agro-dark">{k}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Harga (Rp)</label>
                <input type="number" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bulan</label>
                <input type="number" min="1" max="12" value={form.bulan} onChange={e => setForm({...form, bulan: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tahun</label>
                <input type="number" value={form.tahun} onChange={e => setForm({...form, tahun: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Prediksi Harga
            </button>
          </form>

          {result && (
            <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-xs text-purple-400 font-semibold mb-2">Hasil Prediksi:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Komoditas</span><span className="text-white font-semibold">{result.komoditas}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Harga Sekarang</span><span className="text-white">Rp {result.harga_sekarang?.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Prediksi 1 Bulan</span><span className={result.trend==='naik'?'text-agro-green font-bold':'text-red-400 font-bold'}>Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Perubahan</span><span className={result.trend==='naik'?'text-agro-green':'text-red-400'}>{result.perubahan_persen > 0?'+':''}{result.perubahan_persen}%</span></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{result.rekomendasi}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminHarga