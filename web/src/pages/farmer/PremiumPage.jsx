import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { Crown, Check, Loader, Star, Zap, Package } from 'lucide-react'

const PLANS = [
  { id:'bulanan', label:'1 Bulan',  harga:29000,  per:'bulan',  popular:false, color:'border-white/20' },
  { id:'3bulan',  label:'3 Bulan',  harga:79000,  per:'3 bulan',popular:true,  color:'border-agro-green', hemat:'Hemat Rp 8.000' },
  { id:'tahunan', label:'1 Tahun',  harga:279000, per:'tahun',  popular:false, color:'border-primary-500', hemat:'Hemat Rp 69.000' },
]

const FEATURES_FREE    = ['Upload maks 4 produk','Akses marketplace','Prediksi harga','Credit scoring','Chatbot AI']
const FEATURES_PREMIUM = ['Upload produk unlimited ♾️','Produk tampil prioritas ⭐','Badge Premium di profil 👑','Semua fitur gratis +','Analitik penjualan (segera)']

export default function PremiumPage() {
  const navigate = useNavigate()
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(true)
  const [upgrading, setUpgrading] = useState(null)
  const [success, setSuccess]   = useState(null)

  useEffect(() => {
    api.get('/premium/status').then(res => setStatus(res.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleUpgrade = async (planId) => {
    setUpgrading(planId)
    try {
      const res = await api.post(`/premium/upgrade/${planId}`)
      setSuccess(res.data)
      setStatus(prev => ({ ...prev, is_premium: true, premium_until: res.data.premium_until }))
    } catch (err) {
      alert(err.response?.data?.detail || 'Gagal upgrade.')
    } finally { setUpgrading(null) }
  }

  if (loading) return <FarmerLayout><div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" /></div></FarmerLayout>

  return (
    <FarmerLayout>
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-2">AgroLens Premium</h1>
        <p className="text-gray-400">Upgrade untuk tampil lebih banyak dan lebih prioritas di marketplace</p>
        {status?.is_premium && (
          <div className="inline-flex items-center gap-2 mt-4 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold">
            <Crown className="w-4 h-4" /> Akun Premium aktif hingga {status.premium_until}
          </div>
        )}
      </div>

      {success && (
        <div className="max-w-md mx-auto mb-8 bg-agro-green/10 border border-agro-green/20 rounded-2xl p-6 text-center">
          <Crown className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="font-bold text-white text-lg mb-1">Upgrade Berhasil! 🎉</p>
          <p className="text-gray-400 text-sm">Paket {success.plan} aktif hingga {success.premium_until}</p>
          <p className="text-xs text-gray-500 mt-2">*Simulasi untuk demo AgroLens AI</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4"><Package className="w-5 h-5 text-gray-400" /><h2 className="font-bold text-white">Gratis</h2></div>
          <p className="text-3xl font-extrabold text-white mb-1">Rp 0</p>
          <p className="text-xs text-gray-500 mb-5">Selamanya</p>
          <div className="space-y-2.5">
            {FEATURES_FREE.map((f,i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <Check className="w-4 h-4 text-gray-500 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
          {!status?.is_premium && <div className="mt-5 w-full text-center text-xs text-gray-500 bg-white/5 py-2.5 rounded-xl">Paket aktif saat ini</div>}
        </div>

        <div className="bg-gradient-to-b from-amber-500/10 to-agro-green/5 border border-amber-500/30 rounded-2xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">PALING POPULER</span>
          </div>
          <div className="flex items-center gap-2 mb-4"><Crown className="w-5 h-5 text-amber-400" /><h2 className="font-bold text-white">Premium</h2></div>
          <p className="text-3xl font-extrabold text-amber-400 mb-1">Mulai Rp 29.000</p>
          <p className="text-xs text-gray-500 mb-5">per bulan</p>
          <div className="space-y-2.5">
            {FEATURES_PREMIUM.map((f,i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white font-medium">
                <Star className="w-4 h-4 text-amber-400 flex-shrink-0" />{f}
              </div>
            ))}
          </div>
          {status?.is_premium && <div className="mt-5 w-full text-center text-xs text-amber-400 bg-amber-500/10 py-2.5 rounded-xl font-semibold">✅ Paket aktif saat ini</div>}
        </div>
      </div>

      {!status?.is_premium && (
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center font-bold text-white text-lg mb-6">Pilih Paket Premium</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map(plan => (
              <div key={plan.id} className={`bg-white/5 border-2 ${plan.popular ? 'border-agro-green' : plan.color} rounded-2xl p-5 text-center relative`}>
                {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-agro-green text-white text-xs font-bold px-3 py-1 rounded-full">TERBAIK</span></div>}
                {plan.hemat && <div className="bg-agro-green/20 text-agro-green text-xs font-semibold px-2 py-0.5 rounded-full mb-3 inline-block">{plan.hemat}</div>}
                <p className="font-bold text-white text-lg mb-1">{plan.label}</p>
                <p className="text-2xl font-extrabold text-white mb-1">Rp {plan.harga.toLocaleString('id-ID')}</p>
                <p className="text-xs text-gray-500 mb-5">/{plan.per}</p>
                <button onClick={() => handleUpgrade(plan.id)} disabled={!!upgrading}
                  className={`w-full font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${plan.popular ? 'bg-agro-green hover:bg-agro-teal text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  {upgrading === plan.id ? <Loader className="w-4 h-4 animate-spin" /> : <><Zap className="w-4 h-4" /> Pilih Paket</>}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-600 mt-4">*Simulasi pembayaran untuk demo AgroLens AI — PIDI DIGDAYA X Hackathon 2026</p>
        </div>
      )}
    </FarmerLayout>
  )
}