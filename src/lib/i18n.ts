import en from "@/locales/en";
import vi from "@/locales/vi";
import de from "@/locales/de";
import zh from "@/locales/zh";
import ja from "@/locales/ja";

export { useI18n } from "@/providers/i18n-provider";
export type { Locale } from "@/locales/en";

export const dictionaries = { en, vi, de, zh, ja } as const;

export type LocaleName = keyof typeof dictionaries;

export function getLocaleDictionary(locale?: string | null): typeof en {
  if (locale === "vi" || locale === "de" || locale === "zh" || locale === "ja") {
    return dictionaries[locale];
  }
  return dictionaries.en;
}

export function getCurrentLocale(): LocaleName {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("siro_locale");
    if (saved === "vi" || saved === "de" || saved === "zh" || saved === "ja") return saved;
  }
  return "en";
}

function getValueByPath(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

/** Non-React translation helper for module-level code (e.g. zod schemas). */
export function tSchema(key: string): string {
  const locale = getCurrentLocale();
  const dict = getLocaleDictionary(locale) as unknown as Record<string, unknown>;
  return (
    getValueByPath(dict, key) ??
    getValueByPath(dictionaries.en as unknown as Record<string, unknown>, key) ??
    key
  );
}
