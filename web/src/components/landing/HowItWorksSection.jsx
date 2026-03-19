import { Camera, Tag, ShoppingCart, Truck, Star } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Camera,
      step: '01',
      title: 'Foto & Listing',
      desc: 'Petani foto komoditas, AI langsung deteksi kualitas dan sarankan harga optimal.',
      color: 'bg-agro-green',
    },
    {
      icon: Tag,
      step: '02',
      title: 'Tampil di Marketplace',
      desc: 'Listing muncul di marketplace dengan grade kualitas, lokasi, dan prediksi harga.',
      color: 'bg-primary-500',
    },
    {
      icon: ShoppingCart,
      step: '03',
      title: 'Terima Pesanan',
      desc: 'Pembeli pesan langsung, petani konfirmasi dan siapkan pengiriman.',
      color: 'bg-agro-purple',
    },
    {
      icon: Truck,
      step: '04',
      title: 'Kirim & Dibayar',
      desc: 'Komoditas dikirim, pembayaran langsung masuk ke rekening petani.',
      color: 'bg-amber-500',
    },
    {
      icon: Star,
      step: '05',
      title: 'Bangun Credit Score',
      desc: 'Setiap transaksi membangun credit score untuk akses kredit modal usaha.',
      color: 'bg-teal-500',
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-agro-dark to-primary-900" id="cara-kerja">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Cara Kerja
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Semudah Foto, Secepat Kilat
          </h2>
          <p className="text-gray-400 text-lg">
            Dari foto komoditas sampai uang masuk rekening, semua bisa dilakukan dalam hitungan menit.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className={`relative w-20 h-20 ${s.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-9 h-9 text-white" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-agro-dark border-2 border-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-extrabold text-white">{s.step}</span>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-agro-green to-agro-teal rounded-3xl p-8 text-white flex gap-6 items-center">
            <img
              src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop"
              alt="Petani"
              className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold opacity-80 mb-1">Untuk Petani</p>
              <h3 className="text-xl font-extrabold mb-2">Jual Lebih Mahal, Langsung ke Pembeli</h3>
              <p className="text-sm opacity-80">Tidak ada lagi tengkulak. Harga adil, pembayaran langsung.</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-600 to-primary-900 rounded-3xl p-8 text-white flex gap-6 items-center border border-primary-500/20">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop"
              alt="Pembeli"
              className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
            />
            <div>
              <p className="text-sm font-semibold opacity-80 mb-1">Untuk Pembeli</p>
              <h3 className="text-xl font-extrabold mb-2">Produk Segar, Harga Lebih Murah</h3>
              <p className="text-sm opacity-80">Langsung dari petani, terjamin kualitasnya oleh AI.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}