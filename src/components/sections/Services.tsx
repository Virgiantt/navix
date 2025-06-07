"use client";
import React from "react";

import Image from "next/image";
import { WordPullUpDemo } from "../magicui/demo/word-pull-up-demo";
import { useTranslations } from "../../hooks/useTranslations";

const Services = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  const services = [
    {
      icon: "/images/s_6.png",
      title: t("Services.items.webDevelopment.title"),
      description: t("Services.items.webDevelopment.description"),
    },
    {
      icon: "/images/s_1.png",
      title: t("Services.items.mediaBuying.title"),
      description: t("Services.items.mediaBuying.description"),
    },
    {
      icon: "/images/s_5.png",
      title: t("Services.items.videoProduction.title"),
      description: t("Services.items.videoProduction.description"),
    },
    {
      icon: "/images/s_3.png",
      title: t("Services.items.marketingStrategy.title"),
      description: t("Services.items.marketingStrategy.description"),
    },
    {
      icon: "/images/s_4.png",
      title: t("Services.items.emailSystems.title"),
      description: t("Services.items.emailSystems.description"),
    },
    {
      icon: "/images/s_2.png",
      title: t("Services.items.analytics.title"),
      description: t("Services.items.analytics.description"),
    },
  ];
      
  return (
    <section id="services" className="container">
      <div 
        className="md:px-0 mx-6 xl:w-4/5 2xl:w-[68%] md:mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <WordPullUpDemo />
        <p className={`text-center py-4 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 ${isRTL ? 'text-center' : 'text-center'}`}>
          {t("Services.subtitle")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {services.map((service) => (
            <div
              key={service.title}
              className={`flex flex-col justify-between h-full space-y-4 bg-lochmara-100 p-4 cursor-pointer hover:scale-105 transition-transform rounded-md ${isRTL ? 'text-center' : 'text-center'}`}
            >
              <Image
                src={service.icon}
                width={10000}
                height={10000}
                className="object-contain bg-lochmara-100 p-4 w-full h-40 rounded-md"
                alt="service icon"
              />
              <h1 className="text-xl font-medium">{service.title}</h1>
              <p className="text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
