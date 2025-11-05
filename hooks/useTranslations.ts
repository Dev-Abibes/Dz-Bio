
import { useState, useCallback } from 'react';
import { translations } from '../constants';
import { Language } from '../types';

type TranslationKey = keyof (typeof translations)['en'];

export const useTranslations = () => {
  const [language, setLanguage] = useState<Language>('fr');
  
  const setLang = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback((key: TranslationKey) => {
    return translations[language][key] || translations['en'][key];
  }, [language]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return { t, setLang, language, dir };
};
