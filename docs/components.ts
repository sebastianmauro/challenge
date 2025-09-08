export {};

/**
 * @swagger
 * components:
 *   schemas:
 *     HeldAsset:
 *       type: object
 *       additionalProperties: false
 *       required: [ticker, sharesHeld, positionValue, returnPercent]
 *       properties:
 *         ticker:
 *           type: string
 *           description: Símbolo del instrumento (ej. BMA, PAMP).
 *         sharesHeld:
 *           type: integer
 *           description: Cantidad de acciones (puede ser negativa si es short).
 *         positionValue:
 *           type: number
 *           format: double
 *           description: Valor monetario de la posición.
 *         returnPercent:
 *           type: number
 *           format: double
 *           description: Rendimiento total en fracción (0.12 = 12%).
 *
 *     Portfolio:
 *       type: object
 *       additionalProperties: false
 *       required: [userId, availableCash, assetsValue, totalAccountValue, heldAssets]
 *       properties:
 *         userId: { type: integer, description: ID del usuario. }
 *         availableCash: { type: number, format: double, description: Efectivo disponible para operar. }
 *         assetsValue: { type: number, format: double, description: Valor total de las posiciones. }
 *         totalAccountValue: { type: number, format: double, description: Efectivo + valor de posiciones. }
 *         heldAssets:
 *           type: array
 *           description: Detalle de activos en cartera.
 *           items:
 *             $ref: '#/components/schemas/HeldAsset'
 *
 *     PortfolioResponse:
 *       type: object
 *       additionalProperties: false
 *       required: [data]
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Portfolio'
 *
 *     ErrorResponse:
 *       type: object
 *       additionalProperties: false
 *       required: [error]
 *       properties:
 *         error: { type: string }
 *
 *     OrderCreateRequest:
 *       type: object
 *       additionalProperties: false
 *       required: [ticker, user, quantity, side, orderType]
 *       properties:
 *         ticker:
 *           type: string
 *           description: Símbolo del instrumento.
 *         user:
 *           type: integer
 *           description: ID del usuario.
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           description: Cantidad de acciones.
 *         side:
 *           type: string
 *           enum: [BUY, SELL]
 *           description: Lado de la orden.
 *         orderType:
 *           type: string
 *           enum: [MARKET, LIMIT]
 *           description: Tipo de orden.
 *         price:
 *           type: number
 *           description: Precio límite (requerido si orderType=LIMIT).
 *     Asset:
 *       type: object
 *       additionalProperties: false
 *       required: [ticker, name, currentPrice]
 *       properties:
 *         ticker:
 *           type: string
 *           description: Símbolo del instrumento (ej. PAMP).
 *         name:
 *           type: string
 *           description: Nombre del instrumento.
 *         currentPrice:
 *           type: string
 *           description: Precio actual como string decimal (ej. "925.85").
 *
 *     AssetsResponse:
 *       type: object
 *       additionalProperties: false
 *       required: [data]
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Asset'
 *   examples:
 *     AssetList:
 *       summary: Lista con un activo
 *       value:
 *         data:
 *           - ticker: "PAMP"
 *             name: "Pampa Holding S.A."
 *             currentPrice: "925.85"
 */
