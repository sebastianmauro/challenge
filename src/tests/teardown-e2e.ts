import { Pool } from "pg";

export default async () => {
  const pool: Pool | undefined = (global as any).__PG_POOL__;
  if (pool) await pool.end().catch(() => {});
  const container = (global as any).__PG_CONTAINER__;
  if (container) await container.stop().catch(() => {});
};
