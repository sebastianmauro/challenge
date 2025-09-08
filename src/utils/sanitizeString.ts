import { BadRequestError } from "../app/errors/appErrors";
import { Request } from "express";
import logger from "./logger";

export function sanitizeString(req: Request) {
  const assetToFind = String(req.params.asset || "").trim();

  //length 1-64,
  if (!assetToFind || assetToFind.length > 64) {
    logger.error("Invalid asset parameter", { assetToFind });
    throw new BadRequestError();
  }

  //letters, numbers, spaces, dots, hyphens
  if (!/^[\p{L}\p{N}\s.\-]{1,64}$/u.test(assetToFind)) {
    logger.error("Invalid asset parameter", { assetToFind });
    throw new BadRequestError();
  }

  return assetToFind;
}
