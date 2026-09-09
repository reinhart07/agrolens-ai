import { useState, useEffect, useRef } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { Crown, Check, Loader, Star, Upload, ImageIcon, Clock, CheckCircle, XCircle } from 'lucide-react'

const PLANS = [
  { id:'bulanan', label:'1 Bulan',  harga:29000,  per:'bulan',   popular:false, color:'border-white/20' },
  { id:'3bulan',  label:'3 Bulan',  harga:79000,  per:'3 bulan', popular:true,  color:'border-agro-green', hemat:'Hemat Rp 8.000' },
  { id:'tahunan', label:'1 Tahun',  harga:279000, per:'tahun',   popular:false, color:'border-primary-500', hemat:'Hemat Rp 69.000' },
]

const REKENING = {
  bank     : 'BCA',
  no_rek   : '1234567890',
  atas_nama: 'AgroLens AI - Tim Sonic',
}

const FEATURES_FREE    = ['Upload maks 4 produk','Akses marketplace','Prediksi harga','Credit scoring','Chatbot AI']
const FEATURES_PREMIUM = ['Upload produk unlimited ♾️','Produk tampil prioritas ⭐','Badge Premium di profil 👑','Semua fitur gratis +','Analitik penjualan (segera)']

export default function PremiumPage() {
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)  // plan yang dipilih
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess]   = useState(null)
  const [error, setError]       = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    api.get('/premium/status')
      .then(res => setStatus(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
    setFile(f)
    setError('')
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async () => {
    if (!file) { setError('Upload bukti pembayaran dulu!'); return }
    if (!selected) { setError('Pilih paket dulu!'); return }
    setUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post(`/premium/request/${selected}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess(res.data)
      setStatus(prev => ({ ...prev, pending: true, pending_plan: selected }))
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal kirim request. Coba lagi.')
    } finally { setUploading(false) }
  }

  if (loading) return (
    <FarmerLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
      </div>
    </FarmerLayout>
  )

  return (
    <FarmerLayout>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">AgroLens Premium</h1>
        <p className="text-gray-400">Upgrade untuk tampil lebih banyak dan prioritas di marketplace</p>

        {status?.is_premium && (
          <div className="inline-flex items-center gap-2 mt-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Crown className="w-4 h-4" /> Premium aktif hingga {status.premium_until}
          </div>
        )}

        {status?.pending && !status?.is_premium && (
          <div className="inline-flex items-center gap-2 mt-4 bg-primary-500/20 border border-primary-500/30 text-primary-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Clock className="w-4 h-4" /> Menunggu verifikasi admin
          </div>
        )}
      </div>

      {/* Sukses */}
      {success && (
        <div className="max-w-md mx-auto mb-8 bg-agro-green/10 border border-agro-green/20 rounded-2xl p-6 text-center">
          <CheckCircle className="w-10 h-10 text-agro-green mx-auto mb-3" />
          <p className="font-bold text-white text-lg mb-1">Request Terkirim! 🎉</p>
          <p className="text-gray-400 text-sm">Bukti pembayaran kamu sedang diverifikasi admin. Premium akan aktif setelah admin menyetujui.</p>
        </div>
      )}

      {/* Pending state */}
      {status?.pending && !status?.is_premium && !success && (
        <div className="max-w-md mx-auto mb-8 bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6 text-center">
          <Clock className="w-10 h-10 text-primary-400 mx-auto mb-3" />
          <p className="font-bold text-white text-lg mb-1">Menunggu Verifikasi</p>
          <p className="text-gray-400 text-sm">Bukti pembayaran paket <span className="text-primary-400 font-semibold">{PLANS.find(p => p.id === status.pending_plan)?.label}</span> sedang diverifikasi admin. Harap tunggu 1×24 jam.</p>
        </div>
      )}

      {/* Perbandingan Free vs Premium */}
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-4">Gratis</h2>
          <p className="text-3xl font-extrabold text-white mb-1">Rp 0</p>
          <p className="text-xs text-gray-500 mb-5">Selamanya</p>
          <div className="space-y-2.5">
            {FEATURES_FREE.map((f,i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
          {!status?.is_premium && <div className="mt-5 text-center text-xs text-gray-500 bg-white/5 py-2.5 rounded-xl">Paket aktif saat ini</div>}
        </div>

        <div className="bg-gradient-to-b from-amber-500/10 to-agro-green/5 border border-amber-500/30 rounded-2xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">PALING POPULER</span>
          </div>
          <h2 className="font-bold text-white mb-4">Premium</h2>
          <p className="text-3xl font-extrabold text-amber-400 mb-1">Mulai Rp 29.000</p>
          <p className="text-xs text-gray-500 mb-5">per bulan</p>
          <div className="space-y-2.5">
            {FEATURES_PREMIUM.map((f,i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white font-medium">
                <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
          {status?.is_premium && <div className="mt-5 text-center text-xs text-amber-400 bg-amber-500/10 py-2.5 rounded-xl font-semibold">✅ Paket aktif saat ini</div>}
        </div>
      </div>

      {/* Form upgrade — hanya tampil kalau belum premium dan belum pending */}
      {!status?.is_premium && !status?.pending && !success && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Pilih paket */}
          <div>
            <h2 className="text-center font-bold text-white text-lg mb-4">1. Pilih Paket</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {PLANS.map(plan => (
                <div key={plan.id} onClick={() => setSelected(plan.id)}
                  className={`border-2 rounded-2xl p-5 text-center cursor-pointer transition-all relative ${
                    selected === plan.id
                      ? 'bg-agro-green/10 border-agro-green'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-agro-green text-white text-xs font-bold px-3 py-1 rounded-full">TERBAIK</span></div>}
                  {plan.hemat && <div className="bg-agro-green/20 text-agro-green text-xs font-semibold px-2 py-0.5 rounded-full mb-2 inline-block">{plan.hemat}</div>}
                  <p className="font-bold text-white mb-1">{plan.label}</p>
                  <p className="text-2xl font-extrabold text-white mb-1">Rp {plan.harga.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-500">/{plan.per}</p>
                  {selected === plan.id && <CheckCircle className="w-5 h-5 text-agro-green mx-auto mt-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* Info Transfer */}
          {selected && (
            <div>
              <h2 className="text-center font-bold text-white text-lg mb-4">2. Transfer ke Rekening AgroLens</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bank</span>
                    <span className="text-white font-bold">{REKENING.bank}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">No. Rekening</span>
                    <span className="text-white font-bold text-lg">{REKENING.no_rek}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">A/N</span>
                    <span className="text-white font-bold">{REKENING.atas_nama}</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between">
                    <span className="text-gray-400 font-semibold">Jumlah Transfer</span>
                    <span className="text-agro-green font-extrabold text-lg">
                      Rp {PLANS.find(p => p.id === selected)?.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-xs text-amber-400">⚠️ Transfer sesuai nominal. Bukti transfer akan diverifikasi admin dalam 1×24 jam.</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload bukti */}
          {selected && (
            <div>
              <h2 className="text-center font-bold text-white text-lg mb-4">3. Upload Bukti Transfer</h2>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                {!preview ? (
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-agro-green/50 rounded-xl p-10 text-center cursor-pointer transition-all hover:bg-white/3">
                    <ImageIcon className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Klik untuk pilih foto bukti transfer</p>
                    <p className="text-xs text-gray-600 mt-1">JPG/PNG, maks 5MB</p>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={preview} alt="Bukti" className="w-full h-48 object-cover" />
                    <button onClick={() => { setFile(null); setPreview(null) }}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">✕</button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files[0])} />

                {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

                <button onClick={handleSubmit} disabled={uploading || !file}
                  className="mt-4 w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  {uploading
                    ? <><Loader className="w-4 h-4 animate-spin" /> Mengirim...</>
                    : <><Upload className="w-4 h-4" /> Kirim Bukti & Request Premium</>
                  }
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </FarmerLayout>
  )
}