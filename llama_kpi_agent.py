# Backend/llama_kpi_agent.py

import json
from typing import Dict, Any

from fastapi import requests

class Llama3Client:
    """
    A client to interact with a local Llama3 agent for KPI classification.
    """
    def __init__(self, api_url: str = "http://localhost:11434/api/generate", model_name: str = "llama3"):
        """
        Initializes the Llama3Client.

        Args:
            api_url (str): The URL of your local Llama3 API endpoint.
                           Defaults to 'http://localhost:11434/api/generate' for Ollama.
            model_name (str): The name of the Llama3 model you're using (e.g., 'llama3').
        """
        self.api_url = api_url
        self.model_name = model_name

    def classify_kpi_class(
        self,
        completion_percentage: float,
        milestone_completion: float,
        budget_utilization: float,
        schedule_variance: float,
        overdue_tasks: int,
        alert_count: int,
        avg_task_completion_time: float,
        employee_workload_index: float,
        customer_priority_level: int,
        reopened_tasks: int,
        risk_flag: bool
    ) -> str:
        """
        Classifies the KPI class of a project (Low, Medium, or High) using a local Llama3 agent.

        Args:
            completion_percentage (float): Percentage of project completion (0-100).
            milestone_completion (float): Percentage of milestones completed (0-100).
            budget_utilization (float): Percentage of budget utilized (0-100+).
            schedule_variance (float): Variance from schedule (e.g., in days).
                                       Positive means ahead, negative means behind.
            overdue_tasks (int): Number of tasks currently overdue.
            alert_count (int): Number of active alerts or critical issues.
            avg_task_completion_time (float): Average time to complete a task (e.g., in days).
            employee_workload_index (float): Index representing employee workload (e.g., 0-100).
                                             Higher value indicates higher workload/overload.
            customer_priority_level (int): Priority level of the customer/project (e.g., 1-5,
                                           where 1 is highest priority).
            reopened_tasks (int): Number of tasks that were previously closed and then reopened.
            risk_flag (bool): A flag indicating if the project has a high inherent risk (True/False).

        Returns:
            str: The classified KPI class ("Low", "Medium", or "High"), or "Error" if classification fails.
        """

        # Construct the prompt for the Llama3 model
        prompt = f"""
        You are an expert project manager and an AI assistant designed to classify project KPI performance.
        Given the following project parameters, classify the project's overall KPI class as 'Low', 'Medium', or 'High'.
        Only respond with one of these three words: 'Low', 'Medium', or 'High'. Do not include any other text or explanation.

        Project Parameters:
        - Completion Percentage: {completion_percentage}%
        - Milestone Completion: {milestone_completion}%
        - Budget Utilization: {budget_utilization}%
        - Schedule Variance: {schedule_variance} days (positive is ahead, negative is behind)
        - Overdue Tasks: {overdue_tasks}
        - Alert Count: {alert_count}
        - Average Task Completion Time: {avg_task_completion_time} days
        - Employee Workload Index: {employee_workload_index}
        - Customer Priority Level: {customer_priority_level} (1=highest, 5=lowest)
        - Reopened Tasks: {reopened_tasks}
        - Risk Flag: {risk_flag}

        Based on these parameters, what is the KPI class of this project?
        """

        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "stream": False # Set to False for single, complete response
        }

        try:
            # Make the API call to your local Llama3 agent
            response = requests.post(
                self.api_url,
                headers={'Content-Type': 'application/json'},
                json=payload
            )
            response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)

            result = response.json()

            if result.get('response'):
                text = result['response'].strip().capitalize()
                if text in ["Low", "Medium", "High"]:
                    return text
                else:
                    print(f"Warning: Llama3 returned an unexpected classification: '{text}'. Defaulting to 'Medium'.")
                    return "Medium"
            else:
                print("Error: Llama3 API response structure is unexpected or 'response' field is missing.")
                print(f"Full Llama3 response: {result}") # Print full response for debugging
                return "Error"

        except requests.exceptions.ConnectionError:
            print(f"Error: Could not connect to local Llama3 agent at {self.api_url}.")
            print("Please ensure your local Llama3 agent (e.g., Ollama) is running and accessible at this address.")
            return "Error"
        except requests.exceptions.RequestException as e:
            print(f"Error calling local Llama3 API: {e}")
            return "Error"
        except Exception as e:
            print(f"An unexpected error occurred: {e}")
            return "Error"

# --- Example Usage (can be run directly in a Python script) ---
if __name__ == "__main__":
    llama_client_instance = Llama3Client()
    print("--- Project KPI Classification Examples with Local Llama3 ---")

    # Example 1: A project with excellent KPIs
    project_1_kpis = {
        "completion_percentage": 95.0,
        "milestone_completion": 98.0,
        "budget_utilization": 92.0,
        "schedule_variance": 10.0, # 10 days ahead
        "overdue_tasks": 0,
        "alert_count": 0,
        "avg_task_completion_time": 5.0, # 5 days
        "employee_workload_index": 55.0,
        "customer_priority_level": 3, # Corresponds to Medium
        "reopened_tasks": 0,
        "risk_flag": False
    }
    kpi_class_1 = llama_client_instance.classify_kpi_class(**project_1_kpis)
    print(f"\nProject 1 KPIs: {project_1_kpis}")
    print(f"Project 1 KPI Class (Llama3): {kpi_class_1}")

    # Example 2: A project with moderate KPIs (Medium)
    project_2_kpis = {
        "completion_percentage": 70.0,
        "milestone_completion": 60.0,
        "budget_utilization": 100.0,
        "schedule_variance": 0.0,
        "overdue_tasks": 2,
        "alert_count": 1,
        "avg_task_completion_time": 10.0,
        "employee_workload_index": 70.0,
        "customer_priority_level": 2, # Corresponds to Medium-High
        "reopened_tasks": 1,
        "risk_flag": False
    }
    kpi_class_2 = llama_client_instance.classify_kpi_class(**project_2_kpis)
    print(f"\nProject 2 KPIs: {project_2_kpis}")
    print(f"Project 2 KPI Class (Llama3): {kpi_class_2}")

    # Example 3: A project in trouble (Low)
    project_3_kpis = { 
        "completion_percentage": 40.0,
        "milestone_completion": 35.0,
        "budget_utilization": 120.0, # Significantly over budget
        "schedule_variance": -15.0, # 15 days behind
        "overdue_tasks": 7,
        "alert_count": 5,
        "avg_task_completion_time": 20.0, # 20 days
        "employee_workload_index": 90.0,
        "customer_priority_level": 1, # Corresponds to High
        "reopened_tasks": 3,
        "risk_flag": True # High risk
    }
    kpi_class_3 = llama_client_instance.classify_kpi_class(**project_3_kpis)
    print(f"\nProject 3 KPIs: {project_3_kpis}")
    print(f"Project 3 KPI Class (Llama3): {kpi_class_3}")