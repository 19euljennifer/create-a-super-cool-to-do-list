import { Todo, Priority } from "./types";

const BASE = "/todos";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  getAll: () => request<Todo[]>(BASE),

  create: (data: { title: string; description: string; priority: Priority; dueDate: string | null }) =>
    request<Todo>(BASE, { method: "POST", body: JSON.stringify(data) }),

  toggle: (id: string) =>
    request<Todo>(`${BASE}/${id}/toggle`, { method: "PATCH" }),

  delete: (id: string) =>
    request<void>(`${BASE}/${id}`, { method: "DELETE" }),

  update: (id: string, data: Partial<Pick<Todo, "title" | "description" | "priority" | "completed" | "dueDate">>) =>
    request<Todo>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};
