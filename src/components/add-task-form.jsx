"use client"

import { useContext, useState } from "react";
import TaskContext from "../context/TaskContext";
import NotificationContext from "/src/context/NotificationContext";
import '../App.css';

function AddTaskForm() {
    const { addTask } = useContext(TaskContext);
    const { addNotification } = useContext(NotificationContext);
    const [newTask, setNewTask] = useState({
        title: "",
        category: "Work",
        priority: "1",
        dueDate: "", // Will now store combined date and time
        reminder: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'dueDate' && e.target.type === 'date') {
            setNewTask(prevTask => ({
                ...prevTask,
                dueDate: value + (prevTask.dueDate.split('T')[1] || 'T00:00'),
            }));
        } else if (name === 'dueDate' && e.target.type === 'time') {
            setNewTask(prevTask => ({
                ...prevTask,
                dueDate: (prevTask.dueDate.split('T')[0] || '') + 'T' + value,
            }));
        } else {
            setNewTask({ ...newTask, [name]: value });
        }
    };

    const handleAddTask = () => {
        if (!newTask.title) {
            addNotification("Please enter a task title", "warning");
            return;
        }

        if (!newTask.dueDate) {
            addNotification("Please select a due date and time", "warning");
            return;
        }

        addTask(newTask);
        addNotification(`Task "${newTask.title}" added successfully`, "success");
        setNewTask({ title: "", category: "Work", priority: "1", dueDate: "", reminder: "" });
    };

    const validateReminder = (value) => {
        const isValid = /^\d+[mh]$/.test(value);
        if (!isValid && value) {
            addNotification("Please use format like '30m' or '1h' for reminders", "warning");
        }
    };

    return (
        <div className="mb-4 border p-4 rounded bg-gray-100 taskFormContainer">
            <input
                type="text"
                placeholder="Task Title"
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
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="School">School</option>
                <option value="Shopping">Shopping</option>
                <option value="Health">Health</option>
            </select>
            <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="border p-2 w-full rounded mb-2 taskSelect"
            >
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
            </select>
            <div className="flex gap-2 mb-2">
                <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate.split('T')[0] || ''}
                    onChange={handleInputChange}
                    className="border p-2 w-1/2 rounded taskInput"
                />
                <input
                    type="time"
                    name="dueDate"
                    value={newTask.dueDate.split('T')[1]?.slice(0, 5) || '00:00'}
                    onChange={handleInputChange}
                    className="border p-2 w-1/2 rounded taskInput"
                />
            </div>
            <input
                type="text"
                placeholder="Reminder (e.g., 30m, 1h)"
                name="reminder"
                value={newTask.reminder}
                onChange={(e) => {
                    handleInputChange(e);
                    validateReminder(e.target.value);
                }}
                className="border p-2 w-full rounded mb-2 taskInput"
            />
            <button onClick={handleAddTask} className="bg-green-500 text-white p-2 rounded w-full">
                Add Task
            </button>
        </div>
    );
}

export default AddTaskForm;