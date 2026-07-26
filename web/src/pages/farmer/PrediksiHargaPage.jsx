import { useState } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { TrendingUp, TrendingDown, Minus, Search, Loader } from 'lucide-react'

const KOMODITAS = [
  'Cabai Merah',
  'Cabai Rawit',
  'Bawang Merah',
  'Beras',
  'Beras Medium',
  'Beras Premium',
  'Jagung',
  'Kedelai',
  'Telur Ayam',
]

const BULAN = [
  { label: 'Jan', value: 1 }, { label: 'Feb', value: 2 }, { label: 'Mar', value: 3 },
  { label: 'Apr', value: 4 }, { label: 'Mei', value: 5 }, { label: 'Jun', value: 6 },
  { label: 'Jul', value: 7 }, { label: 'Agu', value: 8 }, { label: 'Sep', value: 9 },
  { label: 'Okt', value: 10 }, { label: 'Nov', value: 11 }, { label: 'Des', value: 12 },
]

export default function PrediksiHargaPage() {
  const now = new Date()
  const [form, setForm] = useState({
    komoditas    : 'Cabai Merah',
    harga_sekarang: '',
    bulan        : now.getMonth() + 1,
    tahun        : now.getFullYear(),
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.harga_sekarang) { setError('Harga sekarang wajib diisi'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await api.post('/predict/harga', {
        komoditas    : form.komoditas,
        harga_sekarang: parseFloat(form.harga_sekarang),
        bulan        : parseInt(form.bulan),
        tahun        : parseInt(form.tahun),
      })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal mengambil prediksi. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const trendColor = result?.trend === 'naik' ? 'text-agro-green' :
                     result?.trend === 'turun' ? 'text-red-400' : 'text-gray-400'
  const trendBg    = result?.trend === 'naik' ? 'bg-agro-green/20 border-agro-green/30' :
                     result?.trend === 'turun' ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/20'
  const TrendIcon  = result?.trend === 'naik' ? TrendingUp :
                     result?.trend === 'turun' ? TrendingDown : Minus

  return (
    <FarmerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📈 Prediksi Harga Komoditas</h1>
        <p className="text-gray-400">Prediksi harga 1 bulan ke depan menggunakan model XGBoost & LSTM</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Input Data Komoditas</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Komoditas */}
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Jenis Komoditas</label>
              <select value={form.komoditas} onChange={e => setForm({...form, komoditas: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green">
                {KOMODITAS.map(k => <option key={k} value={k} className="bg-agro-dark">{k}</option>)}
              </select>
            </div>

            {/* Harga */}
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Harga Sekarang (Rp/kg)</label>
              <input type="number" value={form.harga_sekarang}
                onChange={e => setForm({...form, harga_sekarang: e.target.value})}
                placeholder="Contoh: 45000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green" />
            </div>

            {/* Bulan & Tahun */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Bulan</label>
                <select value={form.bulan} onChange={e => setForm({...form, bulan: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green">
                  {BULAN.map(b => <option key={b.value} value={b.value} className="bg-agro-dark">{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Tahun</label>
                <input type="number" value={form.tahun}
                  onChange={e => setForm({...form, tahun: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading
                ? <><Loader className="w-4 h-4 animate-spin" /> Memprediksi...</>
                : <><Search className="w-4 h-4" /> Prediksi Harga</>
              }
            </button>
          </form>

          {/* Info komoditas */}
          <div className="mt-5 bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
            <p className="text-xs text-primary-400 font-semibold mb-2">📊 Komoditas yang tersedia:</p>
            <div className="flex flex-wrap gap-1.5">
              {KOMODITAS.map(k => (
                <button key={k} onClick={() => setForm({...form, komoditas: k})}
                  className={`text-xs px-2 py-1 rounded-lg transition-all ${
                    form.komoditas === k
                      ? 'bg-agro-green text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}>
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Hasil */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Prediksi</h2>

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <TrendingUp className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Isi form dan klik Prediksi Harga untuk melihat hasil</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Model AI sedang memprediksi...</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Prediksi utama */}
              <div className={`rounded-2xl p-6 text-center border ${trendBg}`}>
                <p className="text-gray-400 text-sm mb-2">{result.komoditas}</p>
                <p className="text-4xl font-extrabold text-white mb-1">
                  Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}
                </p>
                <p className="text-gray-400 text-sm mb-3">Prediksi harga 1 bulan ke depan</p>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold border ${trendBg} ${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                  {result.perubahan_persen > 0 ? '+' : ''}{result.perubahan_persen}% dari harga sekarang
                </div>
              </div>

              {/* Detail */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Harga Sekarang</p>
                  <p className="font-extrabold text-white">Rp {result.harga_sekarang?.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Prediksi 1 Bulan</p>
                  <p className={`font-extrabold ${trendColor}`}>Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}</p>
                </div>
              </div>

              {/* Rekomendasi */}
              <div className={`border rounded-xl p-4 ${trendBg}`}>
                <p className={`text-xs font-bold mb-1 ${trendColor}`}>💡 Rekomendasi</p>
                <p className="text-sm text-gray-300">{result.rekomendasi}</p>
              </div>

              <p className="text-xs text-gray-600 text-center">
                Model: {result.model} | Data: Badan Pangan Nasional 2019–2024
              </p>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  )
}