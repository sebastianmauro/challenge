import { PersistableOrder } from "../../domain/types";

export interface OrdersRepository {
  createOrder(order: PersistableOrder): Promise<void>;
}
