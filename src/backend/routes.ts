import { Router, Request, Response } from "express";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from "./store";
import { Priority } from "./types";

const router = Router();

const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];

function isValidPriority(value: unknown): value is Priority {
  return typeof value === "string" && VALID_PRIORITIES.includes(value as Priority);
}

// GET /todos
router.get("/", (_req: Request, res: Response) => {
  const todos = getAllTodos();
  res.json(todos);
});

// POST /todos
router.post("/", (req: Request, res: Response) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    res.status(400).json({ error: "Title is required and must be a non-empty string" });
    return;
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    res.status(400).json({ error: "Priority must be one of: low, medium, high" });
    return;
  }

  if (dueDate !== undefined && typeof dueDate !== "string") {
    res.status(400).json({ error: "dueDate must be a valid ISO date string" });
    return;
  }

  const todo = createTodo({ title: title.trim(), description, priority, dueDate });
  res.status(201).json(todo);
});

// PUT /todos/:id
router.put("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { title, description, priority, completed, dueDate } = req.body;

  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    res.status(400).json({ error: "Title must be a non-empty string" });
    return;
  }

  if (priority !== undefined && !isValidPriority(priority)) {
    res.status(400).json({ error: "Priority must be one of: low, medium, high" });
    return;
  }

  if (dueDate !== undefined && dueDate !== null && typeof dueDate !== "string") {
    res.status(400).json({ error: "dueDate must be a valid ISO date string or null" });
    return;
  }

  const updated = updateTodo(id, { title, description, priority, completed, dueDate });
  if (!updated) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.json(updated);
});

// DELETE /todos/:id
router.delete("/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const deleted = deleteTodo(id);

  if (!deleted) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.status(204).send();
});

// PATCH /todos/:id/toggle
router.patch("/:id/toggle", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const toggled = toggleTodo(id);

  if (!toggled) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  res.json(toggled);
});

export default router;
