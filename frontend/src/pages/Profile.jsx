"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const Profile = () => {
  const { currentUser, logout } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState("")
  const [avatarInfo, setAvatarInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generateRandomAvatar()
  }, [])

  const generateRandomAvatar = async () => {
    setLoading(true)
    try {
      const randomId = Math.floor(Math.random() * 1000)

      const response = await axios.get(`https://picsum.photos/id/${randomId}/info`)
      setAvatarInfo(response.data)
      setAvatarUrl(`https://picsum.photos/id/${randomId}/200/200`)
    } catch (error) {
      console.error("Error fetching avatar:", error)
      // Fallback avatar
      setAvatarUrl(`https://picsum.photos/200/200?random=${Date.now()}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                {loading ? (
                  <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Loading...
                  </div>
                ) : (
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt="Profile Avatar"
                    className="w-48 h-48 rounded-full object-cover shadow-lg"
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/200/200?random=${Date.now()}`
                    }}
                  />
                )}
              </div>

              <button
                onClick={generateRandomAvatar}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Generating..." : "Generate New Avatar"}
              </button>

              {/* {avatarInfo && (
                <div className="bg-gray-50 rounded-xl p-6 w-full">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Avatar Details</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Photographer:</span>
                      <span className="ml-2 text-gray-600">{avatarInfo.author}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Image ID:</span>
                      <span className="ml-2 text-gray-600">{avatarInfo.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Dimensions:</span>
                      <span className="ml-2 text-gray-600">
                        {avatarInfo.width} × {avatarInfo.height}
                      </span>
                    </div>
                    {avatarInfo.url && (
                      <div>
                        <span className="font-medium text-gray-700">Source:</span>
                        <a
                          href={avatarInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          View Original
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )} */}
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800">
                    {currentUser?.name || "Not provided"}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800">
                    {currentUser?.email || "Not provided"}
                  </div>
                </div>
reactjs-sample-0225 
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <div className="bg-gray-50 px-4 py-3 rounded-lg text-gray-800">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/dashboard"
                  className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
