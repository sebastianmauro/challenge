import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderSide, OrderType } from "./types";
import { BadRequestError } from "../errors/appErrors";
import { OrdersService } from "../services/orderService";
import logger from "../../utils/logger";
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
      logger.error("Invalid ticker for OrderToBeCreated", { ticker });
      throw new BadRequestError("Ticker required");
    }

    if (!Number.isInteger(user) || user <= 0) {
      logger.error("Invalid user for OrderToBeCreated", { user });
      throw new BadRequestError();
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      logger.error("Invalid quantity for OrderToBeCreated", { quantity });
      throw new BadRequestError("Quantity must be > 0");
    }

    if (!Object.values(OrderSide).includes(side as OrderSide)) {
      logger.error("Invalid side for OrderToBeCreated", { side });
      throw new BadRequestError("Side invalid");
    }

    if (!Object.values(OrderType).includes(orderType as OrderType)) {
      logger.error("Invalid orderType for OrderToBeCreated", { orderType });
      throw new BadRequestError("Order type invalid");
    }
  }

  resolvePrice(service: OrdersService): Promise<number> {
    logger.error("Method not implemented.");
    throw new Error("Method should implemented.");
  }
}
