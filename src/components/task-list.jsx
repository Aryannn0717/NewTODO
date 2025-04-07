import TaskItem from "./task-item";
import "../App.css";

function TaskList({ tasks }) {
  return (
    <div className="taskList-wrapper"> {/* Optional wrapper for styling the list as a whole */}
      {tasks.length === 0 ? (
        <p className="text-center">No tasks available.</p>
      ) : (
        <div className="taskListContainer row-container"> {/* Added row-container class */}
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} className="row-item" /> 
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;