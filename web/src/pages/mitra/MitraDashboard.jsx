import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MitraLayout from '../../components/layout/MitraLayout'
import api from '../../services/api'
import { CreditCard, Users, TrendingUp, ArrowRight, CheckCircle, AlertTriangle, XCircle, Leaf } from 'lucide-react'

export default function MitraDashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [form, setForm]       = useState({
    person_age: 35, person_income: 5000000, person_emp_length: 5,
    loan_amnt: 10000000, loan_int_rate: 12, cb_person_cred_hist_length: 5,
    person_home_ownership_enc: 1, loan_intent_enc: 2,
    loan_grade_enc: 1, cb_person_default_on_file_enc: 0,
  })

  const handleKredit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/predict/kredit', {
        ...form,
        loan_percent_income: form.loan_amnt / (form.person_income * 12),
      })
      setResult(res.data)
    } catch { }
    finally { setLoading(false) }
  }

  const riskColor = result?.kategori_risiko === 'Rendah' ? 'text-agro-green' :
                    result?.kategori_risiko === 'Sedang'  ? 'text-amber-400' : 'text-red-400'
  const RiskIcon  = result?.kategori_risiko === 'Rendah' ? CheckCircle :
                    result?.kategori_risiko === 'Sedang'  ? AlertTriangle : XCircle

  return (
    <MitraLayout>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🏦</span>
          <h1 className="text-2xl font-extrabold text-white">Dashboard Mitra Keuangan</h1>
        </div>
        <p className="text-gray-400">Akses data credit scoring petani untuk keputusan pembiayaan.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: CreditCard, label: 'Credit Score Dibuat', value: '—', color: 'text-amber-400',   bg: 'bg-amber-500/10' },
          { icon: Users,      label: 'Petani Dinilai',      value: '—', color: 'text-agro-green',  bg: 'bg-agro-green/10' },
          { icon: TrendingUp, label: 'Risiko Rendah',       value: '—', color: 'text-primary-400', bg: 'bg-primary-500/10' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center mb-4`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <p className="text-2xl font-extrabold text-white mb-1">{s.value}</p>
            <p className="text-sm text-gray-300">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Credit Scoring */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">💳 Hitung Credit Score Petani</h2>
          <form onSubmit={handleKredit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Usia', key:'person_age', type:'number' },
                { label:'Pendapatan/bulan (Rp)', key:'person_income', type:'number' },
                { label:'Lama Usaha (thn)', key:'person_emp_length', type:'number' },
                { label:'Jumlah Pinjaman (Rp)', key:'loan_amnt', type:'number' },
                { label:'Bunga (%)', key:'loan_int_rate', type:'number' },
                { label:'Riwayat Kredit (thn)', key:'cb_person_cred_hist_length', type:'number' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                  <input type={f.type} value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Kepemilikan Rumah</label>
                <select value={form.person_home_ownership_enc}
                  onChange={e => setForm({...form, person_home_ownership_enc: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
                  <option value={0} className="bg-agro-dark">Sewa</option>
                  <option value={1} className="bg-agro-dark">Milik Sendiri</option>
                  <option value={2} className="bg-agro-dark">KPR</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pernah Gagal Bayar?</label>
                <select value={form.cb_person_default_on_file_enc}
                  onChange={e => setForm({...form, cb_person_default_on_file_enc: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500">
                  <option value={0} className="bg-agro-dark">Tidak</option>
                  <option value={1} className="bg-agro-dark">Ya</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
              {loading ? 'Menghitung...' : '💳 Hitung Credit Score'}
            </button>
          </form>
        </div>

        {/* Hasil */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Penilaian</h2>
          {!result ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CreditCard className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Isi form dan klik Hitung Credit Score</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center py-6 bg-white/5 rounded-2xl">
                <p className="text-6xl font-extrabold text-white mb-2">{result.credit_score}</p>
                <p className="text-gray-400 text-sm mb-3">Credit Score / 100</p>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/10 ${riskColor}`}>
                  <RiskIcon className="w-4 h-4" /> Risiko {result.kategori_risiko}
                </div>
              </div>
              {[
                { label:'Probabilitas Default', value:`${result.prob_default}%` },
                { label:'Limit Kredit Estimasi', value:`Rp ${result.limit_kredit?.toLocaleString('id-ID')}` },
                { label:'Regulasi', value:'POJK No. 29/2024' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}</span>
                </div>
              ))}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-xs text-amber-400 font-semibold mb-1">💡 Rekomendasi</p>
                <p className="text-sm text-gray-300">{result.rekomendasi}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 bg-gradient-to-r from-amber-600/20 to-agro-green/10 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Leaf className="w-5 h-5 text-agro-green" />
          <p className="font-bold text-white">AgroLens AI — PIDI DIGDAYA X HACKATHON 2026</p>
        </div>
        <p className="text-gray-400 text-sm">Credit scoring sesuai POJK No. 29/2024 | RandomForest ROC AUC 0.9275</p>
      </div>
    </MitraLayout>
  )
}