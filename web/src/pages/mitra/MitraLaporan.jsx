import { useState, useEffect } from 'react'
import MitraLayout from '../../components/layout/MitraLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import {
  FileText, Download, Loader, Users, CreditCard,
  CheckCircle, AlertTriangle, XCircle, Search
} from 'lucide-react'

const DEFAULT_FORM = {
  person_age: 35, person_income: 5000000, person_emp_length: 5,
  loan_amnt: 10000000, loan_int_rate: 12, cb_person_cred_hist_length: 5,
  person_home_ownership_enc: 1, loan_intent_enc: 2,
  loan_grade_enc: 1, cb_person_default_on_file_enc: 0,
}

export default function MitraLaporan() {
  const { user }              = useAuth()
  const [petaniList, setPetaniList] = useState([])
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm]       = useState(DEFAULT_FORM)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Fetch daftar petani dari komoditas
    api.get('/komoditas/').then(res => {
      const unique = {}
      ;(res.data.komoditas || []).forEach(k => {
        if (!unique[k.petani_id]) {
          unique[k.petani_id] = {
            id: k.petani_id, name: k.petani_name, lokasi: k.lokasi,
            komoditas: []
          }
        }
        unique[k.petani_id].komoditas.push(k.nama)
      })
      setPetaniList(Object.values(unique))
    }).catch(() => {})
  }, [])

  const handleHitung = async () => {
    if (!selected) { setError('Pilih petani dulu!'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await api.post('/predict/kredit', {
        ...form,
        loan_percent_income: form.loan_amnt / (form.person_income * 12),
      })
      const newResult = { ...res.data, petani: selected, form: {...form}, tanggal: new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) }
      setResult(newResult)
      setHistory(prev => [newResult, ...prev.slice(0, 9)])
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menghitung credit score')
    } finally { setLoading(false) }
  }

  const handleExport = (r) => {
    const riskColor = r.kategori_risiko === 'Rendah' ? '#1D9E75' : r.kategori_risiko === 'Sedang' ? '#f59e0b' : '#ef4444'
    const now = r.tanggal || new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Laporan Credit Scoring — ${r.petani?.name}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:Arial,sans-serif;color:#1a1a2e;padding:40px;}
      .header{background:linear-gradient(135deg,#f59e0b,#1D9E75);color:white;padding:28px;border-radius:12px;margin-bottom:28px;}
      .header h1{font-size:20px;margin-bottom:6px;}
      .score-box{text-align:center;background:#f8f8f8;border-radius:12px;padding:24px;margin-bottom:24px;}
      .score{font-size:64px;font-weight:bold;color:${riskColor};}
      .badge{display:inline-block;padding:6px 16px;border-radius:20px;font-size:13px;font-weight:bold;background:${riskColor}20;color:${riskColor};border:1px solid ${riskColor}40;}
      .section{margin-bottom:20px;}
      .section h2{font-size:13px;font-weight:bold;color:#f59e0b;border-bottom:2px solid #f59e0b;padding-bottom:5px;margin-bottom:12px;}
      .row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0f0f0;font-size:13px;}
      .label{color:#666;}.value{font-weight:600;}
      .rec{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;font-size:13px;color:#166534;margin-top:16px;}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:11px;color:#999;text-align:center;}
    </style></head><body>
    <div class="header">
      <h1>🏦 Laporan Credit Scoring Petani</h1>
      <p>Digenerate oleh: ${user?.name} | ${now}</p>
      <p>Regulasi: POJK No. 29/2024 — Alternative Credit Scoring</p>
    </div>

    <div class="section">
      <h2>Identitas Petani</h2>
      <div class="row"><span class="label">Nama Petani</span><span class="value">${r.petani?.name}</span></div>
      <div class="row"><span class="label">Lokasi</span><span class="value">${r.petani?.lokasi || '—'}</span></div>
      <div class="row"><span class="label">Komoditas</span><span class="value">${r.petani?.komoditas?.join(', ') || '—'}</span></div>
    </div>

    <div class="score-box">
      <p style="font-size:13px;color:#666;margin-bottom:8px;">Credit Score</p>
      <p class="score">${r.credit_score}</p>
      <p style="font-size:13px;color:#666;margin:8px 0;">/ 100</p>
      <span class="badge">Risiko ${r.kategori_risiko}</span>
    </div>

    <div class="section">
      <h2>Detail Penilaian</h2>
      <div class="row"><span class="label">Probabilitas Default</span><span class="value">${r.prob_default}%</span></div>
      <div class="row"><span class="label">Limit Kredit Estimasi</span><span class="value">Rp ${r.limit_kredit?.toLocaleString('id-ID')}</span></div>
      <div class="row"><span class="label">Model</span><span class="value">RandomForest</span></div>
      <div class="row"><span class="label">ROC AUC</span><span class="value">0.9275</span></div>
    </div>

    <div class="section">
      <h2>Data Input</h2>
      <div class="row"><span class="label">Usia</span><span class="value">${r.form?.person_age} tahun</span></div>
      <div class="row"><span class="label">Pendapatan/bulan</span><span class="value">Rp ${r.form?.person_income?.toLocaleString('id-ID')}</span></div>
      <div class="row"><span class="label">Lama Usaha</span><span class="value">${r.form?.person_emp_length} tahun</span></div>
      <div class="row"><span class="label">Jumlah Pinjaman</span><span class="value">Rp ${r.form?.loan_amnt?.toLocaleString('id-ID')}</span></div>
      <div class="row"><span class="label">Bunga</span><span class="value">${r.form?.loan_int_rate}%</span></div>
      <div class="row"><span class="label">Riwayat Kredit</span><span class="value">${r.form?.cb_person_cred_hist_length} tahun</span></div>
    </div>

    <div class="rec">💡 <strong>Rekomendasi:</strong> ${r.rekomendasi}</div>

    <div class="footer">
      <p>AgroLens AI — Tim Sonic | Universitas Dipa Makassar | PIDI DIGDAYA X HACKATHON 2026</p>
      <p style="margin-top:4px;">Dokumen ini dihasilkan secara otomatis. Keputusan kredit tetap menjadi wewenang lembaga keuangan.</p>
    </div>
    </body></html>`

    const win = window.open('', '_blank')
    win.document.write(html); win.document.close(); win.focus()
    setTimeout(() => win.print(), 500)
  }

  const riskColor = result?.kategori_risiko === 'Rendah' ? 'text-agro-green' :
                    result?.kategori_risiko === 'Sedang'  ? 'text-amber-400' : 'text-red-400'
  const RiskIcon  = result?.kategori_risiko === 'Rendah' ? CheckCircle :
                    result?.kategori_risiko === 'Sedang'  ? AlertTriangle : XCircle

  const filteredPetani = petaniList.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <MitraLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📊 Laporan Credit Scoring</h1>
        <p className="text-gray-400">Pilih petani → isi data → hitung score → export PDF</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Step 1 — Pilih Petani */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> 1. Pilih Petani
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input type="text" placeholder="Cari nama petani..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredPetani.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Belum ada petani terdaftar</p>
            ) : filteredPetani.map((p, i) => (
              <div key={i} onClick={() => { setSelected(p); setResult(null) }}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selected?.id === p.id
                    ? 'bg-amber-500/20 border-amber-500/30'
                    : 'bg-white/3 border-white/10 hover:bg-white/8'
                }`}>
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="text-xs text-gray-500">{p.lokasi || '—'}</p>
                <p className="text-xs text-amber-400 mt-0.5">{p.komoditas?.slice(0,2).join(', ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2 — Input Data */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-amber-400" /> 2. Data Ekonomi Petani
          </h2>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Users className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">Pilih petani dulu dari daftar kiri</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-3">
                <p className="text-xs text-amber-400 font-semibold">{selected.name}</p>
                <p className="text-xs text-gray-500">{selected.lokasi}</p>
              </div>
              {[
                { label:'Usia', key:'person_age' },
                { label:'Pendapatan/bln (Rp)', key:'person_income' },
                { label:'Lama Usaha (thn)', key:'person_emp_length' },
                { label:'Pinjaman (Rp)', key:'loan_amnt' },
                { label:'Bunga (%)', key:'loan_int_rate' },
                { label:'Riwayat Kredit (thn)', key:'cb_person_cred_hist_length' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-0.5 block">{f.label}</label>
                  <input type="number" value={form[f.key]}
                    onChange={e => setForm({...form, [f.key]: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-0.5 block">Pernah Gagal Bayar?</label>
                <select value={form.cb_person_default_on_file_enc}
                  onChange={e => setForm({...form, cb_person_default_on_file_enc: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
                  <option value={0} className="bg-agro-dark">Tidak</option>
                  <option value={1} className="bg-agro-dark">Ya</option>
                </select>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button onClick={handleHitung} disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                {loading ? <><Loader className="w-4 h-4 animate-spin" /> Menghitung...</> : <><CreditCard className="w-4 h-4" /> Hitung Credit Score</>}
              </button>
            </div>
          )}
        </div>

        {/* Step 3 — Hasil & Export */}
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> 3. Hasil & Export PDF
            </h2>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-36 text-center">
                <CreditCard className="w-8 h-8 text-gray-600 mb-2" />
                <p className="text-gray-500 text-sm">Hasil akan muncul setelah hitung</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center py-4 bg-white/5 rounded-xl">
                  <p className="text-5xl font-extrabold text-white mb-1">{result.credit_score}</p>
                  <p className="text-gray-400 text-xs mb-2">/ 100</p>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 ${riskColor}`}>
                    <RiskIcon className="w-3 h-3" /> Risiko {result.kategori_risiko}
                  </div>
                </div>
                {[
                  { label:'Prob. Default', value:`${result.prob_default}%` },
                  { label:'Limit Kredit', value:`Rp ${result.limit_kredit?.toLocaleString('id-ID')}` },
                ].map((item,i) => (
                  <div key={i} className="flex justify-between text-sm p-2 bg-white/5 rounded-xl">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.value}</span>
                  </div>
                ))}
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-xs text-gray-300">{result.rekomendasi}</p>
                </div>
                <button onClick={() => handleExport(result)}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/20 text-amber-400 font-bold py-2.5 rounded-xl transition-all">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>
            )}
          </div>

          {/* Riwayat */}
          {history.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-3 text-sm">📋 Riwayat Sesi Ini</h2>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-xs font-semibold text-white">{h.petani?.name}</p>
                      <p className={`text-xs ${h.kategori_risiko==='Rendah'?'text-agro-green':h.kategori_risiko==='Sedang'?'text-amber-400':'text-red-400'}`}>
                        Score: {h.credit_score} — {h.kategori_risiko}
                      </p>
                    </div>
                    <button onClick={() => handleExport(h)}
                      className="text-amber-400 hover:text-amber-300 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MitraLayout>
  )
}