import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { customerApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Search, Filter, Trash2, Edit, User, Building2,
  ChevronLeft, ChevronRight, RefreshCw, Eye
} from 'lucide-react'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, pageSize }
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const { data } = await customerApi.getAll(params)
      setCustomers(data.items)
      setTotal(data.totalCount)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [page, pageSize, search, typeFilter])

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300)
    return () => clearTimeout(timer)
  }, [fetchCustomers])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer? This action cannot be undone.')) return
    try {
      await customerApi.delete(id)
      toast.success('Customer deleted')
      fetchCustomers()
    } catch {
      toast.error('Failed to delete customer')
    }
  }

  const handleEdit = (c) => {
    navigate(`/customers/edit/${c.customerType.toLowerCase()}/${c.id}`)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total customers</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/customers/new/individual"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <User className="w-4 h-4" /> Add Individual
          </Link>
          <Link
            to="/customers/new/corporate"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-4 h-4" /> Add Corporate
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, company..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={typeFilter}
            onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
            className="border border-gray-300 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Corporate">Corporate</option>
          </select>
          <button
            onClick={fetchCustomers}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">Type</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">Name</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">Email</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">Phone</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">City</th>
                <th className="text-left px-5 py-3.5 font-medium text-gray-600">Status</th>
                <th className="text-right px-5 py-3.5 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                        c.customerType === 'Individual'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {c.customerType === 'Individual'
                          ? <User className="w-3 h-3" />
                          : <Building2 className="w-3 h-3" />
                        }
                        {c.customerType}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-gray-900">{c.displayName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{c.email}</td>
                    <td className="px-5 py-3.5 text-gray-600">{c.phone || '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{c.city || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/customers/view/${c.id}`)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(c)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages} ({total} total)
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
