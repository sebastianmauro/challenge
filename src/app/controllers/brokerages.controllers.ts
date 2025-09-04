import { Request, Response, NextFunction } from "express";
import { Database } from "../../connectors/postgresBD";

export class BrokerageController {
  private db: Database = Database.instance;

  constructor() {
    this.db.connect();
  }

  async test(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const r: any = (
        await this.db.query(`SELECT ${Number(req.params.param)} AS value;`)
      ).rows;
      if (!r) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const value = r[0]?.value;
      res.json({ data: value });
    } catch (err) {
      next(err);
    }
  }
}
