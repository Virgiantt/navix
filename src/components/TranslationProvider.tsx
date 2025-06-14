"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

interface TranslationContextType {
  isTranslationsReady: boolean;
  locale: string;
}

const TranslationContext = createContext<TranslationContextType>({
  isTranslationsReady: false,
  locale: 'en'
});

export const useTranslationReady = () => useContext(TranslationContext);

interface TranslationProviderProps {
  children: React.ReactNode;
}

export default function TranslationProvider({ children }: TranslationProviderProps) {
  const locale = useLocale();
  const [isTranslationsReady, setIsTranslationsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure next-intl has fully initialized
    const timer = setTimeout(() => {
      setIsTranslationsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [locale]);

  // Show a minimal loading state while translations are loading
  if (!isTranslationsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-lochmara-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <TranslationContext.Provider value={{ isTranslationsReady, locale }}>
      {children}
    </TranslationContext.Provider>
  );
}