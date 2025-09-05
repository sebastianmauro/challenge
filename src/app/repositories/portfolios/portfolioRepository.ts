import { Portfolio } from "../../domain/portfolio";

export interface PortfolioRepository {
  getPortfolioFor(portfolioToFind: number): Promise<Portfolio>;
}
