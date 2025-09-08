import { Asset } from "../../domain/asset";
import { OrderToBeCreated } from "../../domain/orderToBeCreated";

export interface AssetRepository {
  findSimilar(assetToFind: string): Promise<Asset[]>;
  findByTicker(assetToFind: OrderToBeCreated): Promise<Asset>;
}
