import dotenv from "dotenv";
dotenv.config({ quiet: true });

import app from "./app.js";
import { initializeDatabase } from "./database/index.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
}

bootstrap();
