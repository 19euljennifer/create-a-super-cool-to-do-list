export type Priority = "low" | "medium" | "high";
export type FilterStatus = "all" | "active" | "completed";
export type SortBy = "date" | "priority" | "dueDate";

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
