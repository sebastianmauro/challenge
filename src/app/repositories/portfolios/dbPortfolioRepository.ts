import { QueryResultRow } from "pg";
import { Database } from "../../../connectors/postgresBD";
import { PortfolioRepository } from "./portfolioRepository";
import { Portfolio } from "../../domain/portfolio";
import { NotFoundError } from "../../errors/appErrors";
import logger from "../../../utils/logger";

export class DbPortfolioRepository implements PortfolioRepository {
  private db: Database = Database.instance;

  public async getPortfolioFor(user: number): Promise<Portfolio> {
    const queryResult: QueryResultRow[] = (
      await this.db.query(
        `WITH user_cash_balance AS (
          SELECT
              userId,
              SUM(
                  CASE
                      WHEN side = 'CASH_IN' THEN size
                      WHEN side = 'CASH_OUT' THEN -size
                      WHEN side = 'BUY' THEN -price * size
                      WHEN side = 'SELL' THEN price * size
                  END
              ) AS cash_disponible
          FROM orders
          WHERE userId = $1
          AND status = 'FILLED'
          GROUP BY userId
      ),
      user_positions_summary AS (
          SELECT
              o.userId,
              o.instrumentId,
              i.ticker,
              i.name,
              SUM(
                  CASE
                      WHEN o.side = 'BUY' THEN o.size
                      WHEN o.side = 'SELL' THEN -o.size
                  END
              ) AS acciones_poseidas
          FROM orders o
          JOIN instruments i ON o.instrumentId = i.id
          WHERE o.userId = $1
          AND o.status = 'FILLED' AND i.type != 'MONEDA'
          GROUP BY o.userId, o.instrumentId, i.ticker, i.name
      ),
      market_data_latest AS (
          SELECT DISTINCT ON (instrumentId)
              instrumentId,
              close,
              previousClose
          FROM marketdata
          ORDER BY instrumentId, date DESC
      )
      SELECT
          up.userId,
          COALESCE(ucb.cash_disponible, 0) AS cash_disponible,
          COALESCE(SUM(up.acciones_poseidas * mdl.close), 0) AS valor_en_activos,
          COALESCE(SUM(up.acciones_poseidas * mdl.close), 0) + cash_disponible AS valor_total_cuenta,
          json_agg(
              json_build_object(
                  'ticker', up.ticker,
                  'acciones_poseidas', up.acciones_poseidas,
                  'valor_posicion', up.acciones_poseidas * mdl.close,
                  'rendimiento_porcentaje', ((mdl.close - mdl.previousClose) / mdl.previousClose) * 100
              )
          ) AS activos_poseidos
      FROM user_positions_summary up
      JOIN market_data_latest mdl ON up.instrumentId = mdl.instrumentId
      LEFT JOIN user_cash_balance ucb ON up.userId = ucb.userId
      GROUP BY up.userId, ucb.cash_disponible;`,
        [user]
      )
    ).rows;
    this.validateResults(queryResult);
    return Portfolio.fromQueryResult(queryResult[0]);
  }

  private validateResults(queryResult: QueryResultRow[]) {
    if (queryResult.length === 0) {
      logger.error("No portfolio found for user");
      throw new NotFoundError();
    }
  }
}
