"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇹🇳" },
];

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Get current locale from pathname
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    const potentialLocale = segments[1];
    return languages.find(lang => lang.code === potentialLocale)?.code || 'en';
  };

  const currentLocale = getCurrentLocale();
  const currentLanguage = languages.find((lang) => lang.code === currentLocale);

  const handleLanguageChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const segments = pathname.split('/');
    const currentPathLocale = segments[1];
    
    // Check if current path starts with a locale
    const pathWithoutLocale = languages.some(lang => lang.code === currentPathLocale)
      ? '/' + segments.slice(2).join('/')
      : pathname;
    
    // Navigate to the new locale path
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-xs font-medium text-gray-700 hidden sm:inline">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        <span className="text-sm sm:hidden">
          {currentLanguage?.flag}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[160px] bg-white rounded-lg shadow-lg border border-gray-200 py-2"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                    currentLocale === language.code
                      ? "bg-lochmara-50 text-lochmara-600"
                      : "text-gray-700"
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm font-medium">{language.name}</span>
                  {currentLocale === language.code && (
                    <div className="ml-auto w-2 h-2 bg-lochmara-500 rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;