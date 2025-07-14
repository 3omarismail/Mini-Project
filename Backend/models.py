from sqlalchemy import Column, Integer, String, Date, DECIMAL, Enum, ForeignKey, Text, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Customer(Base):
    __tablename__ = "Customers"
    customer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    company = Column(String(100))
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    projects = relationship("Project", back_populates="customer")

class Employee(Base):
    __tablename__ = "Employees"
    employee_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    preferences = Column(Text, default='{"notifications": {"projectUpdates": true, "taskAssignments": true, "overdueAlerts": true}, "theme": "light"}')
    tasks = relationship("Task", back_populates="employee")

class Project(Base):
    __tablename__ = "Projects"
    project_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_name = Column(String(100), nullable=False)
    customer_id = Column(Integer, ForeignKey("Customers.customer_id"))
    status = Column(Enum('Not Started', 'In Progress', 'Completed', 'On Hold', 'Canceled'), nullable=False)
    completion_percentage = Column(DECIMAL(5,2))
    budget_total = Column(DECIMAL(12,2))
    budget_used = Column(DECIMAL(12,2))
    budget_status = Column(Enum('Under Budget', 'On Budget', 'Over Budget'))
    start_date = Column(Date)
    launch_date = Column(Date)
    customer = relationship("Customer", back_populates="projects")
    tasks = relationship("Task", back_populates="project")
    alerts = relationship("Alert", back_populates="project")
    budget_history = relationship("Budget_History", back_populates="project")
    kpis = relationship("Project_KPI", back_populates="project")

class Task(Base):
    __tablename__ = "Tasks"
    task_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("Projects.project_id"))
    task_name = Column(String(100), nullable=False)
    employee_id = Column(Integer, ForeignKey("Employees.employee_id"))
    deadline = Column(Date)
    status = Column(Enum('Pending', 'In Progress', 'Completed', 'Overdue'), nullable=False)
    project = relationship("Project", back_populates="tasks")
    employee = relationship("Employee", back_populates="tasks")
    alerts = relationship("Alert", back_populates="task")

class Alert(Base):
    __tablename__ = "Alerts"
    alert_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    alert_type = Column(Enum('Urgent', 'Warning', 'Info'), nullable=False)
    alert_source = Column(String(50))
    project_id = Column(Integer, ForeignKey("Projects.project_id"))
    task_id = Column(Integer, ForeignKey("Tasks.task_id"))
    message = Column(Text)
    status = Column(Enum('Read', 'Unread'), nullable=False, default='Unread')
    timestamp = Column(TIMESTAMP, server_default=func.now())
    project = relationship("Project", back_populates="alerts")
    task = relationship("Task", back_populates="alerts")

class Budget_History(Base):
    __tablename__ = "Budget_History"
    history_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("Projects.project_id"))
    month = Column(String(7))
    amount_used = Column(DECIMAL(12,2))
    project = relationship("Project", back_populates="budget_history")

class Project_KPI(Base):
    __tablename__ = "Project_KPIs"
    kpi_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("Projects.project_id"), nullable=False)
    completion_percentage = Column(DECIMAL(5,2), default=0.0)
    milestone_completion = Column(DECIMAL(5,2), default=0.0)
    budget_utilization = Column(DECIMAL(5,2), default=0.0)
    schedule_variance = Column(DECIMAL(5,2), default=0.0)
    overdue_tasks = Column(Integer, default=0)
    alert_count = Column(Integer, default=0)
    avg_task_completion_time = Column(DECIMAL(6,2), default=0.0)
    employee_workload_index = Column(DECIMAL(5,2), default=0.0)
    customer_priority_level = Column(Enum('Low', 'Medium', 'High'), default='Medium')
    kpi_class = Column(Enum('Low', 'Medium', 'High'), default='Medium')
    reopened_tasks = Column(Integer, default=0)
    risk_flag = Column(Boolean, default=False)
    project = relationship("Project", back_populates="kpis")