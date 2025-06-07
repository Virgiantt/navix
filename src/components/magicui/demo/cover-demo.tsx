import React from "react";
import { Cover } from "@/components/ui/cover";
import { useTranslations } from "../../../hooks/useTranslations";

export function CoverDemo() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <h1
        className={`text-3xl md:text-6xl 
        font-semibold
        max-w-7xl 
        mx-auto 
        ${isRTL ? 'text-right md:text-center' : 'md:text-center'}
        relative
        z-20 
        bg-clip-text
        text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mb-4`}
      >
        {t('Cover.title')}
        <br className="my-2" />
        <Cover>{t('Cover.subtitle')}</Cover>
      </h1>
    </div>
  );
}