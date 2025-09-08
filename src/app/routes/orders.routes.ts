import { Router } from "express";
import { OrdersController } from "../controllers/orders.controllers";

const ordersRouter = Router();
const controller = new OrdersController();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: crear una orden
 *     description: Crea una nueva orden de compra o venta para un usuario específico.
 *     tags:
 *       - Órdenes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticker:
 *                 type: string
 *                 example: PAMP
 *               user:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 10
 *               side:
 *                 type: string
 *                 enum:
 *                   - BUY
 *                   - SELL
 *                 example: BUY
 *               orderType:
 *                 type: string
 *                 enum:
 *                   - MARKET
 *                   - LIMIT
 *                 example: MARKET
 *               price:
 *                 type: number
 *                 example: 150.0
 *             required:
 *               - ticker
 *               - user
 *               - quantity
 *               - side
 *               - orderType
 *     responses:
 *       200:
 *         description: Orden creada exitosamente, devuelve portfolio actualizado.
 *         content:
 *           application/json:
 *               schema:
 *                 type: object
 *                 additionalProperties: false
 *                 required: [data]
 *                 properties:
 *                   data:
 *                     type: object
 *                     additionalProperties: false
 *                     required:
 *                       - userId
 *                       - availableCash
 *                       - assetsValue
 *                       - totalAccountValue
 *                       - heldAssets
 *                     properties:
 *                       userId:
 *                         type: integer
 *                         description: ID del usuario.
 *                       availableCash:
 *                         type: number
 *                         format: double
 *                         description: Efectivo disponible para operar.
 *                       assetsValue:
 *                         type: number
 *                         format: double
 *                         description: Valor total de las posiciones.
 *                       totalAccountValue:
 *                         type: number
 *                         format: double
 *                         description: Efectivo + valor de posiciones.
 *                       heldAssets:
 *                         type: array
 *                         description: Detalle de activos en cartera.
 *                         items:
 *                           type: object
 *                           additionalProperties: false
 *                           required: [ticker, sharesHeld, positionValue, returnPercent]
 *                           properties:
 *                             ticker:
 *                               type: string
 *                               description: Símbolo del instrumento (ej. BMA, PAMP).
 *                             sharesHeld:
 *                               type: integer
 *                               description: Cantidad de acciones (puede ser negativa si es short).
 *                             positionValue:
 *                               type: number
 *                               format: double
 *                               description: Valor monetario de la posición.
 *                             returnPercent:
 *                               type: number
 *                               format: double
 *                               description: Rendimiento total en fracción (0.12 = 12%).
 *       400:
 *         description: Request inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "quantity debe ser un entero > 0 (acciones)."
 *       404:
 *         description: Activo no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Instrumento no encontrado para ticker AAPL"
 *       500:
 *         description: Error interno del servidor.
 */
ordersRouter.post("/", controller.createOrder.bind(controller));

export default ordersRouter;
