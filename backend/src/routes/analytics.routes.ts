import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller.js";

const router = Router();

router.get("/salary-by-country", analyticsController.salaryByCountry);
router.get("/salary-by-department", analyticsController.salaryByDepartment);
router.get("/top-earners", analyticsController.topEarners);
router.get("/salary-distribution", analyticsController.salaryDistribution);

export default router;
