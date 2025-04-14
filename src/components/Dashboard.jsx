"use client"

import { useContext, useState } from "react"
import TaskContext from "../context/TaskContext"
import ThemeContext from "../context/ThemeContext"
import AddTaskForm from "./add-task-form"
import TaskFilters from "./task-filters"
import TaskList from "./task-list"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Dashboard() {
  const { tasks } = useContext(TaskContext)
  const { darkMode } = useContext(ThemeContext)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState("priorityHigh")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const sortedAndFilteredTasks = () => {
    let filtered = tasks

    // Filter by category
    if (categoryFilter !== "All") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }

    // Sort by selected option
    switch (sortBy) {
      case "priorityHigh":
        filtered.sort((a, b) => Number.parseInt(b.priority) - Number.parseInt(a.priority))
        break
      case "priorityLow":
        filtered.sort((a, b) => Number.parseInt(a.priority) - Number.parseInt(b.priority))
        break
      case "completed":
        filtered.sort((a, b) => (b.completed ? 1 : -1) - (a.completed ? 1 : -1))
        break
      case "incomplete":
        filtered.sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1))
        break
      default:
        // Default sort by priority high
        filtered.sort((a, b) => Number.parseInt(b.priority) - Number.parseInt(a.priority))
    }

    return filtered
  }

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout()
        navigate("/login")
      } catch (error) {
        console.error("Logout failed:", error)
        // Optionally display a notification about the logout failure
      }
    }
    // If the user clicks "No" in the confirmation, nothing happens, and they stay on the dashboard.
  }

  return (
    <div className={`p-4 max-w-lg mx-auto w-full dashboardContainer ${darkMode ? "dark-theme" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center">Add Task</h2>
      </div>

      <AddTaskForm />

      <TaskFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <TaskList tasks={sortedAndFilteredTasks()} />
      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full mt-4">
        Logout
      </button>
    </div>
  )
}

export default Dashboard
