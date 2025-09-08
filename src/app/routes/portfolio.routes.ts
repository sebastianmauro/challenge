import { Router } from "express";
import { PortfolioController } from "../controllers/portfolio.controllers";

const portfolioRouter = Router();
const controller = new PortfolioController();

/**
 * @swagger
 * /api/portfolios/{user}:
 *   get:
 *     summary: Busca el portafolio de un usuario
 *     description: Recupera el portafolio asociado a un usuario específico.
 *     tags:
 *       - Portafolios
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario cuyo portafolio se desea recuperar.
 *     responses:
 *       200:
 *         description: Portafolio recuperado exitosamente.
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
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not found"
 *       500:
 *         description: Error interno del servidor.
 */
portfolioRouter.get("/:user", controller.getPortfolio.bind(controller));

export default portfolioRouter;
