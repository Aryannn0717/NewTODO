"use client"

import { useContext } from "react"
import NotificationContext from "/src/context/NotificationContext"
import '../App.css';

function NotificationToast() {
  const { notifications, removeNotification } = useContext(NotificationContext)

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-3 rounded shadow-lg flex justify-between items-center min-w-[300px] animate-slide-up ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "error"
                ? "bg-red-500 text-white"
                : notification.type === "warning"
                  ? "bg-yellow-500 text-black"
                  : "bg-blue-500 text-white"
          }`}
        >
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)} className="ml-2 text-sm font-bold">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

export default NotificationToast

