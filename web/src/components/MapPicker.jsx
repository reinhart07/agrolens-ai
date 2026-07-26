/**
 * MapPicker — Klik peta → alamat otomatis (tanpa input manual)
 */
import { useState, useEffect, useRef } from 'react'
import { MapPin, Loader } from 'lucide-react'

export default function MapPicker({ onLocationSelect, initialAddress = '', height = '300px' }) {
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  const markerRef  = useRef(null)
  const [address, setAddress]   = useState(initialAddress)
  const [loading, setLoading]   = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if (window.L) { initMap(); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => initMap()
    document.head.appendChild(script)
    return () => {
      if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null }
    }
  }, [])

  // Kalau initialAddress berubah dari luar, geocode otomatis
  useEffect(() => {
    if (initialAddress && initialAddress !== address && leafletRef.current) {
      geocodeAddress(initialAddress)
    }
  }, [initialAddress])

  const initMap = () => {
    if (!mapRef.current || leafletRef.current) return
    const L = window.L
    const map = L.map(mapRef.current, { center: [-2.5, 118.0], zoom: 5 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors', maxZoom: 18,
    }).addTo(map)

    // Klik peta → set marker + reverse geocode
    map.on('click', (e) => {
      setMarker(map, e.latlng.lat, e.latlng.lng)
      reverseGeocode(e.latlng.lat, e.latlng.lng)
    })

    leafletRef.current = map
    setMapReady(true)

    // Kalau ada initialAddress, geocode langsung
    if (initialAddress) geocodeAddress(initialAddress, map)
  }

  const setMarker = (map, lat, lng) => {
    const L = window.L
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;background:#1D9E75;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28],
      })
      markerRef.current = L.marker([lat, lng], { icon, draggable: true }).addTo(map)
      markerRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng()
        reverseGeocode(pos.lat, pos.lng)
      })
    }
    map.setView([lat, lng], 15)
  }

  const reverseGeocode = async (lat, lng) => {
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      const addr = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(addr)
      if (onLocationSelect) onLocationSelect({ lat, lng, address: addr })
    } catch {
      const addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      setAddress(addr)
      if (onLocationSelect) onLocationSelect({ lat, lng, address: addr })
    } finally {
      setLoading(false)
    }
  }

  const geocodeAddress = async (query, map) => {
    if (!query?.trim()) return
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'id' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        const { lat, lon } = data[0]
        const m = map || leafletRef.current
        if (m) setMarker(m, parseFloat(lat), parseFloat(lon))
        setAddress(query)
      }
    } catch { }
  }

  return (
    <div className="space-y-2">
      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-white/10 relative">
        <div ref={mapRef} style={{ height, width: '100%', background: '#1a2035' }} />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-agro-dark/80">
            <div className="text-center">
              <Loader className="w-6 h-6 text-agro-green animate-spin mx-auto mb-2" />
              <p className="text-gray-400 text-xs">Memuat peta...</p>
            </div>
          </div>
        )}
        {loading && mapReady && (
          <div className="absolute bottom-3 left-3 bg-agro-dark/80 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <Loader className="w-3 h-3 text-agro-green animate-spin" />
            <span className="text-xs text-gray-300">Mendapatkan alamat...</span>
          </div>
        )}
      </div>

      {/* Alamat hasil klik */}
      {address && (
        <div className="flex items-start gap-2 bg-agro-green/10 border border-agro-green/20 rounded-xl px-3 py-2.5">
          <MapPin className="w-3.5 h-3.5 text-agro-green flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">{address}</p>
        </div>
      )}
      {!address && mapReady && (
        <p className="text-xs text-gray-600 text-center">💡 Klik di peta atau drag marker untuk memilih lokasi</p>
      )}
    </div>
  )
}