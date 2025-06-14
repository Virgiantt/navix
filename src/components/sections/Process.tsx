"use client";
import React from "react";

import WordPullUp from "@/components/magicui/word-pull-up";
import { useTranslations } from "../../hooks/useTranslations";
import BoxRevealDemo from "../magicui/demo/Box-reveal-demo";
import { AnimatedBeamMultipleOutputDemo } from "../magicui/demo/animated-beam-demo";

const Process = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  // Get the title text based on locale
  const titleText = isRTL ? 
    t("Process.title.our") : 
    `${t("Process.title.our")} ${t("Process.title.process")}`;

  return (
    <section id="process">
      <main 
        className="md:px-0 mx-6 md:mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={`text-center mb-8`}>
          <WordPullUp
            className={`text-3xl md:text-5xl font-medium mb-4 ${
              isRTL ? "text-center" : "text-center"
            }`}
            words={titleText}
          />
        </div>
        <p className={`py-2 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 text-center`}>
          {t("Process.subtitle")}
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center w-full md:w-1/2 mx-auto">
          <div className="w-full md:w-1/2 md:order-1">
            <AnimatedBeamMultipleOutputDemo />
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2 md:ml-0"> 
            <BoxRevealDemo />
          </div>
        </div>
      </main>
    </section>
  );
};

export default Process;
