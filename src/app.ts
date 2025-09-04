import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger-output.json" with { type: "json" };
import cors from "cors";
import todosRouter from "./app/routes/todos.routes.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { Database } from "./connectors/postgresBD.js";

await Database.instance.connect();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/v1/todos", todosRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(notFound);
app.use(errorHandler);

export default app;
