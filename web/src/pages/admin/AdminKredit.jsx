import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { CreditCard, Loader, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export default function AdminKredit() {
  const [form, setForm] = useState({
    person_age: 35, person_income: 5000000, person_emp_length: 5,
    loan_amnt: 10000000, loan_int_rate: 12, cb_person_cred_hist_length: 5,
    person_home_ownership_enc: 1, loan_intent_enc: 2,
    loan_grade_enc: 1, cb_person_default_on_file_enc: 0,
  })
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setResult(null)
    try {
      const payload = {
        ...form,
        loan_percent_income: form.loan_amnt / (form.person_income * 12),
      }
      const res = await api.post('/predict/kredit', payload)
      setResult(res.data)
    } catch (err) { setError(err.response?.data?.detail || 'Gagal menghitung credit score') }
    finally { setLoading(false) }
  }

  const riskIcon  = result?.kategori_risiko === 'Rendah' ? CheckCircle :
                    result?.kategori_risiko === 'Sedang'  ? AlertTriangle : XCircle
  const riskColor = result?.kategori_risiko === 'Rendah' ? 'text-agro-green' :
                    result?.kategori_risiko === 'Sedang'  ? 'text-amber-400' : 'text-red-400'
  const RiskIcon  = riskIcon

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">💳 Credit Scoring</h1>
        <p className="text-gray-400">Hitung credit score petani menggunakan model RandomForest — sesuai POJK No. 29/2024</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Data Profil Petani</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Usia</label>
                <input type="number" value={form.person_age} onChange={e => setForm({...form, person_age: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pendapatan/bulan (Rp)</label>
                <input type="number" value={form.person_income} onChange={e => setForm({...form, person_income: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Lama Usaha (tahun)</label>
                <input type="number" value={form.person_emp_length} onChange={e => setForm({...form, person_emp_length: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Jumlah Pinjaman (Rp)</label>
                <input type="number" value={form.loan_amnt} onChange={e => setForm({...form, loan_amnt: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Bunga (%)</label>
                <input type="number" value={form.loan_int_rate} onChange={e => setForm({...form, loan_int_rate: parseFloat(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Riwayat Kredit (tahun)</label>
                <input type="number" value={form.cb_person_cred_hist_length} onChange={e => setForm({...form, cb_person_cred_hist_length: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Kepemilikan Rumah</label>
                <select value={form.person_home_ownership_enc} onChange={e => setForm({...form, person_home_ownership_enc: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value={0} className="bg-agro-dark">Sewa</option>
                  <option value={1} className="bg-agro-dark">Milik Sendiri</option>
                  <option value={2} className="bg-agro-dark">KPR</option>
                  <option value={3} className="bg-agro-dark">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pernah Gagal Bayar?</label>
                <select value={form.cb_person_default_on_file_enc} onChange={e => setForm({...form, cb_person_default_on_file_enc: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500">
                  <option value={0} className="bg-agro-dark">Tidak</option>
                  <option value={1} className="bg-agro-dark">Ya</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {loading ? <><Loader className="w-4 h-4 animate-spin" /> Menghitung...</> : <><CreditCard className="w-4 h-4" /> Hitung Credit Score</>}
            </button>
          </form>
        </div>

        {/* Hasil */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Credit Score</h2>
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Isi form dan klik Hitung Credit Score</p>
            </div>
          )}
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Model AI sedang menghitung...</p>
            </div>
          )}
          {result && !loading && (
            <div className="space-y-4">
              <div className="text-center py-6 bg-white/5 rounded-2xl">
                <p className="text-6xl font-extrabold text-white mb-2">{result.credit_score}</p>
                <p className="text-gray-400 text-sm mb-3">Credit Score / 100</p>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/10 ${riskColor}`}>
                  <RiskIcon className="w-4 h-4" /> Risiko {result.kategori_risiko}
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label:'Probabilitas Default', value:`${result.prob_default}%` },
                  { label:'Limit Kredit Estimasi', value:`Rp ${result.limit_kredit?.toLocaleString('id-ID')}` },
                  { label:'Model', value:'RandomForest' },
                  { label:'Regulasi', value:'POJK No. 29/2024' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                <p className="text-xs text-purple-400 font-semibold mb-1">💡 Rekomendasi</p>
                <p className="text-sm text-gray-300">{result.rekomendasi}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}