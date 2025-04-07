"use client"

import { createContext, useState } from "react"

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
})

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = "info") => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      message,
      type,
    }

    setNotifications((prev) => [...prev, newNotification])

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)

    return id
  }

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext

