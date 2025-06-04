"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { currentUser, token, loading, authError } = useAuth()
  const location = useLocation()

  console.log("ProtectedRoute - Token:", token, "User:", currentUser, "Loading:", loading, "Error:", authError)

  // If still loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If token exists but there's a critical auth error (401/403), redirect to login
  if (token && authError && authError.includes("Session expired")) {
    return <Navigate to="/login" state={{ error: authError, from: location }} replace />
  }

  // If token exists but no user data and no server error, something is wrong
  if (token && !currentUser && !authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-xl text-gray-600 mb-4">Unable to load user data</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  // If we have a token and user (even with server error), allow access
  return children
}

export default ProtectedRoute
