"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth()

  // If auth is still loading, you might want to show a loading spinner
  if (loading) {
    return <div>Loading...</div>
  }

  // If user is not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" />
  }

  // If user is authenticated, render the protected component
  return children
}

export default PrivateRoute
