import request from "supertest";
import app from "../src/app";
import setup, { resetDatabase, teardown } from "./helpers/db-setup-e2e";

beforeAll(async () => {
  await setup();
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await teardown();
});

describe("GET /portfolio/:userId", () => {
  it("devuelve posiciones y total para el usuario 1", async () => {
    const res = await request(app).get("/api/portfolio/1").expect(200);

    expect(res.body.data).toBe(1);
  });
});
