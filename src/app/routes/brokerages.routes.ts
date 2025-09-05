import { Router } from "express";
import { BrokerageController } from "../controllers/brokerages.controllers";

const router = Router();
const controller = new BrokerageController();

/**
 * @swagger
 * /api/assets/{asset}:
 *   get:
 *     summary: Busca activos por ticker o nombre
 *     description: Retorna un listado de activos que coinciden con el criterio de búsqueda (ticker o nombre).
 *     tags:
 *       - Activos
 *     parameters:
 *       - in: path
 *         name: asset
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
router.get("/assets/:asset", controller.findAssets.bind(controller));

export default router;
