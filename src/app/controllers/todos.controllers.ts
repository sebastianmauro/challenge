import { Request, Response, NextFunction } from "express";
import { todoCreateSchema, todoUpdateSchema } from "../schemas/todo.schema";
import { Database } from "../../connectors/postgresBD";

type Todo = { id: number; title: string; done: boolean };

export class TodoController {
  private seq = 1;
  private todos = new Map<number, Todo>();
  private db: Database = Database.instance;

  constructor() {
    this.db.connect();
  }

  private parseId(req: Request): number {
    return Number(req.params.id);
  }

  async list(req: Request, res: Response, _next: NextFunction): Promise<void> {
    res.json({ data: Array.from(this.todos.values()) });
  }

  async getById(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const id = this.parseId(req);
    const todo = this.todos.get(id);
    if (!todo) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ data: todo });
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = todoCreateSchema.parse(req.body);
      const id = this.seq++;
      const todo: Todo = { id, title: payload.title, done: false };
      this.todos.set(id, todo);
      res.status(201).json({ data: todo });
    } catch (err) {
      next(err);
    }
  }

  async replace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = this.parseId(req);
      if (!this.todos.has(id)) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const payload = todoCreateSchema.parse(req.body);
      const todo: Todo = { id, title: payload.title, done: false };
      this.todos.set(id, todo);
      res.json({ data: todo });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = this.parseId(req);
      const current = this.todos.get(id);
      if (!current) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const patch = todoUpdateSchema.parse(req.body);
      const updated: Todo = { ...current, ...patch };
      this.todos.set(id, updated);
      res.json({ data: updated });
    } catch (err) {
      next(err);
    }
  }

  async remove(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const id = this.parseId(req);
    if (!this.todos.has(id)) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    this.todos.delete(id);
    res.status(204).send();
  }

  async test(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const r: any = (
        await this.db.query(`SELECT ${Number(req.params.param)} AS value;`)
      ).rows;
      if (!r) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      const value = r[0]?.value;
      console.log(value);
      res.json({ data: value });
    } catch (err) {
      next(err);
    }
  }
}
