import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../config/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Read persisted language choice or default to English
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lawai_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lawai_lang', language);
  }, [language]);

  // Translation lookup helper function
  const t = (key) => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
