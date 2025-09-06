import { Asset } from "../domain/asset";
import { OrderToBeCreated } from "../domain/orderToBeCreated";
import { Portfolio } from "../domain/portfolio";
import {
  OrderSide,
  OrderStatus,
  OrderType,
  PersistableOrder,
} from "../domain/types";
import { NotFoundError } from "../errors/appErrors";
import {
  CashInsufficientError,
  InvalidPriceError,
  SharesInsufficientError,
} from "../errors/domainErrors";
import { DbOrdersRepository } from "../repositories/orders/dbOrdersRepository";
import { OrdersRepository } from "../repositories/orders/ordersRepository";
import { AssetService } from "./assetService";
import { PortfolioService } from "./portfolioService";

export class OrdersService {
  private orderRepository: OrdersRepository;
  private portfolioService: PortfolioService;
  private assetService: AssetService;

  static withDefaults() {
    return new OrdersService(
      new DbOrdersRepository(),
      PortfolioService.withDefaults(),
      AssetService.withDefaults()
    );
  }

  constructor(
    aOrdersRepository: OrdersRepository,
    aPortfolioService: PortfolioService,
    aAssetService: AssetService
  ) {
    this.orderRepository = aOrdersRepository;
    this.portfolioService = aPortfolioService;
    this.assetService = aAssetService;
  }

  async createOrderFor(order: OrderToBeCreated): Promise<Portfolio> {
    const price: number = await this.resolvePrice(order);

    const status: OrderStatus = await this.ensureCapacity(order, price);

    await this.save(order, price, status);

    return await this.portfolioService.getPortfolioFor(order.user);
  }

  private async save(
    order: OrderToBeCreated,
    price: number,
    status: OrderStatus
  ) {
    const persistable: PersistableOrder = {
      user: order.user,
      ticker: order.ticker,
      side: order.side,
      orderType: order.orderType,
      quantity: order.quantity,
      price: price,
      status,
    };
    await this.orderRepository.createOrder(persistable);
  }

  private async ensureCapacity(
    order: OrderToBeCreated,
    priceToPersist: number
  ) {
    const portfolio = await this.portfolioService.getPortfolioFor(order.user);
    const willBeFilledNow = order.orderType === OrderType.MARKET;
    const status: OrderStatus = willBeFilledNow
      ? OrderStatus.FILLED
      : OrderStatus.NEW;

    if (order.side === OrderSide.BUY) {
      const totalCost = order.quantity * priceToPersist;
      if (!this.hasEnoughCash(portfolio, totalCost)) {
        await this.persistRejected(order, priceToPersist);
        throw new CashInsufficientError();
      }
    } else {
      // SELL
      const sharesHeld = this.sharesHeldFor(portfolio, order.ticker);
      if (sharesHeld < order.quantity) {
        await this.persistRejected(order, priceToPersist);
        throw new SharesInsufficientError();
      }
    }
    return status;
  }

  private async resolvePrice(order: OrderToBeCreated) {
    let priceToPersist: number;
    //TODO: use polimorfism and double dispatch with await this.resolveMarketPrice(order.ticker);
    if (order.orderType === OrderType.MARKET) {
      const marketPrice = await this.resolveMarketPrice(order.ticker);
      priceToPersist = marketPrice;
    } else {
      // LIMIT
      if (
        order.price === undefined ||
        !Number.isFinite(order.price) ||
        order.price <= 0
      ) {
        throw new InvalidPriceError();
      }
      priceToPersist = order.price;
    }
    return priceToPersist;
  }

  private async resolveMarketPrice(ticker: string): Promise<number> {
    const candidates = await this.assetService.findSimilar(ticker); // TODO: use find by Id
    if (!candidates || candidates.length === 0) {
      throw new NotFoundError(`Not found asset: ${ticker}.`);
    }
    const asset =
      candidates.find(
        (a: Asset) => a.ticket === ticker || (a as any).ticket === ticker
      ) ?? candidates[0];
    const price = Number(asset.currentPrice);
    if (!Number.isFinite(price) || price <= 0) {
      throw new InvalidPriceError();
    }
    return price;
  }

  private sharesHeldFor(portfolio: Portfolio, ticker: string): number {
    const held = portfolio.heldAssets.find((a) => a.ticker === ticker);
    return held ? held.sharesHeld : 0;
  }

  private hasEnoughCash(portfolio: Portfolio, totalCost: number): boolean {
    return (
      Number.isFinite(portfolio.availableCash) &&
      portfolio.availableCash >= totalCost
    );
  }

  private async persistRejected(
    order: OrderToBeCreated,
    price: number
  ): Promise<void> {
    const rejected: PersistableOrder = {
      user: order.user,
      ticker: order.ticker,
      side: order.side,
      orderType: order.orderType,
      quantity: order.quantity,
      price,
      status: OrderStatus.REJECTED,
    };
    await this.orderRepository.createOrder(rejected);
  }
}
