import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderSide, OrderType } from "./types";
import { OrderToBeCreated } from "./orderToBeCreated";
import { OrdersService } from "../services/orderService";

export class MarketOrder extends OrderToBeCreated {
  constructor(
    public user: number,
    public ticker: string,
    public side: OrderSide,
    public orderType: OrderType,
    public quantity: number
  ) {
    super(user, ticker, side, orderType, quantity);
  }

  static canHandle(req: CreateOrderRequest): boolean {
    return req.orderType === OrderType.MARKET;
  }

  static from(req: CreateOrderRequest): MarketOrder {
    const ticker = String(req.ticker).trim().toUpperCase();

    return new MarketOrder(
      req.user,
      ticker,
      req.side,
      req.orderType,
      req.quantity
    );
  }

  override resolvePrice(service: OrdersService): Promise<number> {
    return service.resolveMarketPrice(this);
  }
}
