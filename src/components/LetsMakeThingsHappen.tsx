"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

function LetsMakeThingsHappenSection() {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  return (
    <section
      className="container bg-lochmara-300 md:rounded-[45px] p-6 md:p-16 relative pt-12 md:pt-20 pb-12 md:pb-20 mx-auto mt-10 md:mt-20 mb-10 md:mb-20 flex flex-col items-center justify-center gap-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`flex flex-col md:flex-row items-center justify-between gap-8 w-full ${
          isRTL ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Text Content */}
        <div
          className={`md:flex-1 w-full text-center ${
            isRTL ? "md:text-right" : "md:text-left"
          }`}
        >
          <p className="text-2xl md:text-3xl font-medium mb-4 md:mb-6">
            {t("LetsMakeThingsHappen.title")}
          </p>

          <p className="text-lg md:text-xl mb-8 md:mb-10">
            {t("LetsMakeThingsHappen.description")}
          </p>

          <div
            className={`flex justify-center ${
              isRTL ? "md:justify-end" : "md:justify-start"
            }`}
          >
            <Link
              href="/meeting"
              className="py-3 px-8 md:px-12 text-lg md:text-xl
                bg-[#121212] text-white rounded-[6px] border-2 border-black
                hover:bg-[#abcbff] transition-all duration-300
                hover:shadow-[1px_1px_#000,2px_2px_#000,3px_3px_#000,4px_4px_#000,5px_5px_0_0_#000]
                dark:hover:shadow-[1px_1px_#fff,2px_2px_#fff,3px_3px_#fff,4px_4px_#fff,5px_5px_0_0_#fff]
                transform hover:-translate-y-1 max-md:text-base"
            >
              {t("LetsMakeThingsHappen.cta")}
            </Link>
          </div>
        </div>

        {/* Centered Logo */}
        <div className="md:flex-1 flex justify-center w-full max-w-[300px] mx-auto">
          <div className="relative w-full aspect-square">
            <Image
              src="/logo_navix_long.png"
              alt="Company Logo"
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 90vw, 40vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default LetsMakeThingsHappenSection;