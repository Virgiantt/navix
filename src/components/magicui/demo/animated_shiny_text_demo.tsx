'use client'
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "../animated-shiny-text";
// import { FaHeart } from "react-icons/fa";
import { useTranslations } from "../../../hooks/useTranslations";

export function AnimatedShinyTextDemo() {
  const { t, locale } = useTranslations();
  const isRTL = locale === 'ar';

  return (
    <div className="z-10 flex items-center md:justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        className={cn(
          "group rounded-full text-base text-white transition-all ease-in",
        )}
      >
        <AnimatedShinyText className=" 
        items-center 
        justify-center 
         py-1 transition ease-out
          hover:text-neutral-600 
          hover:duration-300
           hover:dark:text-neutral-400">
          <div className={`
          md:flex
          flex-col-reverse
          md:flex-row
          justify-between
          gap-x-6
          ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          ⭐{" "}   ⭐{" "}   ⭐{" "}   ⭐{" "}   ⭐
          <div className={`flex items-center space-x-2 py-2 md:py-0 ${isRTL ? 'space-x-reverse' : ''}`}>
  {/* <FaHeart className="h-6 w-6 text-lochmara-500" /> */}
  <span className="text-gray-600 hover:underline cursor-pointer">
    {t('AnimatedShinyText.clientFocused')}
  </span>
</div>
          </div>
        </AnimatedShinyText>
      </div>
    </div>
  );
}