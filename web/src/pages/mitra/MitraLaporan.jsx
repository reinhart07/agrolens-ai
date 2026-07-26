import { useState } from 'react'
import MitraLayout from '../../components/layout/MitraLayout'
import { useAuth } from '../../context/AuthContext'
import { FileText, Download, Loader } from 'lucide-react'

export default function MitraLaporan() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const exportLaporan = () => {
    setLoading(true)
    const now = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Mitra AgroLens AI</title>
    <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;color:#1a1a2e;padding:40px;}
    .header{background:linear-gradient(135deg,#f59e0b,#1D9E75);color:white;padding:28px;border-radius:12px;margin-bottom:28px;}
    .section{margin-bottom:24px;}.section h2{font-size:14px;font-weight:bold;color:#f59e0b;border-bottom:2px solid #f59e0b;padding-bottom:6px;margin-bottom:14px;}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:11px;color:#999;text-align:center;}
    </style></head><body>
    <div class="header"><h1>🏦 Laporan Mitra Keuangan AgroLens AI</h1><p>Digenerate oleh: ${user?.name} | ${now}</p></div>
    <div class="section"><h2>Ringkasan Aktivitas Credit Scoring</h2>
      <div class="row"><span>Regulasi</span><span>POJK No. 29/2024</span></div>
      <div class="row"><span>Model</span><span>RandomForest</span></div>
      <div class="row"><span>ROC AUC</span><span>0.9275</span></div>
    </div>
    <div class="footer"><p>AgroLens AI — Tim Sonic | Universitas Dipa Makassar | PIDI DIGDAYA X HACKATHON 2026</p></div>
    </body></html>`
    const win = window.open('', '_blank')
    win.document.write(html); win.document.close(); win.focus()
    setTimeout(() => { win.print(); setLoading(false) }, 500)
  }

  return (
    <MitraLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📊 Laporan</h1>
        <p className="text-gray-400">Export laporan aktivitas credit scoring mitra</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl">
        <h2 className="font-bold text-white mb-4">📥 Export Laporan</h2>
        <button onClick={exportLaporan} disabled={loading}
          className="w-full flex items-center gap-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/20 text-white font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50">
          {loading ? <Loader className="w-5 h-5 animate-spin text-amber-400" /> : <Download className="w-5 h-5 text-amber-400" />}
          <div className="text-left">
            <p className="text-sm">Export Laporan Aktivitas</p>
            <p className="text-xs text-gray-400">PDF — Ringkasan Credit Scoring</p>
          </div>
        </button>
      </div>
    </MitraLayout>
  )
}