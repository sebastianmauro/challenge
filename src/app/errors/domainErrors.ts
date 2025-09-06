import { AppError } from "./apiError";

export class SharesInsufficientError extends AppError {
  constructor(message = "Shares are insufficient") {
    super(message, 400);
  }
}

export class CashInsufficientError extends AppError {
  constructor(message = "Cash is insufficient") {
    super(message, 400);
  }
}

export class InvalidPriceError extends AppError {
  constructor(message = "Invalid price") {
    super(message, 400);
  }
}
