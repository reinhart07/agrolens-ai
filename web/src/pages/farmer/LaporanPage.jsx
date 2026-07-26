import { useState } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import { useAuth } from '../../context/AuthContext'
import { hargaAPI, kreditAPI } from '../../services/api'
import { FileText, Download, Loader, CheckCircle } from 'lucide-react'

export default function LaporanPage() {
  const { user }              = useAuth()
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({
    komoditas     : 'Cabai Merah',
    harga         : 45000,
    usia          : 35,
    pendapatan    : 5000000,
    lama_usaha    : 5,
    pinjaman      : 10000000,
  })

  const KOMODITAS = ['Cabai Merah', 'Cabai Hijau', 'Bawang Merah', 'Tomat', 'Beras', 'Kentang', 'Wortel']

  const generatePDF = async () => {
    setLoading(true)
    setError('')
    setDone(false)

    try {
      // Fetch prediksi harga
      const hargaRes = await hargaAPI.prediksi({
        komoditas      : form.komoditas,
        harga_sekarang : parseFloat(form.harga),
        bulan          : new Date().getMonth() + 1,
        tahun          : new Date().getFullYear(),
      })
      const harga = hargaRes.data

      // Fetch credit score
      const kreditRes = await kreditAPI.score({
        person_age                   : parseInt(form.usia),
        person_income                : parseFloat(form.pendapatan),
        person_emp_length            : parseFloat(form.lama_usaha),
        loan_amnt                    : parseFloat(form.pinjaman),
        loan_int_rate                : 12.0,
        loan_percent_income          : form.pinjaman / form.pendapatan / 12,
        cb_person_cred_hist_length   : Math.min(form.lama_usaha, 10),
        person_home_ownership_enc    : 1,
        loan_intent_enc              : 2,
        loan_grade_enc               : 1,
        cb_person_default_on_file_enc: 0,
      })
      const kredit = kreditRes.data

      // Generate PDF via browser print
      const now = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      })

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Laporan AgroLens AI - ${user?.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 40px; }
            .header { background: linear-gradient(135deg, #1D9E75, #0F6E56); color: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; }
            .header h1 { font-size: 24px; margin-bottom: 8px; }
            .header p { font-size: 13px; opacity: 0.85; }
            .section { margin-bottom: 24px; }
            .section h2 { font-size: 16px; font-weight: bold; color: #1D9E75; border-bottom: 2px solid #1D9E75; padding-bottom: 6px; margin-bottom: 14px; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
            .label { color: #666; }
            .value { font-weight: bold; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
            .badge-green { background: #d1fae5; color: #065f46; }
            .badge-red { background: #fee2e2; color: #991b1b; }
            .badge-yellow { background: #fef3c7; color: #92400e; }
            .score-box { text-align: center; padding: 20px; background: #f8fffe; border: 2px solid #1D9E75; border-radius: 12px; margin: 12px 0; }
            .score-box .score { font-size: 48px; font-weight: bold; color: #1D9E75; }
            .rekomendasi { background: #f0fdf4; border-left: 4px solid #1D9E75; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #065f46; margin-top: 10px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; text-align: center; }
            .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .card { background: #f8f8f8; border-radius: 8px; padding: 16px; }
            .card .num { font-size: 24px; font-weight: bold; color: #1a1a2e; }
            .card .lbl { font-size: 12px; color: #666; margin-top: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌾 Laporan AgroLens AI</h1>
            <p>Petani: ${user?.name || 'Pengguna'} &nbsp;|&nbsp; Tanggal: ${now}</p>
            <p>PIDI DIGDAYA X HACKATHON 2026 — Bank Indonesia & OJK</p>
          </div>

          <div class="section">
            <h2>📈 Prediksi Harga Komoditas</h2>
            <div class="grid2">
              <div class="card">
                <div class="num">Rp ${harga.harga_sekarang?.toLocaleString('id-ID')}</div>
                <div class="lbl">Harga Sekarang (${form.komoditas})</div>
              </div>
              <div class="card">
                <div class="num" style="color: ${harga.trend === 'naik' ? '#1D9E75' : '#dc2626'}">
                  Rp ${harga.prediksi_1_bulan?.toLocaleString('id-ID')}
                </div>
                <div class="lbl">Prediksi 1 Bulan ke Depan</div>
              </div>
            </div>
            <div class="row" style="margin-top:12px">
              <span class="label">Perubahan Harga</span>
              <span class="value" style="color: ${harga.trend === 'naik' ? '#1D9E75' : '#dc2626'}">
                ${harga.perubahan_persen > 0 ? '+' : ''}${harga.perubahan_persen?.toFixed(2)}%
              </span>
            </div>
            <div class="row">
              <span class="label">Trend</span>
              <span class="badge ${harga.trend === 'naik' ? 'badge-green' : 'badge-red'}">${harga.trend?.toUpperCase()}</span>
            </div>
            <div class="rekomendasi">💡 ${harga.rekomendasi}</div>
          </div>

          <div class="section">
            <h2>💳 Credit Scoring Petani</h2>
            <div class="score-box">
              <div class="score">${kredit.credit_score}</div>
              <div style="font-size: 14px; color: #666; margin-top: 4px;">Credit Score / 100</div>
              <span class="badge ${kredit.kategori_risiko === 'Rendah' ? 'badge-green' : kredit.kategori_risiko === 'Sedang' ? 'badge-yellow' : 'badge-red'}" style="margin-top:8px">
                Risiko ${kredit.kategori_risiko}
              </span>
            </div>
            <div class="row"><span class="label">Probabilitas Default</span><span class="value">${kredit.prob_default}%</span></div>
            <div class="row"><span class="label">Limit Kredit Estimasi</span><span class="value">Rp ${kredit.limit_kredit?.toLocaleString('id-ID')}</span></div>
            <div class="row"><span class="label">Regulasi</span><span class="value">POJK No. 29/2024</span></div>
            <div class="rekomendasi">💡 ${kredit.rekomendasi}</div>
          </div>

          <div class="section">
            <h2>📋 Data Profil</h2>
            <div class="row"><span class="label">Nama Petani</span><span class="value">${user?.name || '—'}</span></div>
            <div class="row"><span class="label">Komoditas</span><span class="value">${form.komoditas}</span></div>
            <div class="row"><span class="label">Pendapatan/bulan</span><span class="value">Rp ${parseFloat(form.pendapatan).toLocaleString('id-ID')}</span></div>
            <div class="row"><span class="label">Lama Usaha</span><span class="value">${form.lama_usaha} tahun</span></div>
          </div>

          <div class="footer">
            <p>Laporan ini dibuat otomatis oleh AgroLens AI — Tim Sonic | Universitas Dipa Makassar</p>
            <p>Platform Agritech Terintegrasi Berbasis AI | PIDI DIGDAYA X HACKATHON 2026</p>
            <p style="margin-top:4px">⚠️ Laporan ini bersifat informatif dan tidak merupakan keputusan kredit resmi</p>
          </div>
        </body>
        </html>
      `

      // Buka di window baru dan print sebagai PDF
      const win = window.open('', '_blank')
      win.document.write(html)
      win.document.close()
      win.focus()
      setTimeout(() => {
        win.print()
        setDone(true)
      }, 500)

    } catch (err) {
      setError('Gagal generate laporan. Pastikan backend berjalan.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FarmerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📄 Laporan PDF</h1>
        <p className="text-gray-400">Generate laporan prediksi harga & credit score dalam format PDF</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Data untuk Laporan</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Komoditas Utama</label>
              <select value={form.komoditas} onChange={e => setForm({...form, komoditas: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green">
                {KOMODITAS.map(k => <option key={k} value={k} className="bg-agro-dark">{k}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">Harga Sekarang (Rp/kg)</label>
              <input type="number" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Usia</label>
                <input type="number" value={form.usia} onChange={e => setForm({...form, usia: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Pendapatan/bulan (Rp)</label>
                <input type="number" value={form.pendapatan} onChange={e => setForm({...form, pendapatan: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Lama Usaha (tahun)</label>
                <input type="number" value={form.lama_usaha} onChange={e => setForm({...form, lama_usaha: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Jumlah Pinjaman (Rp)</label>
                <input type="number" value={form.pinjaman} onChange={e => setForm({...form, pinjaman: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {done && (
              <div className="bg-agro-green/10 border border-agro-green/20 rounded-xl px-4 py-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-agro-green" />
                <p className="text-agro-green text-sm">Laporan berhasil dibuka! Pilih "Save as PDF" di dialog print.</p>
              </div>
            )}

            <button onClick={generatePDF} disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              {loading
                ? <><Loader className="w-4 h-4 animate-spin" /> Membuat laporan...</>
                : <><Download className="w-4 h-4" /> Generate & Download PDF</>
              }
            </button>
          </div>
        </div>

        {/* Preview info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Isi Laporan</h2>
          <div className="space-y-3">
            {[
              { icon: '📈', title: 'Prediksi Harga Komoditas', desc: 'Harga sekarang vs prediksi 1 bulan ke depan + rekomendasi' },
              { icon: '💳', title: 'Credit Score', desc: 'Skor kredit 0-100, kategori risiko, limit kredit estimasi' },
              { icon: '📋', title: 'Data Profil Petani', desc: 'Nama, komoditas, pendapatan, lama usaha' },
              { icon: '⚖️', title: 'Regulasi', desc: 'Sesuai POJK No. 29/2024 Alternative Credit Scoring' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-white/5 rounded-xl">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-xs text-amber-400 font-semibold mb-1">📌 Cara Download PDF</p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Klik tombol Generate & Download PDF</li>
              <li>Dialog print akan muncul di browser</li>
              <li>Pilih <strong className="text-white">Save as PDF</strong> sebagai printer</li>
              <li>Klik Save</li>
            </ol>
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-xl text-center">
            <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Laporan akan berisi data real dari model AI AgroLens</p>
          </div>
        </div>
      </div>
    </FarmerLayout>
  )
}