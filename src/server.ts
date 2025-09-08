import dotenv from "dotenv";
import app from "./app";
import { Database } from "./connectors/postgresBD";
import logger from "./utils/logger";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  logger.info(`[api] listening on http://localhost:${PORT}`);
});

//graceful shutdown
process.on("SIGINT", async () => {
  await Database.instance.close();
  server.close(() => process.exit(0));
});
process.on("SIGTERM", async () => {
  await Database.instance.close();
  server.close(() => process.exit(0));
});
