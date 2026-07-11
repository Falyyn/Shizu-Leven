import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'id');

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  return (
    <LangContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
