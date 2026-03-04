import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from '../i18n/translations';

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  setLang: (l: Language) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
  isRTL: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) ?? 'en';
  });

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  };

  const isRTL = lang === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    // Load Arabic font when needed
    if (lang === 'ar') {
      const link = document.getElementById('arabic-font') as HTMLLinkElement | null;
      if (!link) {
        const el = document.createElement('link');
        el.id = 'arabic-font';
        el.rel = 'stylesheet';
        el.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap';
        document.head.appendChild(el);
      }
      document.documentElement.style.fontFamily = "'Cairo', 'Inter', sans-serif";
    } else {
      document.documentElement.style.fontFamily = "'Inter', sans-serif";
    }
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
