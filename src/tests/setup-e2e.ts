import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool } from "pg";
import { Database } from "../connectors/postgresBD";
import { schemaSQL, seedSQL } from "./helpers/dbSeeds";

let container: StartedPostgreSqlContainer;
let adminPool: Pool;

export default async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();
  const url = container.getConnectionUri();
  process.env.DATABASE_URL = url;

  adminPool = new Pool({ connectionString: url });
  await adminPool.query(schemaSQL);
  await adminPool.query(seedSQL);

  // Database.reset?.();
  await Database.instance.connect();

  (global as any).__PG_CONTAINER__ = container;
  (global as any).__PG_POOL__ = adminPool;
};
