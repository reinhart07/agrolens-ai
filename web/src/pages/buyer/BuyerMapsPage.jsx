import { useState, useEffect, useRef } from 'react'
import BuyerLayout from '../../components/layout/BuyerLayout'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { MapPin, ShoppingCart, Leaf } from 'lucide-react'

const DUMMY_PETANI = [
  { id:1, petani_name:'Pak Budi', nama:'Cabai Merah', harga:45000, lokasi:'Gowa, Sulsel',   grade:'A', lat:-5.1477, lng:119.4327 },
  { id:2, petani_name:'Bu Siti',  nama:'Bawang Merah',harga:28000, lokasi:'Brebes, Jateng', grade:'A', lat:-6.8721, lng:109.1348 },
  { id:3, petani_name:'Pak Ahmad',nama:'Tomat',       harga:8000,  lokasi:'Malang, Jatim',  grade:'B', lat:-7.9798, lng:112.6304 },
  { id:4, petani_name:'Bu Dewi',  nama:'Wortel',      harga:12000, lokasi:'Bogor, Jabar',   grade:'A', lat:-6.5971, lng:106.8060 },
  { id:5, petani_name:'Pak Hasan',nama:'Beras',       harga:13000, lokasi:'Sidrap, Sulsel', grade:'A', lat:-3.9985, lng:119.9105 },
]

export default function BuyerMapsPage() {
  const navigate    = useNavigate()
  const mapRef      = useRef(null)
  const leafletRef  = useRef(null)
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
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap', maxZoom: 18
    }).addTo(map)

    DUMMY_PETANI.forEach(p => {
      const color = p.grade === 'A' ? '#3b82f6' : '#f59e0b'
      const icon  = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize:[28,28], iconAnchor:[14,28],
      })
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)
      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:180px;">
          <p style="font-weight:700;margin:0 0 4px;">${p.petani_name}</p>
          <p style="color:#666;font-size:12px;margin:0 0 8px;">📍 ${p.lokasi}</p>
          <div style="background:#f5f5f5;border-radius:8px;padding:8px;font-size:12px;">
            <p style="margin:0;">🌾 <b>${p.nama}</b></p>
            <p style="margin:4px 0 0;">💰 Rp ${p.harga.toLocaleString('id-ID')}/kg</p>
          </div>
        </div>
      `)
      marker.on('click', () => setSelected(p))
    })
    leafletRef.current = map
    setMapLoaded(true)
  }

  return (
    <BuyerLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-white mb-1">🗺️ Peta Petani</h1>
        <p className="text-gray-400">Temukan petani terdekat dan beli langsung</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-4">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-primary-400 rounded-full" /><span className="text-xs text-gray-400">Grade A</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-amber-400 rounded-full" /><span className="text-xs text-gray-400">Grade B</span></div>
            </div>
            <div ref={mapRef} style={{ height:'460px', width:'100%', background:'#1a2035' }}>
              {!mapLoaded && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Memuat peta...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {selected ? (
            <div className="bg-white/5 border border-primary-500/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3"><Leaf className="w-4 h-4 text-primary-400" /><p className="font-bold text-white text-sm">Detail Petani</p></div>
              <p className="text-white font-semibold mb-1">{selected.petani_name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{selected.lokasi}</p>
              <div className="space-y-2 mb-4">
                {[{l:'Komoditas',v:selected.nama},{l:'Harga',v:`Rp ${selected.harga?.toLocaleString('id-ID')}/kg`},{l:'Grade',v:`Grade ${selected.grade}`}].map((i,idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">{i.l}</span>
                    <span className="text-white font-medium">{i.v}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/buyer/checkout', { state: { produk: {
                  id: selected.id, nama: selected.nama, harga: selected.harga,
                  satuan: 'kg', petani: selected.petani_name
                }}})}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                <ShoppingCart className="w-4 h-4" /> Beli Sekarang
              </button>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Klik marker di peta untuk detail petani</p>
            </div>
          )}

          {/* Daftar komoditas */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-bold text-white text-sm mb-3">🌾 Komoditas Tersedia</p>
            {komoditas.length === 0 ? (
              <p className="text-xs text-gray-500">Belum ada komoditas terdaftar</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {komoditas.slice(0,8).map((k,i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-xs text-white font-medium">{k.nama}</p>
                      <p className="text-xs text-gray-500">{k.petani_name}</p>
                    </div>
                    <p className="text-xs font-bold text-agro-green">Rp {k.harga?.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </BuyerLayout>
  )
}