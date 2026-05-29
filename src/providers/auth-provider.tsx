"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

const publicPaths = ["/login", "/forgot-password"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, restoreSession } = useAuthStore();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push("/login");
    }
    if (isAuthenticated && publicPaths.includes(pathname)) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  return <>{children}</>;
}
