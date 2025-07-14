# Backend/crud.py

from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi import HTTPException
import models, schemas
from llama_kpi_agent import Llama3Client

llama_client = Llama3Client()

# --- Employee CRUD ---
def get_employee(db: Session, employee_id: int):
    return db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(models.Employee).filter(models.Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(
        name=employee.name,
        email=employee.email,
        password_hash=employee.password_hash
    )
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def update_employee(db: Session, employee_id: int, employee_update: schemas.EmployeeUpdate):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if not db_employee:
        return None
    
    update_data = employee_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = db.query(models.Employee).filter(models.Employee.employee_id == employee_id).first()
    if db_employee:
        db.delete(db_employee)
        db.commit()
        return True
    return False

# --- Customer CRUD ---
def get_customer(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Customer).offset(skip).limit(limit).all()

def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def update_customer(db: Session, customer_id: int, customer_update: schemas.CustomerUpdate):
    db_customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if not db_customer:
        return None
    
    update_data = customer_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_customer, field, value)
    
    db.commit()
    db.refresh(db_customer)
    return db_customer

def delete_customer(db: Session, customer_id: int):
    db_customer = db.query(models.Customer).filter(models.Customer.customer_id == customer_id).first()
    if db_customer:
        db.delete(db_customer)
        db.commit()
        return True
    return False

# --- Project CRUD ---
def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.project_id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project_update: schemas.ProjectUpdate):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if not db_project:
        return None
    
    update_data = project_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = db.query(models.Project).filter(models.Project.project_id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# --- Task CRUD ---
def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.task_id == task_id).first()

def get_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if not db_task:
        return None
    
    update_data = task_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False

# --- Project Phase CRUD ---
def get_project_phase(db: Session, phase_id: int):
    return db.query(models.Project_Phase).filter(models.Project_Phase.phase_id == phase_id).first()

def get_project_phases(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project_Phase).offset(skip).limit(limit).all()

def get_project_phases_by_project(db: Session, project_id: int):
    return db.query(models.Project_Phase).filter(models.Project_Phase.project_id == project_id).all()

def create_project_phase(db: Session, phase: schemas.ProjectPhaseCreate):
    db_phase = models.Project_Phase(**phase.model_dump())
    db.add(db_phase)
    db.commit()
    db.refresh(db_phase)
    return db_phase

def update_project_phase(db: Session, phase_id: int, phase_update: schemas.ProjectPhaseUpdate):
    db_phase = db.query(models.Project_Phase).filter(models.Project_Phase.phase_id == phase_id).first()
    if not db_phase:
        return None
    
    update_data = phase_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_phase, field, value)
    
    db.commit()
    db.refresh(db_phase)
    return db_phase

def delete_project_phase(db: Session, phase_id: int):
    db_phase = db.query(models.Project_Phase).filter(models.Project_Phase.phase_id == phase_id).first()
    if db_phase:
        db.delete(db_phase)
        db.commit()
        return True
    return False

# --- Alert CRUD ---
def get_alert(db: Session, alert_id: int):
    return db.query(models.Alert).filter(models.Alert.alert_id == alert_id).first()

def get_alerts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Alert).offset(skip).limit(limit).all()

def create_alert(db: Session, alert: schemas.AlertCreate):
    db_alert = models.Alert(**alert.model_dump())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def update_alert(db: Session, alert_id: int, alert_update: schemas.AlertUpdate):
    db_alert = db.query(models.Alert).filter(models.Alert.alert_id == alert_id).first()
    if not db_alert:
        return None
    
    update_data = alert_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_alert, field, value)
    
    db.commit()
    db.refresh(db_alert)
    return db_alert

def delete_alert(db: Session, alert_id: int):
    db_alert = db.query(models.Alert).filter(models.Alert.alert_id == alert_id).first()
    if db_alert:
        db.delete(db_alert)
        db.commit()
        return True
    return False

