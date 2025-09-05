import { Request, Response, NextFunction } from "express";
import { AssetService } from "../services/assetService";
import { Asset } from "../domain/types";
import { sanitize } from "../../utils/sanitize";

export class AssetsController {
  assetsService: AssetService = AssetService.withDefaults();

  async findAssets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const assetToFind = String(req.params.asset || "").trim();
      sanitize(assetToFind);
      const assets: Asset[] = await this.assetsService.findSimilar(assetToFind);
      res.json({ data: assets });
    } catch (err) {
      next(err);
    }
  }
}
