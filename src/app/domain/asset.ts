import { QueryResultRow } from "pg";

export class Asset {
  readonly ticket: string;
  readonly name: string;
  readonly currentPrice: string;

  static fromQueryResult(row: QueryResultRow): Asset {
    return new Asset(row.ticket, row.name, row.precio_actual);
  }
  constructor(aTicket: string, aName: string, aCurrentPrice: string) {
    this.ticket = aTicket;
    this.currentPrice = aCurrentPrice;
    this.name = aName;
  }
}
