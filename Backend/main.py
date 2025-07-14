from fastapi import FastAPI, Depends, HTTPException, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Project Management System Backend",
    description="API for managing customers, projects, tasks, employees, and alerts.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Project Management Dashboard API!"}

# --- Employee Endpoints ---
@app.post("/api/employees/", response_model=schemas.Employee, status_code=status.HTTP_201_CREATED)
def create_employee(employee: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    db_employee = crud.get_employee_by_email(db, email=employee.email)
    if db_employee:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_employee(db=db, employee=employee)

@app.get("/api/employees/", response_model=List[schemas.Employee])
def read_employees(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employees = crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.get("/api/employees/{employee_id}", response_model=schemas.Employee)
def read_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = crud.get_employee(db, employee_id=employee_id)
    if employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@app.put("/api/employees/{employee_id}", response_model=schemas.Employee)
def update_employee(employee_id: int, employee_update: schemas.EmployeeUpdate, db: Session = Depends(get_db)):
    updated_employee = crud.update_employee(db, employee_id, employee_update)
    if not updated_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated_employee

@app.delete("/api/employees/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = crud.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# --- Customer Endpoints ---
@app.post("/api/customers/", response_model=schemas.Customer, status_code=status.HTTP_201_CREATED)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db=db, customer=customer)

@app.get("/api/customers/", response_model=List[schemas.Customer])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    customers = crud.get_customers(db, skip=skip, limit=limit)
    return customers

@app.get("/api/customers/{customer_id}", response_model=schemas.Customer)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id=customer_id)
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/api/customers/{customer_id}", response_model=schemas.Customer)
def update_customer(customer_id: int, customer_update: schemas.CustomerUpdate, db: Session = Depends(get_db)):
    db_customer = crud.update_customer(db, customer_id=customer_id, customer_update=customer_update)
    if db_customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return db_customer

@app.delete("/api/customers/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    success = crud.delete_customer(db, customer_id=customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Customer not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# --- Project Endpoints ---
@app.post("/api/projects/", response_model=schemas.Project, status_code=status.HTTP_201_CREATED)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.get("/api/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    project = crud.get_project(db, project_id=project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@app.put("/api/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project_update: schemas.ProjectUpdate, db: Session = Depends(get_db)):
    updated_project = crud.update_project(db, project_id, project_update)
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

@app.delete("/api/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db)):
    success = crud.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

# --- Task Endpoints ---
@app.post("/api/tasks/", response_model=schemas.Task, status_code=status.HTTP_201_CREATED)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db=db, task=task)

@app.get("/api/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks

@app.get("/api/tasks/{task_id}", response_model=schemas.Task)
def read_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task(db, task_id=task_id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.put("/api/tasks/{task_id}", response_model=schemas.Task)
def update_task(task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(get_db)):
    updated_task = crud.update_task(db, task_id, task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    success = crud.delete_task(db, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

# --- Alert Endpoints ---
@app.post("/api/alerts/", response_model=schemas.Alert, status_code=status.HTTP_201_CREATED)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    return crud.create_alert(db=db, alert=alert)

@app.get("/api/alerts/", response_model=List[schemas.Alert])
def read_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = crud.get_alerts(db, skip=skip, limit=limit)
    return alerts

@app.get("/api/alerts/{alert_id}", response_model=schemas.Alert)
def read_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = crud.get_alert(db, alert_id=alert_id)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@app.put("/api/alerts/{alert_id}", response_model=schemas.Alert)
def update_alert(alert_id: int, alert_update: schemas.AlertUpdate, db: Session = Depends(get_db)):
    updated_alert = crud.update_alert(db, alert_id, alert_update)
    if not updated_alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return updated_alert

@app.delete("/api/alerts/{alert_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_alert(alert_id: int, db: Session = Depends(get_db)):
    success = crud.delete_alert(db, alert_id)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

# --- Budget History Endpoints ---
@app.post("/api/budget-history/", response_model=schemas.BudgetHistory, status_code=status.HTTP_201_CREATED)
def create_budget_history(budget_history: schemas.BudgetHistoryCreate, db: Session = Depends(get_db)):
    return crud.create_budget_history(db=db, budget_history=budget_history)

@app.get("/api/budget-history/", response_model=List[schemas.BudgetHistory])
def read_budget_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    history = crud.get_budget_histories(db, skip=skip, limit=limit)
    return history

@app.get("/api/budget-history/{history_id}", response_model=schemas.BudgetHistory)
def read_budget_history_item(history_id: int, db: Session = Depends(get_db)):
    history_item = crud.get_budget_history(db, history_id=history_id)
    if history_item is None:
        raise HTTPException(status_code=404, detail="Budget history not found")
    return history_item

# --- Project KPI Endpoints ---
@app.post("/api/project-kpis/", response_model=schemas.ProjectKpi, status_code=status.HTTP_201_CREATED)
def create_project_kpi(kpi: schemas.ProjectKpiCreate, db: Session = Depends(get_db)):
    return crud.create_project_kpi(db=db, kpi=kpi)

@app.get("/api/project-kpis/", response_model=List[schemas.ProjectKpi])
def read_project_kpis(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    kpis = crud.get_project_kpis(db, skip=skip, limit=limit)
    return kpis

@app.get("/api/project-kpis/{kpi_id}", response_model=schemas.ProjectKpi)
def read_project_kpi(kpi_id: int, db: Session = Depends(get_db)):
    kpi = crud.get_project_kpi(db, kpi_id=kpi_id)
    if kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return kpi

@app.put("/api/project-kpis/{kpi_id}", response_model=schemas.ProjectKpi)
def update_project_kpi(kpi_id: int, kpi_update: schemas.ProjectKpiUpdate, db: Session = Depends(get_db)):
    updated_kpi = crud.update_project_kpi(db, kpi_id, kpi_update)
    if not updated_kpi:
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return updated_kpi

@app.delete("/api/project-kpis/{kpi_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_kpi(kpi_id: int, db: Session = Depends(get_db)):
    success = crud.delete_project_kpi(db, kpi_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project KPI not found")
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT)

# --- KPI Classification Endpoint ---
@app.post("/api/projects/{project_id}/classify-kpi", response_model=schemas.ProjectKpi)
def trigger_kpi_classification(project_id: int, db: Session = Depends(get_db)):
    db_kpi = crud.classify_and_update_project_kpi_class(db, project_id=project_id)
    if db_kpi is None:
        raise HTTPException(status_code=404, detail="Project KPI not found or classification failed")
    return db_kpi