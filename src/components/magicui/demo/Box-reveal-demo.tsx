"use client";

import Link from "next/link";
import { BoxReveal } from "../box-reveal";
import { useTranslations } from "../../../hooks/useTranslations";

const BoxRevealDemo = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  return (
    <div
      className="h-full w-full items-center justify-center md:ml-10 overflow-hidden pt-8 space-y-2"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <p className={`text-3xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.connect.title")}
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <h2 className={`my-2 text-lg text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.connect.description")}
          <Link href={"/meeting"} className="text-[#4083b7]">
            {" "}
            {t("BoxReveal.meetingLink")}
            {" "}
          </Link>
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <p className={`text-3xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.collaborate.title")}
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <h2 className={`my-2 text-lg text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.collaborate.description")}
        </h2>
      </BoxReveal>

      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <p className={`text-3xl font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.createScale.title")}
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#4083b7"} duration={0.5}>
        <h2 className={`my-2 text-lg text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t("BoxReveal.steps.createScale.description")}
        </h2>
      </BoxReveal>
    </div>
  );
}

export default BoxRevealDemo;