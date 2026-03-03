import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import CustomerList from './pages/CustomerList'
import IndividualForm from './pages/IndividualForm'
import CorporateForm from './pages/CorporateForm'
import CustomerView from './pages/CustomerView'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/customers" element={
          <ProtectedRoute>
            <Layout><CustomerList /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customers/new/individual" element={
          <ProtectedRoute>
            <Layout><IndividualForm /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customers/new/corporate" element={
          <ProtectedRoute>
            <Layout><CorporateForm /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customers/edit/individual/:id" element={
          <ProtectedRoute>
            <Layout><IndividualForm /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customers/edit/corporate/:id" element={
          <ProtectedRoute>
            <Layout><CorporateForm /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/customers/view/:id" element={
          <ProtectedRoute>
            <Layout><CustomerView /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/customers" replace />} />
      </Routes>
    </AuthProvider>
  )
}
