import { OrderSide, OrderType } from "../domain/types";

export class CreateOrderRequest {
  public user!: number;
  public ticker!: string;
  public side!: OrderSide;
  public orderType!: OrderType;
  public quantity!: number;
  public price?: number;
}
