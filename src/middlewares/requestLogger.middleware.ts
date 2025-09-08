import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`[START] ${req.method} ${req.originalUrl}`);

  res.on("finish", () => {
    logger.info(
      `[END] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`
    );
  });

  next();
};

export default requestLogger;
