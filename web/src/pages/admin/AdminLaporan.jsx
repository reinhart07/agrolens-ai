// AdminLaporan.jsx
import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { FileText, Download, Loader } from 'lucide-react'

export function AdminLaporan() {
  const { user }              = useAuth()
  const [stats, setStats]     = useState(null)
  const [orders, setOrders]   = useState([])
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/orders/admin/all'),
      api.get('/admin/users'),
    ]).then(([s, o, u]) => {
      setStats(s.data)
      setOrders(o.data.orders || [])
      setUsers(u.data.users || [])
    }).catch(console.error)
  }, [])

  const exportLaporan = async () => {
    setLoading(true)
    const now = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    const totalRevenue = orders.filter(o => o.status === 'selesai').reduce((s, o) => s + (o.total_harga || 0), 0)

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Laporan Admin AgroLens AI</title>
    <style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;color:#1a1a2e;padding:40px;}
    .header{background:linear-gradient(135deg,#534AB7,#1D9E75);color:white;padding:28px;border-radius:12px;margin-bottom:28px;}
    .header h1{font-size:22px;margin-bottom:6px;}.section{margin-bottom:24px;}
    .section h2{font-size:14px;font-weight:bold;color:#534AB7;border-bottom:2px solid #534AB7;padding-bottom:6px;margin-bottom:14px;}
    .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
    .card{background:#f8f8f8;border-radius:8px;padding:16px;text-align:center;}
    .card .num{font-size:28px;font-weight:bold;color:#534AB7;}.card .lbl{font-size:12px;color:#666;margin-top:4px;}
    .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;}
    .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:11px;color:#999;text-align:center;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th{background:#f0f0f0;padding:8px;text-align:left;font-weight:bold;}
    td{padding:8px;border-bottom:1px solid #f5f5f5;}
    </style></head><body>
    <div class="header"><h1>⚙️ Laporan Admin AgroLens AI</h1><p>Digenerate oleh: ${user?.name} | ${now}</p></div>
    <div class="grid">
      <div class="card"><div class="num">${stats?.total_users || 0}</div><div class="lbl">Total User</div></div>
      <div class="card"><div class="num">${stats?.total_petani || 0}</div><div class="lbl">Petani</div></div>
      <div class="card"><div class="num">${stats?.total_pembeli || 0}</div><div class="lbl">Pembeli</div></div>
      <div class="card"><div class="num">${orders.length}</div><div class="lbl">Total Pesanan</div></div>
    </div>
    <div class="section"><h2>📊 Ringkasan Transaksi</h2>
      <div class="row"><span>Total Pesanan</span><span>${orders.length}</span></div>
      <div class="row"><span>Pesanan Selesai</span><span>${orders.filter(o=>o.status==='selesai').length}</span></div>
      <div class="row"><span>Pesanan Menunggu</span><span>${orders.filter(o=>o.status==='menunggu').length}</span></div>
      <div class="row"><span>Total Revenue (Selesai)</span><span>Rp ${totalRevenue.toLocaleString('id-ID')}</span></div>
    </div>
    <div class="section"><h2>👥 Daftar User Terdaftar</h2>
      <table><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Terdaftar</th></tr>
      ${users.slice(0,20).map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.is_active?'Aktif':'Nonaktif'}</td><td>${u.created_at?.split(' ')[0]||'—'}</td></tr>`).join('')}
      </table></div>
    <div class="footer"><p>AgroLens AI — Tim Sonic | Universitas Dipa Makassar | PIDI DIGDAYA X HACKATHON 2026</p></div>
    </body></html>`

    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); setLoading(false) }, 500)
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📊 Laporan</h1>
        <p className="text-gray-400">Export laporan sistem dan transaksi AgroLens AI</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total User',    value: stats?.total_users || '—',   color:'text-purple-400' },
          { label:'Petani',        value: stats?.total_petani || '—',  color:'text-agro-green' },
          { label:'Pembeli',       value: stats?.total_pembeli || '—', color:'text-primary-400' },
          { label:'Total Pesanan', value: orders.length || '—',        color:'text-amber-400' },
        ].map((s,i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">📋 Laporan Tersedia</h2>
          <div className="space-y-3">
            {[
              { icon:'👥', title:'Laporan User',        desc:'Semua user terdaftar + role + status' },
              { icon:'📦', title:'Laporan Transaksi',   desc:'Semua pesanan + status + revenue' },
              { icon:'🌾', title:'Laporan Komoditas',   desc:'Semua produk terdaftar + petani' },
              { icon:'💳', title:'Laporan Credit Score',desc:'Rekap credit scoring petani' },
            ].map((item,i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">📥 Export Laporan</h2>
          <div className="space-y-3">
            <button onClick={exportLaporan} disabled={loading}
              className="w-full flex items-center gap-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 text-white font-semibold px-4 py-3 rounded-xl transition-all disabled:opacity-50">
              {loading ? <Loader className="w-5 h-5 animate-spin text-purple-400" /> : <Download className="w-5 h-5 text-purple-400" />}
              <div className="text-left">
                <p className="text-sm">Export Laporan Lengkap</p>
                <p className="text-xs text-gray-400">PDF — User + Transaksi + Statistik</p>
              </div>
            </button>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-xs text-amber-400 font-semibold mb-1">📌 Cara Export</p>
              <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                <li>Klik tombol Export di atas</li>
                <li>Dialog print akan muncul</li>
                <li>Pilih "Save as PDF"</li>
                <li>Klik Save</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminLaporan