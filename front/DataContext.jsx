import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:8000";

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [currentUser, setCurrentUser] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [employees, setEmployees] = useState([]);

  const loginUser = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setIsAuthenticated(true);
      await fetchCurrentUser(data.access_token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('token');
      throw error;
    }
  }, [API_URL]);

  const logoutUser = useCallback(() => {
    setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchCurrentUser = useCallback(async (authToken = token) => {
    if (!authToken) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logoutUser();
        }
        throw new Error('Failed to fetch current user');
      }
      const data = await response.json();
      setCurrentUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching current user:", error);
      logoutUser();
    }
  }, [API_URL, token, logoutUser]);

  const updateUserPreferences = useCallback(async (updatedPreferences) => {
    if (!token || !currentUser) return false;
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ preferences: updatedPreferences.preferences, name: updatedPreferences.name, email: updatedPreferences.email }),
      });
      if (!response.ok) {
        throw new Error('Failed to update user preferences');
      }
      const data = await response.json();
      setCurrentUser(data);
      return true;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      return false;
    }
  }, [API_URL, token, currentUser]);

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (!token) throw new Error('Not authenticated.');
    try {
      const response = await fetch(`${API_URL}/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }, [API_URL, token]);

  const fetchData = useCallback(async (endpoint, setter) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) logoutUser();
        throw new Error(`Failed to fetch ${endpoint}`);
      }
      const data = await response.json();
      setter(data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }, [API_URL, token, logoutUser]);

  const createItem = useCallback(async (endpoint, itemData) => {
    if (!token) throw new Error('Not authenticated.');
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to create item at ${endpoint}`);
    }
    return response.json();
  }, [API_URL, token]);

  const updateItem = useCallback(async (endpoint, id, itemData) => {
    if (!token) throw new Error('Not authenticated.');
    const response = await fetch(`${API_URL}${endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to update item at ${endpoint}/${id}`);
    }
    return response.json();
  }, [API_URL, token]);

  const deleteItem = useCallback(async (endpoint, id) => {
    if (!token) throw new Error('Not authenticated.');
    const response = await fetch(`${API_URL}${endpoint}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to delete item at ${endpoint}/${id}`);
    }
    return true;
  }, [API_URL, token]);

  const fetchCustomers = useCallback(() => fetchData('/customers/', setCustomers), [fetchData]);
  const fetchProjects = useCallback(() => fetchData('/projects/', setProjects), [fetchData]);
  const fetchTasks = useCallback(() => fetchData('/tasks/', setTasks), [fetchData]);
  const fetchAlerts = useCallback(() => fetchData('/alerts/', setAlerts), [fetchData]);
  const fetchEmployees = useCallback(() => fetchData('/employees/', setEmployees), [fetchData]);

  const addProject = useCallback(async (projectData) => {
    const newProject = await createItem('/projects/', projectData);
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, [createItem]);

  const updateProject = useCallback(async (id, projectData) => {
    const updatedProject = await updateItem('/projects/', id, projectData);
    setProjects(prev => prev.map(p => p.project_id === id ? updatedProject : p));
    return updatedProject;
  }, [updateItem]);

  const addTaskToProject = useCallback(async (projectId, taskData) => {
    const newTask = await createItem('/tasks/', { ...taskData, project_id: projectId });
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [createItem]);

  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    const updatedTask = await updateItem('/tasks/', taskId, { status: newStatus });
    setTasks(prev => prev.map(t => t.task_id === taskId ? updatedTask : t));
    return updatedTask;
  }, [updateItem]);

  const updateAlert = useCallback(async (alertId, alertData) => {
    const updatedAlert = await updateItem('/alerts/', alertId, alertData);
    setAlerts(prev => prev.map(a => a.alert_id === alertId ? updatedAlert : a));
    return updatedAlert;
  }, [updateItem]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentUser();
      fetchCustomers();
      fetchProjects();
      fetchTasks();
      fetchAlerts();
      fetchEmployees();
    } else {
      setCustomers([]);
      setProjects([]);
      setTasks([]);
      setAlerts([]);
      setEmployees([]);
      setCurrentUser(null);
    }
  }, [isAuthenticated, fetchCurrentUser, fetchCustomers, fetchProjects, fetchTasks, fetchAlerts, fetchEmployees]);

  const contextValue = useMemo(() => ({
    customers,
    projects,
    tasks,
    alerts,
    employees,
    addProject,
    updateProject,
    addTaskToProject,
    updateTaskStatus,
    updateAlert,
    currentUser,
    updateUserPreferences,
    changePassword,
    loginUser,
    logoutUser,
    isAuthenticated,
    token,
    fetchCustomers,
    fetchProjects,
    fetchTasks,
    fetchAlerts,
    fetchEmployees,
    API_URL,
  }), [
    customers, projects, tasks, alerts, employees, addProject, updateProject,
    addTaskToProject, updateTaskStatus, updateAlert, currentUser,
    updateUserPreferences, changePassword, loginUser, logoutUser, isAuthenticated, token,
    fetchCustomers, fetchProjects, fetchTasks, fetchAlerts, fetchEmployees, API_URL
  ]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};