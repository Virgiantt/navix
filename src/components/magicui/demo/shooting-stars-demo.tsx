"use client";
import React from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Image from "next/image";
import { useTranslations } from "@/hooks/useTranslations";

export function ShootingStarsAndStarsBackgroundDemo() {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  const features = [
    {
      icon: "/icons/fast.svg",
      title: t("Guarantees.features.rapidExecution.title"),
      description: t("Guarantees.features.rapidExecution.description"),
    },
    {
      icon: "/icons/design.svg",
      title: t("Guarantees.features.fullStackDevelopment.title"),
      description: t("Guarantees.features.fullStackDevelopment.description"),
    },
    {
      icon: "/icons/scalable.svg",
      title: t("Guarantees.features.growthReady.title"),
      description: t("Guarantees.features.growthReady.description"),
    },
    {
      icon: "/icons/team.svg",
      title: t("Guarantees.features.crossDisciplinary.title"),
      description: t("Guarantees.features.crossDisciplinary.description"),
    },
    {
      icon: "/icons/safe.svg",
      title: t("Guarantees.features.enterpriseSecurity.title"),
      description: t("Guarantees.features.enterpriseSecurity.description"),
    },
    {
      icon: "/icons/analytics.svg",
      title: t("Guarantees.features.realTimeTracking.title"),
      description: t("Guarantees.features.realTimeTracking.description"),
    },
    {
      icon: "/icons/flexible.svg",
      title: t("Guarantees.features.dynamicCMS.title"),
      description: t("Guarantees.features.dynamicCMS.description"),
    },
    {
      icon: "/icons/support.svg",
      title: t("Guarantees.features.priorityResponse.title"),
      description: t("Guarantees.features.priorityResponse.description"),
    },
    {
      icon: "/icons/money.svg",
      title: t("Guarantees.features.roiPricing.title"),
      description: t("Guarantees.features.roiPricing.description"),
    },
  ];

  return (
    <div
      className="mt-20 py-10 md:py-20 bg-neutral-900 flex flex-col items-center justify-center relative w-full px-6 md:px-0"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h2
        className={`relative flex-col z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-400 via-white to-white flex items-center gap-2 ${
          isRTL ? "text-right" : ""
        }`}
      >
        {t("Guarantees.title")}
        <p
          className={`md:text-center mx-auto text-xl md:text-2xl text-gray-200 ${
            isRTL ? "text-right" : ""
          }`}
        >
          {t("Guarantees.subtitle")}
        </p>
      </h2>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 z-40 xl:w-4/5 2xl:w-[68%] mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col p-10 bg-neutral-800 rounded-xl cursor-pointer"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <button className="w-16 p-4 animate-shine flex items-center justify-center rounded-md bg-gradient-to-br from-neutral-700 to-neutral-800 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              <Image
                src={feature.icon}
                width={10000}
                height={10000}
                alt="icon"
                className="w-8 h-8"
              />
            </button>

            <h3
              className={`text-xl font-bold mt-4 text-white ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {feature.title}
            </h3>
            <p
              className={`text-gray-200 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <ShootingStars />
      <StarsBackground />
    </div>
  );
}