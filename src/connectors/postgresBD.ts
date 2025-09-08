import { Pool, QueryResultRow } from "pg";
import "dotenv/config";

type QueryParams = any[] | undefined;

export class Database {
  private static _instance: Database | null = null;
  private pool: Pool;
  private closed = false;

  private constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is required");
    }
    this.pool = new Pool({ connectionString });
  }

  async assertReady(): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query("SELECT 1;");
    } finally {
      client.release();
    }
    console.log("[DB] ready");
  }

  public static get instance(): Database {
    if (!this._instance) this._instance = new Database();
    return this._instance;
  }

  public static reset(): void {
    this._instance = null;
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

  public async close(): Promise<void> {
    if (this.closed) return;
    this.closed = true;
    await this.pool.end();
    console.log("database disconnected");
  }
}
