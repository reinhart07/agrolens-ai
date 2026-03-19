import { useState, useEffect, useRef } from 'react'
import { Users, TrendingUp, ShieldCheck, Leaf } from 'lucide-react'

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = Date.now()
          const endNum = parseFloat(end)
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * endNum))
            if (progress === 1) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return <span ref={ref}>{count.toLocaleString('id-ID')}{suffix}</span>
}

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      color: 'text-agro-green',
      bg: 'bg-agro-green/10',
      value: '33',
      suffix: '.4 Juta',
      label: 'Petani Indonesia',
      desc: 'Potensi pengguna platform AgroLens AI',
      source: 'BPS, Sensus Pertanian 2023',
    },
    {
      icon: TrendingUp,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10',
      value: '50',
      suffix: '–100%',
      label: 'Disparitas Harga',
      desc: 'Selisih harga petani vs konsumen untuk komoditas hortikultura',
      source: 'Jurnal Agribisnis Indonesia',
    },
    {
      icon: ShieldCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      value: '91',
      suffix: ' Juta',
      label: 'Penduduk Unbanked',
      desc: 'Target penerima manfaat credit scoring alternatif AgroLens',
      source: 'OJK, 2024',
    },
    {
      icon: Leaf,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      value: '116',
      suffix: ',73',
      label: 'NTP Nasional',
      desc: 'Nilai Tukar Petani Nov 2023 — menunjukkan daya beli petani masih lemah',
      source: 'BPS, November 2023',
    },
  ]

  return (
    <section className="py-24 bg-agro-dark" id="statistik">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-agro-green/10 text-agro-green border border-agro-green/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Data & Fakta
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Angka yang Berbicara
          </h2>
          <p className="text-gray-400 text-lg">
            Semua data bersumber dari lembaga resmi pemerintah dan publikasi ilmiah terverifikasi.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 text-center">
                <div className={`w-14 h-14 ${s.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${s.color}`} />
                </div>
                <p className="text-4xl font-extrabold text-white mb-1">
                  <CountUp end={s.value} suffix={s.suffix} />
                </p>
                <p className={`${s.color} font-semibold mb-2`}>{s.label}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{s.desc}</p>
                <span className="inline-block text-xs bg-white/5 border border-white/10 text-gray-600 px-2 py-1 rounded-full">
                  {s.source}
                </span>
              </div>
            )
          })}
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          Sumber: BPS 2023, OJK 2024, Bank Indonesia PIHPS 2024, Jurnal Agribisnis Indonesia
        </p>

      </div>
    </section>
  )
}