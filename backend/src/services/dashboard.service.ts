import { col, fn } from "sequelize";
import Employee from "../models/employee.model.js";

type AggregateRow = {
  totalEmployees: string | number;
  averageSalary: string | number | null;
  highestSalary: string | number | null;
  lowestSalary: string | number | null;
};

type GroupRow = { name: string; employeeCount: string | number };

function asNumber(value: string | number | null | undefined) {
  return value === null || value === undefined ? 0 : Number(value);
}

export async function getDashboardSummary() {
  const [totals, countryRows, departmentRows] = await Promise.all([
    Employee.findOne({
      attributes: [
        [fn("COUNT", col("id")), "totalEmployees"],
        [fn("AVG", col("salary")), "averageSalary"],
        [fn("MAX", col("salary")), "highestSalary"],
        [fn("MIN", col("salary")), "lowestSalary"],
      ],
      raw: true,
    }) as Promise<AggregateRow | null>,
    Employee.findAll({
      attributes: [[col("country"), "name"], [fn("COUNT", col("id")), "employeeCount"]],
      group: ["country"],
      order: [["country", "ASC"]],
      raw: true,
    }) as unknown as Promise<GroupRow[]>,
    Employee.findAll({
      attributes: [[col("department"), "name"], [fn("COUNT", col("id")), "employeeCount"]],
      group: ["department"],
      order: [["department", "ASC"]],
      raw: true,
    }) as unknown as Promise<GroupRow[]>,
  ]);

  const employeesByCountry = countryRows.map((row) => ({ country: row.name, count: asNumber(row.employeeCount) }));
  const employeesByDepartment = departmentRows.map((row) => ({ department: row.name, count: asNumber(row.employeeCount) }));

  return {
    totalEmployees: asNumber(totals?.totalEmployees),
    averageSalary: asNumber(totals?.averageSalary),
    highestSalary: asNumber(totals?.highestSalary),
    lowestSalary: asNumber(totals?.lowestSalary),
    countries: employeesByCountry.length,
    departments: employeesByDepartment.length,
    employeesByCountry,
    employeesByDepartment,
  };
}
