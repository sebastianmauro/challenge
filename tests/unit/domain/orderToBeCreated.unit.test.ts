import { OrderToBeCreated } from "../../../src/app/domain/orderToBeCreated";
import { OrderSide, OrderType } from "../../../src/app/domain/types";
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
    const order = OrderToBeCreated.from(req);

    expect(order.user).toBe(req.user);
    expect(order.ticker).toBe(req.ticker.trim().toUpperCase());
    expect(order.side).toBe(req.side);
    expect(order.orderType).toBe(req.orderType);
    expect(order.quantity).toBe(req.quantity);
    expect(order.price).toBeUndefined();
  });

  it("creates a LIMIT order correctly: uses the provided price", () => {
    const req = makeReq({ orderType: OrderType.LIMIT, price: 150.25 });
    const order = OrderToBeCreated.from(req);

    expect(order.orderType).toBe(req.orderType);
    expect(order.price).toBe(req.price);
  });

  it("throws BadRequestError if the body is invalid (not an object)", () => {
    // @ts-expect-error runtime test
    expect(() => OrderToBeCreated.from(undefined)).toThrow(BadRequestError);
    // @ts-expect-error runtime test
    expect(() => OrderToBeCreated.from(null)).toThrow(BadRequestError);
  });

  it("throws 'Ticker required' if ticker is empty or whitespace", () => {
    const req = makeReq({ ticker: "   " });
    expect(() => OrderToBeCreated.from(req)).toThrow(BadRequestError);
    try {
      OrderToBeCreated.from(req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(String(e.message)).toContain("Ticker required");
    }
  });

  it("throws BadRequestError if user is not a positive integer", () => {
    expect(() => OrderToBeCreated.from(makeReq({ user: 0 }))).toThrow(
      BadRequestError
    );
    expect(() => OrderToBeCreated.from(makeReq({ user: 1.2 as any }))).toThrow(
      BadRequestError
    );
  });

  it("throws 'Quantity must be > 0' if quantity <= 0", () => {
    const req = makeReq({ quantity: 0 });
    expect(() => OrderToBeCreated.from(req)).toThrow(BadRequestError);
    try {
      OrderToBeCreated.from(req);
    } catch (e: any) {
      expect(e).toBeInstanceOf(BadRequestError);
      expect(String(e.message)).toContain("Quantity must be > 0");
    }
  });

  it("throws 'Side invalid' if side does not belong to the enum", () => {
    // @ts-expect-error invalid value
    const req = makeReq({ side: "HOLD" });
    expect(() => OrderToBeCreated.from(req)).toThrow(BadRequestError);
    try {
      OrderToBeCreated.from(req);
    } catch (e: any) {
      expect(String(e.message)).toContain("Side invalid");
    }
  });

  it("throws 'Order type invalid' if orderType does not belong to the enum", () => {
    // @ts-expect-error invalid value
    const req = makeReq({ orderType: "STOP" });
    expect(() => OrderToBeCreated.from(req)).toThrow(BadRequestError);
    try {
      OrderToBeCreated.from(req);
    } catch (e: any) {
      expect(String(e.message)).toContain("Order type invalid");
    }
  });

  it("LIMIT without price ⇒ InvalidPriceError", () => {
    const req = makeReq({
      orderType: OrderType.LIMIT,
      price: undefined as any,
    });
    expect(() => OrderToBeCreated.from(req)).toThrow(InvalidPriceError);
  });

  it("LIMIT with price NaN or <= 0 ⇒ InvalidPriceError", () => {
    expect(() =>
      OrderToBeCreated.from(
        makeReq({ orderType: OrderType.LIMIT, price: Number.NaN })
      )
    ).toThrow(InvalidPriceError);

    expect(() =>
      OrderToBeCreated.from(makeReq({ orderType: OrderType.LIMIT, price: 0 }))
    ).toThrow(InvalidPriceError);

    expect(() =>
      OrderToBeCreated.from(makeReq({ orderType: OrderType.LIMIT, price: -5 }))
    ).toThrow(InvalidPriceError);
  });

  it("always normalizes ticker (trim + uppercase)", () => {
    const req = makeReq({ ticker: "  pamp  " });
    const order = OrderToBeCreated.from(req);
    expect(order.ticker).toBe("PAMP");
  });
});
