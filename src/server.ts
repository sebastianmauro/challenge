import dotenv from "dotenv";
import app from "./app.js";
import { Database } from "./connectors/postgresBD.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT}`);
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
