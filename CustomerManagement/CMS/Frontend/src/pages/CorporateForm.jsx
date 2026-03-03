import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customerApi } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Building2 } from 'lucide-react'

const EMPTY = {
  companyName: '', email: '', phone: '', address: '', city: '', country: '',
  taxNumber: '', registrationNumber: '', industry: '', contactPersonName: '',
  numberOfEmployees: '', isActive: true
}

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail',
  'Education', 'Construction', 'Transportation', 'Energy', 'Other'
]

export default function CorporateForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    customerApi.getById(id)
      .then(({ data }) => setForm({
        companyName: data.companyName || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        country: data.country || '',
        taxNumber: data.taxNumber || '',
        registrationNumber: data.registrationNumber || '',
        industry: data.industry || '',
        contactPersonName: data.contactPersonName || '',
        numberOfEmployees: data.numberOfEmployees?.toString() || '',
        isActive: data.isActive
      }))
      .catch(() => toast.error('Failed to load customer'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        numberOfEmployees: form.numberOfEmployees ? parseInt(form.numberOfEmployees) : null
      }
      if (isEdit) {
        await customerApi.updateCorporate(id, payload)
        toast.success('Customer updated!')
      } else {
        await customerApi.createCorporate(payload)
        toast.success('Customer created!')
      }
      navigate('/customers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/customers')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Corporate Customer' : 'New Corporate Customer'}
            </h1>
            <p className="text-sm text-gray-500">Business account</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Company details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label>
            <input value={form.companyName} onChange={set('companyName')} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Acme Corporation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={set('email')} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="contact@company.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input value={form.phone} onChange={set('phone')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="+1-800-000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
            <select value={form.industry} onChange={set('industry')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">No. of Employees</label>
            <input type="number" min="1" value={form.numberOfEmployees} onChange={set('numberOfEmployees')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="250" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax Number</label>
            <input value={form.taxNumber} onChange={set('taxNumber')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="TAX-123456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Registration Number</label>
            <input value={form.registrationNumber} onChange={set('registrationNumber')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="REG-789" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Person</label>
            <input value={form.contactPersonName} onChange={set('contactPersonName')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jane Smith" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input value={form.address} onChange={set('address')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="456 Business Ave" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
            <input value={form.city} onChange={set('city')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="San Francisco" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <input value={form.country} onChange={set('country')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="USA" />
          </div>
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')}
              className="w-4 h-4 rounded border-gray-300" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
          <button type="button" onClick={() => navigate('/customers')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
