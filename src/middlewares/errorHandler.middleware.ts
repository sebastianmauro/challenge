import { Request, Response, NextFunction } from "express";
import { AppError } from "../app/errors/appError";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // unknown error
  const isProd = process.env.NODE_ENV === "production";
  if (!(err instanceof AppError)) {
    const message = isProd
      ? "Internal server error"
      : (err as Error)?.message ?? "Internal error";
    const stack = isProd ? undefined : (err as Error)?.stack;
    return res.status(500).json({ error: { message, stack } });
  }

  // known errors
  const payload: any = { message: err.message };
  if (!isProd) payload.stack = err.stack;
  return res.status(err.statusCode).json({ error: payload });
}
