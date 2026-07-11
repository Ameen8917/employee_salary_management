import { describe, expect, it } from "vitest";
import * as employeeService from "./employee.service.js";
import { employeePayload } from "../test/factories.js";

describe("employee service", () => {
  it("creates, filters, updates, and deletes an employee", async () => {
    const created = await employeeService.createEmployee(employeePayload({ firstName: "Nora", salary: "750000.00" }));
    await employeeService.createEmployee(employeePayload({ firstName: "Sam", department: "Finance", salary: "1200000.00" }));

    const result = await employeeService.listEmployees({
      page: 1, limit: 10, search: "Nora", department: "Engineering", sortBy: "salary", sortOrder: "ASC",
    });
    expect(result.pagination.total).toBe(1);
    expect(result.rows[0].id).toBe(created.id);

    const updated = await employeeService.updateEmployee(String(created.id), { department: "Product", salary: "900000.00" });
    expect(updated?.department).toBe("Product");
    expect(updated?.salary).toBe("900000.00");

    expect(await employeeService.deleteEmployee(String(created.id))).toBe(true);
    expect(await employeeService.getEmployee(String(created.id))).toBeNull();
  });
});
