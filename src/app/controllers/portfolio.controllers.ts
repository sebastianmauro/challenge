import { Request, Response, NextFunction } from "express";
import { PortfolioService } from "../services/portfolioService";
import { Portfolio } from "../domain/portfolio";
import { sanitizeNumber } from "../../utils/sanitizeNumber";

export class PortfolioController {
  private portfolioService: PortfolioService = PortfolioService.withDefaults();

  async getPortfolio(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = sanitizeNumber(req);
      const portfolio: Portfolio = await this.portfolioService.getPortfolioFor(
        user
      );
      res.json({ data: portfolio });
    } catch (err) {
      next(err);
    }
  }
}
