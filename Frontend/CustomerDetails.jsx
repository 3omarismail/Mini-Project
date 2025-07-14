import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBuilding, FaPhone, FaArrowLeft } from 'react-icons/fa';
import { DataContext } from './DataContext';
import './App.css';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, projects, fetchCustomers, fetchProjects } = useContext(DataContext);
  const [customer, setCustomer] = useState(null);
  const [customerProjects, setCustomerProjects] = useState([]);

  const customerId = parseInt(id);

  useEffect(() => {
    // Ensure data is fetched before trying to find customer/projects
    const fetchData = async () => {
      await fetchCustomers();
      await fetchProjects();
    };
    fetchData();
  }, [fetchCustomers, fetchProjects]);

  // Update customer and projects when `customers` or `projects` from context change
  useEffect(() => {
    if (customers.length > 0) {
      const foundCustomer = customers.find(c => c.customer_id === customerId);
      setCustomer(foundCustomer);

      if (foundCustomer && projects.length > 0) {
        const projectsForCustomer = projects.filter(p => p.customer_id === customerId);
        setCustomerProjects(projectsForCustomer);
      }
    }
  }, [customers, projects, customerId]);


  if (!customer) {
    return (
      <div className="main-container">
        <button className="back-button" onClick={() => navigate('/customers')}>
          <FaArrowLeft /> Back to Customers
        </button>
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <main className='main-container'>
      <button className="back-button" onClick={() => navigate('/customers')}>
        <FaArrowLeft /> Back to Customers
      </button>

      <div className='details-header'>
        <h2>{customer.name}</h2>
        <span className="customer-company">
          <FaBuilding /> {customer.company}
        </span>
      </div>

      <div className='details-info'>
        <div className='info-item'>
          <strong>Contact Information</strong>
          <span><FaEnvelope /> {customer.email}</span>
          <span><FaPhone /> {customer.phone}</span>
        </div>
      </div>

      <div className='customer-section'>
        <h3>Projects ({customerProjects.length})</h3>

        {customerProjects.length > 0 ? (
          <div className="projects-list">
            {customerProjects.map(project => (
              <div
                key={project.project_id}
                className="project-item"
                onClick={() => navigate(`/projects/${project.project_id}`)}
              >
                <h4>{project.project_name}</h4>
                <div className="project-status">
                  <span className={`status-${project.status.toLowerCase().replace(' ', '-')}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-meta">
                  <span>Budget: ${project.budget_total?.toLocaleString() || '0'}</span>
                  <span>Completion: {project.completion_percentage || '0'}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-projects">
            <p>No projects for this customer</p>
          </div>
        )}
      </div>
    </main>
  );
}
export default CustomerDetails;