import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { FaBell, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaFilter, FaSearch } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Alerts() {
  const { alerts, projects, fetchAlerts, updateAlert } = useContext(DataContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'urgent', 'resolved'

  useEffect(() => {
    fetchAlerts(); // Fetch alerts when component mounts
  }, [fetchAlerts]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Urgent":
        return <FaExclamationTriangle />;
      case "Warning":
        return <FaBell />;
      case "Info":
        return <FaInfoCircle />;
      case "Read": // Assuming "resolved" could map to "Read" or a specific status
      case "Resolved":
        return <FaCheckCircle />;
      default:
        return <FaBell />;
    }
  };

  const markAsRead = useCallback(async (alertId) => {
    try {
      await updateAlert(alertId, { status: "Read" });
    } catch (error) {
      console.error("Failed to mark alert as read:", error);
      // Optionally show an error message to the user
    }
  }, [updateAlert]);

  const filteredAlerts = useMemo(() => {
    let currentAlerts = alerts;

    if (filter !== 'all') {
      currentAlerts = currentAlerts.filter(alert => {
        if (filter === 'unread') return alert.status === 'Unread';
        if (filter === 'resolved') return alert.status === 'Read'; // Or specific 'Resolved' status if applicable
        return alert.alert_type.toLowerCase() === filter;
      });
    }

    if (searchTerm) {
      currentAlerts = currentAlerts.filter(alert =>
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alert.project && alert.project.project_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return currentAlerts;
  }, [alerts, filter, searchTerm, projects]); // Added projects to dependency array

  return (
    <main className='main-container'>
      <div className='alerts-container'>
        <div className="alerts-header">
          <h2>Alerts</h2>
          <div className="alerts-controls">
            <div className="alerts-filter">
              <FaFilter className="icon" />
              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="unread">Unread</option>
                <option value="urgent">Urgent</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="read">Read</option>
              </select>
            </div>
            <div className="alerts-search">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="alerts-list">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div
                key={alert.alert_id}
                className={`alert-card ${alert.status.toLowerCase()} ${alert.status === 'Read' ? 'read' : 'unread'}`}
                onClick={() => alert.status === 'Unread' && markAsRead(alert.alert_id)}
              >
                <div className="alert-icon">
                  {renderStatusIcon(alert.alert_type || alert.status)}
                </div>
                <div className="alert-content">
                  <h4>{alert.alert_type} Alert: {alert.alert_source}</h4>
                  <p>{alert.message}</p>
                  <div className="alert-meta">
                    <span className="timestamp">
                      {new Date(alert.timestamp).toLocaleDateString()} at {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    {alert.project_id && (
                      <span className="project-badge">
                        Project: {projects.find(p => p.project_id === alert.project_id)?.project_name || 'Unknown'}
                      </span>
                    )}
                    {alert.task_id && (
                      <span className="task-badge">
                        Task: {alert.task?.task_name || 'Unknown'}
                      </span>
                    )}
                  </div>
                </div>
                {alert.status === 'Unread' && <div className="unread-badge"></div>}
              </div>
            ))
          ) : (
            <div className="no-alerts">
              <p>No alerts match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Alerts;