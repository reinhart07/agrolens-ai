import { TrendingUp, Camera, CreditCard, MapPin, MessageCircle, FileText, ShieldCheck, Zap } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      color: 'text-agro-green',
      bg: 'bg-agro-green/10',
      border: 'border-agro-green/20',
      title: 'Prediksi Harga AI',
      desc: 'Model XGBoost/LSTM memprediksi harga komoditas 7–30 hari ke depan berdasarkan data Badan Pangan Nasional dan cuaca BMKG.',
      tag: 'Machine Learning',
      tagColor: 'bg-agro-green/10 text-agro-green border border-agro-green/20',
    },
    {
      icon: Camera,
      color: 'text-primary-500',
      bg: 'bg-primary-500/10',
      border: 'border-primary-500/20',
      title: 'Deteksi Kualitas Otomatis',
      desc: 'Foto komoditas sekali, AI MobileNetV2 langsung mendeteksi grade A/B/C dan tingkat kesegaran secara real-time.',
      tag: 'Computer Vision',
      tagColor: 'bg-primary-500/10 text-primary-400 border border-primary-500/20',
    },
    {
      icon: CreditCard,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      title: 'Credit Scoring Tanpa Bank',
      desc: 'Model Random Forest menghasilkan skor kredit 0–100 dari riwayat transaksi petani. Tanpa perlu rekening bank.',
      tag: 'AI Credit',
      tagColor: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    },
    {
      icon: MapPin,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      title: 'Maps & Heatmap Harga',
      desc: 'Temukan petani terdekat, lacak pengiriman real-time, dan lihat heatmap harga komoditas per wilayah.',
      tag: 'Leaflet.js',
      tagColor: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
    {
      icon: MessageCircle,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      title: 'Chatbot Asisten AI',
      desc: 'Asisten berbasis Groq LLM Llama 3 siap menjawab pertanyaan harga, tips bertani, dan panduan ekspor 24/7.',
      tag: 'Groq LLM',
      tagColor: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    },
    {
      icon: FileText,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
      title: 'Laporan & Invoice PDF',
      desc: 'Generate laporan penjualan, credit score report, invoice transaksi, dan analitik komoditas otomatis dalam PDF.',
      tag: 'ReportLab',
      tagColor: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
    },
    {
      icon: ShieldCheck,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
      title: 'QR Traceability Blockchain',
      desc: 'Setiap produk memiliki QR code berbasis blockchain yang membuktikan keaslian dan asal-usul dari petani ke konsumen.',
      tag: 'Blockchain',
      tagColor: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
    },
    {
      icon: Zap,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      title: 'Marketplace D2C',
      desc: 'Petani listing komoditas langsung, pembeli beli langsung dari sumber. Tidak ada tengkulak, harga lebih adil untuk semua.',
      tag: 'Direct-to-Consumer',
      tagColor: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-primary-900 to-agro-dark" id="fitur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-agro-green/10 text-agro-green border border-agro-green/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Fitur Unggulan
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Satu Platform, Solusi Lengkap untuk Ekosistem Pertanian
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            AgroLens AI menggabungkan teknologi AI, blockchain, dan maps dalam satu ekosistem digital yang belum pernah ada sebelumnya.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div key={i} className={`group bg-white/5 rounded-2xl p-6 border ${f.border} hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-default`}>
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${f.tagColor}`}>
                  {f.tag}
                </span>
                <h3 className="font-bold text-white mb-2 leading-snug">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}