"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

let toastListeners: Array<(toast: Toast) => void> = [];
let toastCount = 0;

export function toast({ title, description, variant = "default" }: Omit<Toast, "id">) {
  const id = String(++toastCount);
  const newToast: Toast = { id, title, description, variant };
  toastListeners.forEach((listener) => listener(newToast));
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id));
    }, 5000);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useState(() => {
    toastListeners.push(addToast);
    function handleCustomEvent(e: Event) {
      const detail = (e as CustomEvent).detail;
      toast(detail);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("app:toast", handleCustomEvent);
    }
    return () => {
      toastListeners = toastListeners.filter((l) => l !== addToast);
      if (typeof window !== "undefined") {
        window.removeEventListener("app:toast", handleCustomEvent);
      }
    };
  });

  return { toasts, dismiss };
}
