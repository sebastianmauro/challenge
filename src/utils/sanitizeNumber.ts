import { Request } from "express";
import { BadRequestError } from "../app/errors/appErrors";
import { log } from "console";
import logger from "./logger";

export function sanitizeNumber(req: Request): number {
  const raw = String(req.params.user ?? "").trim();

  // integer not negative
  if (!/^\d+$/.test(raw)) {
    logger.error("Invalid user parameter", { raw });
    throw new BadRequestError();
  }

  const user = Number(raw);

  // limits
  if (!Number.isSafeInteger(user) || user <= 0) {
    logger.error("Invalid user number", { user });
    throw new BadRequestError();
  }
  return user;
}
