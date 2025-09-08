import { ApiError } from "./apiError";

export class SharesInsufficientError extends ApiError {
  constructor(message = "Shares are insufficient") {
    super(message, 400);
  }
}

export class CashInsufficientError extends ApiError {
  constructor(message = "Cash is insufficient") {
    super(message, 400);
  }
}

export class InvalidPriceError extends ApiError {
  constructor(message = "Invalid price") {
    super(message, 400);
  }
}
