import { createOrderFrom } from "../../../src/app/domain/factories/orderFactory";
import { OrderType } from "../../../src/app/domain/types";
import { BadRequestError } from "../../../src/app/errors/appErrors";
import { InvalidPriceError } from "../../../src/app/errors/domainErrors";
import { makeReq } from "./helpers";

describe("OrderToBeCreated.from", () => {
  it("creates a MARKET order correctly: ignores price and normalizes ticker to UPPERCASE", () => {
    const req = makeReq({
      orderType: OrderType.MARKET,
      price: 123.45,
      ticker: " pamp ",
    });
    const order = createOrderFrom(req);

    expect(order.user).toBe(req.user);
    expect(order.ticker).toBe(req.ticker.trim().toUpperCase());
    expect(order.side).toBe(req.side);
    expect(order.orderType).toBe(req.orderType);
    expect(order.quantity).toBe(req.quantity);
    expect(order.price).toBeUndefined();
  });

  it("creates a LIMIT order correctly: uses the provided price", () => {
    const req = makeReq({ orderType: OrderType.LIMIT, price: 150.25 });
    const order = createOrderFrom(req);

    expect(order.orderType).toBe(req.orderType);
    expect(order.price).toBe(req.price);
  });

  it("throws BadRequestError if the body is invalid (not an object)", () => {
    // @ts-expect-error runtime test
    expect(() => createOrderFrom(undefined)).toThrow(BadRequestError);
    // @ts-expect-error runtime test
    expect(() => createOrderFrom(null)).toThrow(BadRequestError);
  });

  it("throws 'Ticker required' if ticker is empty or whitespace", () => {
    const req = makeReq({ ticker: "   " });
    expect(() => createOrderFrom(req)).toThrow(BadRequestError);
    try {
      createOrderFrom(req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(String(e.message)).toContain("Ticker required");
    }
  });

  it("throws BadRequestError if user is not a positive integer", () => {
    expect(() => createOrderFrom(makeReq({ user: 0 }))).toThrow(
      BadRequestError
    );
    expect(() => createOrderFrom(makeReq({ user: 1.2 as any }))).toThrow(
      BadRequestError
    );
  });

  it("throws 'Quantity must be > 0' if quantity <= 0", () => {
    const req = makeReq({ quantity: 0 });
    expect(() => createOrderFrom(req)).toThrow(BadRequestError);
    try {
      createOrderFrom(req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(String(e.message)).toContain("Quantity must be > 0");
    }
  });

  it("throws 'Side invalid' if side does not belong to the enum", () => {
    // @ts-expect-error invalid value
    const req = makeReq({ side: "HOLD" });
    expect(() => createOrderFrom(req)).toThrow(BadRequestError);
    try {
      createOrderFrom(req);
    } catch (e: any) {
      expect(String(e.message)).toContain("Side invalid");
    }
  });

  it("throws 'Order type invalid' if orderType does not belong to the enum", () => {
    // @ts-expect-error invalid value
    const req = makeReq({ orderType: "STOP" });
    expect(() => createOrderFrom(req)).toThrow(BadRequestError);
    try {
      createOrderFrom(req);
    } catch (e: any) {
      expect(String(e.message)).toContain("Order type invalid");
    }
  });

  it("LIMIT without price ⇒ InvalidPriceError", () => {
    const req = makeReq({
      orderType: OrderType.LIMIT,
      price: undefined as any,
    });
    expect(() => createOrderFrom(req)).toThrow(InvalidPriceError);
  });

  it("LIMIT with price NaN or <= 0 ⇒ InvalidPriceError", () => {
    expect(() =>
      createOrderFrom(
        makeReq({ orderType: OrderType.LIMIT, price: Number.NaN })
      )
    ).toThrow(InvalidPriceError);

    expect(() =>
      createOrderFrom(makeReq({ orderType: OrderType.LIMIT, price: 0 }))
    ).toThrow(InvalidPriceError);

    expect(() =>
      createOrderFrom(makeReq({ orderType: OrderType.LIMIT, price: -5 }))
    ).toThrow(InvalidPriceError);
  });

  it("always normalizes ticker (trim + uppercase)", () => {
    const req = makeReq({ ticker: "  pamp  " });
    const order = createOrderFrom(req);
    expect(order.ticker).toBe("PAMP");
  });
});
