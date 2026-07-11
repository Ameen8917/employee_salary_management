import type { Request, Response } from "express";
import { getDashboardSummary } from "../services/dashboard.service.js";

export async function getSummary(_req: Request, res: Response) {
  const summary = await getDashboardSummary();
  return res.json(summary);
}
