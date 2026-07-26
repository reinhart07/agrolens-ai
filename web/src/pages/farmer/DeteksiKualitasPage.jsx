import { useState, useRef } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import { kualitasAPI } from '../../services/api'
import { Upload, Camera, CheckCircle, XCircle, Loader, ImageIcon } from 'lucide-react'

const GRADE_INFO = {
  A: {
    label   : 'Segar / Berkualitas Tinggi',
    color   : 'text-agro-green',
    bg      : 'bg-agro-green/10 border-agro-green/30',
    badge   : 'bg-agro-green/20 text-agro-green',
    icon    : CheckCircle,
    harga   : 'Layak dijual dengan harga premium (+15–20% dari harga pasar)',
  },
  C: {
    label   : 'Rusak / Tidak Layak Jual',
    color   : 'text-red-400',
    bg      : 'bg-red-500/10 border-red-500/30',
    badge   : 'bg-red-500/20 text-red-400',
    icon    : XCircle,
    harga   : 'Tidak disarankan untuk dijual — pertimbangkan untuk olahan atau kompos',
  },
}

export default function DeteksiKualitasPage() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const inputRef                = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG/PNG)')
      return
    }
    setFile(f)
    setResult(null)
    setError('')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleSubmit = async () => {
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const res = await kualitasAPI.deteksi(file)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Gagal mendeteksi kualitas. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError('')
  }

  const gradeInfo = result ? GRADE_INFO[result.grade] : null

  return (
    <FarmerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">📷 Deteksi Kualitas Komoditas</h1>
        <p className="text-gray-400">Upload foto komoditas — AI akan mendeteksi grade A atau C secara otomatis</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        {/* Upload Area */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Upload Foto Komoditas</h2>

          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-agro-green/50 rounded-2xl p-10 text-center cursor-pointer transition-all hover:bg-white/3 group"
            >
              <div className="w-16 h-16 bg-agro-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-agro-green/20 transition-all">
                <Upload className="w-8 h-8 text-agro-green" />
              </div>
              <p className="text-white font-semibold mb-1">Drag & drop foto di sini</p>
              <p className="text-gray-500 text-sm mb-4">atau klik untuk pilih file</p>
              <p className="text-xs text-gray-600">JPG, PNG — Maks 10MB</p>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-2xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <ImageIcon className="w-4 h-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file?.name}</p>
                  <p className="text-xs text-gray-500">{(file?.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-agro-green hover:bg-agro-teal disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader className="w-4 h-4 animate-spin" /> Mendeteksi...</>
                  : <><Camera className="w-4 h-4" /> Deteksi Kualitas</>
                }
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="mt-5 bg-primary-500/10 border border-primary-500/20 rounded-xl p-4">
            <p className="text-xs text-primary-400 font-semibold mb-2">💡 Tips foto yang baik:</p>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Foto dengan pencahayaan yang cukup</li>
              <li>• Fokus pada komoditas, latar bersih</li>
              <li>• Ambil dari jarak 20–30 cm</li>
              <li>• Pastikan tidak buram</li>
            </ul>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-5">Hasil Deteksi</h2>

          {!result && !loading && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Camera className="w-12 h-12 text-gray-600 mb-3" />
              <p className="text-gray-500 text-sm">Upload foto dan klik Deteksi Kualitas</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-2 border-agro-green/30 border-t-agro-green rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">AI sedang menganalisis foto...</p>
            </div>
          )}

          {result && !loading && gradeInfo && (
            <div className="space-y-5">

              {/* Grade utama */}
              <div className={`rounded-2xl p-6 text-center border ${gradeInfo.bg}`}>
                <p className="text-gray-400 text-sm mb-3">Hasil Analisis AI</p>
                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-2xl font-extrabold ${gradeInfo.badge} mb-3`}>
                  Grade {result.grade}
                </div>
                <p className={`font-bold text-lg ${gradeInfo.color} mb-1`}>{gradeInfo.label}</p>
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Confidence</p>
                  <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                    <div
                      className={`h-2 rounded-full transition-all ${result.grade === 'A' ? 'bg-agro-green' : 'bg-red-400'}`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  <p className={`text-xl font-extrabold ${gradeInfo.color}`}>{result.confidence}%</p>
                </div>
              </div>

              {/* All scores */}
              {result.all_scores && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Skor per Kelas</p>
                  {Object.entries(result.all_scores).map(([cls, score]) => (
                    <div key={cls} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-16 capitalize">{cls.replace('_', ' ')}</span>
                      <div className="flex-1 bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${cls === 'grade_A' ? 'bg-agro-green' : 'bg-red-400'}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-xs text-white font-semibold w-12 text-right">{score.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Rekomendasi harga */}
              <div className={`border rounded-xl p-4 ${gradeInfo.bg}`}>
                <p className={`text-xs font-semibold mb-1 ${gradeInfo.color}`}>💰 Rekomendasi Harga</p>
                <p className="text-sm text-gray-300">{result.rekomendasi_harga || gradeInfo.harga}</p>
              </div>

              <p className="text-xs text-gray-600 text-center">Model: {result.model} · Akurasi 97.83%</p>

              <button onClick={reset}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold py-2.5 rounded-xl transition-all text-sm">
                Upload Foto Lain
              </button>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  )
}