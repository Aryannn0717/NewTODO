"use client"

import { createContext, useState, useEffect, useContext } from "react";
import NotificationContext from "/src/context/NotificationContext";

const TaskContext = createContext({
    tasks: [],
    addTask: () => {},
    markCompleted: () => {},
    deleteTask: () => {},
    editTask: () => {},
});

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const { addNotification: addInAppNotification } = useContext(NotificationContext);
    const [reminders, setReminders] = useState({});

    // Function to request notification permission
    const requestNotificationPermission = async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications.");
            return false;
        }
        if (Notification.permission === "granted") {
            return true;
        }
        if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        }
        return false;
    };

    // Function to show a browser notification
    const showBrowserNotification = (title, body) => {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        } else if (Notification.permission !== 'denied') {
            requestNotificationPermission().then(granted => {
                if (granted) {
                    new Notification(title, { body });
                } else {
                    // Fallback to in-app notification if permission is denied
                    addInAppNotification(body, "warning");
                }
            });
        } else {
            // Fallback to in-app notification if permission is denied
            addInAppNotification(body, "warning");
        }
    };

    // Load tasks from localStorage on initial render
    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    // Handle reminders
    useEffect(() => {
        // Clear all existing timers when tasks change
        Object.values(reminders).forEach((timerId) => clearTimeout(timerId));
        const newReminders = {};

        tasks.forEach((task) => {
            if (task.reminder && !task.completed) {
                const reminderTime = parseReminderTime(task.reminder);
                if (reminderTime) {
                    const timerId = setTimeout(() => {
                        // Trigger browser notification
                        showBrowserNotification("Task Reminder", `Reminder: ${task.title}`);
                        // Optionally, you can also show an in-app notification if the browser notification fails or is denied
                        // addInAppNotification(`Reminder: ${task.title}`, "warning");
                    }, reminderTime);
                    newReminders[task.id] = timerId;
                }
            }
        });

        setReminders(newReminders);

        // Cleanup function to clear all timers when component unmounts
        return () => {
            Object.values(newReminders).forEach((timerId) => clearTimeout(timerId));
        };
    }, [tasks, addInAppNotification, showBrowserNotification]); // Added showBrowserNotification to dependency array

    const parseReminderTime = (reminderStr) => {
        if (!reminderStr) return null;

        const match = reminderStr.match(/^(\d+)([mh])$/);
        if (!match) return null;

        const [, value, unit] = match;
        const numValue = Number.parseInt(value, 10);

        if (isNaN(numValue)) return null;

        // Convert to milliseconds
        return unit === "m" ? numValue * 60 * 1000 : numValue * 60 * 60 * 1000;
    };

    const addTask = (task) => {
        const newTask = {
            ...task,
            id: Date.now().toString(),
            completed: false,
        };
        setTasks([...tasks, newTask]);

        if (task.reminder) {
            addInAppNotification(`Reminder set for "${task.title}"`, "success");
        }
    };

    const markCompleted = (id) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));

        // Clear reminder if task is completed
        const task = tasks.find((t) => t.id === id);
        if (task && !task.completed) {
            addInAppNotification(`Task "${task.title}" marked as completed`, "success");

            // Clear the reminder timer if it exists
            if (reminders[id]) {
                clearTimeout(reminders[id]);
                const newReminders = { ...reminders };
                delete newReminders[id];
                setReminders(newReminders);
            }
        }
    };

    const deleteTask = (id) => {
        const taskToDelete = tasks.find((task) => task.id === id);
        if (taskToDelete) {
            setTasks(tasks.filter((task) => task.id !== id));
            addInAppNotification(`Task "${taskToDelete.title}" has been deleted`, "error");

            // Clear the reminder timer if it exists
            if (reminders[id]) {
                clearTimeout(reminders[id]);
                const newReminders = { ...reminders };
                delete newReminders[id];
                setReminders(newReminders);
            }
        }
    };

    const editTask = (id, updatedTask) => {
        setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)));

        // If reminder was updated, show notification
        const oldTask = tasks.find((t) => t.id === id);
        if (oldTask && updatedTask.reminder && oldTask.reminder !== updatedTask.reminder) {
            addInAppNotification(`Reminder updated for "${oldTask.title}"`, "info");
        }
    };

    return (
        <TaskContext.Provider
            value={{
                tasks,
                addTask,
                markCompleted,
                deleteTask,
                editTask,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export default TaskContext;