import request from "supertest";
import setup, { resetDatabase, teardown } from "./helpers/db-setup-e2e";
import {
  LIMIT_BUY_BAD_PRICE,
  LIMIT_BUY_NO_CASH,
  LIMIT_BUY_NO_PRICE,
  LIMIT_BUY_OK,
  LIMIT_SELL_NO_SHARES,
  LIMIT_SELL_OK,
  MARKET_BUY_ORDER,
  MARKET_SELL_ORDER,
  USER_ID,
} from "./mocks/requests";
import {
  expectLastOrderRow,
  expectPortfolioUnchanged,
  getPortfolio,
  portfolioProcessedOkBeforeMarketOrder,
} from "./helpers/expectHelpers";
import {
  CashInsufficientError,
  InvalidPriceError,
  SharesInsufficientError,
} from "../src/app/errors/domainErrors";
import { OrderSide, OrderStatus, OrderType } from "../src/app/domain/types";

let app: any;

beforeAll(async () => {
  await setup();
  app = (await import("../src/app")).default;
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await teardown();
});

describe("POST /order", () => {
  it("should add new buy order and return updated portfolio", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(MARKET_BUY_ORDER)
      .expect(200);

    portfolioProcessedOkBeforeMarketOrder(
      res,
      752074.15,
      137681.85,
      41,
      37959.85
    );
  });

  it("should add new sell order and return updated portfolio", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(MARKET_SELL_ORDER)
      .expect(200);
    portfolioProcessedOkBeforeMarketOrder(
      res,
      753925.85,
      135830.15,
      39,
      36108.15
    );
  });

  it("creates a BUY LIMIT (status NEW) and portfolio remains unchanged", async () => {
    const before = await getPortfolio(USER_ID, app);

    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_BUY_OK)
      .expect(200);

    const after = res.body.data;
    expectPortfolioUnchanged(before, after);

    await expectLastOrderRow(USER_ID, {
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      status: OrderStatus.NEW,
      price: LIMIT_BUY_OK.price,
      ticker: LIMIT_BUY_OK.ticker,
    });
  });

  it("creates a SELL LIMIT (status NEW) and portfolio remains unchanged", async () => {
    const before = await getPortfolio(USER_ID, app);

    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_SELL_OK)
      .expect(200);

    const after = res.body.data;
    expectPortfolioUnchanged(before, after);

    await expectLastOrderRow(USER_ID, {
      side: OrderSide.SELL,
      type: OrderType.LIMIT,
      status: OrderStatus.NEW,
      price: LIMIT_SELL_OK.price,
      ticker: LIMIT_SELL_OK.ticker,
    });
  });

  it("rejects LIMIT without price (400)", async () => {
    const error = new InvalidPriceError();
    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_BUY_NO_PRICE)
      .expect(error.statusCode);

    expect(res.body.error.message).toBe(error.message);
  });

  it("rejects LIMIT with price <= 0 (400)", async () => {
    const error = new InvalidPriceError();
    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_BUY_BAD_PRICE)
      .expect(error.statusCode);
    expect(res.body.error.message).toBe(error.message);
  });

  it("rejects LIMIT BUY when cash is insufficient (400) and persists REJECTED", async () => {
    const error = new CashInsufficientError();
    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_BUY_NO_CASH)
      .expect(error.statusCode);

    expect(res.body.error.message).toBe(error.message);
    await expectLastOrderRow(USER_ID, {
      side: OrderSide.BUY,
      type: OrderType.LIMIT,
      status: OrderStatus.REJECTED,
      price: LIMIT_BUY_NO_CASH.price,
      ticker: LIMIT_BUY_NO_CASH.ticker,
    });
  });

  it("rejects LIMIT SELL when shares are insufficient (400) and persists REJECTED", async () => {
    const error = new SharesInsufficientError();
    const res = await request(app)
      .post("/api/orders")
      .send(LIMIT_SELL_NO_SHARES)
      .expect(error.statusCode);

    expect(res.body.error.message).toBe(error.message);
    await expectLastOrderRow(USER_ID, {
      side: OrderSide.SELL,
      type: OrderType.LIMIT,
      status: OrderStatus.REJECTED,
      price: LIMIT_SELL_NO_SHARES.price,
      ticker: LIMIT_SELL_NO_SHARES.ticker,
    });
  });
});
