import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../services/api'
import { Users, Search, CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react'

const ROLE_COLOR = {
  petani : 'bg-agro-green/20 text-agro-green',
  pembeli: 'bg-primary-500/20 text-primary-400',
  mitra  : 'bg-amber-500/20 text-amber-400',
  admin  : 'bg-purple-500/20 text-purple-400',
}

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('semua')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users || [])
    } catch (err) {
      setError('Gagal memuat data user. Pastikan kamu login sebagai admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleToggleActive = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-active`)
      fetchUsers()
    } catch { }
  }

  const handleDelete = async (userId, name) => {
    if (!confirm(`Hapus user "${name}"?`)) return
    try {
      await api.delete(`/admin/users/${userId}`)
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.detail || 'Gagal menghapus user')
    }
  }

  const tabs = ['semua', 'petani', 'pembeli', 'mitra', 'admin']

  const filtered = users.filter(u => {
    const matchRole   = filter === 'semua' || u.role === filter
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
                        u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">👥 Kelola User</h1>
          <p className="text-gray-400">Monitor dan kelola semua user AgroLens AI</p>
        </div>
        <button onClick={fetchUsers}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium px-4 py-2 rounded-xl transition-all">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total User',  value: users.length, color: 'text-white' },
          { label: 'Petani',      value: users.filter(u => u.role === 'petani').length, color: 'text-agro-green' },
          { label: 'Pembeli',     value: users.filter(u => u.role === 'pembeli').length, color: 'text-primary-400' },
          { label: 'Mitra/Admin', value: users.filter(u => ['mitra','admin'].includes(u.role)).length, color: 'text-amber-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className={`text-3xl font-extrabold ${s.color}`}>{loading ? '—' : s.value}</p>
            <p className="text-sm text-gray-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" placeholder="Cari nama atau email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
              filter === tab ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-sm font-semibold text-white">{filtered.length} user ditemukan</p>
        </div>

        {error && (
          <div className="m-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-white font-semibold">Tidak ada user</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['User', 'Email', 'No. HP', 'Role', 'Status', 'Terdaftar', 'Aksi'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">{u.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-semibold text-white whitespace-nowrap">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{u.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{u.phone || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${ROLE_COLOR[u.role] || 'bg-white/10 text-gray-400'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleToggleActive(u.id)}
                        className="flex items-center gap-1 text-xs font-medium transition-all hover:opacity-70">
                        {u.is_active
                          ? <><CheckCircle className="w-3.5 h-3.5 text-agro-green" /><span className="text-agro-green">Aktif</span></>
                          : <><XCircle className="w-3.5 h-3.5 text-red-400" /><span className="text-red-400">Nonaktif</span></>
                        }
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {u.created_at?.split(' ')[0] || u.created_at?.split('T')[0]}
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleDelete(u.id, u.name)}
                        className="text-red-400 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}