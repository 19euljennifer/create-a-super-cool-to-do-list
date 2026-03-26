import { useState, useCallback, useRef, useEffect } from "react";
import { Moon, Sun, ListTodo, Sparkles } from "lucide-react";
import { Todo, Priority, FilterStatus, SortBy } from "./types";
import { api } from "./api";
import { TodoForm } from "./components/TodoForm";
import { TodoItem } from "./components/TodoItem";
import { FilterBar } from "./components/FilterBar";
import { Confetti } from "./components/Confetti";
import { Toast } from "./components/Toast";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [confetti, setConfetti] = useState({ active: false, x: 0, y: 0 });
  const confettiTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const dragSource = useRef<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const showError = useCallback((msg: string) => {
    setError(msg);
  }, []);

  useEffect(() => {
    api.getAll()
      .then((data) => setTodos(data))
      .catch((err: Error) => showError(err.message))
      .finally(() => setLoading(false));
  }, [showError]);

  const triggerConfetti = useCallback((x: number, y: number) => {
    if (confettiTimer.current) clearTimeout(confettiTimer.current);
    setConfetti({ active: true, x, y });
    confettiTimer.current = setTimeout(() => setConfetti((c) => ({ ...c, active: false })), 1500);
  }, []);

  const addTodo = useCallback(
    async (title: string, description: string, priority: Priority, dueDate: string | null = null) => {
      try {
        const newTodo = await api.create({ title, description, priority, dueDate });
        setTodos((prev) => [newTodo, ...prev]);
      } catch (err) {
        showError(err instanceof Error ? err.message : "Failed to add task");
      }
    },
    [showError]
  );

  const toggleTodo = useCallback(async (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const updated = await api.toggle(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      showError(err instanceof Error ? err.message : "Failed to update task");
    }
  }, [showError]);

  const deleteTodo = useCallback(async (id: string) => {
    const original = todos.find((t) => t.id === id);
    setDeletingIds((prev) => new Set(prev).add(id));

    setTimeout(async () => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      try {
        await api.delete(id);
      } catch (err) {
        if (original) {
          setTodos((prev) => [...prev, original]);
        }
        showError(err instanceof Error ? err.message : "Failed to delete task");
      }
    }, 300);
  }, [todos, showError]);

  const handleDragStart = useCallback((id: string) => {
    dragSource.current = id;
  }, []);

  const handleDragOver = useCallback((id: string) => {
    setDragOverId(id);
  }, []);

  const handleDragEnd = useCallback(() => {
    const sourceId = dragSource.current;
    const targetId = dragOverId;
    dragSource.current = null;
    setDragOverId(null);

    if (!sourceId || !targetId || sourceId === targetId) return;

    setTodos((prev) => {
      const items = [...prev];
      const sourceIdx = items.findIndex((t) => t.id === sourceId);
      const targetIdx = items.findIndex((t) => t.id === targetId);
      if (sourceIdx === -1 || targetIdx === -1) return prev;
      const [moved] = items.splice(sourceIdx, 1);
      items.splice(targetIdx, 0, moved!);
      return items;
    });
  }, [dragOverId]);

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
      return 0;
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
      <Confetti active={confetti.active} x={confetti.x} y={confetti.y} />
      {error && <Toast message={error} onDismiss={() => setError(null)} />}
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
                  {loading ? "Loading..." : `${counts.active} task${counts.active !== 1 ? "s" : ""} remaining`}
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
          {!loading && todos.length > 0 && (
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
          {!loading && (
            <FilterBar
              filter={filter}
              sortBy={sortBy}
              onFilterChange={setFilter}
              onSortChange={setSortBy}
              counts={counts}
            />
          )}

          {/* Todo List */}
          <div className="space-y-2">
            {loading ? (
              <LoadingSkeleton />
            ) : filteredTodos.length === 0 ? (
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
                  onComplete={triggerConfetti}
                  isDeleting={deletingIds.has(todo.id)}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragOver={dragOverId === todo.id}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {!loading && todos.length > 0 && (
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
