import { useAuth } from '../../context/AuthContext'
import MitraLayout from '../../components/layout/MitraLayout'
import { Shield, Activity, Leaf } from 'lucide-react'

export default function MitraSettings() {
  const { user } = useAuth()

  return (
    <MitraLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">⚙️ Pengaturan</h1>
        <p className="text-gray-400">Informasi akun dan sistem mitra keuangan</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white">Info Akun</h2>
          </div>
          <div className="space-y-3">
            {[
              { label:'Nama', value: user?.name },
              { label:'Email', value: user?.email },
              { label:'Role', value: 'Mitra Keuangan' },
            ].map((item,i) => (
              <div key={i} className="flex justify-between text-sm p-3 bg-white/5 rounded-xl">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white">Regulasi</h2>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              Credit scoring di AgroLens AI sesuai dengan <span className="text-amber-400 font-semibold">POJK No. 29/2024</span> tentang Penyelenggaraan Usaha Perusahaan Pembiayaan — Alternative Credit Scoring untuk segmen unbanked/underbanked.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-600/20 to-agro-green/10 border border-amber-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-5 h-5 text-agro-green" />
            <p className="font-bold text-white">AgroLens AI — PIDI DIGDAYA X HACKATHON 2026</p>
          </div>
          <p className="text-gray-400 text-sm">Tim Sonic | Universitas Dipa Makassar | Bank Indonesia & OJK</p>
        </div>
      </div>
    </MitraLayout>
  )
}