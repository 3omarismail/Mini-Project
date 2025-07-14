import React, { useState, useContext, useEffect, useCallback } from 'react';
import { FaUserCog, FaBell, FaPalette, FaLock, FaSignOutAlt, FaSave } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function Settings() {
  const { currentUser, updateUserPreferences, changePassword, logoutUser, isAuthenticated } = useContext(DataContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    notifications: {
      projectUpdates: currentUser?.preferences?.notifications?.projectUpdates || true,
      taskAssignments: currentUser?.preferences?.notifications?.taskAssignments || true,
      overdueAlerts: currentUser?.preferences?.notifications?.overdueAlerts || true,
    },
    theme: currentUser?.preferences?.theme || 'light',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });
  const [message, setMessage] = useState(''); // For success/error messages

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        notifications: {
          projectUpdates: currentUser.preferences?.notifications?.projectUpdates || true,
          taskAssignments: currentUser.preferences?.notifications?.taskAssignments || true,
          overdueAlerts: currentUser.preferences?.notifications?.overdueAlerts || true,
        },
        theme: currentUser.preferences?.theme || 'light',
      });
    }
  }, [currentUser]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setMessage(''); // Clear messages on input change

    if (name === 'current_password' || name === 'new_password' || name === 'confirm_new_password') {
      setPasswordForm(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }, []);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const success = await updateUserPreferences(formData);
      if (success) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(`Error: ${error.message || 'Failed to update profile.'}`);
    }
  };

  const handleSubmitSecurity = async (e) => {
    e.preventDefault();
    setMessage('');
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setMessage('New password and confirmation do not match.');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      setMessage('New password must be at least 8 characters long.');
      return;
    }

    try {
      await changePassword(passwordForm.current_password, passwordForm.new_password);
      setMessage('Password updated successfully!');
      setPasswordForm({ current_password: '', new_password: '', confirm_new_password: '' }); // Clear form
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage(`Error: ${error.message || 'Failed to change password.'}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="main-container">
        <p>Please log in to view settings.</p>
      </main>
    );
  }

  return (
    <main className='main-container'>
      <div className='settings-container'>
        <aside className='settings-sidebar'>
          <ul>
            <li>
              <button
                className={activeTab === 'profile' ? 'active' : ''}
                onClick={() => setActiveTab('profile')}
              >
                <FaUserCog /> Profile Settings
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'notifications' ? 'active' : ''}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell /> Notification Preferences
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'theme' ? 'active' : ''}
                onClick={() => setActiveTab('theme')}
              >
                <FaPalette /> Theme Settings
              </button>
            </li>
            <li>
              <button
                className={activeTab === 'security' ? 'active' : ''}
                onClick={() => setActiveTab('security')}
              >
                <FaLock /> Security
              </button>
            </li>
            <li>
              <button onClick={logoutUser}>
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </ul>
        </aside>

        <div className='settings-content'>
          {message && (
            <div style={{ color: message.startsWith('Error') ? 'red' : 'green', marginBottom: '15px' }}>
              {message}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSubmitProfile}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <button type="submit" className="save-button">
                <FaSave /> Save Profile
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSubmitProfile}> {/* Using the same handleSubmit for profile updates */}
              <div className="form-section">
                <h3>Notification Preferences</h3>
                <div className="form-group">
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="projectUpdates"
                        checked={formData.notifications.projectUpdates}
                        onChange={handleInputChange}
                      />
                      Project Updates
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="taskAssignments"
                        checked={formData.notifications.taskAssignments}
                        onChange={handleInputChange}
                      />
                      Task Assignments
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="overdueAlerts"
                        checked={formData.notifications.overdueAlerts}
                        onChange={handleInputChange}
                      />
                      Overdue Alerts
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="save-button">
                <FaSave /> Save Notifications
              </button>
            </form>
          )}

          {activeTab === 'theme' && (
            <form onSubmit={handleSubmitProfile}> {/* Using the same handleSubmit for profile updates */}
              <div className="form-section">
                <h3>Theme Settings</h3>
                <div className="form-group">
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="light"
                        checked={formData.theme === 'light'}
                        onChange={handleInputChange}
                      />
                      Light Theme
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="dark"
                        checked={formData.theme === 'dark'}
                        onChange={handleInputChange}
                      />
                      Dark Theme
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="theme"
                        value="system"
                        checked={formData.theme === 'system'}
                        onChange={handleInputChange}
                      />
                      System Default
                    </label>
                  </div>
                </div>
              </div>
              <button type="submit" className="save-button">
                <FaSave /> Save Theme
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSubmitSecurity}>
              <div className="form-section">
                <h3>Security Settings</h3>
                <div className="form-group">
                  <label htmlFor="current_password">Current Password</label>
                  <input
                    type="password"
                    id="current_password"
                    name="current_password"
                    value={passwordForm.current_password}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="new_password">New Password</label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_new_password">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirm_new_password"
                    name="confirm_new_password"
                    value={passwordForm.confirm_new_password}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="save-button">
                <FaSave /> Update Password
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

export default Settings;