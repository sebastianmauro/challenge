import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderSide, OrderType } from "./types";
import { BadRequestError } from "../errors/appErrors";
import { OrdersService } from "../services/orderService";
export class OrderToBeCreated {
  constructor(
    public user: number,
    public ticker: string,
    public side: OrderSide,
    public orderType: OrderType,
    public quantity: number,
    public price?: number
  ) {
    if (typeof ticker !== "string" || ticker.trim() === "") {
      throw new BadRequestError("Ticker required");
    }

    if (!Number.isInteger(user) || user <= 0) {
      throw new BadRequestError();
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestError("Quantity must be > 0");
    }

    if (!Object.values(OrderSide).includes(side as OrderSide)) {
      throw new BadRequestError("Side invalid");
    }

    if (!Object.values(OrderType).includes(orderType as OrderType)) {
      throw new BadRequestError("Order type invalid");
    }
  }

  resolvePrice(service: OrdersService): Promise<number> {
    throw new Error("Method should implemented.");
  }
}
