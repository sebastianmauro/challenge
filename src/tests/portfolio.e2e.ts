import request from "supertest";
import app from "../app";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Pool } from "pg";
import { Database } from "../connectors/postgresBD";

let container: StartedPostgreSqlContainer;
let adminPool: Pool;

beforeAll(async () => {
  container = await new PostgreSqlContainer("postgres:16-alpine").start();
  const url = container.getConnectionUri();

  process.env.DATABASE_URL = url;

  adminPool = new Pool({ connectionString: url });

  const { schemaSQL, seedSQL } = await import("./helpers/dbSeeds");
  await adminPool.query(schemaSQL);
  await adminPool.query(seedSQL);

  await Database.instance.connect();
});

beforeEach(async () => {
  // DB cleaning
  await adminPool.query(`
    TRUNCATE orders, marketdata, instruments, users
    RESTART IDENTITY CASCADE;
  `);
  const { seedSQL } = await import("./helpers/dbSeeds");
  await adminPool.query(seedSQL);
});

afterAll(async () => {
  await Database.instance.close().catch(() => {});
  await adminPool.end().catch(() => {});

  // 3) delay to 'idle' clients process END without errors
  await new Promise((r) => setTimeout(r, 9000));

  await container.stop().catch(() => {});
});

describe("GET /portfolio/:userId", () => {
  it("devuelve posiciones y total para el usuario 1", async () => {
    const res = await request(app).get("/api/portfolio/1").expect(200);

    expect(res.body.data).toBe(1);
  });
});
