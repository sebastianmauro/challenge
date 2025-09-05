import { BadRequestError } from "../app/errors/appErrors";

export function sanitize(assetToFind: string) {
  if (!assetToFind || assetToFind.length > 64)
    throw new BadRequestError("query too short/long");
  if (!/^[\p{L}\p{N}\s.\-]{1,64}$/u.test(assetToFind))
    throw new BadRequestError("invalid query");
}
