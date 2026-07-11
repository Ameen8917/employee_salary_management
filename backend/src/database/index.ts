import sequelize from "../config/database.js";
import "../models/index.js";

export async function initializeDatabase() {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected");

    await sequelize.sync();

    console.log("✅ Database synchronized");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
