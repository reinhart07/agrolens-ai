import logoBi from '../../assets/images/BI.png'
import logoOjk from '../../assets/images/OJK.png'
import logoAspi from '../../assets/images/ASPI.jpg'
import logoFintech from '../../assets/images/Fintech.png'
import logoApuvindo from '../../assets/images/Apuvindo.png'
import logoLppi from '../../assets/images/yppi.png'

export default function SponsorSection() {
  const sponsors = [
    { name: 'Bank Indonesia', logo: logoBi },
    { name: 'OJK', logo: logoOjk },
    { name: 'ASPI', logo: logoAspi },
    { name: 'Fintech Indonesia', logo: logoFintech },
    { name: 'APUVINDO', logo: logoApuvindo },
    { name: 'LPPI', logo: logoLppi },
  ]

  return (
    <section className="bg-agro-dark border-y border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold text-gray-600 uppercase tracking-widest mb-8">
          Diselenggarakan oleh
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          {sponsors.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              <img
                src={s.logo}
                alt={s.name}
                className="h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}