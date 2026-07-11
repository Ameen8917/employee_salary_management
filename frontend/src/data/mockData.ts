import type { Employee } from "../types";

export const employees: Employee[] = [
  { id: 1, employeeNumber: "EMP000014", firstName: "Aarav", lastName: "Sharma", email: "aarav.sharma@example.com", department: "Engineering", country: "India", currency: "INR", salary: 1540000, employmentStatus: "active", hireDate: "2019-03-12" },
  { id: 2, employeeNumber: "EMP000125", firstName: "Emma", lastName: "Williams", email: "emma.williams@example.com", department: "Product", country: "United States", currency: "USD", salary: 142000, employmentStatus: "active", hireDate: "2020-07-01" },
  { id: 3, employeeNumber: "EMP000287", firstName: "Noah", lastName: "Singh", email: "noah.singh@example.com", department: "Finance", country: "Canada", currency: "CAD", salary: 108000, employmentStatus: "on_leave", hireDate: "2017-10-19" },
  { id: 4, employeeNumber: "EMP000402", firstName: "Ananya", lastName: "Patel", email: "ananya.patel@example.com", department: "Human Resources", country: "India", currency: "INR", salary: 925000, employmentStatus: "active", hireDate: "2021-01-07" },
  { id: 5, employeeNumber: "EMP000580", firstName: "Mia", lastName: "Brown", email: "mia.brown@example.com", department: "Sales", country: "United Kingdom", currency: "GBP", salary: 78500, employmentStatus: "active", hireDate: "2018-05-25" },
  { id: 6, employeeNumber: "EMP000721", firstName: "Liam", lastName: "Johnson", email: "liam.johnson@example.com", department: "Engineering", country: "Germany", currency: "EUR", salary: 98000, employmentStatus: "inactive", hireDate: "2016-11-13" },
];

export const departmentStats = [
  { name: "Engineering", average: 1280000, share: 86 },
  { name: "Product", average: 1160000, share: 77 },
  { name: "Finance", average: 1040000, share: 69 },
  { name: "Sales", average: 910000, share: 61 },
];

export const countryStats = [
  { name: "India", count: 3200, share: 100 },
  { name: "United States", count: 2450, share: 77 },
  { name: "Germany", count: 1680, share: 53 },
  { name: "Canada", count: 1460, share: 46 },
  { name: "United Kingdom", count: 1210, share: 38 },
];
