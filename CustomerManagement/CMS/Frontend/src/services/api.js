import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ── Customer API calls ──────────────────────────────────────
export const customerApi = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  createIndividual: (data) => api.post('/customers/individual', data),
  createCorporate: (data) => api.post('/customers/corporate', data),
  updateIndividual: (id, data) => api.put(`/customers/individual/${id}`, data),
  updateCorporate: (id, data) => api.put(`/customers/corporate/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
}
