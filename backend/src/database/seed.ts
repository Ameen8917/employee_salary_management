import dotenv from "dotenv";
dotenv.config({ quiet: true });

import sequelize from "../config/database.js";
import Employee, { type EmploymentStatus } from "../models/employee.model.js";

const EMPLOYEE_COUNT = 10_000;
const BATCH_SIZE = 500;

const FIRST_NAMES = ["Aarav", "Emma", "Liam", "Olivia", "Noah", "Sophia", "Arjun", "Mia", "Ethan", "Ananya"];
const LAST_NAMES = ["Sharma", "Smith", "Patel", "Johnson", "Khan", "Williams", "Gupta", "Brown", "Taylor", "Singh"];
const DEPARTMENTS = ["Engineering", "Human Resources", "Finance", "Sales", "Marketing", "Operations", "Product", "Legal"];
const LOCATIONS = [
  { country: "India", currency: "INR", baseSalary: 650_000 },
  { country: "United States", currency: "USD", baseSalary: 75_000 },
  { country: "United Kingdom", currency: "GBP", baseSalary: 52_000 },
  { country: "Germany", currency: "EUR", baseSalary: 58_000 },
  { country: "Canada", currency: "CAD", baseSalary: 68_000 },
];
const STATUSES: EmploymentStatus[] = ["active", "active", "active", "inactive", "on_leave", "terminated"];

function employeeFor(index: number) {
  const location = LOCATIONS[index % LOCATIONS.length];
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
  const startYear = 2012 + (index % 14);
  const month = String((index % 12) + 1).padStart(2, "0");
  const day = String((index % 28) + 1).padStart(2, "0");
  const salary = location.baseSalary + ((index * 1_379) % Math.round(location.baseSalary * 1.5));

  return {
    employeeNumber: `EMP${String(index + 1).padStart(6, "0")}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${index + 1}@example.com`,
    department: DEPARTMENTS[index % DEPARTMENTS.length],
    country: location.country,
    currency: location.currency,
    salary: salary.toFixed(2),
    employmentStatus: STATUSES[index % STATUSES.length],
    hireDate: `${startYear}-${month}-${day}`,
  };
}

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    for (let start = 0; start < EMPLOYEE_COUNT; start += BATCH_SIZE) {
      const batch = Array.from(
        { length: Math.min(BATCH_SIZE, EMPLOYEE_COUNT - start) },
        (_, offset) => employeeFor(start + offset),
      );
      await Employee.bulkCreate(batch, { ignoreDuplicates: true, validate: true });
    }

    console.log(`Seeding complete. Employee records in database: ${await Employee.count()}`);
  } catch (error) {
    console.error("Failed to seed employees:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

void seed();
