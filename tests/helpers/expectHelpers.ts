import { Database } from "../../src/connectors/postgresBD";
import request from "supertest";
import { BMA, METR, PAMP } from "../mocks/requests";

export function portfolioProcessedOkBeforeMarketOrder(
  res: any,
  availableCash: number,
  assetsValue: number,
  sharesHeld: number,
  positionValue: number
): void {
  expect(res.body).toHaveProperty("data");

  const { data } = res.body;

  expect(data.userId).toBe(1);
  expect(data.availableCash).toBeCloseTo(availableCash, 2);
  expect(data.assetsValue).toBeCloseTo(assetsValue, 2);
  expect(data.totalAccountValue).toBeCloseTo(889756, 2);

  expect(data.heldAssets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ ticker: BMA, sharesHeld: -10 }),
      expect.objectContaining({ ticker: PAMP, sharesHeld: sharesHeld }),
      expect.objectContaining({ ticker: METR, sharesHeld: 500 }),
    ])
  );
  const bma = data.heldAssets.find((a: any) => a.ticker === BMA);
  const pamp = data.heldAssets.find((a: any) => a.ticker === PAMP);
  const metr = data.heldAssets.find((a: any) => a.ticker === METR);

  expect(bma).toBeDefined();
  expect(bma.positionValue).toBeCloseTo(-15028, 2);
  expect(bma.returnPercent).toBeCloseTo(-1.1478375267225784, 6);

  expect(pamp).toBeDefined();
  expect(pamp.positionValue).toBeCloseTo(positionValue, 2);
  expect(pamp.returnPercent).toBeCloseTo(0.4393577782599262, 6);

  expect(metr).toBeDefined();
  expect(metr.positionValue).toBeCloseTo(114750, 2);
  expect(metr.returnPercent).toBeCloseTo(-1.0775862068965518, 6);
}

export async function getPortfolio(userId: number, app: any) {
  const res = await request(app).get(`/api/portfolios/${userId}`).expect(200);
  return res.body.data;
}

export function expectPortfolioUnchanged(before: any, after: any) {
  expect(after.userId).toBe(before.userId);
  expect(after.availableCash).toBeCloseTo(before.availableCash, 2);
  expect(after.assetsValue).toBeCloseTo(before.assetsValue, 2);
  expect(after.totalAccountValue).toBeCloseTo(before.totalAccountValue, 2);

  const byTicker = (arr: any[]) =>
    Object.fromEntries(arr.map((a: any) => [a.ticker, a.sharesHeld]));

  expect(byTicker(after.heldAssets)).toEqual(byTicker(before.heldAssets));
}

export async function expectLastOrderRow(
  userId: number,
  expected: {
    side: string;
    type: string;
    status: string;
    price: number;
    ticker: string;
  }
) {
  const sql = `
    SELECT o.status, o."type", o.side, o.price, i.ticker
    FROM orders o
    JOIN instruments i ON i.id = o."instrumentid"
    WHERE o."userid" = $1
    ORDER BY o.id DESC
    LIMIT 1;
  `;
  const { rows } = await Database.instance.query(sql, [userId]);
  expect(rows.length).toBe(1);
  const row = rows[0];
  expect(row.status).toBe(expected.status);
  expect(row.type).toBe(expected.type);
  expect(row.side).toBe(expected.side);
  expect(Number(row.price)).toBeCloseTo(expected.price, 6);
  expect(row.ticker).toBe(expected.ticker);
}
