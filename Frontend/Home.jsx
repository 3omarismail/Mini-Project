import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill, BsMenuButtonWideFill, BsListCheck, BsCurrencyDollar } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    totalBudget: 0,
    totalAlerts: 0
  });

  // Fetch projects data (in a real app, this would be an API call)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulating API call with your sample projects data
        const sampleProjects = [
          {
            id: 1,
            name: "Website Redesign",
            budget: 50000,
            spent: 40000,
            status: "In Progress",
            tasks: 15,
            alerts: 3
          },
          {
            id: 2,
            name: "Marketing Campaign",
            budget: 30000,
            spent: 28000,
            status: "Completed",
            tasks: 10,
            alerts: 0
          },
          {
            id: 3,
            name: "Mobile App Development",
            budget: 75000,
            spent: 60000,
            status: "On Hold",
            tasks: 20,
            alerts: 1
          },
          {
            id: 4,
            name: "CRM Integration",
            budget: 40000,
            spent: 35000,
            status: "In Progress",
            tasks: 12,
            alerts: 2
          }
        ];

        // Calculate stats
        const totalProjects = sampleProjects.length;
        const totalTasks = sampleProjects.reduce((sum, project) => sum + project.tasks, 0);
        const totalBudget = sampleProjects.reduce((sum, project) => sum + project.budget, 0);
        const totalAlerts = sampleProjects.reduce((sum, project) => sum + project.alerts, 0);

        setProjects(sampleProjects);
        setStats({
          totalProjects,
          totalTasks,
          totalBudget,
          totalAlerts
        });
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []); // Empty dependency array means this runs once on mount

  // Memoize chart data to prevent unnecessary recalculations
  const getChartData = useCallback(() => {
    return projects.map(project => ({
      name: project.name,
      budget: project.budget,
      spent: project.spent,
      id: project.id // Include project id for navigation
    }));
  }, [projects]);

  const handleBarClick = useCallback((data, index) => {
    if (data && data.payload && data.payload.id) {
      navigate(`/projects/${data.payload.id}`);
    }
  }, [navigate]);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card' onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>PROJECTS</h3>
            <BsFillArchiveFill className='card_icon' />
          </div>
          <h1>{stats.totalProjects}</h1>
        </div>

        <div className='card' onClick={() => navigate('/tasks')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>TASKS</h3>
            <BsListCheck className='card_icon' />
          </div>
          <h1>{stats.totalTasks}</h1>
        </div>

        <div className='card' onClick={() => navigate('/customers')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className='card_icon' />
          </div>
          <h1>2</h1> {/* Hardcoded for now based on DataContext.jsx */}
        </div>

        <div className='card'>
          <div className='card-inner'>
            <h3>TOTAL BUDGET</h3>
            <BsCurrencyDollar className='card_icon' />
          </div>
          <h1>${stats.totalBudget.toLocaleString()}</h1>
        </div>

        <div className='card' onClick={() => navigate('/alerts')} style={{ cursor: 'pointer' }}>
          <div className='card-inner'>
            <h3>ALERTS</h3>
            <BsFillBellFill className='card_icon' />
          </div>
          <h1>{stats.totalAlerts}</h1>
        </div>
      </div>

      <div className='charts'>
        <div className='chart-container'>
          <h3>Project Budget Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={getChartData()}
    onClick={handleBarClick}
    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
    <Tooltip 
      formatter={(value, name) => {
        // props.payload contains the original data
        const label = name === 'spent' ? 'Spent' : 'Budget';
        return [`$${value.toLocaleString()}`, label];
      }}
      labelFormatter={(name) => `Project: ${name}`}
    />
    <Legend />
    <Bar 
      dataKey="budget" 
      fill="#8884d8" 
      name="Budget"
      onClick={handleBarClick}
    />
    <Bar 
      dataKey="spent" 
      fill="#82ca9d" 
      name="Spent"
      onClick={handleBarClick}
    />
  </BarChart>
</ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Home;