export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: Priority;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: Priority;
  completed?: boolean;
}
