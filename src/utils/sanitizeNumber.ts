import { Request } from "express";
import { BadRequestError } from "../app/errors/appErrors";

export function sanitizeNumber(req: Request): number {
  const raw = String(req.params.user ?? "").trim();

  // integer not negative
  if (!/^\d+$/.test(raw)) {
    throw new BadRequestError();
  }

  const user = Number(raw);

  // limits
  if (!Number.isSafeInteger(user) || user <= 0) {
    throw new BadRequestError();
  }
  return user;
}
