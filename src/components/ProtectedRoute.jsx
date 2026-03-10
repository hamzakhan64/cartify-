// =============================================
// ProtectedRoute.jsx
// Route guard — protects pages from unauthorized access.
//
// Usage in App.jsx:
//   <ProtectedRoute>           → requires login
//   <ProtectedRoute adminOnly> → requires admin role
// =============================================

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
    const { user, token } = useAuth()

    // Not logged in at all → send to sign in page
    if (!user || !token) {
        return <Navigate to="/signin" replace />
    }

    // Logged in but not admin, and this route requires admin
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/products" replace />
    }

    // All checks passed → show the actual page
    return children
}

export default ProtectedRoute
