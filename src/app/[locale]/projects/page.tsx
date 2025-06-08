import { notFound } from 'next/navigation';
import { BoxReveal } from '@/components/magicui/box-reveal'
import MainLayout from '@/components/main-layout'
import React from 'react'
import ProjectHero from './hero'

const locales = ['en', 'fr', 'ar'] as const;
type Locale = typeof locales[number];

// Inline translations object
const translations = {
  en: {
    title1: "Projects that speak,",
    title2: "results that matter.",
    description: "Each project we take on is built around one goal: growth. From boosting ROAS through paid ads to designing landing pages that convert — here's a glimpse of what we've delivered for our partners."
  },
  fr: {
    title1: "Des projets qui parlent,",
    title2: "des résultats qui comptent.",
    description: "Chaque projet que nous entreprenons est construit autour d'un objectif : la croissance. De l'augmentation du ROAS grâce aux publicités payantes à la conception de pages d'atterrissage qui convertissent — voici un aperçu de ce que nous avons livré pour nos partenaires."
  },
  ar: {
    title1: "مشاريع تتحدث،",
    title2: "نتائج مهمة.",
    description: "كل مشروع نتولاه مبني حول هدف واحد: النمو. من زيادة العائد على الإنفاق الإعلاني (ROAS) عبر الإعلانات المدفوعة إلى تصميم صفحات هبوط تحقق التحويلات — إليك لمحة عما حققناه لشركائنا."
  }
};

interface ProjectsPageProps {
  params: Promise<{locale: string}>;
}

const ProjectsPage = async ({ params }: ProjectsPageProps) => {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const isRTL = locale === "ar";
  const t = translations[locale as Locale];

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <MainLayout>
          <div className='container mx-auto px-4 py-20' dir={isRTL ? "rtl" : "ltr"}>
            <div className={`mx-auto flex items-center justify-center mb-16 ${isRTL ? "text-right" : "text-center"}`}>
              <div className="max-w-5xl">
                <h1 className={`text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-8 ${isRTL ? "text-right" : "text-center"}`}>
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    <span>{t.title1}</span>
                  </BoxReveal>
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    <span>{t.title2}</span>
                  </BoxReveal>
                </h1>
                <BoxReveal boxColor={"#4083b7"} duration={0.7}>
                  <p className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto ${isRTL ? "text-right" : "text-center"}`}>
                    {t.description}
                  </p>
                </BoxReveal>
              </div>
            </div>
            <ProjectHero locale={locale as Locale} />
          </div>
        </MainLayout>
      </div>
    </div>
  )
}

export default ProjectsPage
