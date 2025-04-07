import React from "react";
import '../App.css';

function TaskFilters({ sortBy, setSortBy, categoryFilter, setCategoryFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 filterContainer"> {/* Added filterContainer class */}
      <div className="filter-box">
        <label htmlFor="sort">Sort By:</label>
        <select
          id="sort"
          className="w-full sm:w-auto border p-2 rounded filterSelect"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="priorityHigh">Priority (High)</option>
          <option value="priorityLow">Priority (Low)</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </div>
      <div className="filter-box">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          className="w-full sm:w-auto border p-2 rounded filterSelect"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="School">School</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
        </select>
      </div>
    </div>
  );
}

export default TaskFilters;