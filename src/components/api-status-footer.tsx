"use client";

import { useEffect, useState } from "react";
import { API_URL, APP_VERSION, CORE_VERSION } from "@/lib/constants";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

/**
 * Login footer: skeleton version + live API reachability dot.
 * Fails silent (null = checking) so it never blocks the login form.
 */
export function ApiStatusFooter() {
  const { t } = useI18n();
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    fetch(`${API_URL}/health/ready`, { signal: ctrl.signal })
      .then((r) => setOnline(r.ok))
      .catch(() => setOnline(false));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  return (
    <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
      <span
        title={online === null ? t("login.apiChecking") : online ? t("login.apiOnline") : t("login.apiOffline")}
        className={cn(
          "inline-block h-2 w-2 rounded-full",
          online === null && "bg-muted-foreground/50",
          online === true && "bg-green-500",
          online === false && "bg-red-500",
        )}
      />
      SiroPHP v{APP_VERSION} · core v{CORE_VERSION} ·{" "}
      {online === null ? t("login.apiChecking") : online ? t("login.apiOnline") : t("login.apiOffline")}
    </p>
  );
}
