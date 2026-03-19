import { Code, BarChart2, Lightbulb, Palette } from 'lucide-react'

export default function TeamSection() {
  const team = [
    {
      name: 'Reinhart Jens Robert',
      role: 'Full Stack Developer & AI Engineer',
      prodi: 'Teknik Informatika',
      desc: 'Memimpin pengembangan sistem backend FastAPI, integrasi model ML, dan arsitektur sistem secara keseluruhan.',
      avatar: '/src/assets/images/team-reinhart.jpg',
      fallback: 'RE',
      icon: Code,
      gradient: 'from-agro-green to-agro-teal',
      iconBg: 'bg-agro-green/10',
      iconColor: 'text-agro-green',
      skills: ['FastAPI', 'React', 'Python ML', 'MySQL'],
    },
    {
      name: 'Happy Valendino Hendrik Budi',
      role: 'Business Analyst & Product Manager',
      prodi: 'Bisnis Digital',
      desc: 'Menganalisis kebutuhan pasar, mendefinisikan product roadmap, dan memastikan solusi sesuai kebutuhan pengguna.',
      avatar: '/src/assets/images/team-valendino.jpg',
      fallback: 'VA',
      icon: BarChart2,
      gradient: 'from-primary-500 to-primary-700',
      iconBg: 'bg-primary-500/10',
      iconColor: 'text-primary-400',
      skills: ['Market Research', 'Product Strategy', 'Data Analysis', 'Agile'],
    },
    {
      name: 'Melky Rafael Nuben',
      role: 'Business Model & Go-to-Market',
      prodi: 'Bisnis Digital',
      desc: 'Merancang model bisnis yang berkelanjutan dan strategi penetrasi pasar untuk ekosistem pertanian Indonesia.',
      avatar: '/src/assets/images/team-melky.jpg',
      fallback: 'ME',
      icon: Lightbulb,
      gradient: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400',
      skills: ['Business Canvas', 'GTM Strategy', 'Pitching', 'Finance'],
    },
    {
      name: 'Djefri Wotyla Nugroho',
      role: 'UI/UX Design & Market Research',
      prodi: 'Bisnis Digital',
      desc: 'Mendesain antarmuka yang intuitif untuk petani di lapangan dan memastikan pengalaman pengguna yang optimal.',
      avatar: '/src/assets/images/team-djefri.jpg',
      fallback: 'KE',
      icon: Palette,
      gradient: 'from-agro-purple to-primary-600',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
      skills: ['Figma', 'UI Design', 'User Research', 'Prototyping'],
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-primary-900 to-agro-dark" id="tim">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block bg-purple-500/10 text-purple-400 border border-purple-500/20 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Tim Kami
          </span>
          <h2 className="text-4xl font-extrabold text-white mb-4">Tim Sonic</h2>
          <p className="text-gray-400 text-lg">
            Empat mahasiswa lintas disiplin dari Universitas Dipa Makassar yang berkolaborasi membangun solusi agritech terbaik untuk Indonesia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((m, i) => {
            const Icon = m.icon
            return (
              <div key={i} className="group relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

                {/* Photo area */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-white/5 to-white/10">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  {/* Fallback avatar jika foto tidak ada */}
                  <div
                    className={`hidden w-full h-full bg-gradient-to-br ${m.gradient} items-center justify-center`}
                  >
                    <span className="text-5xl font-extrabold text-white opacity-80">{m.fallback}</span>
                  </div>

                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${m.gradient} opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="text-center text-white px-4">
                      <Icon className="w-10 h-10 mx-auto mb-2" />
                      <p className="font-bold text-sm">{m.role}</p>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-extrabold text-white text-lg">{m.name}</h3>
                      <p className="text-xs text-gray-500">{m.prodi}</p>
                    </div>
                    <div className={`w-9 h-9 ${m.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${m.iconColor}`} />
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.skills.map((skill, j) => (
                      <span key={j} className="text-xs bg-white/5 text-gray-400 border border-white/10 px-2 py-0.5 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* University badge */}
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