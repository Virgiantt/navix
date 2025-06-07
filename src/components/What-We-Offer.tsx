import React from 'react'
import { BoxReveal } from './magicui/box-reveal'
import { PiCheckBold } from 'react-icons/pi'
import { useTranslations } from '../hooks/useTranslations'

const We_Offer = () => {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  const offers = [
    t("WhatWeOffer.videoProduction"),
    t("WhatWeOffer.webDevelopment"),
    t("WhatWeOffer.marketingStrategy"),
    t("WhatWeOffer.mediaBuying"),
    t("WhatWeOffer.emailCampaigns")
  ];

  return (
    <div
      className="grid grid-cols-2 
    md:grid-cols-4 gap-4 items-center 
    text-left md:justify-items-center 
    md:mx-auto mt-10 md:mt-16"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {offers.map((offer, index) => (
        <BoxReveal key={index} boxColor={"var(--color-lochmara-500)"} duration={0.5}>
          <p className={`md:text-xl font-semibold flex gap-x-2 md:gap-x-4 items-center ${
            isRTL ? 'flex-row-reverse' : ''
          }`}>
            <PiCheckBold className="text-xl text-lochmara-500" />
            {offer}
          </p>
        </BoxReveal>
      ))}
    </div>
  )
}

export default We_Offer
