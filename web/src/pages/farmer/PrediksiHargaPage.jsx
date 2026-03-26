import { useState } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import { hargaAPI } from '../../services/api'
import { TrendingUp, TrendingDown, Loader, Search } from 'lucide-react'

const KOMODITAS_LIST = [
  'Beras', 'Cabai Merah', 'Cabai Hijau', 'Bawang Merah', 'Bawang Putih',
  'Tomat', 'Kentang', 'Wortel', 'Ayam Broiler', 'Telur Ayam', 'Daging Sapi',
  'Jagung', 'Gula', 'Minyak Goreng'
]

export default function PrediksiHargaPage() {
  const [form, setForm]     = useState({
    komoditas     : 'Cabai Merah',
    harga_sekarang: '',
    bulan         : new Date().getMonth() + 1,
    tahun         : new Date().getFullYear(),
    suhu_rata     : 29,
    kelembaban_rata: 78,
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await hargaAPI.prediksi({
        ...form,
        harga_sekarang: parseFloat(form.harga_sekarang),
        bulan         : parseInt(form.bulan),
        tahun         : parseInt(form.tahun),
      })
      setResult(res.data)
    } catch (err) {
      setError('Gagal mengambil prediksi. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const naik = result?.trend === 'naik'

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

            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Jenis Komoditas</label>
              <select
                value={form.komoditas}
                onChange={e => setForm({...form, komoditas: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green"
              >
                {KOMODITAS_LIST.map(k => (
                  <option key={k} value={k} className="bg-agro-dark">{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Harga Sekarang (Rp/kg)</label>
              <input
                type="number"
                placeholder="Contoh: 45000"
                value={form.harga_sekarang}
                onChange={e => setForm({...form, harga_sekarang: e.target.value})}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Bulan</label>
                <select
                  value={form.bulan}
                  onChange={e => setForm({...form, bulan: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green"
                >
                  {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'].map((m, i) => (
                    <option key={i} value={i+1} className="bg-agro-dark">{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Tahun</label>
                <input
                  type="number"
                  value={form.tahun}
                  onChange={e => setForm({...form, tahun: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Suhu Rata-rata (°C)</label>
                <input
                  type="number"
                  value={form.suhu_rata}
                  onChange={e => setForm({...form, suhu_rata: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 mb-1.5 block">Kelembaban (%)</label>
                <input
                  type="number"
                  value={form.kelembaban_rata}
                  onChange={e => setForm({...form, kelembaban_rata: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? 'Memproses...' : 'Prediksi Harga'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Prediksi</h2>

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <TrendingUp className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Isi form dan klik Prediksi Harga untuk melihat hasil</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              {/* Main result */}
              <div className={`rounded-2xl p-6 text-center ${naik ? 'bg-agro-green/10 border border-agro-green/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                <p className="text-sm text-gray-400 mb-2">{result.komoditas}</p>
                <p className="text-4xl font-extrabold text-white mb-2">
                  Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-400 mb-3">Prediksi harga 1 bulan ke depan</p>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${naik ? 'bg-agro-green/20 text-agro-green' : 'bg-red-500/20 text-red-400'}`}>
                  {naik ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {naik ? '+' : ''}{result.perubahan_persen?.toFixed(2)}% dari harga sekarang
                </div>
              </div>

              {/* Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Harga Sekarang</p>
                  <p className="text-lg font-bold text-white">Rp {result.harga_sekarang?.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">Prediksi 1 Bulan</p>
                  <p className={`text-lg font-bold ${naik ? 'text-agro-green' : 'text-red-400'}`}>
                    Rp {result.prediksi_1_bulan?.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Rekomendasi */}
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
                <p className="text-xs text-primary-400 font-semibold mb-1">💡 Rekomendasi</p>
                <p className="text-sm text-gray-300">{result.rekomendasi}</p>
              </div>

              <p className="text-xs text-gray-600 text-center">Model: {result.model} | Data: Badan Pangan Nasional + BMKG</p>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  )
}