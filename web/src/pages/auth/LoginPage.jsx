import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [role, setRole] = useState('petani')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const roles = [
    { value: 'petani', label: 'Petani', emoji: '🌾' },
    { value: 'pembeli', label: 'Pembeli', emoji: '🛒' },
    { value: 'mitra', label: 'Mitra Keuangan', emoji: '🏦' },
    { value: 'admin', label: 'Admin', emoji: '⚙️' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: connect ke FastAPI /auth/login
      await new Promise(r => setTimeout(r, 1000))
      if (role === 'petani') navigate('/farmer/dashboard')
      else if (role === 'pembeli') navigate('/buyer/home')
      else if (role === 'mitra') navigate('/partner/dashboard')
      else navigate('/admin/dashboard')
    } catch {
      setError('Email atau password salah. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-agro-dark via-primary-900 to-agro-dark flex">

      {/* LEFT — Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-agro-green/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-agro-green rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-xl text-white leading-none">AgroLens AI</p>
            <p className="text-xs text-agro-green font-semibold">by Tim Sonic</p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Ekosistem Pertanian Digital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-primary-400">
              {' '}Indonesia
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Menghubungkan petani, pembeli, dan lembaga keuangan dalam satu platform AI terintegrasi.
          </p>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              'Prediksi harga komoditas 7–30 hari ke depan',
              'Deteksi kualitas otomatis via AI',
              'Credit scoring tanpa riwayat bank',
              'Marketplace D2C langsung dari petani',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-agro-green/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 bg-agro-green rounded-full" />
                </div>
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-400">PIDI DIGDAYA X HACKATHON 2026</span>
            <span className="text-xs text-agro-green font-semibold">· Bank Indonesia & OJK</span>
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg">AgroLens AI</span>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Selamat datang!</h1>
            <p className="text-gray-400">Masuk ke akun AgroLens AI kamu</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-4 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                  role === r.value
                    ? 'bg-agro-green/20 border-agro-green text-agro-green'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-agro-green hover:underline">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">atau</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register link */}
          <p className="text-center text-gray-400 text-sm">
            Belum punya akun?{' '}
            <Link to="/register" className="text-agro-green font-semibold hover:underline">
              Daftar sekarang — Gratis
            </Link>
          </p>

          {/* Back to home */}
          <p className="text-center">
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              ← Kembali ke beranda
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}