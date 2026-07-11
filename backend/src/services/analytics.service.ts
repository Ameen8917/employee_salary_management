import { Op, col, fn } from "sequelize";
import Employee from "../models/employee.model.js";

type AverageGroup = { name: string; averageSalary: string | number };

function numberValue(value: string | number | null | undefined) {
  return value === null || value === undefined ? 0 : Number(value);
}

async function averageSalaryBy(field: "country" | "department") {
  const rows = await Employee.findAll({
    attributes: [[col(field), "name"], [fn("AVG", col("salary")), "averageSalary"]],
    group: [field],
    order: [[field, "ASC"]],
    raw: true,
  }) as unknown as AverageGroup[];

  return rows.map((row) => ({ [field]: row.name, averageSalary: numberValue(row.averageSalary) }));
}

export function getSalaryByCountry() {
  return averageSalaryBy("country");
}

export function getSalaryByDepartment() {
  return averageSalaryBy("department");
}

export function getTopEarners(limit: number) {
  return Employee.findAll({
    attributes: ["id", "employeeNumber", "firstName", "lastName", "department", "country", "currency", "salary"],
    order: [["salary", "DESC"], ["id", "ASC"]],
    limit,
  });
}

const SALARY_BANDS = [
  { label: "Below 500,000", min: 0, max: 499_999.99 },
  { label: "500,000 - 999,999", min: 500_000, max: 999_999.99 },
  { label: "1,000,000 - 1,499,999", min: 1_000_000, max: 1_499_999.99 },
  { label: "1,500,000 and above", min: 1_500_000, max: undefined },
] as const;

export async function getSalaryDistribution() {
  const counts = await Promise.all(SALARY_BANDS.map(({ min, max }) => Employee.count({
    where: { salary: max === undefined ? { [Op.gte]: min } : { [Op.between]: [min, max] } },
  })));

  return SALARY_BANDS.map((band, index) => ({
    range: band.label,
    minSalary: band.min,
    maxSalary: band.max ?? null,
    employeeCount: counts[index],
  }));
}
