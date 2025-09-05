import { CreateOrderRequest } from "../dtos/createOrderRequest";
import { OrderSide, OrderType } from "./types";
import { BadRequestError } from "../errors/appErrors";

export class OrderToBeCreated {
  constructor(
    public user: number,
    public ticker: string,
    public side: OrderSide,
    public orderType: OrderType,
    public quantity: number,
    public price?: number
  ) {}

  static from(req: CreateOrderRequest): OrderToBeCreated {
    this.ensureShape(req);
    const ticker = String(req.ticker).trim().toUpperCase();
    const price =
      req.orderType === OrderType.LIMIT ? Number(req.price) : undefined;

    return new OrderToBeCreated(
      req.user,
      ticker,
      req.side,
      req.orderType,
      req.quantity,
      price
    );
  }

  private static ensureShape(req: CreateOrderRequest): void {
    if (!req || typeof req !== "object") {
      throw new BadRequestError("Body requerido.");
    }

    if (typeof req.ticker !== "string" || req.ticker.trim() === "") {
      throw new BadRequestError("ticker es requerido.");
    }

    if (!Number.isInteger(req.user) || req.user <= 0) {
      throw new BadRequestError("user debe ser un id válido (> 0).");
    }

    if (!Number.isInteger(req.quantity) || req.quantity <= 0) {
      throw new BadRequestError("quantity debe ser un entero > 0 (acciones).");
    }

    if (!Object.values(OrderSide).includes(req.side as OrderSide)) {
      throw new BadRequestError("side inválido. Use BUY o SELL.");
    }

    if (!Object.values(OrderType).includes(req.orderType as OrderType)) {
      throw new BadRequestError("orderType inválido. Use MARKET o LIMIT.");
    }

    if (req.orderType === OrderType.LIMIT) {
      if (req.price == null || !Number.isFinite(req.price) || req.price <= 0) {
        throw new BadRequestError(
          "price es requerido y debe ser > 0 para órdenes LIMIT."
        );
      }
    }
  }
}
