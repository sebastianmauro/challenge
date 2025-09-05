import { Asset } from "../../domain/types";

export interface AssetRepository {
  findSimilar(assetToFind: string): Promise<Asset[]>;
}
