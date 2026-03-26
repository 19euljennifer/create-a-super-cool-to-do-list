import { useEffect } from "react";
import { X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className="toast-enter fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 shadow-lg"
      style={{
        backgroundColor: "var(--color-high-bg)",
        border: "1px solid var(--color-high)",
        color: "var(--color-high)",
      }}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onDismiss}
        className="ml-2 shrink-0 rounded-md p-0.5 transition-opacity hover:opacity-70"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
