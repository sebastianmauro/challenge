import { QueryResultRow } from "pg";

export class Asset {
  readonly ticker: string;
  readonly name: string;
  readonly currentPrice: string;

  static fromQueryResult(row: QueryResultRow): Asset {
    return new Asset(row.ticker, row.name, row.precio_actual);
  }
  constructor(aTicker: string, aName: string, aCurrentPrice: string) {
    this.ticker = aTicker;
    this.currentPrice = aCurrentPrice;
    this.name = aName;
  }
}
