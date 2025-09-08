import { CreateOrderRequest } from "../../dtos/createOrderRequest";
import { BadRequestError } from "../../errors/appErrors";
import { LimitOrder } from "../limitOrder";
import { MarketOrder } from "../marketOrder";
import { OrderToBeCreated } from "../orderToBeCreated";

const subclasses = [MarketOrder, LimitOrder];

export function createOrderFrom(req: CreateOrderRequest): OrderToBeCreated {
  if (!req || typeof req !== "object") throw new BadRequestError();
  const orderClass = subclasses.find((o: any) => o.canHandle(req));
  if (!orderClass) throw new BadRequestError("Order type invalid");
  return orderClass.from(req);
}
