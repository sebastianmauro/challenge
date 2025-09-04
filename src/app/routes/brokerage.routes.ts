import { Router } from "express";
import { BrokerageController } from "../controllers/todos.controllers";

const router = Router();
const controller = new BrokerageController();

/**
 * @swagger
 * /api/portfolio/{param}:
 *   get:
 *     summary: retorna param
 *     description: Devuelve un To-Do específico por su ID.
 *     tags: [To-Dos]
 *     parameters:
 *       - in: path
 *         name: param
 *         required: true
 *         schema:
 *           type: integer
 *         description: El param
 *     responses:
 *       200:
 *         description: To-Do encontrado y devuelto.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: To-Do no encontrado.
 */
router.get("/portfolio/:param", controller.test.bind(controller));

export default router;
