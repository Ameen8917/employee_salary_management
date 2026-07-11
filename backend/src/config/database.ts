import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// This module constructs the connection, so it must load configuration itself.
// Static ES module imports are evaluated before a caller's dotenv.config() runs.
dotenv.config({ quiet: true });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_STORAGE ?? "./database.sqlite",
  logging: false,
});

export default sequelize;
