"use client"

import { useState, useContext } from "react"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../firebaseConfig"
import { useAuth } from "../context/authContext"
import NotificationContext from "/src/context/NotificationContext"
import LanguageContext from "../context/LanguageContext"
import "../App.css"

function AddTaskForm() {
  const { user } = useAuth()
  const { addNotification } = useContext(NotificationContext)
  const { t } = useContext(LanguageContext)
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Work",
    priority: "1",
    dueDate: "",
    reminder: "",
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target

    if (name === "dueDate" && type === "date") {
      setNewTask((prev) => ({
        ...prev,
        dueDate: value + (prev.dueDate.split("T")[1] || "T00:00"),
      }))
    } else if (name === "dueDate" && type === "time") {
      setNewTask((prev) => ({
        ...prev,
        dueDate: (prev.dueDate.split("T")[0] || "") + "T" + value,
      }))
    } else {
      setNewTask({ ...newTask, [name]: value })
    }
  }

  const validateReminder = (value) => {
    const isValid = /^\d+[mh]$/.test(value)
    if (!isValid && value) {
      addNotification(t("notifications.reminderFormat"), "warning")
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title) {
      addNotification(t("notifications.enterTitle"), "warning")
      return
    }

    if (!newTask.dueDate) {
      addNotification(t("notifications.selectDueDate"), "warning")
      return
    }

    if (!user) {
      addNotification(t("notifications.loginRequired"), "error")
      return
    }

    try {
      await addDoc(collection(db, "tasks"), {
        ...newTask,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        completed: false,
      })
      addNotification(t("notifications.taskAdded"), "success")
      setNewTask({
        title: "",
        category: "Work",
        priority: "1",
        dueDate: "",
        reminder: "",
      })
    } catch (error) {
      console.error("Error adding task: ", error)
      addNotification(t("notifications.taskAddError"), "error")
    }
  }

  return (
    <div className="mb-4 border p-4 rounded bg-gray-100 taskFormContainer">
      <input
        type="text"
        placeholder={t("tasks.title")}
        name="title"
        value={newTask.title}
        onChange={handleInputChange}
        className="border p-2 w-full rounded mb-2 taskInput"
      />
      <select
        name="category"
        value={newTask.category}
        onChange={handleInputChange}
        className="border p-2 w-full rounded mb-2 taskSelect"
      >
        <option value="Work">{t("categories.work")}</option>
        <option value="Personal">{t("categories.personal")}</option>
        <option value="School">{t("categories.school")}</option>
        <option value="Shopping">{t("categories.shopping")}</option>
        <option value="Health">{t("categories.health")}</option>
      </select>
      <select
        name="priority"
        value={newTask.priority}
        onChange={handleInputChange}
        className="border p-2 w-full rounded mb-2 taskSelect"
      >
        <option value="1">{t("priorities.low")}</option>
        <option value="2">{t("priorities.medium")}</option>
        <option value="3">{t("priorities.high")}</option>
      </select>
      <div className="flex gap-2 mb-2">
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate.split("T")[0] || ""}
          onChange={handleInputChange}
          className="border p-2 w-1/2 rounded taskInput"
        />
        <input
          type="time"
          name="dueDate"
          value={newTask.dueDate.split("T")[1]?.slice(0, 5) || "00:00"}
          onChange={handleInputChange}
          className="border p-2 w-1/2 rounded taskInput"
        />
      </div>
      <input
        type="text"
        placeholder={t("tasks.reminder")}
        name="reminder"
        value={newTask.reminder}
        onChange={(e) => {
          handleInputChange(e)
          validateReminder(e.target.value)
        }}
        className="border p-2 w-full rounded mb-2 taskInput"
      />
      <button onClick={handleAddTask} className="bg-green-500 text-white p-2 rounded w-full">
        {t("tasks.add")}
      </button>
    </div>
  )
}

export default AddTaskForm
