"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const toastVariants = {
  default: "border bg-background text-foreground",
  destructive: "border-destructive bg-destructive text-destructive-foreground shadow-lg",
};

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-md">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border p-4 shadow-md animate-in slide-in-from-right-full",
            toastVariants[t.variant ?? "default"],
          )}
        >
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
      ))}
    </div>
  );
}
