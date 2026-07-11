import type { EmployeePayload } from "../validators/employee.validator.js";

let sequence = 0;

export function employeePayload(overrides: Partial<EmployeePayload> = {}): EmployeePayload {
  sequence += 1;
  return {
    employeeNumber: `TEST${String(sequence).padStart(5, "0")}`,
    firstName: "Ava",
    lastName: "Taylor",
    email: `ava.taylor.${sequence}@example.test`,
    department: "Engineering",
    country: "India",
    currency: "INR",
    salary: "1000000.00",
    employmentStatus: "active",
    hireDate: "2022-01-15",
    ...overrides,
  };
}
