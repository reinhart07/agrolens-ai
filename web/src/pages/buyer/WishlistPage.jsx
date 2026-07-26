import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BuyerLayout from '../../components/layout/BuyerLayout'
import { Heart, ShoppingCart, Trash2, MapPin, Leaf } from 'lucide-react'

export default function WishlistPage() {
  const navigate = useNavigate()
  const [wishlist, setWishlist] = useState([])

  // Load wishlist dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('agrolens_wishlist')
    if (saved) setWishlist(JSON.parse(saved))
  }, [])

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(w => w.id !== id)
    setWishlist(updated)
    localStorage.setItem('agrolens_wishlist', JSON.stringify(updated))
  }

  const handleBeli = (item) => {
    navigate('/buyer/checkout', { state: { produk: {
      id: item.id, nama: item.nama, harga: item.harga,
      satuan: item.satuan || 'kg', petani: item.petani_name,
    }}})
  }

  return (
    <BuyerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">❤️ Wishlist</h1>
        <p className="text-gray-400">Komoditas yang kamu simpan untuk dibeli nanti</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-gray-600" />
          </div>
          <p className="text-white font-semibold mb-2">Wishlist kosong</p>
          <p className="text-gray-400 text-sm mb-6">Simpan komoditas favorit kamu dari halaman Browse</p>
          <button onClick={() => navigate('/buyer/browse')}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-all">
            Browse Komoditas
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="h-36 bg-agro-green/5 flex items-center justify-center relative overflow-hidden">
                {item.foto_url
                  ? <img src={item.foto_url} alt={item.nama} className="w-full h-full object-cover" />
                  : <span className="text-4xl">🌾</span>
                }
                <button onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-full flex items-center justify-center transition-all">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-white mb-1">{item.nama}</p>
                <div className="flex items-center gap-1 text-xs text-agro-green mb-1">
                  <Leaf className="w-3 h-3" /> {item.petani_name}
                </div>
                {item.lokasi && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <MapPin className="w-3 h-3" /> {item.lokasi}
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <p className="font-extrabold text-white">Rp {item.harga?.toLocaleString('id-ID')}/kg</p>
                </div>
                <button onClick={() => handleBeli(item)}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold py-2 rounded-xl transition-all">
                  <ShoppingCart className="w-4 h-4" /> Beli Sekarang
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </BuyerLayout>
  )
}