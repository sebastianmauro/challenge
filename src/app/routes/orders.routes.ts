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
 *            $ref: '#/components/schemas/OrderCreateRequest'
 *     responses:
 *       200:
 *         description: Orden creada exitosamente, devuelve portfolio actualizado.
 *         content:
 *           application/json:
 *               schema:
 *                 $ref: '#/components/schemas/PortfolioResponse'
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
