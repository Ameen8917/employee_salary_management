import type { Request, Response } from "express";
import * as analyticsService from "../services/analytics.service.js";

function parseLimit(value: unknown) {
  if (typeof value !== "string") return 10;
  const limit = Number(value);
  return Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;
}

export async function salaryByCountry(_req: Request, res: Response) {
  return res.json(await analyticsService.getSalaryByCountry());
}

export async function salaryByDepartment(_req: Request, res: Response) {
  return res.json(await analyticsService.getSalaryByDepartment());
}

export async function topEarners(req: Request, res: Response) {
  return res.json(await analyticsService.getTopEarners(parseLimit(req.query.limit)));
}

export async function salaryDistribution(_req: Request, res: Response) {
  return res.json(await analyticsService.getSalaryDistribution());
}
