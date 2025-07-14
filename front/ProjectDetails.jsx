import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaSpinner, FaClock, FaCalendarAlt, FaArrowLeft, FaPlus, FaTrashAlt, FaEdit, FaUser } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, employees, fetchProjects, addTaskToProject, updateTaskStatus, updateProject, fetchEmployees } = useContext(DataContext);
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState({
    task_name: '', // Matches backend schema
    deadline: '',
    employee_id: '' // Matches backend schema
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(null);

  const projectId = parseInt(id);

  useEffect(() => {
    fetchProjects(); // Ensure projects are fresh
    fetchEmployees(); // Ensure employees are available for task assignment
  }, [fetchProjects, fetchEmployees]);

  useEffect(() => {
    if (projects.length > 0) {
      const foundProject = projects.find(p => p.project_id === projectId);
      setProject(foundProject);
      setEditedProject(foundProject); // Initialize edited project data
    }
  }, [projects, projectId]);

  const renderStatusIcon = useCallback((status) => {
    switch (status) {
      case "Completed":
        return <FaCheckCircle className="status-icon completed" />;
      case "In Progress":
        return <FaSpinner className="status-icon in-progress" />;
      case "Overdue":
        return <FaClock className="status-icon overdue" />;
      case "Not Started":
        return <div className="status-icon not-started"></div>;
      case "On Hold":
        return <FaClock className="status-icon on-hold" />;
      default:
        return null;
    }
  }, []);

  const handleAddTask = async () => {
    if (!newTask.task_name || !newTask.deadline || !newTask.employee_id) return;

    try {
      // Pass task_name, deadline, employee_id directly from newTask
      await addTaskToProject(projectId, {
        task_name: newTask.task_name,
        deadline: newTask.deadline,
        employee_id: parseInt(newTask.employee_id), // Ensure it's an integer
        status: "Pending" // Default status for new tasks
      });
      setNewTask({ task_name: '', deadline: '', employee_id: '' });
      setShowAddTask(false);
      // Re-fetch projects to get the updated tasks list
      fetchProjects();
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const handleUpdateTaskStatus = useCallback(async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchProjects(); // Re-fetch projects to update task list
    } catch (error) {
      console.error("Failed to update task status:", error);
      alert("Failed to update task status. Please try again.");
    }
  }, [updateTaskStatus, fetchProjects]);

  const handleEditProject = useCallback(() => {
    setEditMode(true);
  }, []);

  const handleSaveProject = async () => {
    if (!editedProject || !editedProject.project_name || !editedProject.status) {
      alert("Project name and status are required.");
      return;
    }
    try {
      // Send only the fields that can be updated as per schema
      const updateData = {
        project_name: editedProject.project_name,
        status: editedProject.status,
        completion_percentage: parseFloat(editedProject.completion_percentage),
        budget_total: parseFloat(editedProject.budget_total),
        budget_used: parseFloat(editedProject.budget_used),
        budget_status: editedProject.budget_status,
        start_date: editedProject.start_date,
        launch_date: editedProject.launch_date,
        customer_id: editedProject.customer_id
      };
      await updateProject(projectId, updateData);
      setEditMode(false);
      fetchProjects(); // Re-fetch to display updated data
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project. Please try again.");
    }
  };

  const handleCancelEdit = useCallback(() => {
    setEditMode(false);
    setEditedProject(project); // Revert to original project data
  }, [project]);

  const getEmployeeName = useCallback((employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.name : 'Unassigned';
  }, [employees]);


  if (!project) {
    return (
      <div className="main-container">
        <button className="back-button" onClick={() => navigate('/projects')}>
          <FaArrowLeft /> Back to Projects
        </button>
        <p>Project not found</p>
      </div>
    );
  }

  // Filter tasks for the specific project from the nested tasks
  const projectTasks = useMemo(() => project.tasks || [], [project.tasks]);

  return (
    <main className='main-container'>
      <button className="back-button" onClick={() => navigate('/projects')}>
        <FaArrowLeft /> Back to Projects
      </button>

      <div className='details-header'>
        <h2>{project.project_name}</h2>
        <div>
          {!editMode && (
            <button className="add-button" onClick={handleEditProject}>
              <FaEdit /> Edit Project
            </button>
          )}
          {editMode && (
            <>
              <button className="add-button" onClick={handleSaveProject}>
                <FaCheckCircle /> Save
              </button>
              <button className="cancel" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      <div className='details-info'>
        <div className='info-item'>
          <strong>Customer</strong>
          <span>{project.customer ? project.customer.name : 'N/A'}</span>
        </div>
        <div className='info-item'>
          <strong>Status</strong>
          {!editMode ? (
            <span>{renderStatusIcon(project.status)} {project.status}</span>
          ) : (
            <select
              name="status"
              value={editedProject.status}
              onChange={(e) => setEditedProject(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
              <option value="Canceled">Canceled</option>
            </select>
          )}
        </div>
        <div className='info-item'>
          <strong>Completion</strong>
          {!editMode ? (
            <span>{project.completion_percentage || 0}%</span>
          ) : (
            <input
              type="number"
              value={editedProject.completion_percentage || 0}
              onChange={(e) => setEditedProject(prev => ({ ...prev, completion_percentage: parseFloat(e.target.value) }))}
              min="0" max="100"
            />
          )}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${project.completion_percentage || 0}%` }}
            >
              {project.completion_percentage || 0}%
            </div>
          </div>
        </div>
        <div className='info-item'>
          <strong>Budget</strong>
          {!editMode ? (
            <span>${(project.budget_total || 0).toLocaleString()} (Used: ${(project.budget_used || 0).toLocaleString()})</span>
          ) : (
            <>
              <label>Total:</label>
              <input
                type="number"
                value={editedProject.budget_total || 0}
                onChange={(e) => setEditedProject(prev => ({ ...prev, budget_total: parseFloat(e.target.value) }))}
                min="0"
              />
              <label>Used:</label>
              <input
                type="number"
                value={editedProject.budget_used || 0}
                onChange={(e) => setEditedProject(prev => ({ ...prev, budget_used: parseFloat(e.target.value) }))}
                min="0"
              />
            </>
          )}
        </div>
        <div className='info-item'>
          <strong>Dates</strong>
          <span>Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</span>
          <span>Launch: {project.launch_date ? new Date(project.launch_date).toLocaleDateString() : 'N/A'}</span>
          {editMode && (
            <>
              <label>Start Date:</label>
              <input
                type="date"
                value={editedProject.start_date || ''}
                onChange={(e) => setEditedProject(prev => ({ ...prev, start_date: e.target.value }))}
              />
              <label>Launch Date:</label>
              <input
                type="date"
                value={editedProject.launch_date || ''}
                onChange={(e) => setEditedProject(prev => ({ ...prev, launch_date: e.target.value }))}
              />
            </>
          )}
        </div>
      </div>

      <div className='project-section'>
        <h3>Tasks ({projectTasks.length})</h3>
        <button className="add-button" onClick={() => setShowAddTask(!showAddTask)}>
          <FaPlus /> Add New Task
        </button>

        {showAddTask && (
          <div className="form-container">
            <h4>Add New Task</h4>
            <div className="form-group">
              <label>Task Name</label>
              <input
                type="text"
                placeholder="Task name"
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Deadline</label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <select
                value={newTask.employee_id}
                onChange={(e) => setNewTask({ ...newTask, employee_id: e.target.value })}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddTask}>Add Task</button>
            <button className="cancel" onClick={() => setShowAddTask(false)} style={{marginLeft: '10px'}}>Cancel</button>
          </div>
        )}

        {projectTasks.length > 0 ? (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task</th>
                <th>Deadline</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projectTasks.map((task) => (
                <tr key={task.task_id}>
                  <td className={task.status === 'Overdue' ? 'warning' : ''}>
                    {renderStatusIcon(task.status)} {task.status}
                  </td>
                  <td>{task.task_name}</td>
                  <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <FaUser /> {getEmployeeName(task.employee_id)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdateTaskStatus(task.task_id, task.status)}
                      className="add-button"
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    >
                      {task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                    </button>
                    {/* Add delete task functionality if needed */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks for this project.</p>
        )}
      </div>
    </main>
  );
}

export default ProjectDetails;