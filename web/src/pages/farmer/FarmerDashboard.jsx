import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hargaAPI, kreditAPI } from '../../services/api'
import FarmerLayout from '../../components/layout/FarmerLayout'
import {
  TrendingUp, TrendingDown, ShoppingBag, CreditCard,
  ArrowRight, Leaf, AlertCircle, CheckCircle, Clock
} from 'lucide-react'

// ── Stat Card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}

// ── Harga Card ────────────────────────────────────────────────
function HargaCard({ komoditas, harga, prediksi, perubahan, trend }) {
  const naik = trend === 'naik'
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-agro-green/10 rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-agro-green" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{komoditas}</p>
          <p className="text-xs text-gray-500">Rp {harga?.toLocaleString('id-ID')}/kg</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white">Rp {prediksi?.toLocaleString('id-ID')}</p>
        <div className={`flex items-center gap-1 justify-end text-xs font-semibold ${naik ? 'text-agro-green' : 'text-red-400'}`}>
          {naik ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(perubahan).toFixed(1)}%
        </div>
      </div>
    </div>
  )
}

export default function FarmerDashboard() {
  const { user } = useAuth()
  const [hargaData, setHargaData]   = useState([])
  const [kreditData, setKreditData] = useState(null)
  const [loading, setLoading]       = useState(true)

  // Komoditas untuk demo prediksi harga
  const komoditasList = [
    { nama: 'Cabai Merah',  harga: 45000, bulan: 3, tahun: 2026 },
    { nama: 'Bawang Merah', harga: 28000, bulan: 3, tahun: 2026 },
    { nama: 'Tomat',        harga: 8000,  bulan: 3, tahun: 2026 },
    { nama: 'Beras',        harga: 13000, bulan: 3, tahun: 2026 },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prediksi harga untuk beberapa komoditas
        const hargaPromises = komoditasList.map(k =>
          hargaAPI.prediksi({
            komoditas       : k.nama,
            harga_sekarang  : k.harga,
            bulan           : k.bulan,
            tahun           : k.tahun,
          }).then(r => ({ ...r.data })).catch(() => null)
        )
        const hargaResults = await Promise.all(hargaPromises)
        setHargaData(hargaResults.filter(Boolean))

        // Fetch credit score dummy
        const kreditRes = await kreditAPI.score({
          person_age                   : 35,
          person_income                : 5000000,
          person_emp_length            : 8,
          loan_amnt                    : 10000000,
          loan_int_rate                : 12.0,
          loan_percent_income          : 0.15,
          cb_person_cred_hist_length   : 6,
          person_home_ownership_enc    : 1,
          loan_intent_enc              : 2,
          loan_grade_enc               : 1,
          cb_person_default_on_file_enc: 0,
        })
        setKreditData(kreditRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const scoreColor = kreditData?.credit_score >= 75
    ? 'text-agro-green' : kreditData?.credit_score >= 50
    ? 'text-amber-400' : 'text-red-400'

  const risikoIcon = kreditData?.kategori_risiko === 'Rendah'
    ? <CheckCircle className="w-4 h-4 text-agro-green" />
    : kreditData?.kategori_risiko === 'Sedang'
    ? <Clock className="w-4 h-4 text-amber-400" />
    : <AlertCircle className="w-4 h-4 text-red-400" />

  return (
    <FarmerLayout>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">🌾</span>
          <h1 className="text-2xl font-extrabold text-white">
            Selamat datang, {user?.name?.split(' ')[0]}!
          </h1>
        </div>
        <p className="text-gray-400">Pantau komoditas, harga, dan credit score kamu hari ini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Komoditas Aktif"
          value="0"
          sub="Belum ada listing"
          color="text-agro-green"
          bg="bg-agro-green/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Penjualan"
          value="Rp 0"
          sub="Bulan ini"
          color="text-primary-400"
          bg="bg-primary-500/10"
        />
        <StatCard
          icon={CreditCard}
          label="Credit Score"
          value={kreditData ? `${kreditData.credit_score}` : '—'}
          sub={kreditData?.kategori_risiko ? `Risiko ${kreditData.kategori_risiko}` : 'Memuat...'}
          color={kreditData?.credit_score >= 75 ? 'text-agro-green' : 'text-amber-400'}
          bg="bg-purple-500/10"
        />
        <StatCard
          icon={Leaf}
          label="Transaksi"
          value="0"
          sub="Total transaksi"
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Prediksi Harga */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-white">Prediksi Harga Komoditas</h2>
              <p className="text-xs text-gray-500">Estimasi harga 1 bulan ke depan</p>
            </div>
            <Link to="/farmer/harga" className="text-xs text-agro-green hover:underline flex items-center gap-1">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : hargaData.length > 0 ? (
            <div>
              {hargaData.map((h, i) => (
                <HargaCard
                  key={i}
                  komoditas={h.komoditas}
                  harga={h.harga_sekarang}
                  prediksi={h.prediksi_1_bulan}
                  perubahan={h.perubahan_persen}
                  trend={h.trend}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Data prediksi tidak tersedia</p>
          )}
        </div>

        {/* Credit Score */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-white">Credit Score</h2>
            <Link to="/farmer/kredit" className="text-xs text-agro-green hover:underline">
              Detail →
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
            </div>
          ) : kreditData ? (
            <div className="space-y-4">
              {/* Score circle */}
              <div className="flex flex-col items-center py-6">
                <div className="relative w-32 h-32">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke={kreditData.credit_score >= 75 ? '#1D9E75' : kreditData.credit_score >= 50 ? '#f59e0b' : '#e11d48'}
                      strokeWidth="10"
                      strokeDasharray={`${(kreditData.credit_score / 100) * 314} 314`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-extrabold ${scoreColor}`}>{kreditData.credit_score}</span>
                    <span className="text-xs text-gray-500">/ 100</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  {risikoIcon}
                  <span className="text-sm font-semibold text-white">Risiko {kreditData.kategori_risiko}</span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Prob. Default</span>
                  <span className="text-white font-medium">{kreditData.prob_default}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Limit Kredit</span>
                  <span className="text-white font-medium">Rp {kreditData.limit_kredit?.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="bg-agro-green/10 border border-agro-green/20 rounded-xl p-3">
                <p className="text-xs text-agro-green leading-relaxed">{kreditData.rekomendasi}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">Data kredit tidak tersedia</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/farmer/komoditas', icon: '📦', label: 'Tambah Komoditas', color: 'border-agro-green/20 hover:bg-agro-green/5' },
          { to: '/farmer/harga',    icon: '📈', label: 'Cek Prediksi Harga', color: 'border-primary-500/20 hover:bg-primary-500/5' },
          { to: '/farmer/kredit',   icon: '💳', label: 'Ajukan Kredit', color: 'border-purple-500/20 hover:bg-purple-500/5' },
          { to: '/farmer/chatbot',  icon: '🤖', label: 'Tanya Chatbot AI', color: 'border-amber-500/20 hover:bg-amber-500/5' },
        ].map((item, i) => (
          <Link
            key={i}
            to={item.to}
            className={`flex items-center gap-3 p-4 bg-white/3 border ${item.color} rounded-xl transition-all duration-200 hover:-translate-y-0.5`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-300">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Regulasi badge */}
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
        <span>Credit scoring sesuai regulasi</span>
        <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-full text-gray-500">POJK No. 29/2024</span>
      </div>

    </FarmerLayout>
  )
}