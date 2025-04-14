"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import NotificationContext from "/src/context/NotificationContext"
import ThemeContext from "../context/ThemeContext"
import LanguageContext from "../context/LanguageContext"
import "../App.css"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addNotification } = useContext(NotificationContext)
  const { darkMode } = useContext(ThemeContext)
  const { t } = useContext(LanguageContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      addNotification(t("notifications.fillAllFields"), "warning")
      return
    }

    try {
      setLoading(true)
      await login(email, password)
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
        <img src="src/assets/TODO-ICON.png" />
        <h1 className="loginTitle">{t("auth.login")}</h1>

        <form onSubmit={handleLogin}>
          <div className="inputGroup">
            <input
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <div className="inputGroup">
            <input
              type="password"
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputField"
              required
            />
          </div>

          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </form>

        <p className="registerLink">
          {t("auth.noAccount")} <a href="/register">{t("auth.register")}</a>
        </p>
      </div>
    </div>
  )
}

export default Login