# --- Budget History CRUD ---
def get_budget_history(db: Session, history_id: int):
    return db.query(models.Budget_History).filter(models.Budget_History.history_id == history_id).first()

def get_budget_histories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Budget_History).offset(skip).limit(limit).all()

def get_budget_history_by_project(db: Session, project_id: int):
    return db.query(models.Budget_History).filter(models.Budget_History.project_id == project_id).all()

def create_budget_history(db: Session, budget_history: schemas.BudgetHistoryCreate):
    db_budget_history = models.Budget_History(**budget_history.model_dump())
    db.add(db_budget_history)
    db.commit()
    db.refresh(db_budget_history)
    return db_budget_history

def update_budget_history(db: Session, history_id: int, budget_update: schemas.BudgetHistoryUpdate):
    db_budget_history = db.query(models.Budget_History).filter(models.Budget_History.history_id == history_id).first()
    if not db_budget_history:
        return None
    
    update_data = budget_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_budget_history, field, value)
    
    db.commit()
    db.refresh(db_budget_history)
    return db_budget_history

def delete_budget_history(db: Session, history_id: int):
    db_budget_history = db.query(models.Budget_History).filter(models.Budget_History.history_id == history_id).first()
    if db_budget_history:
        db.delete(db_budget_history)
        db.commit()
        return True
    return False

# --- Project KPI CRUD ---
def get_project_kpi(db: Session, kpi_id: int):
    return db.query(models.Project_KPI).filter(models.Project_KPI.kpi_id == kpi_id).first()

def get_project_kpis(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project_KPI).offset(skip).limit(limit).all()

def get_project_kpi_by_project(db: Session, project_id: int):
    return db.query(models.Project_KPI).filter(models.Project_KPI.project_id == project_id).first()

def create_project_kpi(db: Session, kpi: schemas.ProjectKpiCreate):
    db_kpi = models.Project_KPI(**kpi.model_dump())
    db.add(db_kpi)
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

def update_project_kpi(db: Session, kpi_id: int, kpi_update: schemas.ProjectKpiUpdate):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.kpi_id == kpi_id).first()
    if not db_kpi:
        return None
    
    update_data = kpi_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_kpi, field, value)
    
    db.commit()
    db.refresh(db_kpi)
    return db_kpi

def delete_project_kpi(db: Session, kpi_id: int):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.kpi_id == kpi_id).first()
    if db_kpi:
        db.delete(db_kpi)
        db.commit()
        return True
    return False

# --- Llama3 Integration for KPI Classification ---
def classify_and_update_project_kpi_class(db: Session, project_id: int):
    db_kpi = db.query(models.Project_KPI).filter(models.Project_KPI.project_id == project_id).first()
    if not db_kpi:
        return None

    kpi_data = {
        "completion_percentage": float(db_kpi.completion_percentage or 0),
        "milestone_completion": float(db_kpi.milestone_completion or 0),
        "budget_utilization": float(db_kpi.budget_utilization or 0),
        "schedule_variance": float(db_kpi.schedule_variance or 0),
        "overdue_tasks": db_kpi.overdue_tasks or 0,
        "alert_count": db_kpi.alert_count or 0,
        "avg_task_completion_time": float(db_kpi.avg_task_completion_time or 0),
        "employee_workload_index": float(db_kpi.employee_workload_index or 0),
        "customer_priority_level": 1 if db_kpi.customer_priority_level == 'High' else 2 if db_kpi.customer_priority_level == 'Medium' else 3,
        "reopened_tasks": db_kpi.reopened_tasks or 0,
        "risk_flag": bool(db_kpi.risk_flag or False)
    }

    try:
        kpi_class_prediction = llama_client.classify_kpi_class(**kpi_data)
        db_kpi.kpi_class = kpi_class_prediction
        db.commit()
        db.refresh(db_kpi)
        return db_kpi
    except Exception as e:
        print(f"Error classifying KPI for project {project_id}: {e}")
        return None