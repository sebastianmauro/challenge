import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool } from "pg";
import { Database } from "../../src/connectors/postgresBD";
import { schemaSQL, seedSQL } from "./dbSeeds";

let container: StartedPostgreSqlContainer | null = null;
let adminPool: Pool | null = null;

const setup = async () => {
  if (!container) {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    const url = container.getConnectionUri();
    process.env.DATABASE_URL = url;

    adminPool = new Pool({ connectionString: url });
    await adminPool.query(schemaSQL);
    await adminPool.query(seedSQL);
    await Database.instance.connect();
  }
};

export const resetDatabase = async () => {
  if (!adminPool) {
    throw new Error(
      "La base de datos no está inicializada. Ejecuta setup() primero."
    );
  }
  await adminPool.query(`
    TRUNCATE orders, marketdata, instruments, users
    RESTART IDENTITY CASCADE;
  `);
  await adminPool.query(seedSQL);
};

export const teardown = async () => {
  if (container) {
    await Database.instance.close().catch(() => {});
    await adminPool?.end().catch(() => {});
    await new Promise((r) => setTimeout(r, 9000));
    await container.stop().catch(() => {});
    container = null;
    adminPool = null;
  }
};

export default setup;
