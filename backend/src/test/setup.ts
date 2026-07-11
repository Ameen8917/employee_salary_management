import { afterEach, beforeAll } from "vitest";
import sequelize from "../config/database.js";
import "../models/index.js";
import Employee from "../models/employee.model.js";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(async () => {
  await Employee.destroy({ where: {}, truncate: true });
});
