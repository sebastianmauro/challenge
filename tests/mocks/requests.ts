import { OrderSide, OrderType } from "../../src/app/domain/types";

export const USER_ID = 1;

export const BMA = "BMA";

export const PAMP = "PAMP";

export const METR = "METR";

export const LONG_STRING =
  "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

export const MALICIOUS_QUERY = "1; delete * from orders";

export const MARKET_BUY_ORDER = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.BUY,
  orderType: OrderType.MARKET,
};

export const MARKET_SELL_ORDER = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.SELL,
  orderType: OrderType.MARKET,
};

export const LIMIT_BUY_OK = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.BUY,
  orderType: OrderType.LIMIT,
  price: 1000,
};

export const LIMIT_SELL_OK = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.SELL,
  orderType: OrderType.LIMIT,
  price: 1000,
};

export const LIMIT_BUY_NO_PRICE = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.BUY,
  orderType: OrderType.LIMIT,
  // price: missing
};

export const LIMIT_BUY_BAD_PRICE = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 1,
  side: OrderSide.BUY,
  orderType: OrderType.LIMIT,
  price: 0,
};

export const LIMIT_BUY_NO_CASH = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 10_000_000,
  side: OrderSide.BUY,
  orderType: OrderType.LIMIT,
  price: 1_000_000,
};

export const LIMIT_SELL_NO_SHARES = {
  ticker: PAMP,
  user: USER_ID,
  quantity: 999_999,
  side: OrderSide.SELL,
  orderType: OrderType.LIMIT,
  price: 1000,
};
