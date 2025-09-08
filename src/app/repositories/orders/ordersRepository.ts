import { PersistableOrder } from "../../dtos/persistableOrder";

export interface OrdersRepository {
  createOrder(order: PersistableOrder): Promise<void>;
}
