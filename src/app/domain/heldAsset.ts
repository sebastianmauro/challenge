export class HeldAsset {
  private readonly ticker: string;
  private readonly sharesHeld: number;
  private readonly positionValue: number;
  private readonly returnPercent: number;

  constructor(
    ticker: string,
    sharesHeld: number,
    positionValue: number,
    returnPercent: number
  ) {
    this.ticker = ticker;
    this.sharesHeld = sharesHeld;
    this.positionValue = positionValue;
    this.returnPercent = returnPercent;
  }

  static fromDb(obj: any): HeldAsset {
    return new HeldAsset(
      String(obj.ticker),
      Number(obj.acciones_poseidas),
      Number(obj.valor_posicion),
      Number(obj.rendimiento_porcentaje)
    );
  }
}
