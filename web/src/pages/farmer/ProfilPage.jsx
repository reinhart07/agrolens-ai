import { useState, useEffect, useRef } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import MapPicker from '../../components/MapPicker'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import { User, CreditCard, Phone, Save, Loader, CheckCircle, Upload, ImageIcon, QrCode } from 'lucide-react'

const BANK_LIST = ['BCA', 'Mandiri', 'BNI', 'BRI', 'BSI', 'BTN', 'CIMB Niaga', 'Danamon', 'Lainnya']

export default function ProfilPage() {
  const { user }              = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')
  const [uploadingQris, setUploadingQris] = useState(false)
  const qrisRef = useRef(null)

  const [form, setForm] = useState({
    provinsi:'', kota:'', luas_lahan:'', jenis_komoditas:'',
    no_rekening:'', nama_bank:'BCA', atas_nama:'',
    whatsapp:'', bio:'', lokasi_lengkap:'', foto_qris:'',
  })

  useEffect(() => {
    api.get('/profile/me').then(res => {
      if (res.data.profile) setForm(prev => ({...prev, ...res.data.profile}))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleUploadQris = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('File harus berupa gambar'); return }
    setUploadingQris(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await api.post('/upload/qris', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setForm(prev => ({ ...prev, foto_qris: res.data.url }))
    } catch { setError('Gagal upload QRIS. Coba lagi.') }
    finally { setUploadingQris(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSaved(false)
    try {
      await api.put('/profile/me', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal menyimpan')
    } finally { setSaving(false) }
  }

  if (loading) return (
    <FarmerLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin" />
      </div>
    </FarmerLayout>
  )

  return (
    <FarmerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">👤 Profil Saya</h1>
        <p className="text-gray-400">Lengkapi profil, rekening, dan QRIS untuk menerima pembayaran</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">

        {/* Info Akun */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-4 h-4 text-agro-green" />
            <h2 className="font-bold text-white">Informasi Akun</h2>
          </div>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-agro-green/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-extrabold text-agro-green">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-bold text-white text-lg">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className="text-xs bg-agro-green/20 text-agro-green px-2 py-0.5 rounded-full capitalize">{user?.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="tel" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})}
                  placeholder="08xxxxxxxxxx"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Luas Lahan (hektar)</label>
              <input type="text" value={form.luas_lahan} onChange={e => setForm({...form, luas_lahan: e.target.value})}
                placeholder="1.5"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Provinsi</label>
              <input type="text" value={form.provinsi} onChange={e => setForm({...form, provinsi: e.target.value})}
                placeholder="Sulawesi Selatan"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Kota / Kabupaten</label>
              <input type="text" value={form.kota} onChange={e => setForm({...form, kota: e.target.value})}
                placeholder="Makassar"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Jenis Komoditas</label>
              <input type="text" value={form.jenis_komoditas} onChange={e => setForm({...form, jenis_komoditas: e.target.value})}
                placeholder="Cabai, Tomat, Bawang Merah"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Bio</label>
              <textarea rows={2} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                placeholder="Ceritakan usaha tani kamu..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green resize-none" />
            </div>
          </div>
        </div>

        {/* Lokasi Kebun */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-2">📍 Lokasi Kebun / Ladang</h2>
          <p className="text-xs text-gray-500 mb-4">Cari alamat atau klik langsung di peta</p>
          <MapPicker
            onLocationSelect={({address}) => setForm(prev => ({...prev, lokasi_lengkap: address}))}
            initialAddress={form.lokasi_lengkap || `${form.kota}, ${form.provinsi}`}
            height="260px"
          />
          {form.lokasi_lengkap && (
            <div className="mt-3 bg-agro-green/10 border border-agro-green/20 rounded-xl p-3">
              <p className="text-xs text-agro-green font-semibold mb-1">Lokasi dipilih:</p>
              <p className="text-xs text-gray-300">{form.lokasi_lengkap}</p>
            </div>
          )}
        </div>

        {/* Rekening Bank */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-agro-green" />
            <h2 className="font-bold text-white">Rekening Bank</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Ditampilkan ke pembeli saat checkout</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nama Bank</label>
              <select value={form.nama_bank} onChange={e => setForm({...form, nama_bank: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green">
                {BANK_LIST.map(b => <option key={b} value={b} className="bg-agro-dark">{b}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nomor Rekening</label>
              <input type="text" value={form.no_rekening} onChange={e => setForm({...form, no_rekening: e.target.value})}
                placeholder="1234567890"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 mb-1 block">Atas Nama</label>
              <input type="text" value={form.atas_nama} onChange={e => setForm({...form, atas_nama: e.target.value})}
                placeholder="Nama sesuai rekening"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-agro-green" />
            </div>
          </div>
          {form.no_rekening && (
            <div className="mt-4 bg-agro-green/10 border border-agro-green/20 rounded-xl p-4">
              <p className="text-xs text-agro-green font-semibold mb-2">Preview info transfer:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Bank</span><span className="text-white font-semibold">{form.nama_bank}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">No. Rekening</span><span className="text-white font-semibold">{form.no_rekening}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">A/N</span><span className="text-white font-semibold">{form.atas_nama || user?.name}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* QRIS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <QrCode className="w-4 h-4 text-agro-green" />
            <h2 className="font-bold text-white">QRIS</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">Upload foto QRIS kamu — ditampilkan ke pembeli saat checkout</p>

          <div className="flex gap-4 items-start">
            {/* Preview QRIS */}
            <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
              {uploadingQris ? (
                <Loader className="w-6 h-6 text-agro-green animate-spin" />
              ) : form.foto_qris ? (
                <img src={form.foto_qris} alt="QRIS" className="w-full h-full object-contain p-1" />
              ) : (
                <QrCode className="w-10 h-10 text-gray-600" />
              )}
            </div>

            <div className="flex-1">
              <button type="button" onClick={() => qrisRef.current?.click()} disabled={uploadingQris}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 mb-2">
                <Upload className="w-4 h-4" />
                {uploadingQris ? 'Mengupload...' : 'Upload Foto QRIS'}
              </button>
              <p className="text-xs text-gray-600">JPG/PNG, maks 2MB</p>
              <p className="text-xs text-gray-600 mt-1">Dapatkan QRIS dari BCA/BRI/GoPay/OVO/Dana</p>
              <input ref={qrisRef} type="file" accept="image/*" className="hidden"
                onChange={e => handleUploadQris(e.target.files[0])} />

              {form.foto_qris && (
                <div className="mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-agro-green" />
                  <span className="text-xs text-agro-green">QRIS sudah diupload!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {saved && (
          <div className="bg-agro-green/10 border border-agro-green/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-agro-green" />
            <p className="text-agro-green text-sm">Profil berhasil disimpan!</p>
          </div>
        )}

        <button type="submit" disabled={saving}
          className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all">
          {saving ? <><Loader className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Profil</>}
        </button>
      </form>
    </FarmerLayout>
  )
}