import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Priority } from "../types";

interface TodoFormProps {
  onAdd: (title: string, description: string, priority: Priority, dueDate: string | null) => void;
}

const PRIORITY_CONFIG = {
  low: { label: "Low", color: "var(--color-low)", bg: "var(--color-low-bg)" },
  medium: { label: "Medium", color: "var(--color-medium)", bg: "var(--color-medium-bg)" },
  high: { label: "High", color: "var(--color-high)", bg: "var(--color-high-bg)" },
} as const;

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), priority, dueDate || null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setExpanded(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-2xl p-4 transition-all duration-300"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:opacity-50 focus:ring-2"
          style={{
            backgroundColor: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            "--tw-ring-color": "var(--color-primary)",
          } as React.CSSProperties}
          onFocus={() => setExpanded(true)}
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
          }}
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: expanded ? "280px" : "0", opacity: expanded ? 1 : 0 }}
      >
        <div className="mt-3 space-y-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description (optional)"
            rows={2}
            className="w-full resize-none rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200 placeholder:opacity-50 focus:ring-2"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
              "--tw-ring-color": "var(--color-primary)",
            } as React.CSSProperties}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Priority:
              </span>
              <div className="flex gap-1.5">
                {(Object.entries(PRIORITY_CONFIG) as [Priority, (typeof PRIORITY_CONFIG)[Priority]][]).map(
                  ([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPriority(key)}
                      className="rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                      style={{
                        backgroundColor: priority === key ? config.bg : "transparent",
                        color: priority === key ? config.color : "var(--color-text-secondary)",
                        border: `1px solid ${priority === key ? config.color : "var(--color-border)"}`,
                      }}
                    >
                      {config.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" style={{ color: "var(--color-text-secondary)" }} />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-lg px-3 py-1 text-xs outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1 text-xs transition-colors duration-200 hover:opacity-70"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <ChevronUp className="h-3 w-3" />
              Less
            </button>
          </div>
        </div>
      </div>

      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-2 flex items-center gap-1 text-xs transition-colors duration-200 hover:opacity-70"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <ChevronDown className="h-3 w-3" />
          Add details
        </button>
      )}
    </form>
  );
}
