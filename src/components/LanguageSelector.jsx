"use client"

import { useContext } from "react"
import LanguageContext from "../context/LanguageContext"

function LanguageSelector() {
  const { language, changeLanguage } = useContext(LanguageContext)

  return (
    <div className="language-selector">
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  )
}

export default LanguageSelector
