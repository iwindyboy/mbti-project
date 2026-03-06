import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';
import jaTranslations from '../locales/ja.json';

export type Language = 'ko' | 'en' | 'ja';

export interface Translations {
  [key: string]: any;
}

const translations: Record<Language, Translations> = {
  ko: koTranslations,
  en: enTranslations,
  ja: jaTranslations,
};

const LANGUAGE_KEY = 'SCAN_LANGUAGE';

/**
 * 시스템 언어 감지
 */
export const detectSystemLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'ko';
  }

  try {
    // 저장된 언어 설정 확인
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en' || savedLanguage === 'ja')) {
      return savedLanguage as Language;
    }

    // 브라우저 언어 감지
    const browserLang = navigator.language || (navigator as any).userLanguage;
    
    if (browserLang.startsWith('ko')) {
      return 'ko';
    } else if (browserLang.startsWith('ja')) {
      return 'ja';
    } else if (browserLang.startsWith('en')) {
      return 'en';
    }
    
    // 기본값은 한국어
    return 'ko';
  } catch (error) {
    console.error('Error detecting system language:', error);
    return 'ko';
  }
};

/**
 * 언어 설정 저장
 */
export const setLanguage = (lang: Language): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_KEY, lang);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

/**
 * 현재 언어 가져오기
 */
export const getCurrentLanguage = (): Language => {
  return detectSystemLanguage();
};

/**
 * 번역 함수
 */
export const t = (key: string, params?: Record<string, string | number>): string => {
  const currentLang = getCurrentLanguage();
  const translation = translations[currentLang] || translations.ko;
  
  // 키 경로로 값 찾기 (예: "menu.main" -> translation.menu.main)
  const keys = key.split('.');
  let value: any = translation;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // 번역이 없으면 한국어로 fallback
      const koValue = translations.ko;
      let fallbackValue: any = koValue;
      for (const fk of keys) {
        if (fallbackValue && typeof fallbackValue === 'object' && fk in fallbackValue) {
          fallbackValue = fallbackValue[fk];
        } else {
          return key; // 최종 fallback은 키 자체
        }
      }
      value = fallbackValue;
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // 파라미터 치환 (예: "Hello {name}" -> "Hello John")
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
};

/**
 * React Context를 위한 i18n 훅
 */
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectSystemLanguage());

  useEffect(() => {
    // 언어 변경 감지
    const savedLang = localStorage.getItem(LANGUAGE_KEY);
    if (savedLang && (savedLang === 'ko' || savedLang === 'en' || savedLang === 'ja')) {
      setLanguageState(savedLang as Language);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    // Context가 없을 때 기본값 반환
    return {
      language: 'ko',
      setLanguage: () => {},
      t,
    };
  }
  return context;
};
