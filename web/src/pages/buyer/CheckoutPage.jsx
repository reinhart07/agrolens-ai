import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BuyerLayout from '../../components/layout/BuyerLayout'
import MapPicker from '../../components/MapPicker'
import api from '../../services/api'
import { ShoppingCart, CreditCard, Loader, CheckCircle, QrCode, X, ZoomIn, Info } from 'lucide-react'

const METODE_BAYAR = [
  { id: 'Transfer Bank', icon: '🏦', label: 'Transfer Bank',   desc: 'BCA / Mandiri / BNI / BRI' },
  { id: 'QRIS',          icon: '📱', label: 'QRIS',            desc: 'Scan QR dari semua e-wallet' },
  { id: 'COD',           icon: '💵', label: 'Bayar di Tempat', desc: 'Cash on Delivery' },
]

const FEE_PERSEN = 0.02

function QrisLightbox({ url, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative bg-white rounded-2xl p-4 max-w-sm w-full" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
          <X className="w-4 h-4" />
        </button>
        <p className="text-center text-sm font-bold text-gray-700 mb-3">📱 Scan QRIS untuk Bayar</p>
        <img src={url} alt="QRIS" className="w-full object-contain rounded-xl" />
        <p className="text-center text-xs text-gray-500 mt-3">Klik di luar untuk menutup</p>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const produk   = location.state?.produk || { nama: 'Cabai Merah', harga: 45000, satuan: 'kg', petani: 'Pak Budi', petani_id: null }

  const [form, setForm]   = useState({ jumlah: 1, metode: 'Transfer Bank', alamat: '', catatan: '' })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(null)
  const [error, setError]       = useState('')
  const [farmerProfile, setFarmerProfile] = useState(null)
  const [showQrisLightbox, setShowQrisLightbox] = useState(false)

  useEffect(() => {
    if (produk?.petani_id) {
      api.get(`/profile/${produk.petani_id}`).then(res => setFarmerProfile(res.data.profile)).catch(() => {})
    }
  }, [produk?.petani_id])

  const subtotal = form.jumlah * produk.harga
  const fee      = Math.round(subtotal * FEE_PERSEN)
  const total    = subtotal + fee

  const handleOrder = async () => {
    if (!form.alamat) { setError('Alamat pengiriman wajib diisi'); return }
    setError(''); setLoading(true)
    try {
      const res = await api.post('/orders/', {
        komoditas: produk.nama, jumlah: parseFloat(form.jumlah),
        harga_per_kg: produk.harga, metode_bayar: form.metode,
        catatan: form.catatan, alamat_pengiriman: form.alamat,
      })
      setSuccess({ ...res.data, total })
    } catch (err) { setError(err.response?.data?.detail || 'Gagal membuat pesanan.') }
    finally { setLoading(false) }
  }

  if (success) return (
    <BuyerLayout>
      {showQrisLightbox && farmerProfile?.foto_qris && <QrisLightbox url={farmerProfile.foto_qris} onClose={() => setShowQrisLightbox(false)} />}
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 bg-agro-green/20 border-2 border-agro-green rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-agro-green" />
        </div>
        <h1 className="text-2xl font-extrabold text-white mb-2">Pesanan Berhasil! 🎉</h1>
        <p className="text-gray-400 mb-2">Order ID: <span className="text-white font-bold">#{success.order_id}</span></p>
        <p className="text-gray-400 mb-6">Total: <span className="text-agro-green font-bold">Rp {total?.toLocaleString('id-ID')}</span></p>

        {form.metode === 'Transfer Bank' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-left">
            <p className="font-bold text-white mb-3">📋 Info Transfer</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white font-semibold">{farmerProfile?.nama_bank || 'Hubungi petani'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">No. Rekening</span><span className="text-white font-semibold">{farmerProfile?.no_rekening || 'Hubungi petani'}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">A/N</span><span className="text-white font-semibold">{farmerProfile?.atas_nama || produk.petani}</span></div>
              {farmerProfile?.whatsapp && <div className="flex justify-between"><span className="text-gray-400">WhatsApp</span><span className="text-agro-green font-semibold">{farmerProfile.whatsapp}</span></div>}
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="font-bold text-white">Total Transfer</span>
                <span className="text-agro-green font-bold text-lg">Rp {total?.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">* Upload bukti transfer di halaman Pesanan Saya</p>
          </div>
        )}

        {form.metode === 'QRIS' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-center">
            <p className="font-bold text-white mb-3">📱 Scan QRIS</p>
            {farmerProfile?.foto_qris ? (
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => setShowQrisLightbox(true)}>
                  <img src={farmerProfile.foto_qris} alt="QRIS" className="w-48 h-48 object-contain bg-white rounded-xl p-2 mb-2 group-hover:opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/60 rounded-xl p-2"><ZoomIn className="w-8 h-8 text-white" /></div>
                  </div>
                </div>
                <p className="text-xs text-primary-400 font-semibold mt-1">👆 Tap untuk perbesar</p>
                <p className="text-xs text-gray-400 mt-1">Total: <span className="text-agro-green font-bold">Rp {total?.toLocaleString('id-ID')}</span></p>
              </div>
            ) : (
              <div className="flex flex-col items-center"><QrCode className="w-16 h-16 text-gray-600 mb-2" /><p className="text-xs text-gray-400">QRIS petani belum tersedia</p></div>
            )}
          </div>
        )}

        {form.metode === 'COD' && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-6">
            <p className="font-bold text-white mb-2">💵 Bayar di Tempat (COD)</p>
            <p className="text-sm text-gray-300">Siapkan <span className="text-agro-green font-bold">Rp {total?.toLocaleString('id-ID')}</span> saat barang tiba.</p>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate('/buyer/pesanan')} className="flex-1 bg-agro-green hover:bg-agro-teal text-white font-bold py-3 rounded-xl">Lihat Pesanan</button>
          <button onClick={() => navigate('/buyer/home')} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl">Belanja Lagi</button>
        </div>
      </div>
    </BuyerLayout>
  )

  return (
    <BuyerLayout>
      {showQrisLightbox && farmerProfile?.foto_qris && <QrisLightbox url={farmerProfile.foto_qris} onClose={() => setShowQrisLightbox(false)} />}
      <div className="mb-6"><h1 className="text-2xl font-extrabold text-white mb-1">🛒 Checkout</h1><p className="text-gray-400">Selesaikan pesanan kamu</p></div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4">🌾 Detail Produk</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-agro-green/10 rounded-xl overflow-hidden flex items-center justify-center text-2xl flex-shrink-0">
                {produk.foto_url ? <img src={produk.foto_url} alt={produk.nama} className="w-full h-full object-cover" /> : '🌾'}
              </div>
              <div>
                <p className="font-semibold text-white">{produk.nama}</p>
                <p className="text-sm text-gray-400">Dari: {produk.petani}</p>
                <p className="text-agro-green font-bold">Rp {produk.harga?.toLocaleString('id-ID')}/{produk.satuan}</p>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-gray-300 mb-1.5 block">Jumlah (kg)</label>
              <input type="number" min="1" value={form.jumlah} onChange={e => setForm({...form, jumlah: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4">📍 Alamat Pengiriman</h2>
            <MapPicker onLocationSelect={({ address }) => setForm(prev => ({...prev, alamat: address}))} height="260px" />
            {form.alamat && (
              <div className="mt-3 bg-agro-green/10 border border-agro-green/20 rounded-xl p-3">
                <p className="text-xs text-agro-green font-semibold mb-1">Alamat dipilih:</p>
                <p className="text-xs text-gray-300">{form.alamat}</p>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="w-4 h-4 text-agro-green" /> Metode Pembayaran</h2>
            <div className="space-y-2 mb-4">
              {METODE_BAYAR.map(m => (
                <div key={m.id} onClick={() => setForm({...form, metode: m.id})}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.metode === m.id ? 'bg-agro-green/10 border-agro-green/30' : 'bg-white/3 border-white/10 hover:bg-white/5'}`}>
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1"><p className="text-sm font-semibold text-white">{m.label}</p><p className="text-xs text-gray-500">{m.desc}</p></div>
                  <div className={`w-4 h-4 rounded-full border-2 ${form.metode === m.id ? 'border-agro-green bg-agro-green' : 'border-gray-600'}`} />
                </div>
              ))}
            </div>
            {form.metode === 'Transfer Bank' && farmerProfile?.no_rekening && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-400 font-semibold mb-2">Info Rekening Petani:</p>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Bank</span><span className="text-white font-semibold">{farmerProfile.nama_bank}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">No. Rekening</span><span className="text-white font-semibold">{farmerProfile.no_rekening}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">A/N</span><span className="text-white font-semibold">{farmerProfile.atas_nama || produk.petani}</span></div>
                </div>
              </div>
            )}
            {form.metode === 'QRIS' && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                {farmerProfile?.foto_qris ? (
                  <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => setShowQrisLightbox(true)}>
                      <img src={farmerProfile.foto_qris} alt="QRIS" className="w-36 h-36 object-contain bg-white rounded-xl p-1.5 mx-auto group-hover:opacity-90" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-black/60 rounded-xl p-2"><ZoomIn className="w-6 h-6 text-white" /></div>
                      </div>
                    </div>
                    <p className="text-xs text-primary-400 mt-2 font-semibold">👆 Tap untuk perbesar</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2"><QrCode className="w-10 h-10 text-gray-600 mb-2" /><p className="text-xs text-gray-500">QRIS petani belum tersedia</p></div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-3">📝 Catatan</h2>
            <textarea rows={2} placeholder="Catatan untuk petani..." value={form.catatan}
              onChange={e => setForm({...form, catatan: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green resize-none" />
          </div>
        </div>

        <div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold text-white mb-4">📋 Ringkasan</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm"><span className="text-gray-400">{produk.nama} × {form.jumlah} kg</span><span className="text-white">Rp {subtotal?.toLocaleString('id-ID')}</span></div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-1">Fee Platform (2%) <Info className="w-3 h-3 text-gray-600" /></span>
                <span className="text-gray-300">Rp {fee?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Metode</span><span className="text-white">{form.metode}</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between">
                <span className="font-bold text-white">Total</span>
                <span className="font-extrabold text-agro-green text-lg">Rp {total?.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl px-3 py-2 mb-4">
              <p className="text-xs text-primary-400">💡 Fee 2% mendukung pengembangan platform AgroLens AI</p>
            </div>
            {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-3"><p className="text-red-400 text-sm">{error}</p></div>}
            <button onClick={handleOrder} disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
              {loading ? <><Loader className="w-4 h-4 animate-spin" /> Memproses...</> : <><ShoppingCart className="w-4 h-4" /> Buat Pesanan</>}
            </button>
            <p className="text-xs text-gray-600 text-center mt-3">Dengan memesan, kamu setuju dengan syarat & ketentuan AgroLens AI</p>
          </div>
        </div>
      </div>
    </BuyerLayout>
  )
}