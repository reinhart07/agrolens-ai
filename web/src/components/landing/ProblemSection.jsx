import { TrendingDown, Eye, CreditCard } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: TrendingDown,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      title: 'Tengkulak Menguasai Rantai Distribusi',
      desc: 'Margin petani jauh lebih kecil dari harga konsumen akhir akibat panjangnya rantai distribusi dengan 3–5 lapis perantara yang tidak memberikan nilai tambah signifikan.',
      stat: 'Rantai Panjang',
      statLabel: '3–5 lapis perantara distribusi',
      img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&auto=format&fit=crop',
    },
    {
      icon: Eye,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      title: 'Tidak Ada Informasi Harga Real-time',
      desc: 'Petani sering menjual komoditas di bawah harga pasar karena tidak memiliki akses informasi harga yang akurat. Disparitas harga bisa mencapai lebih dari 50–100% untuk komoditas seperti cabai dan bawang.',
      stat: '50–100%',
      statLabel: 'disparitas harga petani vs konsumen',
      img: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&auto=format&fit=crop',
    },
    {
      icon: CreditCard,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      title: 'Tidak Ada Akses Kredit Formal',
      desc: '91 juta orang Indonesia masih unbanked/underbanked (OJK 2024), termasuk jutaan petani kecil. OJK merespons dengan menerbitkan regulasi Alternative Credit Scoring (POJK No. 29/2024).',
      stat: '91 Juta',
      statLabel: 'penduduk unbanked/underbanked (OJK 2024)',
      img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-agro-dark to-primary-900" id="masalah">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Masalah yang Kami Selesaikan
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Petani Indonesia Berjuang Melawan Sistem yang Tidak Adil
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Tiga masalah struktural yang telah merugikan 33,4 juta petani Indonesia selama puluhan tahun.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i} className={`group rounded-3xl border ${p.border} bg-white/5 overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1`}>
                <div className="relative h-48 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-agro-dark to-transparent" />
                  <div className={`absolute bottom-4 left-4 ${p.bg} border ${p.border} rounded-xl px-3 py-1.5 flex items-center gap-2`}>
                    <Icon className={`w-4 h-4 ${p.color}`} />
                    <span className={`text-xs font-bold ${p.color}`}>{p.stat}</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{p.statLabel}</p>
                  <h3 className="text-lg font-bold text-white leading-snug">{p.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom quote — diganti dengan fakta BI yang terverifikasi */}
        <div className="mt-16 bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 text-center">
          <p className="text-2xl font-bold leading-relaxed max-w-3xl mx-auto text-white">
            "Inefisiensi distribusi pangan menjadi salah satu penyebab utama
            <span className="text-amber-400"> fluktuasi harga dan inflasi volatile food</span> di Indonesia"
          </p>
          <p className="text-gray-500 text-sm mt-3">— Bank Indonesia, Outlook Inflasi Pangan</p>
        </div>

      </div>
    </section>
  )
}