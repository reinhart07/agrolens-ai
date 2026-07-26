import { useState } from 'react'
import MitraLayout from '../../components/layout/MitraLayout'
import api from '../../services/api'
import { TrendingUp, TrendingDown, Search, Loader } from 'lucide-react'

const KOMODITAS = ['Cabai Merah','Cabai Rawit','Bawang Merah','Beras','Beras Medium','Beras Premium','Jagung','Kedelai','Telur Ayam']

export default function MitraHarga() {
  const now = new Date()
  const [form, setForm]       = useState({ komoditas:'Cabai Merah', harga:25000, bulan: now.getMonth()+1, tahun:2024 })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setResult(null)
    try {
      const res = await api.post('/predict/harga', {
        komoditas: form.komoditas, harga_sekarang: parseFloat(form.harga),
        bulan: parseInt(form.bulan), tahun: parseInt(form.tahun),
      })
      setResult(res.data)
    } catch { }
    finally { setLoading(false) }
  }

  return (
    <MitraLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📈 Monitor Harga</h1>
        <p className="text-gray-400">Pantau dan prediksi harga komoditas untuk analisis risiko pembiayaan</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl">
        <h2 className="font-bold text-white mb-4">Prediksi Harga AI</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select value={form.komoditas} onChange={e => setForm({...form, komoditas: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
            {KOMODITAS.map(k => <option key={k} value={k} className="bg-agro-dark">{k}</option>)}
          </select>
          <input type="number" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})}
            placeholder="Harga sekarang (Rp)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
          <button type="submit" disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Prediksi
          </button>
        </form>

        {result && (
          <div className="mt-4 bg-white/5 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Harga Sekarang</span><span className="text-white">Rp {result.harga_sekarang?.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Prediksi 1 Bulan</span><span className="text-white font-bold">Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}</span></div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Trend</span>
              <span className={`flex items-center gap-1 ${result.trend==='naik'?'text-agro-green':'text-red-400'}`}>
                {result.trend==='naik'?<TrendingUp className="w-3 h-3"/>:<TrendingDown className="w-3 h-3"/>}{result.perubahan_persen}%
              </span>
            </div>
          </div>
        )}
      </div>
    </MitraLayout>
  )
}