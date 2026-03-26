import crypto from "crypto";
import { Todo, CreateTodoInput, UpdateTodoInput } from "./types";

const todos: Map<string, Todo> = new Map();

export function getAllTodos(): Todo[] {
  return Array.from(todos.values());
}

export function getTodoById(id: string): Todo | undefined {
  return todos.get(id);
}

export function createTodo(input: CreateTodoInput): Todo {
  const todo: Todo = {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description ?? "",
    completed: false,
    priority: input.priority ?? "medium",
    createdAt: new Date().toISOString(),
  };
  todos.set(todo.id, todo);
  return todo;
}

export function updateTodo(id: string, input: UpdateTodoInput): Todo | null {
  const existing = todos.get(id);
  if (!existing) return null;

  const changes: Partial<Todo> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      (changes as Record<string, unknown>)[key] = value;
    }
  }

  const updated: Todo = { ...existing, ...changes };
  todos.set(id, updated);
  return updated;
}

export function deleteTodo(id: string): boolean {
  return todos.delete(id);
}

export function toggleTodo(id: string): Todo | null {
  const existing = todos.get(id);
  if (!existing) return null;

  existing.completed = !existing.completed;
  todos.set(id, existing);
  return existing;
}
