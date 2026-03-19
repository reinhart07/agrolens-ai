import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react'

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('petani')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    province: '',
    city: '',
    land_area: '',
    farming_type: '',
    institution_name: '',
    institution_type: 'bank',
  })

  const roles = [
    { value: 'petani', label: 'Petani', emoji: '🌾', desc: 'Jual komoditas langsung ke pembeli' },
    { value: 'pembeli', label: 'Pembeli', emoji: '🛒', desc: 'Beli produk segar dari petani' },
    { value: 'mitra', label: 'Mitra Keuangan', emoji: '🏦', desc: 'Akses credit scoring petani' },
  ]

  const provinces = [
    'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Tenggara',
    'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'DI Yogyakarta',
    'Sumatera Utara', 'Sumatera Selatan', 'Kalimantan Selatan',
    'Bali', 'Nusa Tenggara Barat', 'Papua', 'Lainnya'
  ]

  const handleNext = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (form.password !== form.confirm_password) {
        setError('Password dan konfirmasi password tidak sama!')
        return
      }
      setError('')
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: connect ke FastAPI /auth/register
      await new Promise(r => setTimeout(r, 1500))
      setStep(3)
    } catch {
      setError('Gagal mendaftar. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  // Step 3 — Success
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-agro-dark via-primary-900 to-agro-dark flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-agro-green/20 border-2 border-agro-green rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
            <Check className="w-10 h-10 text-agro-green" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Pendaftaran Berhasil!</h1>
          <p className="text-gray-400">
            Akun kamu sebagai <span className="text-agro-green font-semibold capitalize">{role}</span> berhasil dibuat.
            Silakan masuk untuk mulai menggunakan AgroLens AI.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 bg-agro-green hover:bg-agro-teal text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Masuk Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
          <p>
            <Link to="/" className="text-xs text-gray-600 hover:text-gray-400">
              ← Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    )
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

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-agro-green rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-xl text-white leading-none">AgroLens AI</p>
            <p className="text-xs text-agro-green font-semibold">by Tim Sonic</p>
          </div>
        </div>

        <div className="relative space-y-8">
          <h2 className="text-4xl font-extrabold text-white leading-tight">
            Bergabung dengan
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-primary-400">
              {' '}Ekosistem Tani Digital
            </span>
          </h2>

          {/* Role cards */}
          <div className="space-y-3">
            {roles.map((r) => (
              <div
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  role === r.value
                    ? 'bg-agro-green/20 border-agro-green'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className={`font-bold text-sm ${role === r.value ? 'text-agro-green' : 'text-white'}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-gray-400">{r.desc}</p>
                </div>
                {role === r.value && (
                  <div className="ml-auto w-5 h-5 bg-agro-green rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <span className="text-xs text-gray-400">PIDI DIGDAYA X HACKATHON 2026</span>
            <span className="text-xs text-agro-green font-semibold">· Bank Indonesia & OJK</span>
          </div>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg">AgroLens AI</span>
          </div>

          {/* Header + step indicator */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s ? 'bg-agro-green text-white' : 'bg-white/10 text-gray-500'
                  }`}>
                    {step > s ? <Check className="w-3.5 h-3.5" /> : s}
                  </div>
                  {s < 2 && <div className={`w-12 h-0.5 ${step > s ? 'bg-agro-green' : 'bg-white/10'}`} />}
                </div>
              ))}
              <span className="text-xs text-gray-500 ml-2">
                {step === 1 ? 'Data akun' : 'Data profil'}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-1">
              {step === 1 ? 'Buat Akun Baru' : 'Lengkapi Profil'}
            </h1>
            <p className="text-gray-400 text-sm">
              {step === 1 ? 'Daftar gratis, mulai dalam hitungan menit' : 'Informasi tambahan untuk pengalaman terbaik'}
            </p>
          </div>

          {/* Mobile role selector */}
          <div className="lg:hidden grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === r.value
                    ? 'bg-agro-green/20 border-agro-green text-agro-green'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                {r.label}
              </button>
            ))}
          </div>

          {/* STEP 1 — Data akun */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Nama lengkap kamu"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Nomor HP</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Minimal 8 karakter"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    required
                    minLength={8}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Konfirmasi Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Ulangi password"
                    value={form.confirm_password}
                    onChange={e => update('confirm_password', e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" className="w-full bg-agro-green hover:bg-agro-teal text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2">
                Lanjut
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2 — Data profil */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Petani fields */}
              {role === 'petani' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Provinsi</label>
                    <select
                      value={form.province}
                      onChange={e => update('province', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    >
                      <option value="" className="bg-agro-dark">Pilih provinsi</option>
                      {provinces.map(p => (
                        <option key={p} value={p} className="bg-agro-dark">{p}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Kota / Kabupaten</label>
                    <input
                      type="text"
                      placeholder="Contoh: Makassar"
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Luas Lahan (hektar)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="Contoh: 1.5"
                      value={form.land_area}
                      onChange={e => update('land_area', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Jenis Komoditas yang Diusahakan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Cabai, Tomat, Bawang Merah"
                      value={form.farming_type}
                      onChange={e => update('farming_type', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    />
                  </div>
                </>
              )}

              {/* Pembeli fields */}
              {role === 'pembeli' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Provinsi</label>
                    <select
                      value={form.province}
                      onChange={e => update('province', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    >
                      <option value="" className="bg-agro-dark">Pilih provinsi</option>
                      {provinces.map(p => (
                        <option key={p} value={p} className="bg-agro-dark">{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Kota / Kabupaten</label>
                    <input
                      type="text"
                      placeholder="Contoh: Makassar"
                      value={form.city}
                      onChange={e => update('city', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    />
                  </div>
                </>
              )}

              {/* Mitra fields */}
              {role === 'mitra' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Nama Institusi</label>
                    <input
                      type="text"
                      placeholder="Contoh: Bank Sulawesi Selatan"
                      value={form.institution_name}
                      onChange={e => update('institution_name', e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Jenis Institusi</label>
                    <select
                      value={form.institution_type}
                      onChange={e => update('institution_type', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-agro-green focus:bg-white/10 transition-all"
                    >
                      <option value="bank" className="bg-agro-dark">Bank</option>
                      <option value="koperasi" className="bg-agro-dark">Koperasi</option>
                      <option value="fintech" className="bg-agro-dark">Fintech</option>
                      <option value="lainnya" className="bg-agro-dark">Lainnya</option>
                    </select>
                  </div>
                </>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-3.5 rounded-xl transition-all duration-200"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Daftar<ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-agro-green font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>

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