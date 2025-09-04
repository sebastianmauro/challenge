import { Router } from "express";
import * as controller from "../controllers/todos.controllers";

const router = Router();

/**
 * @swagger
 * /api/v1/todos/:
 *   get:
 *     summary: Obtiene todos los To-Dos
 *     description: Devuelve una lista de todos los To-Dos almacenados.
 *     tags: [To-Dos]
 *     responses:
 *       200:
 *         description: Lista de To-Dos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
router.get("/", controller.list);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   get:
 *     summary: Obtiene un To-Do por ID
 *     description: Devuelve un To-Do específico por su ID.
 *     tags: [To-Dos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: El ID del To-Do.
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
router.get("/:id", controller.getById);

/**
 * @swagger
 * /api/v1/todos/:
 *   post:
 *     summary: Crea un nuevo To-Do
 *     description: Crea un nuevo To-Do en la base de datos.
 *     tags: [To-Dos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: El título del To-Do.
 *                 example: Aprender Swagger
 *     responses:
 *       201:
 *         description: To-Do creado con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Datos de entrada inválidos.
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/v1/todos/portfolio/{param}:
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
router.get("/portfolio/:param", controller.test);

export default router;
