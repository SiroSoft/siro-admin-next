"use client";

import { useI18n } from "@/providers/i18n-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as "en" | "vi" | "de" | "zh" | "ja")}>
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇬🇧 English</SelectItem>
        <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
        <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
        <SelectItem value="zh">🇨🇳 中文</SelectItem>
        <SelectItem value="ja">🇯🇵 日本語</SelectItem>
      </SelectContent>
    </Select>
  );
}
