"use client";
import React from "react";

import { FlipWords } from "../ui/flip-words";
import { useTranslations } from "../../hooks/useTranslations";
import BoxRevealDemo from "../magicui/demo/Box-reveal-demo";
import { AnimatedBeamMultipleOutputDemo } from "../magicui/demo/animated-beam-demo";

const Process = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";
  
  const words = t("Process.words");

  return (
    <section id="process">
      <main 
        className="md:px-0 mx-6 md:mx-auto"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <h1 className={`text-3xl md:text-5xl md:text-center font-medium flex flex-wrap items-center justify-center gap-x-2 mx-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
          {isRTL ? (
            // Arabic: "عمليتنا [FlipWords]" (Our [Adjective] Process)
            <>
         
              <span className="text-lochmara-500 inline-flex min-h-[4rem] items-center relative">
                <FlipWords 
                  words={words} 
                  className="text-lochmara-500 px-2 text-center whitespace-nowrap" 
                />
              </span>
              <span className="whitespace-nowrap">{t("Process.title.our")}</span>
            </>
          ) : (
            // English/French: "Our [FlipWords] Process"
            <>
              <span className="whitespace-nowrap">{t("Process.title.our")}</span>
              <span className="text-lochmara-500 inline-flex min-h-[4rem] items-center relative">
                <FlipWords 
                  words={words} 
                  className="text-lochmara-500 px-2 text-center whitespace-nowrap" 
                />
              </span>
              <span className="whitespace-nowrap">{t("Process.title.process")}</span>
            </>
          )}
        </h1>
        <p className={`py-2 md:w-1/2 mx-auto text-xl md:text-2xl text-gray-500 ${isRTL ? 'text-center' : 'text-center'}`}>
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
