"use client"

import { createContext, useState, useEffect, useContext } from "react";
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // your Firestore instance
import { useAuth } from "./authContext";
import NotificationContext from "./NotificationContext";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState({});
  const { user } = useAuth();
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tasksArr = [];
      querySnapshot.forEach((doc) => {
        tasksArr.push({ ...doc.data(), id: doc.id });
      });
      setTasks(tasksArr);
    });

    return () => unsubscribe();
  }, [user]);

  // --- Notification Helpers ---
  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  const showBrowserNotification = async (title, body) => {
    const granted = await requestNotificationPermission();
    if (granted) {
      new Notification(title, { body });
    } else {
      addNotification(body, "warning");
    }
  };

  // --- Reminder Timer Setup ---
  useEffect(() => {
    Object.values(reminders).forEach(clearTimeout);
    const newReminders = {};

    tasks.forEach(task => {
      if (task.reminder && !task.completed) {
        const time = parseReminderTime(task.reminder);
        if (time) {
          const timerId = setTimeout(() => {
            showBrowserNotification("Task Reminder", `Reminder: ${task.title}`);
          }, time);
          newReminders[task.id] = timerId;
        }
      }
    });

    setReminders(newReminders);
    return () => Object.values(newReminders).forEach(clearTimeout);
  }, [tasks]);

  const parseReminderTime = (reminderStr) => {
    const match = reminderStr?.match(/^(\d+)([mh])$/);
    if (!match) return null;
    const [, value, unit] = match;
    const numValue = parseInt(value, 10);
    return unit === "m" ? numValue * 60000 : numValue * 3600000;
  };

  // --- Firebase Actions ---
  const addTask = async (task) => {
    if (!user) return;
    await addDoc(collection(db, 'tasks'), {
      ...task,
      userId: user.uid,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    if (task.reminder) {
      addNotification(`Reminder set for "${task.title}"`, "success");
    }
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    addNotification("Task deleted", "error");
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    await updateDoc(doc(db, 'tasks', id), {
      completed: !currentStatus,
    });
    addNotification(`Task marked as ${!currentStatus ? "completed" : "incomplete"}`, "success");
  };

  const editTask = async (id, updatedTask) => {
    await updateDoc(doc(db, 'tasks', id), updatedTask);
    addNotification(`Task "${updatedTask.title}" updated`, "info");
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        deleteTask,
        toggleTaskStatus,
        editTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;


