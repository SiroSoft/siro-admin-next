"use client";

import { useState } from "react";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { MobileSidebar } from "@/layouts/mobile-sidebar";
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div
        className={cn(
          "transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-60",
        )}
      >
        <Header onMenuToggle={() => setMobileOpen(true)} />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
