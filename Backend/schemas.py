# Backend/schemas.py
from pydantic import BaseModel, EmailStr, Field, computed_field
from datetime import date
from typing import Optional, Dict, Any
import json

class EmployeePreferences(BaseModel):
    notifications: Dict[str, bool] = {"projectUpdates": True, "taskAssignments": True, "overdueAlerts": True}
    theme: str = "light"

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    position: str
    status: str

class EmployeeCreate(EmployeeBase):
    hire_date: date
    preferences: Optional[EmployeePreferences] = None

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    position: Optional[str] = None
    status: Optional[str] = None
    hire_date: Optional[date] = None
    preferences: Optional[EmployeePreferences] = None

class Employee(EmployeeBase):
    employee_id: int
    hire_date: date
    preferences: Dict[str, Any] = {}
    
    @computed_field
    @property
    def id(self) -> int:
        return self.employee_id
    
    class Config:
        from_attributes = True

class CustomerBase(BaseModel):
    name: str
    company: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    company: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class Customer(CustomerBase):
    customer_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.customer_id
    
    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    project_name: str
    customer_id: int
    status: str = "Not Started"
    budget_total: float
    start_date: date
    completion_percentage: Optional[float] = 0.0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    customer: Optional[str] = None
    status: Optional[str] = None
    budget_total: Optional[float] = None
    start_date: Optional[date] = None
    completion_percentage: Optional[float] = None

class Project(ProjectBase):
    project_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.project_id
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    task_name: str
    project_id: int
    employee_id: Optional[int] = None
    deadline: Optional[date] = None
    status: str = "Pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    task_name: Optional[str] = None
    project_id: Optional[int] = None
    employee_id: Optional[int] = None
    deadline: Optional[date] = None
    status: Optional[str] = None

class Task(TaskBase):
    task_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.task_id
    
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    alert_type: str
    alert_source: Optional[str] = None
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    message: str
    status: str = "Unread"

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    alert_type: Optional[str] = None
    alert_source: Optional[str] = None
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    message: Optional[str] = None
    status: Optional[str] = None

class Alert(AlertBase):
    alert_id: int
    timestamp: date
    
    @computed_field
    @property
    def id(self) -> int:
        return self.alert_id
    
    class Config:
        from_attributes = True

class BudgetHistoryBase(BaseModel):
    project_id: int
    month: str
    amount_used: float

class BudgetHistoryCreate(BudgetHistoryBase):
    pass

class BudgetHistory(BudgetHistoryBase):
    history_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.history_id
    
    class Config:
        from_attributes = True

class ProjectKpiBase(BaseModel):
    project_id: int
    completion_percentage: float = 0.0
    milestone_completion: float = 0.0
    budget_utilization: float = 0.0
    schedule_variance: float = 0.0
    overdue_tasks: int = 0
    alert_count: int = 0
    avg_task_completion_time: float = 0.0
    employee_workload_index: float = 0.0
    customer_priority_level: str = "Medium"
    reopened_tasks: int = 0
    risk_flag: bool = False
    kpi_class: str = "Medium"

class ProjectKpiCreate(ProjectKpiBase):
    pass

class ProjectKpiUpdate(BaseModel):
    completion_percentage: Optional[float] = None
    milestone_completion: Optional[float] = None
    budget_utilization: Optional[float] = None
    schedule_variance: Optional[float] = None
    overdue_tasks: Optional[int] = None
    alert_count: Optional[int] = None
    avg_task_completion_time: Optional[float] = None
    employee_workload_index: Optional[float] = None
    customer_priority_level: Optional[str] = None
    reopened_tasks: Optional[int] = None
    risk_flag: Optional[bool] = None
    kpi_class: Optional[str] = None

class ProjectKpi(ProjectKpiBase):
    kpi_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.kpi_id
    
    class Config:
        from_attributes = True