import { useState } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import { kreditAPI } from '../../services/api'
import { CreditCard, Loader, CheckCircle, AlertCircle, Clock } from 'lucide-react'

export default function CreditScorePage() {
  const [form, setForm] = useState({
    person_age                   : 35,
    person_income                : 5000000,
    person_emp_length            : 5,
    loan_amnt                    : 10000000,
    loan_int_rate                : 12.0,
    loan_percent_income          : 0.2,
    cb_person_cred_hist_length   : 5,
    person_home_ownership_enc    : 1,
    loan_intent_enc              : 2,
    loan_grade_enc               : 1,
    cb_person_default_on_file_enc: 0,
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await kreditAPI.score(form)
      setResult(res.data)
    } catch {
      setError('Gagal menghitung credit score. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const scoreColor = result?.credit_score >= 75
    ? '#1D9E75' : result?.credit_score >= 50 ? '#f59e0b' : '#e11d48'

  const risikoInfo = {
    'Rendah': { icon: CheckCircle, color: 'text-agro-green', bg: 'bg-agro-green/10 border-agro-green/20' },
    'Sedang': { icon: Clock,        color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
    'Tinggi': { icon: AlertCircle,  color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20' },
  }

  const risikoData = result ? risikoInfo[result.kategori_risiko] : null

  return (
    <FarmerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">💳 Credit Scoring Petani</h1>
        <p className="text-gray-400">Hitung skor kredit berbasis data transaksi — sesuai POJK No. 29/2024</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Data Profil Petani</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Usia</label>
                <input type="number" value={form.person_age}
                  onChange={e => setForm({...form, person_age: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pendapatan/bulan (Rp)</label>
                <input type="number" value={form.person_income}
                  onChange={e => setForm({...form, person_income: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Lama Usaha (tahun)</label>
                <input type="number" value={form.person_emp_length}
                  onChange={e => setForm({...form, person_emp_length: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Jumlah Pinjaman (Rp)</label>
                <input type="number" value={form.loan_amnt}
                  onChange={e => setForm({...form, loan_amnt: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bunga Pinjaman (%)</label>
                <input type="number" step="0.1" value={form.loan_int_rate}
                  onChange={e => setForm({...form, loan_int_rate: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Riwayat Kredit (tahun)</label>
                <input type="number" value={form.cb_person_cred_hist_length}
                  onChange={e => setForm({...form, cb_person_cred_hist_length: +e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Status Kepemilikan Rumah</label>
              <select value={form.person_home_ownership_enc}
                onChange={e => setForm({...form, person_home_ownership_enc: +e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green">
                <option value={0} className="bg-agro-dark">Sewa</option>
                <option value={1} className="bg-agro-dark">Milik Sendiri</option>
                <option value={2} className="bg-agro-dark">KPR</option>
                <option value={3} className="bg-agro-dark">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Pernah Gagal Bayar?</label>
              <select value={form.cb_person_default_on_file_enc}
                onChange={e => setForm({...form, cb_person_default_on_file_enc: +e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green">
                <option value={0} className="bg-agro-dark">Tidak</option>
                <option value={1} className="bg-agro-dark">Ya</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {loading ? 'Menghitung...' : 'Hitung Credit Score'}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Credit Score</h2>

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Isi data dan klik Hitung Credit Score</p>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
            </div>
          )}

          {result && !loading && (
            <div className="space-y-5">
              {/* Score */}
              <div className="flex flex-col items-center py-6">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={scoreColor} strokeWidth="10"
                      strokeDasharray={`${(result.credit_score / 100) * 314} 314`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold" style={{color: scoreColor}}>{result.credit_score}</span>
                    <span className="text-xs text-gray-500">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Risiko badge */}
              {risikoData && (
                <div className={`flex items-center gap-2 justify-center border rounded-xl px-4 py-2 ${risikoData.bg}`}>
                  <risikoData.icon className={`w-4 h-4 ${risikoData.color}`} />
                  <span className={`font-semibold text-sm ${risikoData.color}`}>Risiko {result.kategori_risiko}</span>
                </div>
              )}

              {/* Info */}
              <div className="space-y-2.5">
                {[
                  { label: 'Probabilitas Default', value: `${result.prob_default}%` },
                  { label: 'Limit Kredit Estimasi', value: `Rp ${result.limit_kredit?.toLocaleString('id-ID')}` },
                  { label: 'Model', value: result.model },
                  { label: 'Regulasi', value: result.regulasi },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-medium text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Rekomendasi */}
              <div className={`border rounded-xl p-4 ${risikoData?.bg}`}>
                <p className="text-xs font-semibold mb-1" style={{color: scoreColor}}>💡 Rekomendasi</p>
                <p className="text-sm text-gray-300">{result.rekomendasi}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  )
}