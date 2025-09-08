import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderSide, OrderType } from "./types";
import { OrderToBeCreated } from "./orderToBeCreated";
import { InvalidPriceError } from "../errors/domainErrors";
import { OrdersService } from "../services/orderService";

export class LimitOrder extends OrderToBeCreated {
  price: number;

  constructor(
    aUser: number,
    aTicker: string,
    aSide: OrderSide,
    aOrderType: OrderType,
    aQuantity: number,
    aPrice?: number
  ) {
    if (
      aPrice === undefined ||
      aPrice == null ||
      !Number.isFinite(aPrice) ||
      aPrice <= 0
    ) {
      throw new InvalidPriceError();
    }
    super(aUser, aTicker, aSide, aOrderType, aQuantity);
    this.price = aPrice;
  }

  static canHandle(req: CreateOrderRequest): boolean {
    return req.orderType === OrderType.LIMIT;
  }

  static from(req: CreateOrderRequest): LimitOrder {
    const ticker = String(req.ticker).trim().toUpperCase();

    return new LimitOrder(
      req.user,
      ticker,
      req.side,
      req.orderType,
      req.quantity,
      req.price
    );
  }

  override resolvePrice(service: OrdersService): Promise<number> {
    return Promise.resolve(this.price);
  }
}
