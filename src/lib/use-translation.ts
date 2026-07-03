"use client";

import { useERPStore } from "@/stores/erp-store";
import { translations, type Language } from "@/lib/i18n";

export function useTranslation() {
  const language = useERPStore((s) => s.language);

  const t = (language === "am" ? translations.am : translations.en) as typeof translations.en;

  return {
    t,
    language,
    isAmharic: language === "am",
    toggleLanguage: () => {
      const newLang: Language = language === "en" ? "am" : "en";
      useERPStore.getState().setLanguage(newLang);
    },
  };
}
