import logger from "../../../utils/logger";
import { CreateOrderRequest } from "../../dtos/createOrderRequest";
import { BadRequestError } from "../../errors/appErrors";
import { LimitOrder } from "../limitOrder";
import { MarketOrder } from "../marketOrder";
import { OrderToBeCreated } from "../orderToBeCreated";

const subclasses = [MarketOrder, LimitOrder];

export function createOrderFrom(req: CreateOrderRequest): OrderToBeCreated {
  if (!req || typeof req !== "object") {
    logger.error("Invalid request object for createOrderFrom", { req });
    throw new BadRequestError();
  }
  const orderClass = subclasses.find((o: any) => o.canHandle(req));
  if (!orderClass) {
    logger.error("No order class can handle the request", { req });
    throw new BadRequestError("Order type invalid");
  }
  return orderClass.from(req);
}
