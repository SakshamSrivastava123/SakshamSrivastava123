import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customerApi } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, User } from 'lucide-react'

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '', phone: '',
  address: '', city: '', country: '', dateOfBirth: '', nationalId: '', isActive: true
}

export default function IndividualForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    setFetching(true)
    customerApi.getById(id)
      .then(({ data }) => {
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          nationalId: data.nationalId || '',
          isActive: data.isActive
        })
      })
      .catch(() => toast.error('Failed to load customer'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, dateOfBirth: form.dateOfBirth || null }
      if (isEdit) {
        await customerApi.updateIndividual(id, payload)
        toast.success('Customer updated!')
      } else {
        await customerApi.createIndividual(payload)
        toast.success('Customer created!')
      }
      navigate('/customers')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save customer')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/customers')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Edit Individual Customer' : 'New Individual Customer'}
            </h1>
            <p className="text-sm text-gray-500">Personal customer account</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name *" required>
            <input value={form.firstName} onChange={set('firstName')} 
              className="input" placeholder="John" />
          </Field>
          <Field label="Last Name *" required>
            <input value={form.lastName} onChange={set('lastName')} 
              className="input" placeholder="Doe" />
          </Field>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email *">
            <input type="email" value={form.email} onChange={set('email')} required
              className="input" placeholder="john@example.com" />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={set('phone')}
              className="input" placeholder="+1-555-0100" />
          </Field>
        </div>

        {/* Personal */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth">
            <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')}
              className="input" />
          </Field>
          <Field label="National ID">
            <input value={form.nationalId} onChange={set('nationalId')}
              className="input" placeholder="ID-123456" />
          </Field>
        </div>

        {/* Address */}
        <Field label="Address">
          <input value={form.address} onChange={set('address')}
            className="input" placeholder="123 Main Street" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="City">
            <input value={form.city} onChange={set('city')}
              className="input" placeholder="New York" />
          </Field>
          <Field label="Country">
            <input value={form.country} onChange={set('country')}
              className="input" placeholder="USA" />
          </Field>
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={set('isActive')}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : isEdit ? 'Update Customer' : 'Create Customer'}
          </button>
          <button type="button" onClick={() => navigate('/customers')}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            Cancel
          </button>
        </div>
      </form>

      <style>{`.input { width: 100%; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.625rem 0.75rem; font-size: 0.875rem; outline: none; transition: box-shadow 0.15s; } .input:focus { ring: 2px solid #3b82f6; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }`}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
