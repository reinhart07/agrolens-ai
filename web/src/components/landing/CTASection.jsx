import { ArrowRight, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CTASection() {
  return (
    <section className="py-24 bg-agro-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-agro-green/20 via-primary-700/30 to-agro-purple/20 border border-agro-green/20 rounded-3xl overflow-hidden p-12 text-center text-white">

          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-agro-green/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-agro-green/20 border border-agro-green/30 rounded-full px-4 py-2 mb-6">
              <Leaf className="w-4 h-4 text-agro-green" />
              <span className="text-agro-green text-sm font-semibold">AgroLens AI — Tim Sonic</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Berinovasi untuk Masa Depan,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-agro-green to-primary-400">
                Memberdayakan Petani Indonesia
              </span>
            </h2>

            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Bergabunglah dengan ekosistem pertanian digital yang menghubungkan petani,
              pembeli, dan lembaga keuangan dalam satu platform AI terintegrasi.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-agro-green hover:bg-agro-teal text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg text-lg"
              >
                Daftar Sekarang — Gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 text-lg"
              >
                Pelajari Fitur
              </a>
            </div>

            <div className="flex flex-wrap gap-6 justify-center mt-12 pt-8 border-t border-white/10">
              {['PIDI DIGDAYA X HACKATHON 2026', 'Bank Indonesia & OJK', 'Universitas Dipa Makassar'].map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-agro-green rounded-full" />
                  <span className="text-sm text-gray-400">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}