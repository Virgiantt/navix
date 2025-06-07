'use client'

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

interface Value {
  title: string;
  description: string;
}

const CultureValue: React.FC<Value & { isRTL: boolean }> = ({ title, description, isRTL }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-6 border-t border-gray-200"
    >
      <div className={`flex flex-col md:flex-row md:items-start md:justify-between ${isRTL ? "md:flex-row-reverse" : ""}`}>
        <h3 className={`text-lg font-semibold w-full md:w-1/3 ${isRTL ? "md:text-right" : ""}`}>{title}</h3>
        <p className={`text-[#7b7b7b] w-full md:w-1/2 ${isRTL ? "md:text-right" : ""}`}>{description}</p>
      </div>
    </motion.div>
  );
};

const Culture = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  const values = [
    {
      title: t("About.culture.values.relentlessExecution.title"),
      description: t("About.culture.values.relentlessExecution.description"),
    },
    {
      title: t("About.culture.values.ownershipResponsibility.title"),
      description: t("About.culture.values.ownershipResponsibility.description"),
    },
    {
      title: t("About.culture.values.clientFirst.title"),
      description: t("About.culture.values.clientFirst.description"),
    },
    {
      title: t("About.culture.values.calculatedInnovation.title"),
      description: t("About.culture.values.calculatedInnovation.description"),
    },
    {
      title: t("About.culture.values.consistentGrowth.title"),
      description: t("About.culture.values.consistentGrowth.description"),
    },
  ];
  

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <div className="px-6 py-10 2xl:w-4/5 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <p className={`text-sm uppercase tracking-wider text-gray-500 mb-6 ${isRTL ? "text-right" : ""}`}>
            {t("About.culture.title")}
          </p>
          <div className={`text-[#7b7b7b] max-w-3xl ${isRTL ? "text-right" : ""}`}>
            {t("About.culture.description")}
          </div>
        </motion.div>

        <div className="space-y-2">
          {values.map((value, index) => (
            <CultureValue
              key={index}
              title={value.title}
              description={value.description}
              isRTL={isRTL}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Culture;