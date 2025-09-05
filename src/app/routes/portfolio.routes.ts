import { Router } from "express";
import { PortfolioController } from "../controllers/portfolio.controllers";

const portfolioRouter = Router();
const controller = new PortfolioController();

/**
 * @swagger
 * /api/portfolios/{user}:
 *   get:
 *     summary: Busca activos por ticker o nombre
 *     description: Retorna un listado de activos que coinciden con el criterio de búsqueda (ticker o nombre).
 *     tags:
 *       - Activos
 *     parameters:
 *       - in: path
 *         name: user
 *         required: true
 *         schema:
 *           type: string
 *         description: El ticker o nombre del activo a buscar
 *     responses:
 *       200:
 *         description: Lista de activos similares encontrada y devuelta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *       404:
 *         description: Activo no encontrado o criterio de búsqueda no proporcionado.
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
