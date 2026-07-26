import { useState, useEffect, useRef } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { MapPin, Leaf, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

const HARGA_NASIONAL = [
  { nama: 'Cabai Merah',  harga: 45000, trend: 'naik',  persen: 5.2  },
  { nama: 'Bawang Merah', harga: 28000, trend: 'turun', persen: 2.1  },
  { nama: 'Tomat',        harga: 8000,  trend: 'naik',  persen: 12.5 },
  { nama: 'Beras',        harga: 13000, trend: 'stabil',persen: 0.3  },
  { nama: 'Kentang',      harga: 15000, trend: 'naik',  persen: 3.8  },
  { nama: 'Jagung',       harga: 5500,  trend: 'turun', persen: 1.5  },
]

const DUMMY_PETANI = [
  { id:1, petani_name:'Pak Budi', nama:'Cabai Merah', harga:45000, lokasi:'Gowa, Sulsel',   grade:'A', lat:-5.1477, lng:119.4327 },
  { id:2, petani_name:'Bu Siti',  nama:'Bawang Merah',harga:28000, lokasi:'Brebes, Jateng', grade:'A', lat:-6.8721, lng:109.1348 },
  { id:3, petani_name:'Pak Ahmad',nama:'Tomat',       harga:8000,  lokasi:'Malang, Jatim',  grade:'B', lat:-7.9798, lng:112.6304 },
  { id:4, petani_name:'Bu Dewi',  nama:'Wortel',      harga:12000, lokasi:'Bogor, Jabar',   grade:'A', lat:-6.5971, lng:106.8060 },
]

export default function PetaPage() {
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  const [selected, setSelected]   = useState(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [komoditas, setKomoditas] = useState([])

  useEffect(() => {
    api.get('/komoditas/').then(res => setKomoditas(res.data.komoditas || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id='leaflet-css'; link.rel='stylesheet'
      link.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) { initMap(); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)
    return () => { if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null } }
  }, [])

  const initMap = () => {
    if (!mapRef.current || leafletRef.current) return
    const L = window.L
    const map = L.map(mapRef.current, { center: [-2.5, 118.0], zoom: 5 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(map)
    DUMMY_PETANI.forEach(p => {
      const color = p.grade === 'A' ? '#1D9E75' : '#f59e0b'
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize:[28,28], iconAnchor:[14,28],
      })
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)
      marker.bindPopup(`<div style="font-family:sans-serif;min-width:160px;"><p style="font-weight:700;margin:0 0 4px;">${p.petani_name}</p><p style="color:#666;font-size:12px;margin:0 0 8px;">📍 ${p.lokasi}</p><div style="background:#f5f5f5;border-radius:8px;padding:8px;font-size:12px;"><p style="margin:0;">🌾 <b>${p.nama}</b></p><p style="margin:4px 0 0;">💰 Rp ${p.harga.toLocaleString('id-ID')}/kg</p><p style="margin:4px 0 0;">⭐ Grade ${p.grade}</p></div></div>`)
      marker.on('click', () => setSelected(p))
    })
    leafletRef.current = map
    setMapLoaded(true)
  }

  return (
    <FarmerLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-white mb-1">🗺️ Peta Sebaran Petani</h1>
        <p className="text-gray-400">Lokasi petani dan harga komoditas di Indonesia</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-agro-green rounded-full" /><span className="text-xs text-gray-400">Grade A</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-full" /><span className="text-xs text-gray-400">Grade B</span></div>
              <span className="text-xs text-gray-500 ml-auto">{DUMMY_PETANI.length} petani terdaftar</span>
            </div>
            <div ref={mapRef} style={{ height:'460px', width:'100%', background:'#1a2035' }}>
              {!mapLoaded && <div className="flex items-center justify-center h-full"><div className="text-center"><div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin mx-auto mb-3" /><p className="text-gray-400 text-sm">Memuat peta...</p></div></div>}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {selected ? (
            <div className="bg-white/5 border border-agro-green/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3"><Leaf className="w-4 h-4 text-agro-green" /><p className="font-bold text-white text-sm">Detail Petani</p></div>
              <p className="text-white font-semibold mb-1">{selected.petani_name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{selected.lokasi}</p>
              {[{label:'Komoditas',value:selected.nama},{label:'Harga',value:`Rp ${selected.harga?.toLocaleString('id-ID')}/kg`},{label:'Grade',value:`Grade ${selected.grade}`}].map((item,i) => (
                <div key={i} className="flex justify-between text-sm"><span className="text-gray-400">{item.label}</span><span className="text-white font-medium">{item.value}</span></div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Klik marker di peta untuk detail petani</p>
            </div>
          )}
          {komoditas.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="font-bold text-white text-sm mb-3">🌾 Komoditas Terdaftar</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {komoditas.slice(0,8).map((k,i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-gray-300 truncate flex-1">{k.nama}</span>
                    <span className="text-xs font-semibold text-agro-green ml-2">Rp {k.harga?.toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-bold text-white text-sm mb-3">📊 Harga Nasional</p>
            <div className="space-y-2">
              {HARGA_NASIONAL.map((item,i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">{item.nama}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">Rp {item.harga.toLocaleString('id-ID')}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${item.trend==='naik'?'text-agro-green':item.trend==='turun'?'text-red-400':'text-gray-400'}`}>
                      {item.trend==='naik'?<TrendingUp className="w-3 h-3"/>:item.trend==='turun'?<TrendingDown className="w-3 h-3"/>:'—'}{item.persen}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FarmerLayout>
  )
}