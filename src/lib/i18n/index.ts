import { id } from "./id";
import { en } from "./en";
import type { Locale, TranslationSchema } from "./types";

export * from "./types";

export const translations: Record<Locale, TranslationSchema> = {
  id,
  en,
};

export function getTranslation(locale: Locale): TranslationSchema {
  return translations[locale] || translations.id;
}
