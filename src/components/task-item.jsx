"use client"

import { useContext, useState } from "react"
import TaskContext from "../context/TaskContext"
import NotificationContext from "/src/context/NotificationContext"
import LanguageContext from "../context/LanguageContext"

import "../App.css"

function TaskItem({ task }) {
  const { markCompleted, deleteTask, editTask } = useContext(TaskContext)
  const { addNotification } = useContext(NotificationContext)
  const { t } = useContext(LanguageContext)
  const [editingTask, setEditingTask] = useState(false)
  const [editText, setEditText] = useState(task.title)
  const [editCategory, setEditCategory] = useState(task.category)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editDueDate, setEditDueDate] = useState(task.dueDate)
  const [editReminder, setEditReminder] = useState(task.reminder)

  const handleEditClick = () => {
    setEditingTask(true)
    setEditText(task.title)
    setEditCategory(task.category)
    setEditPriority(task.priority)
    setEditDueDate(task.dueDate)
    setEditReminder(task.reminder)
  }

  const validateReminder = (value) => {
    // Allow empty value
    if (!value) {
      setEditReminder(value)
      return
    }

    // Check if the format is valid (e.g., "30m", "1h")
    const isValid = /^\d+[mh]$/.test(value)
    if (isValid) {
      setEditReminder(value)
    } else {
      addNotification(t("notifications.reminderFormat"), "warning")
    }
  }

  const handleSaveEdit = () => {
    if (!editText) {
      addNotification(t("notifications.enterTitle"), "warning")
      return
    }

    if (!editDueDate) {
      addNotification(t("notifications.selectDueDate"), "warning")
      return
    }

    editTask(task.id, {
      title: editText,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate,
      reminder: editReminder,
    })

    addNotification(t("notifications.taskUpdated"), "success")
    setEditingTask(false)
  }

  const handleDeleteClick = () => {
    // Confirmation before deleting
    if (window.confirm(`${t("tasks.confirmDelete")} "${task.title}"?`)) {
      deleteTask(task.id)
    }
  }

  const handleCheckboxChange = () => {
    markCompleted(task.id)
  }

  return (
    <div className="border p-3 rounded shadow-md bg-white flex items-center justify-between">
      <input type="checkbox" checked={task.completed} onChange={handleCheckboxChange} className="mr-2" />
      {editingTask ? (
        <div className="flex-grow">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          >
            <option value="Work">{t("categories.work")}</option>
            <option value="Personal">{t("categories.personal")}</option>
            <option value="School">{t("categories.school")}</option>
            <option value="Shopping">{t("categories.shopping")}</option>
            <option value="Health">{t("categories.health")}</option>
          </select>
          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          >
            <option value="1">{t("priorities.low")}</option>
            <option value="2">{t("priorities.medium")}</option>
            <option value="3">{t("priorities.high")}</option>
          </select>
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <input
            type="text"
            placeholder={t("tasks.reminder")}
            value={editReminder}
            onChange={(e) => validateReminder(e.target.value)}
            className="border p-2 w-full rounded mb-2"
          />
          <div className="flex gap-2">
            <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-3 py-1 rounded">
              {t("tasks.save")}
            </button>
            <button onClick={() => setEditingTask(false)} className="bg-gray-500 text-white px-3 py-1 rounded">
              {t("tasks.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow">
          <h3 className={`font-bold ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</h3>
          <p className="text-sm">{task.category}</p>
          <p className="text-sm">Reminder: {task.reminder || "None"}</p>
        </div>
      )}
      <div className="flex-shrink-0 ml-4">
        {!editingTask && (
          <>
            <button onClick={handleEditClick} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
              {t("tasks.edit")}
            </button>
            <button onClick={handleDeleteClick} className="bg-red-500 text-white px-3 py-1 rounded">
              {t("tasks.delete")}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default TaskItem
