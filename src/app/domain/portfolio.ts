import { QueryResultRow } from "pg";
import { HeldAsset } from "./heldAsset";

export class Portfolio {
  readonly userId: number;
  readonly availableCash: number;
  readonly assetsValue: number;
  readonly totalAccountValue: number;
  readonly heldAssets: HeldAsset[];

  constructor(
    userId: number,
    availableCash: number,
    assetsValue: number,
    totalAccountValue: number,
    heldAssets: HeldAsset[]
  ) {
    this.userId = userId;
    this.availableCash = availableCash;
    this.assetsValue = assetsValue;
    this.totalAccountValue = totalAccountValue;
    this.heldAssets = heldAssets;
  }

  static fromQueryResult(row: QueryResultRow): Portfolio {
    const rawAssets = row.activos_poseidos ?? [];

    const assets: HeldAsset[] = rawAssets.map(HeldAsset.fromDb);

    return new Portfolio(
      Number(row.userid ?? row.user_id ?? row.userId),
      Number(row.cash_disponible),
      Number(row.valor_en_activos),
      Number(row.valor_total_cuenta),
      assets
    );
  }
}
