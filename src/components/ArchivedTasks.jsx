import { useState, useEffect } from 'react';
import '../App.css'; // Assuming you have some CSS styles defined here

const ArchivedTasks = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching archived tasks from an API
  useEffect(() => {
    const fetchArchivedTasks = async () => {
      try {
        // In a real app, this would be an actual API call
        // const response = await fetch('/api/tasks/archived');
        // const data = await response.json();
        
        // Simulating API response
        setTimeout(() => {
          const mockData = [
            { id: 1, title: 'Complete project documentation', completedAt: '2023-05-15', archivedAt: '2023-05-16' },
            { id: 2, title: 'Fix login page bugs', completedAt: '2023-05-10', archivedAt: '2023-05-12' },
            { id: 3, title: 'Update dependencies', completedAt: '2023-04-28', archivedAt: '2023-05-01' },
            { id: 4, title: 'Write unit tests', completedAt: '2023-04-20', archivedAt: '2023-04-25' },
          ];
          setArchivedTasks(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArchivedTasks();
  }, []);

  const restoreTask = (taskId) => {
    // In a real app, you would call an API to restore the task
    console.log('Restoring task:', taskId);
    setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
    alert(`Task ${taskId} restored successfully!`);
  };

  const deletePermanently = (taskId) => {
    // Confirm before permanent deletion
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      // In a real app, you would call an API to delete the task
      console.log('Deleting task permanently:', taskId);
      setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
      alert(`Task ${taskId} deleted permanently!`);
    }
  };

  if (loading) {
    return <div className="loading">Loading archived tasks...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="archived-tasks">
      <h2>Archived Completed Tasks</h2>
      {archivedTasks.length === 0 ? (
        <p>No archived tasks found.</p>
      ) : (
        <ul className="task-list">
          {archivedTasks.map(task => (
            <li key={task.id} className="task-item">
              <div className="task-info">
                <h3>{task.title}</h3>
                <p>Completed: {new Date(task.completedAt).toLocaleDateString()}</p>
                <p>Archived: {new Date(task.archivedAt).toLocaleDateString()}</p>
              </div>
              <div className="task-actions">
                <button 
                  onClick={() => restoreTask(task.id)}
                  className="restore-btn"
                >
                  Restore
                </button>
                <button 
                  onClick={() => deletePermanently(task.id)}
                  className="delete-btn"
                >
                  Delete Permanently
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArchivedTasks;