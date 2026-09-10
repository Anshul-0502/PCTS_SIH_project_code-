import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type AppLanguage = 'en' | 'hi';

interface LanguageContextType {
  language: AppLanguage;
  voiceLanguage: AppLanguage;
  changeLanguage: (lang: AppLanguage) => void;
  changeVoiceLanguage: (lang: AppLanguage) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('careplus_lang') as AppLanguage) || 'en';
  });
  const [voiceLanguage, setVoiceLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('careplus_voice_lang') as AppLanguage) || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem('careplus_lang', language);
  }, [language, i18n]);

  useEffect(() => {
    localStorage.setItem('careplus_voice_lang', voiceLanguage);
  }, [voiceLanguage]);

  const changeLanguage = (lang: AppLanguage) => {
    setLanguage(lang);
  };

  const changeVoiceLanguage = (lang: AppLanguage) => {
    setVoiceLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        voiceLanguage,
        changeLanguage,
        changeVoiceLanguage,
      }}
    >
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
