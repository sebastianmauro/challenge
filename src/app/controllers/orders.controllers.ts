import { Request, Response, NextFunction } from "express";
import { Portfolio } from "../domain/portfolio";
import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderToBeCreated } from "../domain/orderToBeCreated";
import { OrdersService } from "../services/orderService";

export class OrdersController {
  private ordersService: OrdersService = OrdersService.withDefaults();

  async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const request: CreateOrderRequest = req.body;
      const portfolio: Portfolio = await this.ordersService.createOrderFor(
        OrderToBeCreated.from(request)
      );
      res.json({ data: portfolio });
    } catch (err) {
      next(err);
    }
  }
}
