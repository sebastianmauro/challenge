import { Request, Response, NextFunction } from "express";
import { todoCreateSchema, todoUpdateSchema } from "../schemas/todo.schema";
import { Database } from "../../connectors/postgresBD";

// In‑memory store (reemplaza por DB real cuando quieras)
let SEQ = 1;
const todos = new Map<number, { id: number; title: string; done: boolean }>();

export async function list(_req: Request, res: Response) {
  res.json({ data: Array.from(todos.values()) });
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  const todo = todos.get(id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json({ data: todo });
}

export async function create(req: Request, res: Response, next: NextFunction) {
  const payload = todoCreateSchema.parse(req.body);
  const id = SEQ++;
  const todo = { id, title: payload.title, done: false };
  todos.set(id, todo);
  res.status(201).json({ data: todo });
}

export async function replace(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!todos.has(id)) return res.status(404).json({ error: "Not found" });
  const payload = todoCreateSchema.parse(req.body);
  const todo = { id, title: payload.title, done: false };
  todos.set(id, todo);
  res.json({ data: todo });
}

export async function update(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  const current = todos.get(id);
  if (!current) return res.status(404).json({ error: "Not found" });
  const patch = todoUpdateSchema.parse(req.body);
  const updated = { ...current, ...patch };
  todos.set(id, updated);
  res.json({ data: updated });
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.id);
  if (!todos.has(id)) return res.status(404).json({ error: "Not found" });
  todos.delete(id);
  res.status(204).send();
}

export async function test(req: Request, res: Response, next: NextFunction) {
  await Database.instance.connect();
  const r: any = (
    await Database.instance.query(
      "SELECT " + Number(req.params.param) + " AS value;"
    )
  ).rows;
  if (!r) return res.status(404).json({ error: "Not found" });
  const value = r[0]?.value;
  console.log(value); //1
  res.json({ data: value });
}
