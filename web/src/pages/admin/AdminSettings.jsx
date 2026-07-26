import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import { Settings, Save, CheckCircle, Shield, Activity, Leaf } from 'lucide-react'

export default function AdminSettings() {
  const { user } = useAuth()
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    app_name       : 'AgroLens AI',
    app_version    : '1.0.0',
    maintenance    : false,
    allow_register : true,
    max_komoditas  : 50,
    hackathon_mode : true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">⚙️ Pengaturan</h1>
        <p className="text-gray-400">Konfigurasi sistem AgroLens AI</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* Info Sistem */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-purple-400" />
            <h2 className="font-bold text-white">Info Sistem</h2>
          </div>
          <div className="space-y-3">
            {[
              { label:'Nama Aplikasi',    value: settings.app_name },
              { label:'Versi',            value: settings.app_version },
              { label:'Admin',            value: user?.name },
              { label:'Hackathon',        value: 'PIDI DIGDAYA X HACKATHON 2026' },
              { label:'Penyelenggara',    value: 'Bank Indonesia & OJK' },
              { label:'Tim',              value: 'Tim Sonic — Universitas Dipa Makassar' },
              { label:'Backend',          value: 'FastAPI + Python' },
              { label:'Frontend',         value: 'React.js + Vite + TailwindCSS' },
              { label:'Database',         value: 'MySQL (Laragon)' },
            ].map((item,i) => (
              <div key={i} className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Model ML */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Leaf className="w-4 h-4 text-agro-green" />
            <h2 className="font-bold text-white">Model ML</h2>
          </div>
          <div className="space-y-3">
            {[
              { label:'XGBoost Harga',    value:'MAPE 11.51% | R² 0.9163', color:'text-agro-green' },
              { label:'LSTM Harga',       value:'R² 0.8070', color:'text-primary-400' },
              { label:'MobileNetV2',      value:'Akurasi 97.83%', color:'text-amber-400' },
              { label:'RandomForest',     value:'ROC AUC 0.9275', color:'text-purple-400' },
              { label:'Dataset Harga',    value:'Badan Pangan 2019–2024', color:'text-gray-300' },
              { label:'Dataset Kualitas', value:'3 kelas (Grade A/B/C)', color:'text-gray-300' },
            ].map((item,i) => (
              <div key={i} className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                <span className="text-gray-400">{item.label}</span>
                <span className={`font-medium ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Konfigurasi */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-purple-400" />
            <h2 className="font-bold text-white">Konfigurasi Aplikasi</h2>
          </div>
          <div className="space-y-4">
            {[
              { key:'maintenance',    label:'Mode Maintenance',     desc:'Nonaktifkan akses user sementara' },
              { key:'allow_register', label:'Izinkan Registrasi',   desc:'User baru bisa mendaftar' },
              { key:'hackathon_mode', label:'Mode Hackathon Demo',  desc:'Tampilkan info hackathon di UI' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button onClick={() => setSettings(prev => ({...prev, [item.key]: !prev[item.key]}))}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings[item.key] ? 'bg-purple-500' : 'bg-white/10'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings[item.key] ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {saved && (
          <div className="bg-agro-green/10 border border-agro-green/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-agro-green" />
            <p className="text-agro-green text-sm">Pengaturan berhasil disimpan!</p>
          </div>
        )}

        <button onClick={handleSave}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
          <Save className="w-4 h-4" /> Simpan Pengaturan
        </button>
      </div>
    </AdminLayout>
  )
}