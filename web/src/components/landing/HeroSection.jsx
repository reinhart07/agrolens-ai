import { ArrowRight, Leaf, TrendingUp, Shield, MapPin, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-agro-dark via-primary-700 to-agro-purple overflow-hidden flex items-center">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-agro-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-agro-purple/5 rounded-full blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <div className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-agro-green/20 border border-agro-green/40 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-agro-green rounded-full animate-pulse" />
            <span className="text-agro-green text-sm font-semibold">PIDI DIGDAYA X HACKATHON 2026</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Pertanian
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-primary-500">
                {' '}Cerdas
              </span>
              <br />
              untuk Indonesia
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Platform agritech berbasis AI yang menghubungkan petani langsung ke pembeli,
              dengan prediksi harga real-time, deteksi kualitas otomatis, dan akses kredit
              tanpa riwayat bank.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-agro-green hover:bg-agro-teal text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Mulai Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#cara-kerja"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              Lihat Cara Kerja
            </a>
          </div>

          {/* Stats — semua terverifikasi */}
          <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10">
            {[
              { value: '33.4 Juta', label: 'Petani Indonesia (BPS 2023)' },
              { value: '91 Juta', label: 'Penduduk Unbanked (OJK 2024)' },
              { value: '3 Model AI', label: 'Terintegrasi' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold text-agro-green">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Floating cards */}
        <div className="relative hidden lg:block h-[500px]">
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop"
              alt="Petani Indonesia"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-agro-dark/60 to-transparent" />
          </div>

          <div className="absolute -left-8 top-12 bg-white rounded-2xl shadow-2xl p-4 w-52 animate-float">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-agro-green/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-agro-green" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Prediksi Harga</p>
                <p className="text-sm font-bold text-agro-dark">Cabai Merah</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-agro-green">Rp 45.000</p>
            <p className="text-xs text-gray-400">Estimasi 7 hari ke depan</p>
          </div>

          <div className="absolute -right-8 top-1/3 bg-white rounded-2xl shadow-2xl p-4 w-48 animate-float-delayed">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Kualitas AI</p>
                <p className="text-sm font-bold text-agro-dark">Grade A</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-agro-green h-2 rounded-full" style={{ width: '92%' }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Confidence 92%</p>
          </div>

          <div className="absolute -left-8 bottom-16 bg-white rounded-2xl shadow-2xl p-4 w-52 animate-float">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-agro-purple" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Credit Score</p>
                <p className="text-sm font-bold text-agro-dark">Budi Santoso</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-agro-purple">82.5</p>
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
              Risiko Rendah
            </span>
          </div>

          <div className="absolute right-4 bottom-8 bg-white rounded-2xl shadow-2xl p-4 w-44 animate-float-delayed">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-red-500" />
              <p className="text-xs font-semibold text-agro-dark">Petani Terdekat</p>
            </div>
            <p className="text-sm text-gray-600">Makassar, Sulsel</p>
            <p className="text-xs text-agro-green font-semibold mt-1">3 km dari kamu</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs">Scroll untuk lihat lebih</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>

    </section>
  )
}