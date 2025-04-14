"use client"

import { useContext, useEffect, useState } from "react"
import LanguageContext from "../context/LanguageContext"
import TaskItem from "./task-item"
import "../App.css"
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebaseConfig" // Assuming you've moved your Firebase config here

function TaskList({ tasks: initialTasks, onTaskUpdate }) {
  const { t } = useContext(LanguageContext)
  const [tasks, setTasks] = useState(initialTasks || [])
  const [loading, setLoading] = useState(true)

  // Fetch tasks from Firestore
  useEffect(() => {
    setLoading(true)
    const q = query(collection(db, "tasks"), where("deleted", "!=", true))
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksData = []
      querySnapshot.forEach((doc) => {
        tasksData.push({ id: doc.id, ...doc.data() })
      })
      setTasks(tasksData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleCompleteTask = async (task) => {
    try {
      const taskRef = doc(db, "tasks", task.id)
      await updateDoc(taskRef, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null,
        // Archive after 24 hours will be handled by a Cloud Function or separate process
      })
      if (onTaskUpdate) onTaskUpdate()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm(t("tasks.confirmDelete"))) {
      try {
        const taskRef = doc(db, "tasks", taskId)
        await updateDoc(taskRef, {
          deleted: true,
          deletedAt: new Date().toISOString()
        })
        if (onTaskUpdate) onTaskUpdate()
      } catch (error) {
        console.error("Error deleting task:", error)
      }
    }
  }

  if (loading) {
    return <div className="text-center py-4">{t("tasks.loading")}</div>
  }

  return (
    <div className="taskList-header">
      <h2 className="text-center">{t("tasks.taskList")}</h2>
      <div className="taskList-wrapper">
        {tasks.length === 0 ? (
          <p className="text-center">{t("tasks.noTasks")}</p>
        ) : (
          <div className="taskListContainer row-container">
            {tasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                className="row-item"
                onComplete={() => handleCompleteTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList