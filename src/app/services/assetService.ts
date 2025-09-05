import { Asset } from "../domain/types";
import { AssetRepository } from "../repositories/assets/assetRepository";
import { DbAssetRepository } from "../repositories/assets/dbAssetRepository";

export class AssetService {
  assetRepository: AssetRepository;

  static withDefaults() {
    return new AssetService(new DbAssetRepository());
  }

  constructor(aAssetRepository: AssetRepository) {
    this.assetRepository = aAssetRepository;
  }

  async findSimilar(assetToFind: string): Promise<Asset[]> {
    const assets = await this.assetRepository.findSimilar(assetToFind);
    return assets;
  }
}
