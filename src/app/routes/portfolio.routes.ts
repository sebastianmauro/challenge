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
 *                 $ref: '#/components/schemas/PortfolioResponse'
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
