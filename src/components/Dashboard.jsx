"use client"

import { useContext, useState, useEffect } from "react"
import TaskContext from "../context/TaskContext"
import ThemeContext from "../context/ThemeContext"
import LanguageContext from "../context/LanguageContext"
import AddTaskForm from "./add-task-form"
import TaskFilters from "./task-filters"
import TaskList from "./task-list"
import { useAuth } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import "../App.css"

function Dashboard() {
  const { tasks, updateTask } = useContext(TaskContext)
  const { darkMode } = useContext(ThemeContext)
  const { t } = useContext(LanguageContext)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState("priorityHigh")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showArchived, setShowArchived] = useState(false)

  // Automatically archive completed tasks after 24 hours
  useEffect(() => {
    const checkCompletedTasks = () => {
      const now = new Date()
      tasks.forEach(task => {
        if (task.completed && !task.archived) {
          const completedDate = new Date(task.completedAt)
          const hoursSinceCompletion = (now - completedDate) / (1000 * 60 * 60)
          
          if (hoursSinceCompletion >= 24) {
            updateTask(task.id, { ...task, archived: true, archivedAt: now.toISOString() })
          }
        }
      })
    }

    // Check immediately and then every hour
    checkCompletedTasks()
    const interval = setInterval(checkCompletedTasks, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [tasks, updateTask])

  const sortedAndFilteredTasks = () => {
    let filtered = tasks.filter(task => !task.archived)

    if (categoryFilter !== "All") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }

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
        filtered.sort((a, b) => Number.parseInt(b.priority) - Number.parseInt(a.priority))
    }

    return filtered
  }

  const getArchivedTasks = () => {
    return tasks.filter(task => task.archived)
  }

  const handleCompleteTask = (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    }
    updateTask(task.id, updatedTask)
  }

  const handleRestoreTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      updateTask(taskId, { ...task, archived: false, archivedAt: null })
    }
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm(t("dashboard.confirmDelete"))) {
      // In a real app, you would call your API to delete the task
      // For now, we'll just filter it out
      updateTask(taskId, { ...tasks.find(t => t.id === taskId), deleted: true })
    }
  }

  const handleLogout = async () => {
    if (window.confirm(t("dashboard.confirmLogout"))) {
      try {
        await logout()
        navigate("/login")
      } catch (error) {
        console.error("Logout failed:", error)
      }
    }
  }

  const ArchivedTasks = () => {
    const archivedTasks = getArchivedTasks()

    if (archivedTasks.length === 0) {
      return <p className="text-center py-4">{t("dashboard.noArchivedTasks")}</p>
    }

    return (
      <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <h3 className="text-lg font-semibold mb-3">{t("dashboard.archivedTasks")}</h3>
        <ul className="space-y-3">
          {archivedTasks.map(task => (
            <li key={task.id} className={`p-3 rounded-md flex justify-between items-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <div>
                <h4 className={`font-medium line-through ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                  {task.title}
                </h4>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {t("dashboard.completedOn", { date: new Date(task.completedAt).toLocaleDateString() })} • 
                  {t("dashboard.archivedOn", { date: new Date(task.archivedAt).toLocaleDateString() })}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleRestoreTask(task.id)}
                  className={`px-3 py-1 rounded ${darkMode ? "bg-green-700 hover:bg-green-600" : "bg-green-500 hover:bg-green-400"} text-white text-sm`}
                >
                  {t("dashboard.restore")}
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className={`px-3 py-1 rounded ${darkMode ? "bg-red-700 hover:bg-red-600" : "bg-red-500 hover:bg-red-400"} text-white text-sm`}
                >
                  {t("dashboard.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className={`p-4 max-w-lg mx-auto w-full dashboardContainer ${darkMode ? "dark-theme" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-center">{t("dashboard.addTask")}</h2>
      </div>

      <AddTaskForm />

      <TaskFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{t("dashboard.activeTasks")}</h3>
        <button 
          onClick={() => setShowArchived(!showArchived)}
          className={`text-sm ${darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}
        >
          {showArchived ? t("dashboard.hideArchived") : t("dashboard.showArchived")}
        </button>
      </div>

      <TaskList 
        tasks={sortedAndFilteredTasks()} 
        onCompleteTask={handleCompleteTask}
      />

      {showArchived && <ArchivedTasks />}

      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 w-full mt-4">
        {t("dashboard.logout")}
      </button>
    </div>
  )
}

export default Dashboard