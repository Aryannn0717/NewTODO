"use client"

import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import NotificationContext from "/src/context/NotificationContext"
import "../App.css"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { addNotification } = useContext(NotificationContext)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email || !password || !confirmPassword) {
      addNotification("Please fill in all fields", "warning")
      return
    }

    if (password !== confirmPassword) {
      addNotification("Passwords do not match", "error")
      return
    }

    if (password.length < 6) {
      addNotification("Password should be at least 6 characters", "warning")
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
    <div className="registerContainer">
      <div className="registerCard">
        <img src="src/assets/TODO-ICON.png" />
        <h1 className="registerTitle">Register</h1>

        <form onSubmit={handleRegister}>
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

          <div className="inputGroup">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="inputField"
              required
            />
            <>
              {password !== confirmPassword && <p className="errorText">Passwords do not match</p>}
              {password.length < 6 && password.length > 0 && <p className="errorText">Password should be at least 6 characters</p>}
            </>
          </div>

          <button
            type="submit"
            className="registerButton"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="registerLink">
          Already have an account?{" "}
          <a href="/login" className="hoverUnderline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register

