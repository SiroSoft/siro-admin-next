"use client";

import { Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n, type TranslationKey } from "@/providers/i18n-provider";

const AUTH_TITLE_KEYS: Record<string, TranslationKey> = {
  "/login": "auth.signIn",
  "/register": "auth.signUp",
  "/forgot-password": "auth.forgotPassword",
  "/reset-password": "auth.resetTitle",
  "/verify-email": "auth.verifyTitle",
};

function AuthTitle() {
  const { t } = useI18n();
  const pathname = usePathname();

  useEffect(() => {
    const key = AUTH_TITLE_KEYS[pathname ?? ""] ?? "auth.signIn";
    document.title = `${t(key)} | Siro Admin`;
  }, [pathname, t]);

  return null;
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <AuthTitle />
      </Suspense>
      {children}
    </>
  );
}
