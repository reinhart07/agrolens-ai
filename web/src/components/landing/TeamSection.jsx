import sonicPhoto from '../../assets/images/sonic.png'

export default function TeamSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-primary-900 to-agro-dark" id="tim">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Tim Kami
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">Tim Sonic</h2>
          <p className="text-gray-400 text-lg">
            Tiga mahasiswa lintas disiplin dari Universitas Dipa Makassar yang berkolaborasi membangun solusi agritech terbaik untuk Indonesia.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/10">
          <img
            src={sonicPhoto}
            alt="Tim Sonic - AgroLens"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
            <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Institusi</p>
              <p className="text-sm font-bold text-white">Universitas Dipa Makassar</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}