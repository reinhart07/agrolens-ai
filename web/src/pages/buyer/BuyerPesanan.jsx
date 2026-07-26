import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import BuyerLayout from '../../components/layout/BuyerLayout'
import api from '../../services/api'
import {
  Package, Clock, CheckCircle, XCircle, Truck,
  Search, Upload, RefreshCw, Loader, ImageIcon
} from 'lucide-react'

const STATUS_CONFIG = {
  menunggu    : { label: 'Menunggu Konfirmasi', icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10  border-amber-500/20' },
  dikonfirmasi: { label: 'Dikonfirmasi',        icon: CheckCircle,  color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
  dikirim     : { label: 'Sedang Dikirim',      icon: Truck,        color: 'text-agro-green',  bg: 'bg-agro-green/10  border-agro-green/20' },
  selesai     : { label: 'Selesai',             icon: CheckCircle,  color: 'text-agro-green',  bg: 'bg-agro-green/10  border-agro-green/20' },
  dibatalkan  : { label: 'Dibatalkan',          icon: XCircle,      color: 'text-red-400',     bg: 'bg-red-500/10     border-red-500/20' },
}

function UploadBuktiModal({ order, onClose, onSuccess }) {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
    setFile(f)
    setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      // Upload foto ke Cloudinary
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await api.post('/upload/foto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Update order dengan bukti bayar
      await api.patch(`/orders/${order.id}/bukti`, {
        bukti_url: uploadRes.data.url
      })

      onSuccess()
      onClose()
    } catch (err) {
      setError('Gagal upload bukti. Coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-agro-dark border border-white/10 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div>
            <h2 className="font-bold text-white">Upload Bukti Pembayaran</h2>
            <p className="text-xs text-gray-500">Order #{order.id} — {order.komoditas}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Info transfer */}
          <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
            <p className="text-xs text-primary-400 font-semibold mb-2">💰 Total yang harus dibayar:</p>
            <p className="text-2xl font-extrabold text-white">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
            <p className="text-xs text-gray-400 mt-1">Metode: {order.metode_bayar}</p>
          </div>

          {/* Upload area */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Screenshot bukti transfer / pembayaran</label>
            {!preview ? (
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-white/20 hover:border-primary-500/50 rounded-xl p-8 text-center cursor-pointer transition-all hover:bg-white/3">
                <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Klik untuk pilih foto</p>
                <p className="text-xs text-gray-600 mt-1">JPG/PNG, maks 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                <button onClick={() => { setFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-sm">✕</button>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => handleFile(e.target.files[0])} />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-2.5 rounded-xl transition-all">
              Batal
            </button>
            <button onClick={handleUpload} disabled={!file || uploading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
              {uploading ? <><Loader className="w-4 h-4 animate-spin" /> Mengupload...</> : <><Upload className="w-4 h-4" /> Upload Bukti</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BuyerPesanan() {
  const [orders, setOrders]     = useState([])
  const [filter, setFilter]     = useState('semua')
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)
  const [uploadModal, setUploadModal] = useState(null)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await api.get('/orders/my')
      setOrders(res.data.orders || [])
    } catch { console.error('gagal fetch orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [])

  const tabs = ['semua', 'menunggu', 'dikonfirmasi', 'dikirim', 'selesai', 'dibatalkan']

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'semua' || o.status === filter
    const matchSearch = o.komoditas?.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <BuyerLayout>
      {uploadModal && (
        <UploadBuktiModal
          order={uploadModal}
          onClose={() => setUploadModal(null)}
          onSuccess={fetchOrders}
        />
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">📦 Pesanan Saya</h1>
          <p className="text-gray-400">Pantau status pesanan dari petani</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari pesanan..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === tab ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-white font-semibold mb-2">Belum ada pesanan</p>
          <p className="text-gray-400 text-sm mb-6">Yuk mulai belanja komoditas segar dari petani!</p>
          <Link to="/buyer/browse"
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
            Mulai Belanja
          </Link>
        </div>
      )}

      {!loading && filtered.map((order) => {
        const sc   = STATUS_CONFIG[order.status] || STATUS_CONFIG.menunggu
        const Icon = sc.icon
        const needsBukti = order.status === 'menunggu' && !order.bukti_bayar && order.metode_bayar !== 'COD'

        return (
          <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Order #{order.id} · {order.created_at?.split(' ')[0]}</p>
                <p className="font-semibold text-white text-lg">{order.komoditas}</p>
                <p className="text-sm text-gray-400">{order.jumlah} kg × Rp {order.harga_per_kg?.toLocaleString('id-ID')}</p>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${sc.bg} ${sc.color}`}>
                <Icon className="w-3 h-3" />
                {sc.label}
              </div>
            </div>

            {/* Bukti sudah diupload */}
            {order.bukti_bayar && (
              <div className="mb-3 flex items-center gap-2 bg-agro-green/10 border border-agro-green/20 rounded-xl px-3 py-2">
                <CheckCircle className="w-4 h-4 text-agro-green flex-shrink-0" />
                <p className="text-xs text-agro-green">Bukti pembayaran sudah diupload — menunggu konfirmasi petani</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div>
                <p className="text-xs text-gray-500">Total Pembayaran</p>
                <p className="font-extrabold text-white">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500">{order.metode_bayar}</p>
              </div>
              <div className="flex gap-2">
                {needsBukti && (
                  <button onClick={() => setUploadModal(order)}
                    className="flex items-center gap-1.5 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-500/20 text-primary-400 text-xs font-semibold px-3 py-2 rounded-xl transition-all">
                    <Upload className="w-3 h-3" />
                    Upload Bukti Bayar
                  </button>
                )}
                {order.status === 'selesai' && (
                  <button className="flex items-center gap-1.5 bg-agro-green/10 border border-agro-green/20 text-agro-green text-xs font-semibold px-3 py-2 rounded-xl">
                    <CheckCircle className="w-3 h-3" />
                    Beri Ulasan
                  </button>
                )}
              </div>
            </div>

            {order.alamat_pengiriman && (
              <p className="text-xs text-gray-600 mt-2">📍 {order.alamat_pengiriman}</p>
            )}
          </div>
        )
      })}
    </BuyerLayout>
  )
}