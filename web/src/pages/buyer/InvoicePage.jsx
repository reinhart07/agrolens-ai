import { useState, useEffect } from 'react'
import BuyerLayout from '../../components/layout/BuyerLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { FileText, Download, Package, CheckCircle, Clock, Truck } from 'lucide-react'

const STATUS_ICON = {
  menunggu    : Clock,
  dikonfirmasi: CheckCircle,
  dikirim     : Truck,
  selesai     : CheckCircle,
  dibatalkan  : Package,
}

const STATUS_COLOR = {
  menunggu    : 'text-amber-400',
  dikonfirmasi: 'text-primary-400',
  dikirim     : 'text-agro-green',
  selesai     : 'text-agro-green',
  dibatalkan  : 'text-red-400',
}

export default function InvoicePage() {
  const { user }              = useAuth()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/orders/my').then(res => {
      setOrders(res.data.orders || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const printInvoice = (order) => {
    const now = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
    const html = `
      <!DOCTYPE html><html><head><meta charset="UTF-8">
      <title>Invoice #${order.id} — AgroLens AI</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:Arial,sans-serif;color:#1a1a2e;padding:40px;}
        .header{background:linear-gradient(135deg,#3b82f6,#1D9E75);color:white;padding:28px;border-radius:12px;margin-bottom:28px;}
        .header h1{font-size:22px;margin-bottom:6px;}
        .section{margin-bottom:20px;}
        .section h2{font-size:14px;font-weight:bold;color:#3b82f6;border-bottom:2px solid #3b82f6;padding-bottom:6px;margin-bottom:12px;}
        .row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f0f0f0;font-size:13px;}
        .label{color:#666;}
        .value{font-weight:bold;}
        .total{font-size:18px;font-weight:bold;color:#3b82f6;}
        .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:#dbeafe;color:#1e40af;}
        .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:11px;color:#999;text-align:center;}
      </style></head><body>
      <div class="header">
        <h1>🌾 Invoice AgroLens AI</h1>
        <p>Invoice #INV-${String(order.id).padStart(4,'0')} | ${now}</p>
      </div>
      <div class="section">
        <h2>Detail Transaksi</h2>
        <div class="row"><span class="label">Invoice No</span><span class="value">#INV-${String(order.id).padStart(4,'0')}</span></div>
        <div class="row"><span class="label">Tanggal</span><span class="value">${order.created_at?.split(' ')[0]}</span></div>
        <div class="row"><span class="label">Status</span><span class="badge">${order.status?.toUpperCase()}</span></div>
      </div>
      <div class="section">
        <h2>Pembeli</h2>
        <div class="row"><span class="label">Nama</span><span class="value">${order.buyer_name}</span></div>
        <div class="row"><span class="label">Alamat Pengiriman</span><span class="value">${order.alamat_pengiriman || '—'}</span></div>
      </div>
      <div class="section">
        <h2>Detail Pesanan</h2>
        <div class="row"><span class="label">Komoditas</span><span class="value">${order.komoditas}</span></div>
        <div class="row"><span class="label">Jumlah</span><span class="value">${order.jumlah} ${order.satuan || 'kg'}</span></div>
        <div class="row"><span class="label">Harga Satuan</span><span class="value">Rp ${order.harga_per_kg?.toLocaleString('id-ID')}/${order.satuan || 'kg'}</span></div>
        <div class="row"><span class="label">Metode Bayar</span><span class="value">${order.metode_bayar}</span></div>
        <div class="row" style="margin-top:8px;padding-top:8px;border-top:2px solid #3b82f6;">
          <span style="font-weight:bold;font-size:15px;">Total Pembayaran</span>
          <span class="total">Rp ${order.total_harga?.toLocaleString('id-ID')}</span>
        </div>
      </div>
      <div class="footer">
        <p>AgroLens AI — Platform Agritech Terintegrasi | Tim Sonic | Universitas Dipa Makassar</p>
        <p>PIDI DIGDAYA X HACKATHON 2026 — Bank Indonesia & OJK</p>
        <p style="margin-top:4px">⚠️ Invoice ini adalah bukti transaksi di platform AgroLens AI</p>
      </div>
      </body></html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  return (
    <BuyerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">🧾 Invoice & Struk</h1>
        <p className="text-gray-400">Unduh struk pembayaran dari semua transaksi kamu</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="w-12 h-12 text-gray-600 mb-3" />
          <p className="text-white font-semibold mb-1">Belum ada invoice</p>
          <p className="text-gray-400 text-sm">Invoice akan muncul setelah kamu melakukan pembelian</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const Icon  = STATUS_ICON[order.status] || Package
            const color = STATUS_COLOR[order.status] || 'text-gray-400'
            return (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs text-gray-500">#INV-{String(order.id).padStart(4,'0')}</p>
                      <span className="text-xs text-gray-600">·</span>
                      <p className="text-xs text-gray-500">{order.created_at?.split(' ')[0]}</p>
                    </div>
                    <p className="font-semibold text-white text-lg mb-1">{order.komoditas}</p>
                    <p className="text-sm text-gray-400">{order.jumlah} kg × Rp {order.harga_per_kg?.toLocaleString('id-ID')}</p>
                    <div className={`flex items-center gap-1.5 mt-2 text-xs font-semibold ${color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-extrabold text-white text-lg">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-gray-500 mb-3">{order.metode_bayar}</p>
                    <button onClick={() => printInvoice(order)}
                      className="flex items-center gap-1.5 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/20 text-primary-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </BuyerLayout>
  )
}