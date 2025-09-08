import { Database } from "../../../connectors/postgresBD";
import { OrdersRepository } from "./ordersRepository";
import { PersistableOrder } from "../../domain/types";
import { NotFoundError } from "../../errors/appErrors";

export class DbOrdersRepository implements OrdersRepository {
  private db: Database = Database.instance;

  public async createOrder(p: PersistableOrder): Promise<void> {
    const sql = `
      WITH ins AS (
        SELECT id AS instrument_id
        FROM instruments
        WHERE UPPER(ticker) = UPPER($1)
      )
      INSERT INTO orders (
        instrumentId, userId, side, size, price, "type", status, "datetime"
      )
      SELECT
        ins.instrument_id, $2, $3, $4, $5, $6, $7, NOW()
      FROM ins
      RETURNING id;
    `;

    const params = [
      p.ticker,
      p.user,
      p.side,
      p.quantity,
      p.price,
      p.orderType,
      p.status,
    ];

    const { rows } = await this.db.query(sql, params);

    if (!rows || rows.length === 0) {
      throw new NotFoundError(`Instrument not found`);
    }
  }
}
