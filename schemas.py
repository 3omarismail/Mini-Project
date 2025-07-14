# Backend/schemas.py
from pydantic import BaseModel, EmailStr, Field, computed_field
from datetime import date, datetime
from typing import Optional, Dict, Any
import json

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    password_hash: str

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password_hash: Optional[str] = None

class Employee(EmployeeBase):
    employee_id: int
    
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
    completion_percentage: Optional[float] = None
    budget_total: Optional[float] = None
    budget_used: Optional[float] = None
    budget_status: Optional[str] = None
    start_date: Optional[date] = None
    launch_date: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = None
    customer_id: Optional[int] = None
    status: Optional[str] = None
    completion_percentage: Optional[float] = None
    budget_total: Optional[float] = None
    budget_used: Optional[float] = None
    budget_status: Optional[str] = None
    start_date: Optional[date] = None
    launch_date: Optional[date] = None

class Project(ProjectBase):
    project_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.project_id
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    project_id: int
    task_name: str
    employee_id: Optional[int] = None
    deadline: Optional[date] = None
    status: str = "Pending"

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    project_id: Optional[int] = None
    task_name: Optional[str] = None
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

class ProjectPhaseBase(BaseModel):
    project_id: int
    phase_name: str
    status: str = "Waiting"

class ProjectPhaseCreate(ProjectPhaseBase):
    pass

class ProjectPhaseUpdate(BaseModel):
    project_id: Optional[int] = None
    phase_name: Optional[str] = None
    status: Optional[str] = None

class ProjectPhase(ProjectPhaseBase):
    phase_id: int
    
    @computed_field
    @property
    def id(self) -> int:
        return self.phase_id
    
    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    alert_type: str
    alert_source: str
    project_id: Optional[int] = None
    task_id: Optional[int] = None
    message: Optional[str] = None
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
    created_at: datetime
    
    @computed_field
    @property
    def id(self) -> int:
        return self.alert_id
    
    class Config:
        from_attributes = True

class BudgetHistoryBase(BaseModel):
    project_id: int
    month: str  # Format: YYYY-MM
    amount_used: float

class BudgetHistoryCreate(BudgetHistoryBase):
    pass

class BudgetHistoryUpdate(BaseModel):
    project_id: Optional[int] = None
    month: Optional[str] = None
    amount_used: Optional[float] = None

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
    created_at: datetime
    
    @computed_field
    @property
    def id(self) -> int:
        return self.kpi_id
    
    class Config:
        from_attributes = True