"use client";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { NotificationProvider } from "/src/context/NotificationContext";
import { TaskProvider } from "./context/TaskContext";
import { AuthProvider, useAuth } from "./context/authContext";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import NotificationToast from "./components/notification-toast";
import "./App.css"; // Ensure your global styles are here

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TaskProvider>
          <Router>
            <div className="app-layout"> {/* Main layout container */}
              <header className="app-header">
                {/* You can add your header content here */}
                <h1>To Do List App</h1>
                {/* Navigation links could go here */}
              </header>
              <main className="app-main">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <NotificationToast /> {/* Keep the notification toast outside main for visibility */}
              <footer className="app-footer">
                {/* You can add your footer content here */}
                <p>&copy; {new Date().getFullYear()} My To Do List</p>
              </footer>
            </div>
          </Router>
        </TaskProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;