import { BadRequestError } from "../app/errors/appErrors";
import { Request } from "express";

export function sanitizeString(req: Request) {
  const assetToFind = String(req.params.asset || "").trim();

  //length 1-64,
  if (!assetToFind || assetToFind.length > 64) throw new BadRequestError();

  //letters, numbers, spaces, dots, hyphens
  if (!/^[\p{L}\p{N}\s.\-]{1,64}$/u.test(assetToFind))
    throw new BadRequestError();

  return assetToFind;
}
