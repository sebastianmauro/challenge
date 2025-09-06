import { OrderSide, OrderType } from "../../../src/app/domain/types";
import { CreateOrderRequest } from "../../../src/app/dtos/createOrderRequest";

export const baseReq: CreateOrderRequest = {
  user: 1,
  ticker: " Pamp ",
  side: OrderSide.BUY,
  orderType: OrderType.MARKET,
  quantity: 10,
};

export const makeReq = (
  over: Partial<CreateOrderRequest> = {}
): CreateOrderRequest => ({ ...baseReq, ...over });
