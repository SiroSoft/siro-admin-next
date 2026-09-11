"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import en from "@/locales/en";
import vi from "@/locales/vi";
import de from "@/locales/de";
import zh from "@/locales/zh";
import ja from "@/locales/ja";
import type { Locale } from "@/locales/en";

type NestedKeyOf<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}${T[K] extends Record<string, unknown> ? `.${NestedKeyOf<T[K]>}` : ""}` : never }[keyof T]
  : "";

export type TranslationKey = NestedKeyOf<Locale>;

type LocaleName = "en" | "vi" | "de" | "zh" | "ja";

interface I18nContextValue {
  locale: LocaleName;
  setLocale: (locale: LocaleName) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const locales: Record<LocaleName, Locale> = { en, vi, de, zh, ja };

function getValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleName>("en");

  useEffect(() => {
    const saved = localStorage.getItem("siro_locale");
    if (saved === "en" || saved === "vi" || saved === "de" || saved === "zh" || saved === "ja") setLocaleState(saved);
  }, []);

  const setLocale = useCallback((l: LocaleName) => {
    setLocaleState(l);
    localStorage.setItem("siro_locale", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return getValue(locales[locale] as unknown as Record<string, unknown>, key);
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
