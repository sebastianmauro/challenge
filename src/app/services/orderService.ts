import logger from "../../utils/logger";
import { Asset } from "../domain/asset";
import { MarketOrder } from "../domain/marketOrder";
import { OrderToBeCreated } from "../domain/orderToBeCreated";
import { Portfolio } from "../domain/portfolio";
import { OrderSide, OrderStatus, OrderType } from "../domain/types";
import { PersistableOrder } from "../dtos/persistableOrder";
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
    const price: number = await order.resolvePrice(this);

    const status: OrderStatus = await this.assertSufficientFundsOrHoldings(
      order,
      price
    );

    await this.save(order, price, status);

    return await this.portfolioService.getPortfolioFor(order.user);
  }

  private async assertSufficientFundsOrHoldings(
    order: OrderToBeCreated,
    priceToPersist: number
  ) {
    const portfolio = await this.portfolioService.getPortfolioFor(order.user);
    const status: OrderStatus = this.getStatus(order);

    if (order.side === OrderSide.BUY) {
      await this.ensureCanBuy(order, priceToPersist, portfolio);
    } else {
      await this.ensureCanSell(portfolio, order, priceToPersist);
    }
    return status;
  }

  private async ensureCanSell(
    portfolio: Portfolio,
    order: OrderToBeCreated,
    priceToPersist: number
  ) {
    const sharesHeld = this.sharesHeldFor(portfolio, order.ticker);
    if (sharesHeld < order.quantity) {
      await this.save(order, priceToPersist, OrderStatus.REJECTED);
      logger.error("Insufficient shares to sell", { order, sharesHeld });
      throw new SharesInsufficientError();
    }
  }

  private async ensureCanBuy(
    order: OrderToBeCreated,
    priceToPersist: number,
    portfolio: Portfolio
  ) {
    const totalCost = order.quantity * priceToPersist;
    if (!this.hasEnoughCash(portfolio, totalCost)) {
      await this.save(order, priceToPersist, OrderStatus.REJECTED);
      logger.error("Insufficient cash to buy", { order, totalCost, portfolio });
      throw new CashInsufficientError();
    }
  }

  private getStatus(order: OrderToBeCreated) {
    const willBeFilledNow = order.orderType === OrderType.MARKET;
    const status: OrderStatus = willBeFilledNow
      ? OrderStatus.FILLED
      : OrderStatus.NEW;
    return status;
  }

  async resolveMarketPrice(order: MarketOrder): Promise<number> {
    const candidates = await this.assetService.findByTicker(order); // TODO: use find by Id
    if (!candidates) {
      logger.error("Asset not found for market order", { order });
      throw new NotFoundError(`Not found asset: ${order.ticker}.`);
    }
    return this.getPrice(candidates);
  }

  private getPrice(asset: Asset) {
    const price = Number(asset.currentPrice);
    if (!Number.isFinite(price) || price <= 0) {
      logger.error("Invalid price for asset", { asset });
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
}
