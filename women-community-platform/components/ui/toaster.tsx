"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitive.Provider;
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;

type ToastVariant = "default" | "success" | "error" | "warning";

interface ToastContextValue {
  toast: (opts: { title: string; description?: string; variant?: ToastVariant }) => void;
}

const ToastContext = React.createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return React.useContext(ToastContext);
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((opts: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...opts }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {toasts.map((t) => (
          <ToastPrimitive.Root
            key={t.id}
            className={cn(
              "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-card-hover transition-all",
              t.variant === "success" && "border-teal-200 bg-teal-50",
              t.variant === "error" && "border-red-200 bg-red-50",
              t.variant === "warning" && "border-amber-200 bg-amber-50",
              (!t.variant || t.variant === "default") && "border-purple-200 bg-white",
            )}
          >
            <div className="mt-0.5">
              {t.variant === "success" && <CheckCircle className="h-4 w-4 text-teal-600" />}
              {t.variant === "error" && <AlertCircle className="h-4 w-4 text-red-600" />}
              {(!t.variant || t.variant === "default") && <Info className="h-4 w-4 text-purple-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <ToastPrimitive.Title className="text-sm font-semibold text-foreground">
                {t.title}
              </ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="rounded-full p-0.5 hover:bg-gray-100 transition-colors">
              <X className="h-3 w-3" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}
