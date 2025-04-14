import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ user, requiredRole, children }) => {
  if (!user) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    // User doesn't have the required role, redirect to their dashboard
    return <Navigate to={`/${user.role}`} replace />
  }

  // User is authenticated and has the required role
  return children
}

export default ProtectedRoute

