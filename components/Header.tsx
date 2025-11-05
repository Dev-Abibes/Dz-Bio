import React from 'react';
import { Language } from '../types';

interface HeaderProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  t: (key: any) => string;
  isAdmin: boolean;
  onLogout: () => void;
}

const languages: { code: Language; name: string }[] = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
];

const Header: React.FC<HeaderProps> = ({ currentLanguage, onLanguageChange, t, isAdmin, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="#/" className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          Luminaires Algériens
        </a>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md py-1 ps-2 pe-8 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Select language"
            >
              {languages.map(({ code, name }) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
            >
              {t('logout_button')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
