"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n, type TranslationKey } from "@/providers/i18n-provider";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header"; import { OpenSourceLinks } from "@/components/open-source-links";
import { MobileSidebar } from "@/layouts/mobile-sidebar";
import { cn } from "@/lib/utils";

const SEGMENT_TITLE_KEYS: Record<string, TranslationKey> = {
  "": "common.dashboard",
  users: "common.users",
  orders: "common.orders",
  products: "common.products",
  categories: "common.categories",
  tags: "common.tags",
  posts: "common.posts",
  profile: "common.profile",
  settings: "common.settings",
};

function DashboardTitle() {
  const { t } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const segment = (pathname ?? "/").split("/")[1] ?? "";
    const key = SEGMENT_TITLE_KEYS[segment] ?? "common.dashboard";
    document.title = `${t(key)} | Siro Admin`;
  }, [pathname, t]);

  return null;
}

const SIDEBAR_KEY = "siro_sidebar_collapsed";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_KEY) === "1";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        // private mode etc. — collapse simply won't persist
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense>
        <DashboardTitle />
      </Suspense>
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-60",
        )}
      >
        <Header onMenuToggle={() => setMobileOpen(true)} />

        <main className="p-4 lg:p-6 animate-fade-in">
          {children}
        </main>
        <footer className="px-4 pb-6 lg:px-6">
          <OpenSourceLinks compact />
        </footer>
      </div>
    </div>
  );
}
