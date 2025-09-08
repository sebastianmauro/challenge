import { Asset } from "../domain/asset";
import { OrderToBeCreated } from "../domain/orderToBeCreated";
import { AssetRepository } from "../repositories/assets/assetRepository";
import { DbAssetRepository } from "../repositories/assets/dbAssetRepository";

export class AssetService {
  private assetRepository: AssetRepository;

  static withDefaults() {
    return new AssetService(new DbAssetRepository());
  }

  constructor(aAssetRepository: AssetRepository) {
    this.assetRepository = aAssetRepository;
  }

  async findSimilar(assetToFind: string): Promise<Asset[]> {
    return await this.assetRepository.findSimilar(assetToFind);
  }

  async findByTicker(assetToFind: OrderToBeCreated): Promise<Asset> {
    return await this.assetRepository.findByTicker(assetToFind);
  }
}
