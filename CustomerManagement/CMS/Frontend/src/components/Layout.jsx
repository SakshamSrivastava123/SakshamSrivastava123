import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Users, LogOut, User, Shield } from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()

  const navLinks = [
    { to: '/customers', label: 'All Customers' },
    { to: '/customers/new/individual', label: '+ Individual' },
    { to: '/customers/new/corporate', label: '+ Corporate' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/customers" className="flex items-center gap-2.5">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">CMS</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  {isAdmin ? <Shield className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-blue-600" />}
                </div>
                <span className="hidden sm:block font-medium">{user?.username}</span>
                {isAdmin && (
                  <span className="hidden sm:block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Admin</span>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
