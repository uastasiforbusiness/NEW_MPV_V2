"use client";

import { useEffect, useState, createContext, useContext, useCallback, type ReactNode } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const typeStyles: Record<ToastType, string> = {
  success:
    "bg-[var(--success)] text-white",
  error:
    "bg-[var(--error)] text-white",
  warning:
    "bg-[var(--warning)] text-white",
  info:
    "bg-[var(--brand-charcoal)] text-white",
};

const typeIcons: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={`
        ${typeStyles[toast.type]}
        px-4 py-3 rounded-[var(--radius-md)]
        shadow-lg text-sm font-medium
        animate-in slide-in-from-right
        flex items-center gap-2.5
        min-w-[280px] max-w-[420px]
        transition-all duration-[var(--transition-base)]
      `}
      role="alert"
    >
      <span className="text-base flex-shrink-0">{typeIcons[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0 rounded-[var(--radius-sm)]"
        aria-label="Chiudi notifica"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
