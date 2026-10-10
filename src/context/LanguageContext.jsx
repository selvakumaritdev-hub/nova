import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const languages = [
  { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧' },
  { code: 'ta', label: 'தமிழ்', short: 'தமிழ்', flag: '🇮🇳' },
  { code: 'hi', label: 'हिन्दी', short: 'हिन्दी', flag: '🇮🇳' }
];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('nova_language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('nova_language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key, params = {}) => {
    const langDict = translations[language] || translations.en;
    let text = langDict[key] || translations.en[key] || key;

    // Interpolate dynamic parameters like {amount}, {count}
    Object.keys(params).forEach(param => {
      text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), params[param]);
    });

    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
