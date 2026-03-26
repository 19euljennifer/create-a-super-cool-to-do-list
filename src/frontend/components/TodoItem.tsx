import { useState } from "react";
import { Check, Trash2, Clock, CalendarDays } from "lucide-react";
import { Todo, Priority } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const PRIORITY_STYLES: Record<Priority, { color: string; bg: string; label: string }> = {
  high: { color: "var(--color-high)", bg: "var(--color-high-bg)", label: "High" },
  medium: { color: "var(--color-medium)", bg: "var(--color-medium-bg)", label: "Medium" },
  low: { color: "var(--color-low)", bg: "var(--color-low-bg)", label: "Low" },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function TodoItem({ todo, onToggle, onDelete, isDeleting }: TodoItemProps) {
  const priority = PRIORITY_STYLES[todo.priority];
  const [justToggled, setJustToggled] = useState(false);

  const handleToggle = () => {
    setJustToggled(true);
    onToggle(todo.id);
    setTimeout(() => setJustToggled(false), 300);
  };

  return (
    <div
      className={`todo-card group flex items-start gap-3 rounded-xl p-4 ${
        isDeleting ? "todo-exit" : "todo-enter"
      }`}
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 1px 3px var(--color-shadow)",
      }}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 ${
          justToggled ? "check-pulse" : ""
        }`}
        style={{
          border: todo.completed ? "none" : `2px solid ${priority.color}`,
          backgroundColor: todo.completed ? priority.color : "transparent",
        }}
        aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {todo.completed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium transition-all duration-300 ${
                todo.completed ? "strikethrough" : ""
              }`}
              style={{ color: todo.completed ? "var(--color-completed)" : "var(--color-text)" }}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className={`mt-0.5 text-xs transition-all duration-300 ${
                  todo.completed ? "strikethrough" : ""
                }`}
                style={{ color: "var(--color-text-secondary)" }}
              >
                {todo.description}
              </p>
            )}
          </div>

          {/* Priority badge */}
          <span
            className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{
              color: priority.color,
              backgroundColor: priority.bg,
            }}
          >
            {priority.label}
          </span>
        </div>

        {/* Meta info */}
        <div
          className="mt-2 flex items-center gap-3"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-[11px]">{formatDate(todo.createdAt)}</span>
          </div>
          {todo.dueDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              <span className="text-[11px]">
                Due {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(todo.id)}
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-0 transition-all duration-200 hover:scale-110 group-hover:opacity-100"
        style={{
          color: "var(--color-high)",
          backgroundColor: "var(--color-high-bg)",
        }}
        aria-label="Delete task"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
