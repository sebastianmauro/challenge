import request from "supertest";
import setup, { resetDatabase, teardown } from "./helpers/db-setup-e2e";
import { MARKET_BUY_ORDER, MARKET_SELL_ORDER } from "./mocks/requests";

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
    expect(
      portfolioProcessedOk(res, 752074.15, 137681.85, 41, 37959.85)
    ).toBeTruthy();
  });

  it("should add new sell order and return updated portfolio", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(MARKET_SELL_ORDER)
      .expect(200);
    expect(
      portfolioProcessedOk(res, 753925.85, 135830.15, 39, 36108.15)
    ).toBeTruthy();
  });
});

// {
//   data: {
//     userId: 1,
//     availableCash: 752074.15,
//     assetsValue: 137681.85,
//     totalAccountValue: 889756,
//     heldAssets: [
//             {
//         ticker: 'BMA',
//         sharesHeld: -10,
//         positionValue: -15028,
//         returnPercent: -1.1478375267225784
//       },
//              {
//         ticker: 'PAMP',
//         sharesHeld: 41,
//         positionValue: 37959.85,
//         returnPercent: 0.4393577782599262
//       },
//             {
//         ticker: 'METR',
//         sharesHeld: 500,
//         positionValue: 114750,
//         returnPercent: -1.0775862068965518
//       }
//      ]
//   }
// }

function buyOrderProcessedOk(res: any): boolean {
  expect(res.body).toHaveProperty("data");

  const { data } = res.body;

  expect(data.userId).toBe(1);
  expect(data.availableCash).toBeCloseTo(752074.15, 2);
  expect(data.assetsValue).toBeCloseTo(137681.85, 2);
  expect(data.totalAccountValue).toBeCloseTo(889756, 2);

  expect(data.heldAssets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ ticker: "BMA", sharesHeld: -10 }),
      expect.objectContaining({ ticker: "PAMP", sharesHeld: 41 }),
      expect.objectContaining({ ticker: "METR", sharesHeld: 500 }),
    ])
  );
  const bma = data.heldAssets.find((a: any) => a.ticker === "BMA");
  const pamp = data.heldAssets.find((a: any) => a.ticker === "PAMP");
  const metr = data.heldAssets.find((a: any) => a.ticker === "METR");

  expect(bma).toBeDefined();
  expect(bma.positionValue).toBeCloseTo(-15028, 2);
  expect(bma.returnPercent).toBeCloseTo(-1.1478375267225784, 6);

  expect(pamp).toBeDefined();
  expect(pamp.positionValue).toBeCloseTo(37959.85, 2);
  expect(pamp.returnPercent).toBeCloseTo(0.4393577782599262, 6);

  expect(metr).toBeDefined();
  expect(metr.positionValue).toBeCloseTo(114750, 2);
  expect(metr.returnPercent).toBeCloseTo(-1.0775862068965518, 6);
  return true;
}

function sellOrderProcessedOk(res: any): boolean {
  expect(res.body).toHaveProperty("data");

  const { data } = res.body;

  expect(data.userId).toBe(1);
  expect(data.availableCash).toBeCloseTo(753925.85, 2);
  expect(data.assetsValue).toBeCloseTo(135830.15, 2);
  expect(data.totalAccountValue).toBeCloseTo(889756, 2);

  expect(data.heldAssets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ ticker: "BMA", sharesHeld: -10 }),
      expect.objectContaining({ ticker: "PAMP", sharesHeld: 39 }),
      expect.objectContaining({ ticker: "METR", sharesHeld: 500 }),
    ])
  );
  const bma = data.heldAssets.find((a: any) => a.ticker === "BMA");
  const pamp = data.heldAssets.find((a: any) => a.ticker === "PAMP");
  const metr = data.heldAssets.find((a: any) => a.ticker === "METR");

  expect(bma).toBeDefined();
  expect(bma.positionValue).toBeCloseTo(-15028, 2);
  expect(bma.returnPercent).toBeCloseTo(-1.1478375267225784, 6);

  expect(pamp).toBeDefined();
  expect(pamp.positionValue).toBeCloseTo(36108.15, 2);
  expect(pamp.returnPercent).toBeCloseTo(0.4393577782599262, 6);

  expect(metr).toBeDefined();
  expect(metr.positionValue).toBeCloseTo(114750, 2);
  expect(metr.returnPercent).toBeCloseTo(-1.0775862068965518, 6);
  return true;
}

function portfolioProcessedOk(
  res: any,
  availableCash: number,
  assetsValue: number,
  sharesHeld: number,
  positionValue: number
): boolean {
  expect(res.body).toHaveProperty("data");

  const { data } = res.body;

  expect(data.userId).toBe(1);
  expect(data.availableCash).toBeCloseTo(availableCash, 2);
  expect(data.assetsValue).toBeCloseTo(assetsValue, 2);
  expect(data.totalAccountValue).toBeCloseTo(889756, 2);

  expect(data.heldAssets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ ticker: "BMA", sharesHeld: -10 }),
      expect.objectContaining({ ticker: "PAMP", sharesHeld: sharesHeld }),
      expect.objectContaining({ ticker: "METR", sharesHeld: 500 }),
    ])
  );
  const bma = data.heldAssets.find((a: any) => a.ticker === "BMA");
  const pamp = data.heldAssets.find((a: any) => a.ticker === "PAMP");
  const metr = data.heldAssets.find((a: any) => a.ticker === "METR");

  expect(bma).toBeDefined();
  expect(bma.positionValue).toBeCloseTo(-15028, 2);
  expect(bma.returnPercent).toBeCloseTo(-1.1478375267225784, 6);

  expect(pamp).toBeDefined();
  expect(pamp.positionValue).toBeCloseTo(positionValue, 2);
  expect(pamp.returnPercent).toBeCloseTo(0.4393577782599262, 6);

  expect(metr).toBeDefined();
  expect(metr.positionValue).toBeCloseTo(114750, 2);
  expect(metr.returnPercent).toBeCloseTo(-1.0775862068965518, 6);
  return true;
}
