import logger from "../../utils/logger";

export abstract class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    if (process.env.NODE_ENV != "production") {
      Error.captureStackTrace?.(this, this.constructor);
    } else {
      this.stack = undefined;
    }
  }
}
