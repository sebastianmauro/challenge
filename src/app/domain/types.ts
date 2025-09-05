import { QueryResultRow } from "pg";

export class Asset {
  private ticket: string;
  private name: string;
  private currentPrice: string;

  static fromQueryResult(row: QueryResultRow): Asset {
    return new Asset(row.ticket, row.name, row.precio_actual);
  }
  constructor(aTicket: string, aName: string, aCurrentPrice: string) {
    this.ticket = aTicket;
    this.currentPrice = aCurrentPrice;
    this.name = aName;
  }
}
