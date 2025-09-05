import request from "supertest";
import app from "../src/app";
import setup, { resetDatabase, teardown } from "./helpers/db-setup-e2e";
import { NEW_BUY_ORDER } from "./mocks/requests";

beforeAll(async () => {
  await setup();
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await teardown();
});

describe("POST /order", () => {
  it("should add new order", async () => {
    const res = await request(app)
      .post(`/api/orders/`)
      .send(NEW_BUY_ORDER)
      .expect(200);

    expect(res.body).toHaveProperty("data");
  });
});
