"use client"

import { useState } from "react"

const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || "")
  const [editStatus, setEditStatus] = useState(task.status)
  const [editPriority, setEditPriority] = useState(task.priority)

  const handleSave = () => {
    onUpdateTask(task.id, {
      title: editTitle,
      description: editDescription,
      status: editStatus,
      priority: editPriority,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditStatus(task.status)
    setEditPriority(task.priority)
    setIsEditing(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Done":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 font-medium"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
            rows="2"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-semibold text-gray-800 flex-1 pr-2">{task.title}</h4>
        <div className="flex gap-2">
          <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-gray-100 transition-colors">
            ✏️
          </button>
          <button onClick={() => onDeleteTask(task.id || task._id)} className="p-1 rounded hover:bg-red-50 transition-colors">
            🗑️
          </button>
        </div>
      </div>

      {task.description && <p className="text-gray-600 mb-4 leading-relaxed">{task.description}</p>}

      <div className="flex gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>

      {task.createdAt && (
        <div className="text-xs text-gray-400">Created: {new Date(task.createdAt).toLocaleDateString()}</div>
      )}
    </div>
  )
}

export default TaskItem
