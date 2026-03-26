export function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl p-4"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="skeleton h-5 w-5 shrink-0 rounded-md"
            style={{ backgroundColor: "var(--color-border)" }}
          />
          <div className="flex-1 space-y-2">
            <div
              className="skeleton h-4 rounded"
              style={{ backgroundColor: "var(--color-border)", width: `${60 + i * 10}%` }}
            />
            <div
              className="skeleton h-3 rounded"
              style={{ backgroundColor: "var(--color-border)", width: `${40 + i * 5}%` }}
            />
          </div>
          <div
            className="skeleton h-5 w-14 shrink-0 rounded-md"
            style={{ backgroundColor: "var(--color-border)" }}
          />
        </div>
      ))}
    </div>
  );
}
