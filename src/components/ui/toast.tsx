"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { Toast } from "@/hooks/use-toast";

const toastVariants: Record<string, string> = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground shadow-lg",
  success: "border-green-500 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 shadow-lg",
  warning: "border-amber-500 bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-100 shadow-lg",
  info: "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100 shadow-lg",
};

const toastIcons: Record<string, React.ElementType> = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
      {toasts.map((t: Toast) => {
        const Icon = toastIcons[t.variant ?? "default"] ?? Info;
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-4 shadow-md animate-in slide-in-from-right-full",
              toastVariants[t.variant ?? "default"],
            )}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && (
                <p className="text-sm opacity-90">{t.description}</p>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
