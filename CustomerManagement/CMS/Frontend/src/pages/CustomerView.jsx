import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { customerApi } from '../services/api'
import toast from 'react-hot-toast'
import { ArrowLeft, Edit, User, Building2, Mail, Phone, MapPin, Calendar, Hash } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function CustomerView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    customerApi.getById(id)
      .then(({ data }) => setCustomer(data))
      .catch(() => toast.error('Customer not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  )

  if (!customer) return (
    <div className="text-center py-16 text-gray-400">Customer not found</div>
  )

  const isIndividual = customer.customerType === 'Individual'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/customers')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Customer Details</h1>
        </div>
        <button
          onClick={() => navigate(`/customers/edit/${customer.customerType.toLowerCase()}/${customer.id}`)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Edit className="w-4 h-4" /> Edit
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-5 border-b border-gray-100 ${isIndividual ? 'bg-blue-50' : 'bg-indigo-50'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
              isIndividual ? 'bg-blue-500' : 'bg-indigo-500'
            }`}>
              {isIndividual ? customer.displayName[0] : <Building2 className="w-7 h-7" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{customer.displayName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  isIndividual ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {customer.customerType}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                  customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {customer.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6 space-y-4">
          <InfoRow icon={<Mail />} label="Email" value={customer.email} />
          <InfoRow icon={<Phone />} label="Phone" value={customer.phone || '—'} />
          {(customer.address || customer.city || customer.country) && (
            <InfoRow
              icon={<MapPin />}
              label="Address"
              value={[customer.address, customer.city, customer.country].filter(Boolean).join(', ')}
            />
          )}

          {isIndividual ? (
            <>
              {customer.dateOfBirth && (
                <InfoRow icon={<Calendar />} label="Date of Birth"
                  value={`${new Date(customer.dateOfBirth).toLocaleDateString()} (Age: ${customer.age})`} />
              )}
              {customer.nationalId && (
                <InfoRow icon={<Hash />} label="National ID" value={customer.nationalId} />
              )}
            </>
          ) : (
            <>
              {customer.industry && <InfoRow icon={<Building2 />} label="Industry" value={customer.industry} />}
              {customer.taxNumber && <InfoRow icon={<Hash />} label="Tax Number" value={customer.taxNumber} />}
              {customer.registrationNumber && (
                <InfoRow icon={<Hash />} label="Registration No." value={customer.registrationNumber} />
              )}
              {customer.contactPersonName && (
                <InfoRow icon={<User />} label="Contact Person" value={customer.contactPersonName} />
              )}
              {customer.numberOfEmployees && (
                <InfoRow icon={<User />} label="Employees" value={customer.numberOfEmployees.toLocaleString()} />
              )}
            </>
          )}

          <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
            <p>Created: {new Date(customer.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(customer.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}
