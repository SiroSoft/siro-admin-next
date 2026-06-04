"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
      <h3 className="text-lg font-semibold">{title ?? t("errors.unknown")}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{message ?? t("errors.serverError")}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          {t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
}
