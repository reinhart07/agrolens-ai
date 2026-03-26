import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrolens_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})


api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('agrolens_token')
      localStorage.removeItem('agrolens_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)


export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  me:       ()     => api.get('/auth/me'),
}


export const komoditasAPI = {
  list:      ()   => api.get('/komoditas/'),
  detail:    (id) => api.get(`/komoditas/${id}`),
  create:    (data) => api.post('/komoditas/', data),
  update:    (id, data) => api.put(`/komoditas/${id}`, data),
  delete:    (id) => api.delete(`/komoditas/${id}`),
}


export const hargaAPI = {
  prediksi: (data) => api.post('/predict/harga', data),
}



export const kualitasAPI = {
  deteksi: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/predict/kualitas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const kreditAPI = {
  score: (data) => api.post('/predict/kredit', data),
}


export const userAPI = {
  profile:    ()        => api.get('/user/profile'),
  getUser:    (id)      => api.get(`/user/${id}`),
  updateProfile: (data) => api.put('/user/profile', data),
}

export default api