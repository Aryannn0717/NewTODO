"use client"

import { useContext } from "react"
import LanguageContext from "../context/LanguageContext"
import "../App.css"

function TaskFilters({ sortBy, setSortBy, categoryFilter, setCategoryFilter }) {
  const { t } = useContext(LanguageContext)

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 filterContainer">
      <div className="filter-box">
        <label htmlFor="sort">{t("filters.sortBy")}</label>
        <select
          id="sort"
          className="w-full sm:w-auto border p-2 rounded filterSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="priorityHigh">{t("filters.priorityHigh")}</option>
          <option value="priorityLow">{t("filters.priorityLow")}</option>
          <option value="completed">{t("filters.completed")}</option>
          <option value="incomplete">{t("filters.incomplete")}</option>
        </select>
      </div>
      <div className="filter-box">
        <label htmlFor="category">{t("filters.category")}</label>
        <select
          id="category"
          className="w-full sm:w-auto border p-2 rounded filterSelect"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">{t("categories.all")}</option>
          <option value="Work">{t("categories.work")}</option>
          <option value="Personal">{t("categories.personal")}</option>
          <option value="School">{t("categories.school")}</option>
          <option value="Shopping">{t("categories.shopping")}</option>
          <option value="Health">{t("categories.health")}</option>
        </select>
      </div>
    </div>
  )
}

export default TaskFilters
