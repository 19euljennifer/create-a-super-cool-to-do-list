import { useState, useCallback } from "react";
import { Moon, Sun, ListTodo, Sparkles } from "lucide-react";
import { Todo, Priority, FilterStatus, SortBy } from "./types";
import { TodoForm } from "./components/TodoForm";
import { TodoItem } from "./components/TodoItem";
import { FilterBar } from "./components/FilterBar";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const addTodo = useCallback(
    (title: string, description: string, priority: Priority, dueDate: string | null = null) => {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: generateId(),
        title,
        description,
        completed: false,
        priority,
        dueDate,
        createdAt: now,
        updatedAt: now,
      };
      setTodos((prev) => [newTodo, ...prev]);
    },
    []
  );

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  }, []);

  const priorityOrder: Record<Priority, number> = {
    high: 0,
    medium: 1,
    low: 2,
  };

  const filteredTodos = todos
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  const completionPercent = todos.length > 0
    ? Math.round((counts.completed / todos.length) * 100)
    : 0;

  return (
    <div className={dark ? "dark" : ""}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="header-gradient flex h-11 w-11 items-center justify-center rounded-xl shadow-lg">
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1
                  className="flex items-center gap-1.5 text-2xl font-bold tracking-tight"
                  style={{ color: "var(--color-text)" }}
                >
                  Super Cool To-Do
                  <Sparkles className="h-5 w-5" style={{ color: "var(--color-primary)" }} />
                </h1>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {counts.active} task{counts.active !== 1 ? "s" : ""} remaining
                </p>
              </div>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className="theme-toggle flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)",
                boxShadow: "0 1px 3px var(--color-shadow)",
              }}
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </header>

          {/* Progress bar */}
          {todos.length > 0 && (
            <div className="mb-6">
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="text-xs font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Progress
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {completionPercent}%
                </span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--color-border)" }}
              >
                <div
                  className="progress-bar h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completionPercent}%`,
                    background: "linear-gradient(90deg, var(--color-primary), #8b5cf6, #ec4899)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Add Todo Form */}
          <TodoForm onAdd={addTodo} />

          {/* Filter & Sort Bar */}
          <FilterBar
            filter={filter}
            sortBy={sortBy}
            onFilterChange={setFilter}
            onSortChange={setSortBy}
            counts={counts}
          />

          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.length === 0 ? (
              <div
                className="empty-bounce rounded-xl py-12 text-center"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  boxShadow: "0 1px 3px var(--color-shadow)",
                }}
              >
                <ListTodo
                  className="mx-auto mb-3 h-12 w-12"
                  style={{ color: "var(--color-border)" }}
                />
                <p
                  className="text-lg font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {filter === "all"
                    ? "No tasks yet"
                    : filter === "active"
                      ? "No active tasks"
                      : "No completed tasks"}
                </p>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {filter === "all"
                    ? "Add your first task above!"
                    : "Try changing the filter"}
                </p>
              </div>
            ) : (
              filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  isDeleting={deletingIds.has(todo.id)}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {todos.length > 0 && (
            <p
              className="mt-6 text-center text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {counts.completed} of {todos.length} task{todos.length !== 1 ? "s" : ""} completed
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
