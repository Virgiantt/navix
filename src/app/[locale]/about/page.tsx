"use client"
import MainLayout from '@/components/main-layout'
import React from 'react'
import Culture from './culture'
import Team from './Team'
import { BoxReveal } from '@/components/magicui/box-reveal'
import { useTranslations } from '@/hooks/useTranslations'

const AboutPage = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <MainLayout>
          <div className='container' dir={isRTL ? "rtl" : "ltr"}>
            <div className={`mx-auto flex items-center ${isRTL ? "text-right" : "text-left"}`}>
              <div className="max-w-5xl">
                <h1 className={`text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    {t("About.hero.title1")}
                  </BoxReveal>
                  <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                    {t("About.hero.title2")}
                  </BoxReveal>
                </h1>
                <p className={`text-medium md:text-xl text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
                  {t("About.hero.description")}
                </p>
              </div>
            </div>
            <Culture />
            <Team />
          </div>
        </MainLayout>
      </div>
    </div>
  )
}

export default AboutPage
