import { describe, expect, it } from "vitest";
import * as analyticsService from "./analytics.service.js";
import Employee from "../models/employee.model.js";
import { employeePayload } from "../test/factories.js";

describe("analytics service", () => {
  it("groups averages, ranks top earners, and assigns salary bands", async () => {
    await Employee.bulkCreate([
      employeePayload({ firstName: "Low", country: "India", department: "Engineering", salary: "400000.00" }),
      employeePayload({ firstName: "Mid", country: "India", department: "Engineering", salary: "600000.00" }),
      employeePayload({ firstName: "High", country: "Canada", department: "Finance", salary: "1200000.00" }),
      employeePayload({ firstName: "Top", country: "Canada", department: "Finance", salary: "1600000.00" }),
    ]);

    await expect(analyticsService.getSalaryByCountry()).resolves.toEqual([
      { country: "Canada", averageSalary: 1400000 }, { country: "India", averageSalary: 500000 },
    ]);
    await expect(analyticsService.getSalaryByDepartment()).resolves.toEqual([
      { department: "Engineering", averageSalary: 500000 }, { department: "Finance", averageSalary: 1400000 },
    ]);

    const topEarners = await analyticsService.getTopEarners(2);
    expect(topEarners.map((employee) => employee.firstName)).toEqual(["Top", "High"]);

    await expect(analyticsService.getSalaryDistribution()).resolves.toMatchObject([
      { range: "Below 500,000", employeeCount: 1 },
      { range: "500,000 - 999,999", employeeCount: 1 },
      { range: "1,000,000 - 1,499,999", employeeCount: 1 },
      { range: "1,500,000 and above", employeeCount: 1 },
    ]);
  });
});
