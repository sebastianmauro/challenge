import { Request, Response, NextFunction } from "express";
import { AssetService } from "../services/assetService";
import { Asset } from "../domain/asset";
import { sanitizeString } from "../../utils/sanitizeString";

export class AssetsController {
  private assetsService: AssetService = AssetService.withDefaults();

  async findAssets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const assetToFind = sanitizeString(req);
      const assets: Asset[] = await this.assetsService.findSimilar(assetToFind);
      res.json({ data: assets });
    } catch (err) {
      next(err);
    }
  }
}
