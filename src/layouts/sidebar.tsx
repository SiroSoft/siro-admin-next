"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  ChevronLeft,
  LogOut,
  Package,
  Tags,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/providers/i18n-provider";
import { APP_NAME } from "@/lib/constants";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useI18n();

  const navItems = [
    { href: "/", label: t("common.dashboard"), icon: LayoutDashboard },
    { href: "/users", label: t("common.users"), icon: Users },
    { href: "/orders", label: t("common.orders"), icon: ShoppingCart },
    { href: "/products", label: t("common.products"), icon: Package },
    { href: "/categories", label: t("common.categories"), icon: Tags },
    { href: "/posts", label: t("common.posts"), icon: FileText },
    { href: "/profile", label: t("common.profile"), icon: User },
    { href: "/settings", label: t("common.settings"), icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-sidebar-border px-4 gap-2", collapsed && "justify-center")}>
        <Link href="/" className="flex items-center gap-2 truncate">
          <img src="/logo.svg" alt="Siro Admin" className="h-7 w-7 shrink-0" />
          {!collapsed && <span className="text-sm font-bold text-sidebar-foreground">{APP_NAME}</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("ml-auto text-sidebar-foreground hover:bg-sidebar-accent", collapsed && "ml-0")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      <div className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className={cn(
            "w-full justify-start text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground active:scale-[0.98]",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="ml-3">{t("common.logout")}</span>}
        </Button>
      </div>
    </aside>
  );
}
