"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import NotificationContext from "/src/context/NotificationContext"
import ThemeContext from "../context/ThemeContext"
import LanguageContext from "../context/LanguageContext"
import "../App.css"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addNotification } = useContext(NotificationContext)
  const { darkMode } = useContext(ThemeContext)
  const { t } = useContext(LanguageContext)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      addNotification(t("notifications.fillAllFields"), "warning")
      return
    }

    if (password !== confirmPassword) {
      addNotification(t("auth.passwordsNoMatch"), "error")
      return
    }

    if (password.length < 6) {
      addNotification(t("auth.passwordLength"), "warning")
      return
    }

    try {
      setLoading(true)
      await register(email, password)
      addNotification("Account created successfully!", "success")
      navigate("/")
    } catch (error) {
      addNotification(error.message || "Failed to create account. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`registerContainer ${darkMode ? "dark-theme" : ""}`}>
      <div className="registerCard">
        <img src="src/assets/TODO-ICON.png" />
        <h1 className="registerTitle">{t("auth.register")}</h1>

        <form onSubmit={handleRegister}>
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

          <div className="inputGroup">
            <input
              type="password"
              placeholder={t("auth.confirmPassword")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="inputField"
              required
            />
            <>
              {password !== confirmPassword && <p className="errorText">{t("auth.passwordsNoMatch")}</p>}
              {password.length < 6 && password.length > 0 && <p className="errorText">{t("auth.passwordLength")}</p>}
            </>
          </div>

          <button type="submit" className="registerButton" disabled={loading}>
            {loading ? t("auth.creatingAccount") : t("auth.register")}
          </button>
        </form>

        <p className="registerLink">
          {t("auth.haveAccount")}{" "}
          <a href="/login" className="hoverUnderline">
            {t("auth.login")}
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
