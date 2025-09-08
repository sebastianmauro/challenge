import { OrderSide, OrderType, OrderStatus } from "../domain/types";

export type PersistableOrder = {
  user: number;
  ticker: string;
  side: OrderSide;
  orderType: OrderType;
  quantity: number;
  price: number;
  status: OrderStatus;
};
