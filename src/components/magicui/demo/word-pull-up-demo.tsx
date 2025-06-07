import WordPullUp from "@/components/magicui/word-pull-up";
import { useTranslations } from "../../../hooks/useTranslations";

export function WordPullUpDemo({ text }: { text?: string }) {
  const { t, locale } = useTranslations();
  const isRTL = locale === "ar";

  // Use Services title translation if no custom text is provided
  const displayText = text || t("Services.title");

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <WordPullUp
        className={`text-3xl md:text-5xl md:text-center font-medium ${
          isRTL ? "text-center" : "text-center"
        }`}
        words={displayText}
      />
    </div>
  );
}