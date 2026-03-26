import { ArrowUpDown } from "lucide-react";
import { FilterStatus, SortBy } from "../types";

interface FilterBarProps {
  filter: FilterStatus;
  sortBy: SortBy;
  onFilterChange: (filter: FilterStatus) => void;
  onSortChange: (sort: SortBy) => void;
  counts: Record<FilterStatus, number>;
}

const FILTERS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export function FilterBar({
  filter,
  sortBy,
  onFilterChange,
  onSortChange,
  counts,
}: FilterBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      {/* Filter tabs */}
      <div
        className="flex rounded-lg p-1"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className="relative rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: filter === key ? "var(--color-primary)" : "transparent",
              color: filter === key ? "white" : "var(--color-text-secondary)",
            }}
          >
            {label}
            <span
              className="ml-1 text-[10px] opacity-70"
            >
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Sort toggle */}
      <button
        onClick={() => onSortChange(sortBy === "date" ? "priority" : "date")}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        <ArrowUpDown className="h-3 w-3" />
        {sortBy === "date" ? "By Date" : "By Priority"}
      </button>
    </div>
  );
}
