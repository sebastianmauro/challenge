import request from "supertest";
import app from "../src/app";
import setup, { resetDatabase, teardown } from "./helpers/db-setup-e2e";
import { similarAsset, userPortfolio } from "./mocks/responses";
import { BadRequestError, NotFoundError } from "../src/app/errors/appErrors";
import { LONG_STRING, MALICIOUS_QUERY } from "./mocks/requests";

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
  it("return the list of similar assets", async () => {
    const assetToFind = "ec";
    const res = await request(app)
      .get(`/api/assets/${assetToFind}`)
      .expect(200);

    expect(res.body.toString()).toBe(similarAsset.toString());
  });

  it("should return empty array", async () => {
    const assetToFind = "zfg";
    const res = await request(app)
      .get(`/api/assets/${assetToFind}`)
      .expect(200);

    expect(res.body.data.length).toBe(0);
  });

  it("should return bad request error, for length", async () => {
    const badRequestError = new BadRequestError();
    const res = await request(app)
      .get(`/api/assets/${LONG_STRING}`)
      .expect(badRequestError.statusCode);
    expect(res.body.error.message).toBe(badRequestError.message);
  });

  it("should return bad request error for characters", async () => {
    const badRequestError = new BadRequestError();
    const res = await request(app)
      .get(`/api/assets/${MALICIOUS_QUERY}`)
      .expect(badRequestError.statusCode);
    expect(res.body.error.message).toBe(badRequestError.message);
  });

  it("should return user 1 portfolio", async () => {
    const userId = 1;
    const res = await request(app).get(`/api/portfolios/${userId}`).expect(200);
    expect(res.body.toString()).toBe(userPortfolio.toString());
  });

  it("should return not found error", async () => {
    const userMissing = 999;
    const notFoundError = new NotFoundError();
    const res = await request(app)
      .get(`/api/portfolios/${userMissing}`)
      .expect(notFoundError.statusCode);
    expect(res.body.error.message).toBe(notFoundError.message);
  });

  it("should return not found error", async () => {
    const invalidUser = "notAnId";
    const badRequestError = new BadRequestError();
    const res = await request(app)
      .get(`/api/portfolios/${invalidUser}`)
      .expect(badRequestError.statusCode);
    expect(res.body.error.message).toBe(badRequestError.message);
  });
});
