import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Home';
import Tasks from './Tasks';
import Projects from './Projects';
import Settings from './Settings';
import Login from './Login';
import Alerts from './Alerts';
import ProjectDetails from './ProjectDetails';
import CustomerDetails from './CustomerDetails';
import Customers  from './Customers';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        {/* The tasks route for projects/:id/tasks is redundant if Tasks component can filter by project_id,
            but keeping it for now if there's a specific view for project-related tasks.
            The current Tasks component already aggregates all tasks.
            Consider if ProjectDetails should embed a filtered Tasks list or if /tasks route should handle param. */}
        <Route path="/customers/:id" element={<CustomerDetails />} />
      </Routes>
    </div>
  );
}

export default App;