import { EMPLOYMENT_STATUSES, type EmploymentStatus } from "../models/employee.model.js";

export const SORTABLE_EMPLOYEE_FIELDS = [
  "employeeNumber", "firstName", "lastName", "department", "country", "salary", "hireDate", "createdAt",
] as const;

export type EmployeePayload = {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  salary: string;
  employmentStatus: EmploymentStatus;
  hireDate: string;
};

export type EmployeeListOptions = {
  page: number;
  limit: number;
  search?: string;
  department?: string;
  country?: string;
  employmentStatus?: EmploymentStatus;
  salaryMin?: number;
  salaryMax?: number;
  sortBy: (typeof SORTABLE_EMPLOYEE_FIELDS)[number];
  sortOrder: "ASC" | "DESC";
};

function invalid(message: string): never {
  throw new Error(message);
}

function queryString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function positiveInteger(value: unknown, fallback: number, maximum?: number) {
  const parsed = Number(queryString(value));
  if (!Number.isInteger(parsed) || parsed < 1) return fallback;
  return maximum ? Math.min(parsed, maximum) : parsed;
}

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

export function validateEmployeePayload(body: unknown, partial = false): Partial<EmployeePayload> {
  if (!body || typeof body !== "object" || Array.isArray(body)) invalid("Request body must be a JSON object.");

  const input = body as Record<string, unknown>;
  const result: Partial<EmployeePayload> = {};
  const stringFields: Array<keyof Omit<EmployeePayload, "salary" | "employmentStatus">> = [
    "employeeNumber", "firstName", "lastName", "email", "department", "country", "currency", "hireDate",
  ];

  for (const field of stringFields) {
    const value = input[field];
    if (value === undefined && partial) continue;
    if (typeof value !== "string" || !value.trim()) invalid(`${field} is required and must be a non-empty string.`);
    result[field] = value.trim();
  }

  if (result.email && !/^\S+@\S+\.\S+$/.test(result.email)) invalid("email must be valid.");
  if (result.currency) {
    result.currency = result.currency.toUpperCase();
    if (!/^[A-Z]{3}$/.test(result.currency)) invalid("currency must be a three-letter ISO code.");
  }
  if (result.hireDate && !isDateOnly(result.hireDate)) invalid("hireDate must use YYYY-MM-DD format.");

  if (input.salary !== undefined || !partial) {
    const amount = typeof input.salary === "number" ? input.salary : Number(input.salary);
    if (!Number.isFinite(amount) || amount < 0) invalid("salary must be a non-negative number.");
    result.salary = amount.toFixed(2);
  }

  if (input.employmentStatus !== undefined || !partial) {
    if (typeof input.employmentStatus !== "string" || !EMPLOYMENT_STATUSES.includes(input.employmentStatus as EmploymentStatus)) {
      invalid(`employmentStatus must be one of: ${EMPLOYMENT_STATUSES.join(", ")}.`);
    }
    result.employmentStatus = input.employmentStatus as EmploymentStatus;
  }

  return result;
}

export function validateEmployeeListQuery(query: Record<string, unknown>): EmployeeListOptions {
  const employmentStatus = queryString(query.employmentStatus)?.trim();
  const salaryMinValue = queryString(query.salaryMin);
  const salaryMaxValue = queryString(query.salaryMax);
  const sortBy = queryString(query.sortBy) ?? "createdAt";
  const sortOrder = (queryString(query.sortOrder) ?? "DESC").toUpperCase();

  if (!SORTABLE_EMPLOYEE_FIELDS.includes(sortBy as (typeof SORTABLE_EMPLOYEE_FIELDS)[number]) || !["ASC", "DESC"].includes(sortOrder)) {
    invalid("Invalid sortBy or sortOrder.");
  }
  if (employmentStatus && !EMPLOYMENT_STATUSES.includes(employmentStatus as EmploymentStatus)) invalid("Invalid employmentStatus.");

  const salaryMin = salaryMinValue === undefined ? undefined : Number(salaryMinValue);
  const salaryMax = salaryMaxValue === undefined ? undefined : Number(salaryMaxValue);
  if ((salaryMin !== undefined && (!Number.isFinite(salaryMin) || salaryMin < 0))
    || (salaryMax !== undefined && (!Number.isFinite(salaryMax) || salaryMax < 0))
    || (salaryMin !== undefined && salaryMax !== undefined && salaryMax < salaryMin)) {
    invalid("Invalid salary range.");
  }

  return {
    page: positiveInteger(query.page, 1),
    limit: positiveInteger(query.limit, 20, 100),
    search: queryString(query.search)?.trim() || undefined,
    department: queryString(query.department)?.trim() || undefined,
    country: queryString(query.country)?.trim() || undefined,
    employmentStatus: employmentStatus as EmploymentStatus | undefined,
    salaryMin,
    salaryMax,
    sortBy: sortBy as EmployeeListOptions["sortBy"],
    sortOrder: sortOrder as EmployeeListOptions["sortOrder"],
  };
}
