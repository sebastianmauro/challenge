import { Pool, QueryResultRow } from "pg";
import "dotenv/config";

type QueryParams = any[] | undefined;

export class Database {
  private static _instance: Database | null = null;
  private pool: Pool;
  private closed = false;

  private constructor() {
    const connectionString = process.env.DATABASE_URL;
    this.pool = new Pool({ connectionString });
  }

  public static get instance(): Database {
    if (!this._instance) {
      this._instance = new Database();
    }
    return this._instance;
  }

  public async connect(): Promise<void> {
    await this.query("SELECT 1;");
  }

  public async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: QueryParams
  ): Promise<{ rows: T[] }> {
    const start = Date.now();
    const res = await this.pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log("[DB] query", { text, duration, rows: res.rowCount });
    return { rows: res.rows };
  }

  async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    await this.pool.end();
    console.log("database disconnected");
  }
}
