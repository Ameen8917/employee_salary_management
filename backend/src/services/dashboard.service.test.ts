import { describe, expect, it } from "vitest";
import * as dashboardService from "./dashboard.service.js";
import Employee from "../models/employee.model.js";
import { employeePayload } from "../test/factories.js";

describe("dashboard service", () => {
  it("calculates summary statistics and employee group counts", async () => {
    await Employee.bulkCreate([
      employeePayload({ country: "India", department: "Engineering", salary: "100.00" }),
      employeePayload({ country: "India", department: "Engineering", salary: "200.00" }),
      employeePayload({ country: "Canada", department: "Finance", salary: "300.00" }),
    ]);

    const summary = await dashboardService.getDashboardSummary();
    expect(summary).toMatchObject({ totalEmployees: 3, averageSalary: 200, highestSalary: 300, lowestSalary: 100, countries: 2, departments: 2 });
    expect(summary.employeesByCountry).toEqual([{ country: "Canada", count: 1 }, { country: "India", count: 2 }]);
    expect(summary.employeesByDepartment).toEqual([{ department: "Engineering", count: 2 }, { department: "Finance", count: 1 }]);
  });
});
