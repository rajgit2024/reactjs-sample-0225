"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import TaskForm from "../components/TaskForm"
import TaskItem from "../components/TaskItem"
import axios from "axios"

const Dashboard = () => {
  // State variables
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  // Get authentication context
  const { currentUser, logout, token, API_BASE_URL, authError } = useAuth()

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks()
  }, [])

  // Function to fetch all tasks from the API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      setTasks([]) // Set empty array to prevent crash
    } finally {
      setLoading(false)
    }
  }

  // Function to add a new task
  const handleAddTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks/add`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setTasks([...tasks, response.data])
    } catch (error) {
      console.error("Error adding task:", error)
      alert("Failed to add task. Please try again.")
    }
  }

  // Function to update an existing task
  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      // Check if taskId exists
      if (!taskId) {
        alert("Error: Task ID is missing. Cannot update task.")
        return
      }

      // Make API call to update the task
      const response = await axios.put(`${API_BASE_URL}/tasks/update/${taskId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Update the tasks in state
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          // Check if this is the task we're updating
          if (task.id === taskId || task._id === taskId) {
            return { ...task, ...updatedData }
          }
          return task
        }),
      )

      alert("Task updated successfully!")
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Failed to update task. Please try again.")
    }
  }

  // Function to delete a task
  const handleDeleteTask = async (taskId) => {
    // Make sure we have a valid task ID
    if (!taskId) {
      alert("Error: Cannot delete task - ID is missing")
      return
    }

    // Ask for confirmation before deleting
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        // Make API call to delete the task
        await axios.delete(`${API_BASE_URL}/tasks/delete/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        // Remove the deleted task from state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId && task._id !== taskId))

        alert("Task deleted successfully!")
      } catch (error) {
        console.error("Error deleting task:", error)
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true
    return task.status === filter
  })

  // Calculate task statistics
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter((task) => task.status === "Done").length
    const inProgress = tasks.filter((task) => task.status === "In Progress").length
    const todo = tasks.filter((task) => task.status === "To Do").length

    return { total, completed, inProgress, todo }
  }

  const stats = getTaskStats()

  // Show loading indicator while fetching tasks
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error banner for server errors */}
      {authError && authError.includes("Server error") && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{authError} Some features may not work properly.</p>
            </div>
          </div>
        </div>
      )}

      {/* Header with user info and logout button */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
              <p className="text-gray-600 mt-1">Welcome back, {currentUser?.name || currentUser?.email || "User"}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="text-purple-600 hover:text-purple-700 font-medium px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Task statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-purple-600 mb-2">{stats.total}</h3>
            <p className="text-gray-600 font-medium">Total Tasks</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-blue-600 mb-2">{stats.todo}</h3>
            <p className="text-gray-600 font-medium">To Do</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-yellow-600 mb-2">{stats.inProgress}</h3>
            <p className="text-gray-600 font-medium">In Progress</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</h3>
            <p className="text-gray-600 font-medium">Completed</p>
          </div>
        </div>

        {/* Filter and Add Task button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Filter by status:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
            >
              <option value="All">All Tasks</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            + Add New Task
          </button>
        </div>

        {/* Task list */}
        <div className="mb-8">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-600 mb-2">No tasks found</p>
              <p className="text-gray-500">Create your first task to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div key={task.id || task._id}>
                  <TaskItem task={task} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task form modal */}
      {showTaskForm && <TaskForm onAddTask={handleAddTask} onClose={() => setShowTaskForm(false)} />}
    </div>
  )
}

export default Dashboard
