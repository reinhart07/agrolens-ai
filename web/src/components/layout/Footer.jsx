import { Leaf, Github, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-agro-green rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-extrabold text-lg leading-none">AgroLens AI</p>
                <p className="text-xs text-agro-green font-semibold">by Tim Sonic</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Platform agritech berbasis AI yang menghubungkan petani langsung ke pembeli untuk ekosistem pertanian Indonesia yang lebih adil.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-agro-green rounded-lg flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-agro-green rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/5 hover:bg-agro-green rounded-lg flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Marketplace', to: '/marketplace' },
                { label: 'Prediksi Harga', to: '/harga' },
                { label: 'Credit Scoring', to: '/kredit' },
                { label: 'Peta Petani', to: '/maps' },
                { label: 'Chatbot AI', to: '/chat' },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="text-gray-500 hover:text-agro-green text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Informasi</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Tentang Kami', to: '/about' },
                { label: 'Tim Sonic', to: '#tim' },
                { label: 'Cara Kerja', to: '#cara-kerja' },
                { label: 'Blog & Berita', to: '/blog' },
                { label: 'Kebijakan Privasi', to: '/privasi' },
              ].map((l, i) => (
                <li key={i}>
                  <Link to={l.to} className="text-gray-500 hover:text-agro-green text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Kontak</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-agro-green flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">Universitas Dipa Makassar, Sulawesi Selatan</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-agro-green flex-shrink-0" />
                <span className="text-gray-500 text-sm">tim.sonic@agrolens.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-agro-green flex-shrink-0" />
                <span className="text-gray-500 text-sm">[Nomor HP Reinhart]</span>
              </li>
            </ul>
            <div className="bg-agro-green/10 border border-agro-green/20 rounded-xl p-4 mt-4">
              <p className="text-xs text-agro-green font-semibold mb-1">PIDI DIGDAYA X HACKATHON 2026</p>
              <p className="text-xs text-gray-500">Kategori Mahasiswa — Tim Sonic</p>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © 2026 AgroLens AI — Tim Sonic. Universitas Dipa Makassar.
          </p>
          <p className="text-gray-700 text-xs">
            Dibangun untuk PIDI DIGDAYA X HACKATHON 2026 · Bank Indonesia & OJK
          </p>
        </div>
      </div>
    </footer>
  )
}