"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import NotificationContext from "/src/context/NotificationContext"
import ThemeContext from "../context/ThemeContext"
import "../App.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addNotification } = useContext(NotificationContext)
  const { darkMode } = useContext(ThemeContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      addNotification("Please enter both email and password", "warning")
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      addNotification("Login successful!", "success")
      navigate("/dashboard") // Redirect to /dashboard after successful login
    } catch (error) {
      addNotification(error.message || "Failed to login. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`loginContainer ${darkMode ? "dark-theme" : ""}`}>
      <div className="loginCard">
        <div className="logo-container">
          <img src="src/assets/TODO-ICON.png" alt="Todo App Logo" />
        </div>
        <h1 className="loginTitle">Login</h1>

        <form onSubmit={handleLogin}>
          <div className="inputGroup">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <div className="inputGroup">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="registerLink">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  )
}

export default Login
