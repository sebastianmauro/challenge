import { QueryResultRow } from "pg";
import { Database } from "../../../connectors/postgresBD";
import { Asset } from "../../domain/asset";
import { AssetRepository } from "./assetRepository";
import { OrderToBeCreated } from "../../domain/orderToBeCreated";

export class DbAssetRepository implements AssetRepository {
  private db: Database = Database.instance;

  constructor() {
    this.db.connect();
  }

  public async findSimilar(assetToFind: string): Promise<Asset[]> {
    const queryResult: QueryResultRow[] = (
      await this.db.query(
        `SELECT DISTINCT ON (i.id)
        i.ticker,
        i.name,
        md.close AS precio_actual
      FROM instruments i
      JOIN marketdata md ON i.id = md.instrumentId
      WHERE
        i.type != 'MONEDA' AND
        (i.ticker ILIKE '%${assetToFind}%' OR i.name ILIKE '%${assetToFind}%')
      ORDER BY i.id, md.date DESC;`
      )
    ).rows;
    const assets: Asset[] = [];
    queryResult.forEach((row) => assets.push(Asset.fromQueryResult(row)));
    return assets;
  }

  public async findByTicker(assetToFind: OrderToBeCreated): Promise<Asset> {
    const queryResult: QueryResultRow[] = (
      await this.db.query(
        `SELECT DISTINCT ON (i.id)
        i.ticker,
        i.name,
        md.close AS precio_actual
      FROM instruments i
      JOIN marketdata md ON i.id = md.instrumentId
      WHERE
        (i.ticker = '${assetToFind.ticker}')
      ORDER BY i.id, md.date DESC;`
      )
    ).rows;
    return Asset.fromQueryResult(queryResult[0]);
  }
}
