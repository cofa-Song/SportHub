"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './dictionaries/en.json';
import zhTW from './dictionaries/zh-TW.json';
import zhCN from './dictionaries/zh-CN.json';

type Locale = 'zh-TW' | 'zh-CN' | 'en';
type Dictionaries = typeof zhTW;

interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Dictionaries;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Locale, Dictionaries> = {
    'en': en as Dictionaries,
    'zh-TW': zhTW as Dictionaries,
    'zh-CN': zhCN as Dictionaries,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [locale, setLocale] = useState<Locale>('zh-TW');

    // Load locale from localStorage on mount
    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && dictionaries[savedLocale]) {
            setLocale(savedLocale);
        }
    }, []);

    const handleSetLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.lang = newLocale;
    };

    return (
        <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, t: dictionaries[locale] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};
