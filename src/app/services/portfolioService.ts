import { Portfolio } from "../domain/portfolio";
import { DbPortfolioRepository } from "../repositories/portfolios/dbPortfolioRepository";
import { PortfolioRepository } from "../repositories/portfolios/portfolioRepository";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;

  static withDefaults() {
    return new PortfolioService(new DbPortfolioRepository());
  }

  constructor(aPortfolioRepository: PortfolioRepository) {
    this.portfolioRepository = aPortfolioRepository;
  }

  async getPortfolioFor(user: number): Promise<Portfolio> {
    return await this.portfolioRepository.getPortfolioFor(user);
  }
}
