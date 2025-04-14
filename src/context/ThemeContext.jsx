"use client"

import { createContext, useState, useEffect } from "react"

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Check if dark mode is saved in localStorage or use system preference as fallback
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("darkMode")
      if (savedTheme !== null) {
        return savedTheme === "true"
      }
      // Use system preference as default
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

  // Update localStorage when theme changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode)

      // Apply dark mode class to body
      if (darkMode) {
        document.body.classList.add("dark-mode")
      } else {
        document.body.classList.remove("dark-mode")
      }
    }
  }, [darkMode])

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

export default ThemeContext
