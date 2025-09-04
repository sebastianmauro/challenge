import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger-output.json" with { type: "json" };
import cors from "cors";
import todosRouter from "./app/routes/todos.routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";

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
