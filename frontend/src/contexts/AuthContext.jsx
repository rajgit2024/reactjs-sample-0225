"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [authError, setAuthError] = useState(null)

  const API_BASE_URL = "http://localhost:5000/api"

  // Create axios instance with default config
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  })

  // Update axios headers when token changes
  useEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"]
    }
  }, [token])

  // Fetch user profile when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile with token:", token)

      const response = await axiosInstance.get(`/users/profile`)
      console.log("Profile response:", response.data)

      if (response.data) {
        setCurrentUser(response.data)
        setAuthError(null)
      } else {
        console.error("Invalid user data format:", response.data)
        setAuthError("Invalid user data format")
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error.message)

      // Handle different types of errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token is invalid, removing...")
        localStorage.removeItem("token")
        setToken(null)
        setAuthError("Session expired. Please login again.")
      } else if (error.response?.status === 500) {
        // Backend server error - keep token but show error
        console.log("Backend server error, keeping token but showing error")
        setAuthError("Server error. Please try again later or contact support.")

        // For now, let's create a temporary user object from the token
        // This allows the user to access the app while the backend is fixed
        try {
          const tokenPayload = JSON.parse(atob(token.split(".")[1]))
          setCurrentUser({
            id: tokenPayload.id,
            email: tokenPayload.email,
            name: tokenPayload.email.split("@")[0], // Use email prefix as name
            createdAt: new Date().toISOString(),
          })
          console.log("Created temporary user from token:", tokenPayload)
        } catch (tokenError) {
          console.error("Failed to parse token:", tokenError)
        }
      } else {
        // Network or other errors
        setAuthError(error.response?.data?.message || "Failed to load user data")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      console.log("Attempting login...")
      setAuthError(null)

      const response = await axiosInstance.post(`/users/login`, {
        email,
        password,
      })

      console.log("Login response:", response.data)

      if (!response.data.token) {
        console.error("Invalid login response format:", response.data)
        return { success: false, error: "Invalid server response" }
      }

      const newToken = response.data.token
      localStorage.setItem("token", newToken)
      setToken(newToken)

      // If user data is included in login response, set it directly
      if (response.data.user) {
        setCurrentUser(response.data.user)
      }

      console.log("Login successful, token stored:", newToken)
      return { success: true }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (name, email, password) => {
    try {
      console.log("Attempting registration...")
      const response = await axiosInstance.post(`/users/register`, {
        name,
        email,
        password,
      })
      console.log("Registration successful:", response.data)
      return { success: true }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message)
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    console.log("Logging out...")
    localStorage.removeItem("token")
    setToken(null)
    setCurrentUser(null)
    setAuthError(null)
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    token,
    authError,
    loading,
    API_BASE_URL,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
