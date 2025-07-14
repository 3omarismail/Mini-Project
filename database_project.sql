-- Create database
CREATE DATABASE IF NOT EXISTS ProjectManagementSystem;
USE ProjectManagementSystem;

-- Create Customers table
CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    company VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20)
);

-- Create Employees table
CREATE TABLE IF NOT EXISTS Employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Create Projects table
CREATE TABLE IF NOT EXISTS Projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(100) NOT NULL,
    customer_id INT,
    status ENUM('Not Started', 'In Progress', 'Completed', 'On Hold') NOT NULL,
    completion_percentage DECIMAL(5,2),
    budget_total DECIMAL(12,2),
    budget_used DECIMAL(12,2),
    budget_status ENUM('Under Budget', 'On Budget', 'Over Budget'),
    start_date DATE,
    launch_date DATE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create Tasks table
CREATE TABLE IF NOT EXISTS Tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    task_name VARCHAR(100) NOT NULL,
    employee_id INT,
    deadline DATE,
    status ENUM('Pending', 'In Progress', 'Completed', 'Overdue') NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (employee_id) REFERENCES Employees(employee_id)
);

-- Create Project_Phases table
CREATE TABLE IF NOT EXISTS Project_Phases (
    phase_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    phase_name VARCHAR(50) NOT NULL,
    status ENUM('Completed', 'In Progress', 'Waiting') NOT NULL,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

-- Create Alerts table
CREATE TABLE IF NOT EXISTS Alerts (
    alert_id INT PRIMARY KEY AUTO_INCREMENT,
    alert_type ENUM('Urgent', 'Warning', 'Info') NOT NULL,
    alert_source ENUM('Project', 'Task', 'System') NOT NULL,
    project_id INT,
    task_id INT,
    message TEXT,
    status ENUM('Read', 'Unread') DEFAULT 'Unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (task_id) REFERENCES Tasks(task_id)
);

-- Create Budget_History table
CREATE TABLE IF NOT EXISTS Budget_History (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    month CHAR(7), -- Format: YYYY-MM
    amount_used DECIMAL(12,2),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);
-- Project_KPIs table: Stores detailed KPI metrics for ML/AI
-- Project_KPIs table: Extended version with more ML-relevant features
CREATE TABLE IF NOT EXISTS Project_KPIs (
    kpi_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    
    -- Core KPIs
    completion_percentage DECIMAL(5,2) DEFAULT 0.0,
    milestone_completion DECIMAL(5,2) DEFAULT 0.0,
    budget_utilization DECIMAL(5,2) DEFAULT 0.0,
    schedule_variance DECIMAL(5,2) DEFAULT 0.0,
    overdue_tasks INT DEFAULT 0,
    alert_count INT DEFAULT 0,

    -- Additional AI/ML-enhancing features
    avg_task_completion_time DECIMAL(6,2) DEFAULT 0.0,      -- in days
    employee_workload_index DECIMAL(5,2) DEFAULT 0.0,       -- normalized workload metric
    customer_priority_level ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    kpi_class ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    reopened_tasks INT DEFAULT 0,
    risk_flag BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
);

