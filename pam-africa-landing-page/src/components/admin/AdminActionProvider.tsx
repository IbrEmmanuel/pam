"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Toast = {
  id: number;
  message: string;
  loading?: boolean;
  error?: boolean;
};

type AdminActionContextValue = {
  runAction: <T>(message: string, fn: () => Promise<T>) => Promise<T>;
};

const AdminActionContext = createContext<AdminActionContextValue | null>(null);

export function AdminActionProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const runAction = useCallback(
    async <T,>(message: string, fn: () => Promise<T>): Promise<T> => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, loading: true }]);
      try {
        const result = await fn();
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, message: `${message} — done`, loading: false } : t
          )
        );
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
        return result;
      } catch (error) {
        const errMsg =
          error instanceof Error && error.message
            ? error.message
            : "Something went wrong. Please try again.";
        setToasts((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, message: errMsg, loading: false, error: true }
              : t
          )
        );
        throw error;
      }
    },
    []
  );

  const value = useMemo(() => ({ runAction }), [runAction]);

  return (
    <AdminActionContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border px-4 py-3 text-sm shadow-lg ${
              toast.error
                ? "border-red-500/40 bg-red-950 text-red-100"
                : "border-white/15 bg-[#131313] text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.loading && (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminActionContext.Provider>
  );
}

export function useAdminAction() {
  const ctx = useContext(AdminActionContext);
  if (!ctx) {
    return {
      runAction: async <T,>(_message: string, fn: () => Promise<T>) => fn(),
    };
  }
  return ctx;
}
