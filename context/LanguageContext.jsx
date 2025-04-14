"use client"

import { createContext, useState, useEffect } from "react"
import { translations } from "../translations"

// Create the context
const LanguageContext = createContext()

// Create the provider component
export function LanguageProvider({ children }) {
  // Get the saved language from localStorage or use browser language as default
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("language")
      if (savedLanguage) {
        return savedLanguage
      }

      // Try to get browser language (first two characters, e.g., 'en' from 'en-US')
      const browserLang = navigator.language.split("-")[0]
      // Check if we support this language, otherwise default to English
      return translations[browserLang] ? browserLang : "en"
    }
    return "en" // Default to English
  })

  // Update localStorage when language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      // You could also set the lang attribute on the html element
      document.documentElement.lang = language
    }
  }, [language])

  // Function to change the language
  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
    }
  }

  // Translation function
  const t = (key) => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")
    let value = translations[language]

    // Navigate through the nested properties
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Fallback to English if the key doesn't exist in the current language
        let fallback = translations["en"]
        for (const k of keys) {
          if (fallback && fallback[k]) {
            fallback = fallback[k]
          } else {
            return key // Return the key itself if not found in English either
          }
        }
        return fallback
      }
    }

    return value
  }

  return <LanguageContext.Provider value={{ language, changeLanguage, t }}>{children}</LanguageContext.Provider>
}

export default LanguageContext
