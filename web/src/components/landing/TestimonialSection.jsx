import { Star, Quote } from 'lucide-react'

export default function TestimonialSection() {
  const testimonials = [
    {
      name: 'Pak Budi Santoso',
      role: 'Petani Cabai — Makassar, Sulsel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Dulu jual cabai ke tengkulak cuma dapat Rp 30.000/kg, padahal di pasar dijual Rp 60.000. Sekarang pakai AgroLens langsung jual ke restoran, dapat Rp 50.000/kg. Alhamdulillah penghasilan naik hampir dua kali lipat.',
    },
    {
      name: 'Ibu Siti Rahayu',
      role: 'Petani Padi — Gowa, Sulsel',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Fitur prediksi harga sangat membantu. Saya tahu kapan waktu terbaik untuk jual beras. Credit score saya 78, dan sudah dapat penawaran pinjaman modal dari koperasi untuk beli bibit unggul musim depan.',
    },
    {
      name: 'Ahmad Fauzi',
      role: 'Pembeli — Pemilik Restoran, Makassar',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Sebagai pemilik restoran, saya butuh bahan baku segar dengan harga stabil. AgroLens kasih saya akses langsung ke petani, harga lebih murah 20-30% dari pasar, dan kualitasnya sudah ter-grading oleh AI.',
    },
    {
      name: 'Rina Kusuma',
      role: 'Pembeli — Ibu Rumah Tangga, Makassar',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Sayuran yang saya beli lewat AgroLens jauh lebih segar daripada di supermarket. Ada QR code yang bisa scan untuk tahu dari kebun mana asalnya. Saya jadi lebih percaya kualitasnya.',
    },
    {
      name: 'Koperasi Tani Sulsel',
      role: 'Mitra Keuangan — Makassar',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Credit scoring berbasis data transaksi AgroLens sangat membantu kami menilai kelayakan kredit petani. Data lebih akurat daripada metode konvensional, dan kami bisa jangkau petani yang sebelumnya tidak terdeteksi.',
    },
    {
      name: 'Djefri Mamonto',
      role: 'Go-to-Market Strategy — Tim Sonic',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&face',
      rating: 5,
      text: 'Sebagai anggota tim yang fokus di strategi bisnis, saya bangga AgroLens memiliki model yang berkelanjutan. Bukan sekadar platform, tapi ekosistem yang benar-benar memberdayakan petani Indonesia.',
    },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-amber-50 text-amber-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Testimoni
          </span>
          <h2 className="text-4xl font-extrabold text-agro-dark mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-500 text-lg">
            Dari petani, pembeli, hingga mitra keuangan — semua merasakan manfaat AgroLens AI.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="flex items-start justify-between mb-4">
                <Quote className="w-8 h-8 text-agro-green/20 flex-shrink-0" />
                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Text */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-agro-green/20 group-hover:ring-agro-green/50 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
                <div>
                  <p className="font-bold text-agro-dark text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}