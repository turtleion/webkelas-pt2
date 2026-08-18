import { usePreferences } from "./use-preferences";
import { getTranslation, type TranslationSchema, type Locale } from "@/lib/i18n";

export interface UseTranslationReturn {
  t: TranslationSchema;
  locale: Locale;
  setLocale: (lang: Locale) => Promise<void>;
  interpolate: (template: string, vars: Record<string, string | number>) => string;
}

export function useTranslation(): UseTranslationReturn {
  const { preferences, setLanguage } = usePreferences();
  const locale: Locale = preferences.language || "id";
  const t = getTranslation(locale);

  const interpolate = (template: string, vars: Record<string, string | number>): string => {
    return Object.entries(vars).reduce((acc, [key, val]) => {
      return acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
    }, template);
  };

  return {
    t,
    locale,
    setLocale: setLanguage,
    interpolate,
  };
}
