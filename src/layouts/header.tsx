"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/layouts/user-nav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

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
