import type { Request, Response } from "express";
import { UniqueConstraintError, ValidationError } from "sequelize";
import * as employeeService from "../services/employee.service.js";
import { validateEmployeeListQuery, validateEmployeePayload, type EmployeePayload } from "../validators/employee.validator.js";

function sendError(error: unknown, res: Response) {
  if (error instanceof UniqueConstraintError) return res.status(409).json({ success: false, message: "employeeNumber or email already exists." });
  if (error instanceof ValidationError) return res.status(400).json({ success: false, message: error.errors.map((item) => item.message).join(", ") });
  return res.status(400).json({ success: false, message: error instanceof Error ? error.message : "An unexpected error occurred." });
}

function employeeId(req: Request) {
  return Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
}

export async function list(req: Request, res: Response) {
  try {
    const result = await employeeService.listEmployees(validateEmployeeListQuery(req.query));
    return res.json({ success: true, data: result.rows, pagination: result.pagination });
  } catch (error) { return sendError(error, res); }
}

export async function getById(req: Request, res: Response) {
  const employee = await employeeService.getEmployee(employeeId(req));
  if (!employee) return res.status(404).json({ success: false, message: "Employee not found." });
  return res.json({ success: true, data: employee });
}

export async function create(req: Request, res: Response) {
  try {
    const employee = await employeeService.createEmployee(validateEmployeePayload(req.body) as EmployeePayload);
    return res.status(201).json({ success: true, data: employee });
  } catch (error) { return sendError(error, res); }
}

export async function update(req: Request, res: Response) {
  try {
    const payload = validateEmployeePayload(req.body, true);
    if (!Object.keys(payload).length) return res.status(400).json({ success: false, message: "Provide at least one field to update." });
    const employee = await employeeService.updateEmployee(employeeId(req), payload);
    if (!employee) return res.status(404).json({ success: false, message: "Employee not found." });
    return res.json({ success: true, data: employee });
  } catch (error) { return sendError(error, res); }
}

export async function remove(req: Request, res: Response) {
  const deleted = await employeeService.deleteEmployee(employeeId(req));
  if (!deleted) return res.status(404).json({ success: false, message: "Employee not found." });
  return res.status(204).send();
}
