import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger-output.json" with { type: "json" };
import cors from "cors";
import assetsRouter from "./app/routes/assets.routes";
import { notFound } from "./middlewares/notFound.middleware";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import portfolioRouter from "./app/routes/portfolio.routes";
import ordersRouter from "./app/routes/orders.routes";
import { Database } from "./connectors/postgresBD";
import requestLogger from "./middlewares/requestLogger.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});
app.get("/readiness", async (_req, res) => {
  res.status(200).send("ok");
});
app.get("/startup", async (_req, res) => {
  try{
    await Database.instance.assertReady();
    return res.status(200).send("ok");

  }catch(err){
    return res.status(503).send("initializing");
  }
});

app.use("/api/assets", assetsRouter);
app.use("/api/portfolios", portfolioRouter);
app.use("/api/orders", ordersRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.use(notFound);
app.use(errorHandler);

export default app;
