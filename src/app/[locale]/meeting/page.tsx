"use client"
import MainLayout from '@/components/main-layout'
import { motion } from 'framer-motion'
import React from 'react'
import { PiCheckCircle } from 'react-icons/pi'
import { BoxReveal } from '@/components/magicui/box-reveal'
import AIContactForm from '@/components/AIContactForm'
import { useTranslations } from '@/hooks/useTranslations'

const checkItemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
};
  
const MeetingPage = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  const features = [
    {
      title: t("Meeting.features.aiDiscovery.title"),
      description: t("Meeting.features.aiDiscovery.description"),
    },
    {
      title: t("Meeting.features.personalizedSession.title"),
      description: t("Meeting.features.personalizedSession.description"),
    },
    {
      title: t("Meeting.features.actionableSteps.title"),
      description: t("Meeting.features.actionableSteps.description"),
    },
  ];

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]">
        <MainLayout>
          <div className={`md:px-0 px-6 xl:w-4/5 2xl:w-[68%] justify-between md:mt-14 md:flex mx-auto ${isRTL ? "md:flex-row-reverse" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
            <div className="md:w-2/5">
              <div className="mx-auto flex items-center">
                <div className="max-w-5xl">
                  <h1 className={`text-4xl xl:text-6xl 2xl:text-7xl font-bold mb-8 ${isRTL ? "text-right" : "text-left"}`}>
                    <BoxReveal boxColor={"#4083b7"} duration={0.5}>
                      {t("Meeting.hero.title")}
                    </BoxReveal>
                  </h1>
                  <p className={`text-medium md:text-xl text-gray-600 ${isRTL ? "text-right" : "text-left"}`}>
                    {t("Meeting.hero.description")}
                  </p>
                </div>
              </div>

              {features.map((item, index) => (
                <motion.div
                  key={index}
                  variants={checkItemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.3 }}
                  className={`flex gap-x-4 py-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}
                >
                  <PiCheckCircle className="rounded-md text-[#3d80d7] text-2xl flex-shrink-0" />
                  <ul>
                    <h3 className="text-lg font-bold text-gray-700">
                      {item.title}
                    </h3>
                    <div className="text-gray-400">{item.description}</div>
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="md:w-1/2 mt-8 md:mt-0">
              <AIContactForm />
            </div>
          </div>
        </MainLayout>
      </div>
    </div>
  )
}

export default MeetingPage
