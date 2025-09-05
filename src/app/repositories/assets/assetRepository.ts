import { Asset } from "../../domain/asset";

export interface AssetRepository {
  findSimilar(assetToFind: string): Promise<Asset[]>;
}
