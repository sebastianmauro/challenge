import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});
const logLevel =
  process.env.NODE_ENV === "production" || "test" ? "info" : "debug";

const logger = createLogger({
  level: logLevel,
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
