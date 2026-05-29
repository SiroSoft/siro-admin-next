"use client";

import { Menu, Moon, Sun, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/layouts/user-nav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
        {pathname.split("/").filter(Boolean).map((segment, i, arr) => (
          <span key={segment} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            <span className={cn(i === arr.length - 1 && "text-foreground font-medium")}>
              {segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className={cn("h-5 w-5", theme === "dark" && "hidden")} />
        <Moon className={cn("h-5 w-5", theme !== "dark" && "hidden")} />
      </Button>

      <UserNav />
    </header>
  );
}
