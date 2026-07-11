import { Op } from "sequelize";
import Employee from "../models/employee.model.js";
import type { EmployeeListOptions, EmployeePayload } from "../validators/employee.validator.js";

export async function listEmployees(options: EmployeeListOptions) {
  const where: Record<string | symbol, unknown> = {};
  if (options.search) {
    const term = `%${options.search.replace(/[\\%_]/g, "\\$&")}%`;
    where[Op.or] = [
      { employeeNumber: { [Op.like]: term } }, { firstName: { [Op.like]: term } },
      { lastName: { [Op.like]: term } }, { email: { [Op.like]: term } },
    ];
  }
  if (options.department) where.department = options.department;
  if (options.country) where.country = options.country;
  if (options.employmentStatus) where.employmentStatus = options.employmentStatus;
  if (options.salaryMin !== undefined || options.salaryMax !== undefined) {
    where.salary = { [Op.between]: [options.salaryMin ?? 0, options.salaryMax ?? Number.MAX_SAFE_INTEGER] };
  }

  const { count, rows } = await Employee.findAndCountAll({
    where,
    limit: options.limit,
    offset: (options.page - 1) * options.limit,
    order: [[options.sortBy, options.sortOrder]],
  });
  return { rows, pagination: { page: options.page, limit: options.limit, total: count, totalPages: Math.ceil(count / options.limit) } };
}

export function getEmployee(id: string) {
  return Employee.findByPk(id);
}

export function createEmployee(payload: EmployeePayload) {
  return Employee.create(payload);
}

export async function updateEmployee(id: string, payload: Partial<EmployeePayload>) {
  const employee = await Employee.findByPk(id);
  if (!employee) return null;
  return employee.update(payload);
}

export async function deleteEmployee(id: string) {
  const employee = await Employee.findByPk(id);
  if (!employee) return false;
  await employee.destroy();
  return true;
}
