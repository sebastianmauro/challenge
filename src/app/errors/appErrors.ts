import { AppError } from "./appError.js";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}
export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}
export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity") {
    super(message, 422);
  }
}
