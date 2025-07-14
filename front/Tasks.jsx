import React, { useContext, useEffect, useMemo, useCallback } from 'react';
import { FaCheckCircle, FaSpinner, FaUser, FaClipboardList, FaClock } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Tasks() {
  const { projects, employees, fetchProjects, fetchEmployees } = useContext(DataContext);

  useEffect(() => {
    fetchProjects(); // Ensure projects are fetched to get tasks
    fetchEmployees(); // Ensure employees are fetched to display names
  }, [fetchProjects, fetchEmployees]);


  // Get all tasks from all projects, ensuring project name and employee name are available
  const allTasks = useMemo(() => {
    return projects.flatMap(project =>
      (project.tasks || []).map(task => ({
        ...task,
        projectName: project.project_name, // Use project_name from backend
        employeeName: employees.find(emp => emp.employee_id === task.employee_id)?.name || 'Unassigned'
      }))
    );
  }, [projects, employees]);

  const pendingTasks = useMemo(() => allTasks.filter(task => task.status === "Pending" || task.status === "In Progress"), [allTasks]);
  const completedTasks = useMemo(() => allTasks.filter(task => task.status === "Completed"), [allTasks]);
  const overdueTasks = useMemo(() => allTasks.filter(task => task.status === "Overdue"), [allTasks]); // Added overdue tasks


  const renderStatusIcon = useCallback((status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="status-icon completed" />;
      case "In Progress":
        return <FaSpinner className="status-icon in-progress" />;
      case "Pending":
        return <div className="status-icon pending"></div>;
      case "Overdue":
        return <FaClock className="status-icon overdue" />;
      default:
        return <div className="status-icon pending"></div>;
    }
  }, []);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>TASKS</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PENDING TASKS</h3>
          </div>
          <h1>{pendingTasks.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>COMPLETED TASKS</h3>
          </div>
          <h1>{completedTasks.length}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>OVERDUE TASKS</h3>
          </div>
          <h1>{overdueTasks.length}</h1>
        </div>
      </div>

      <div className='tasks-container'>
        <h3>All Tasks ({allTasks.length})</h3>

        <div className="tasks-list-header">
          <span>Task</span>
          <span>Project</span>
          <span>Assigned To</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>

        {allTasks.length > 0 ? (
          allTasks.map(task => (
            <div key={task.task_id} className="task-item">
              <span className="task-name">{task.task_name}</span>
              <span className="task-project">{task.projectName}</span>
              <span className="task-employee">
                <FaUser className="employee-icon" /> {task.employeeName}
              </span>
              <span className="task-deadline">
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}
              </span>
              <span className={`task-status status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {renderStatusIcon(task.status)}
                {task.status}
              </span>
            </div>
          ))
        ) : (
          <div className="no-tasks">No tasks found</div>
        )}
      </div>
    </main>
  );
}

export default Tasks;