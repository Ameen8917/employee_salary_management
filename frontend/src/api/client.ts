import type { Employee } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

type EmployeeApiRecord = Omit<Employee, "salary"> & { salary: string | number };
type ApiResponse<T> = { success: boolean; data: T; pagination?: EmployeePagination };

export type EmployeePagination = { page: number; limit: number; total: number; totalPages: number };
export type EmployeeQuery = {
  page?: number; limit?: number; search?: string; department?: string; country?: string;
  employmentStatus?: Employee["employmentStatus"]; salaryMin?: number; salaryMax?: number;
};
export type DashboardSummary = {
  totalEmployees: number;
  averageSalary: number;
  highestSalary: number;
  lowestSalary: number;
  countries: number;
  departments: number;
  employeesByCountry: Array<{ country: string; count: number }>;
  employeesByDepartment: Array<{ department: string; count: number }>;
};
export type SalaryAverage = { averageSalary: number };
export type DepartmentSalary = SalaryAverage & { department: string };
export type SalaryDistribution = { range: string; minSalary: number; maxSalary: number | null; employeeCount: number };
export type CreateEmployeeInput = Omit<Employee, "id" | "salary"> & { salary: string | number };

function normalizeEmployee(employee: EmployeeApiRecord): Employee {
  return { ...employee, salary: Number(employee.salary) };
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const payload = await response.json().catch(() => null) as { message?: string } | null;
  if (!response.ok) throw new Error(payload?.message ?? "The request could not be completed.");
  return payload as T;
}

export const api = {
  async getEmployees(query: EmployeeQuery = {}) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
    const response = await request<ApiResponse<EmployeeApiRecord[]>>(`/employees?${params}`);
    return { employees: response.data.map(normalizeEmployee), pagination: response.pagination! };
  },
  async createEmployee(input: CreateEmployeeInput) {
    const response = await request<ApiResponse<EmployeeApiRecord>>("/employees", { method: "POST", body: JSON.stringify(input) });
    return normalizeEmployee(response.data);
  },
  getDashboardSummary: () => request<DashboardSummary>("/dashboard/summary"),
  getSalaryByDepartment: () => request<DepartmentSalary[]>("/analytics/salary-by-department"),
  getSalaryDistribution: () => request<SalaryDistribution[]>("/analytics/salary-distribution"),
};
